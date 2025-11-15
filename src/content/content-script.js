import { logger } from '../utils/logger.js';
import { getPostElements, extractPost } from '../utils/extractor.js';

let state = {
  isActive: false,
  isExtracting: false,
  shouldStop: false,
  hasInitialized: false
};

function init() {
  if (state.hasInitialized) {
    logger.debug('Content script already initialized');
    return;
  }
  
  state.hasInitialized = true;
  logger.info('Content script initialized');
  
  chrome.runtime.onMessage.addListener(handleMessage);
  
  chrome.storage.sync.get(['active'], (result) => {
    if (result.active) {
      state.isActive = true;
      logger.info('Extension activated from storage');
    }
  });
}

function handleMessage(message, sender, sendResponse) {
  logger.debug('Content script received message:', message.action);
  
  switch (message.action) {
    case 'ACTIVATE_EXTRACTOR':
      state.isActive = true;
      chrome.storage.sync.set({ active: true });
      logger.info('Extractor activated');
      sendResponse({ success: true });
      break;
      
    case 'START_EXTRACTION':
      if (state.isExtracting) {
        sendResponse({ success: false, error: 'Already extracting' });
        return true;
      }
      startExtraction(message.limit || 100);
      sendResponse({ success: true });
      break;
      
    case 'STOP_EXTRACTION':
      state.shouldStop = true;
      logger.info('Stop extraction requested');
      sendResponse({ success: true });
      break;
      
    default:
      sendResponse({ success: false, error: 'Unknown action' });
  }
  
  return true;
}

async function startExtraction(limit) {
  if (state.isExtracting) {
    logger.warn('Extraction already in progress');
    return;
  }
  
  state.isExtracting = true;
  state.shouldStop = false;
  
  logger.info(`Starting extraction with limit: ${limit}`);
  
  try {
    const posts = await extractPosts(limit);
    
    chrome.runtime.sendMessage({
      action: 'EXTRACTION_COMPLETE',
      posts: posts
    }).catch(err => logger.error('Failed to send completion message:', err));
    
    logger.info(`Extraction complete. Extracted ${posts.length} posts`);
  } catch (error) {
    logger.error('Extraction failed:', error);
    
    chrome.runtime.sendMessage({
      action: 'EXTRACTION_ERROR',
      error: error.message
    }).catch(err => logger.error('Failed to send error message:', err));
  } finally {
    state.isExtracting = false;
  }
}

function getRandomDelay(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomScrollAmount() {
  const baseAmount = Math.floor(Math.random() * 300) + 200;
  const jitter = Math.floor(Math.random() * 100) - 50;
  return baseAmount + jitter;
}

function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

async function smoothScroll(targetY, duration = 500) {
  const startY = window.scrollY;
  const distance = targetY - startY;
  const startTime = performance.now();
  
  return new Promise(resolve => {
    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutQuad(progress);
      
      window.scrollTo(0, startY + distance * eased);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        resolve();
      }
    }
    
    requestAnimationFrame(animate);
  });
}

async function humanLikeScroll() {
  const viewportHeight = window.innerHeight;
  const scrollAmount = getRandomScrollAmount();
  const targetY = window.scrollY + Math.min(scrollAmount, viewportHeight * 0.8);
  
  const scrollDuration = getRandomDelay(300, 800);
  await smoothScroll(targetY, scrollDuration);
  
  const pauseDelay = getRandomDelay(500, 2000);
  await delay(pauseDelay);
}

async function extractPosts(limit) {
  const maxLimit = Math.min(limit, 1000);
  const posts = [];
  const seenTexts = new Set();
  let attempts = 0;
  const maxAttempts = maxLimit * 3;
  const startTime = Date.now();
  const timeout = 30 * 60 * 1000;
  let consecutiveErrors = 0;
  let postsSinceLastPause = 0;
  const pauseThreshold = 50;
  
  logger.info(`Extracting up to ${maxLimit} posts`);
  
  while (posts.length < maxLimit && attempts < maxAttempts && !state.shouldStop) {
    if (Date.now() - startTime > timeout) {
      logger.warn('Extraction timeout reached');
      break;
    }
    
    try {
      const postElements = getPostElements();
      
      if (postElements.length === 0) {
        logger.warn('No posts found on page');
        await delay(getRandomDelay(2000, 4000));
        attempts++;
        continue;
      }
      
      let newPostsFound = false;
      
      for (const postEl of postElements) {
        if (posts.length >= maxLimit || state.shouldStop) {
          break;
        }
        
        await delay(getRandomDelay(100, 300));
        
        const post = extractPost(postEl);
        
        if (post && post.text) {
          const textHash = post.text.substring(0, 100);
          
          if (!seenTexts.has(textHash)) {
            seenTexts.add(textHash);
            posts.push(post);
            newPostsFound = true;
            postsSinceLastPause++;
            consecutiveErrors = 0;
            
            await delay(getRandomDelay(1000, 3000));
            
            chrome.runtime.sendMessage({
              action: 'EXTRACTION_PROGRESS',
              current: posts.length,
              total: maxLimit,
              posts: posts
            }).catch(err => logger.debug('Failed to send progress:', err));
            
            logger.debug(`Extracted post ${posts.length}/${maxLimit}`);
            
            if (postsSinceLastPause >= pauseThreshold) {
              const longPause = getRandomDelay(10000, 20000);
              logger.info(`Taking long pause (${longPause}ms) after ${postsSinceLastPause} posts`);
              await delay(longPause);
              postsSinceLastPause = 0;
            }
          }
        }
      }
      
      if (!newPostsFound) {
        logger.debug('No new posts found, scrolling...');
        await humanLikeScroll();
      }
      
      attempts++;
      
    } catch (error) {
      consecutiveErrors++;
      logger.error(`Extraction error (${consecutiveErrors} consecutive):`, error);
      
      if (error.message && (error.message.includes('429') || error.message.includes('403'))) {
        const backoffDelay = Math.min(1000 * Math.pow(2, consecutiveErrors), 60000);
        logger.warn(`Rate limit detected, backing off for ${backoffDelay}ms`);
        await delay(backoffDelay);
      } else if (consecutiveErrors >= 5) {
        logger.error('Too many consecutive errors, stopping extraction');
        break;
      } else {
        await delay(getRandomDelay(2000, 5000));
      }
    }
  }
  
  if (state.shouldStop) {
    logger.info('Extraction stopped by user');
  }
  
  return posts;
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

logger.info('Content script loaded');
