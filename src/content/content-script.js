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
  // Scroll between 40% and 70% of viewport height
  const viewportHeight = window.innerHeight;
  const minScroll = Math.floor(viewportHeight * 0.4);
  const maxScroll = Math.floor(viewportHeight * 0.7);
  return Math.floor(Math.random() * (maxScroll - minScroll + 1)) + minScroll;
}

function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

async function smoothScroll(targetY, duration) {
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
  const scrollAmount = getRandomScrollAmount();
  const targetY = window.scrollY + scrollAmount;

  // Slower, more natural scroll speed (800ms - 1500ms)
  const scrollDuration = getRandomDelay(800, 1500);

  await smoothScroll(targetY, scrollDuration);

  // Variable pause after scrolling to simulate scanning content
  const pauseDelay = getRandomDelay(500, 1200);
  await delay(pauseDelay);
}

async function simulateUserActivity() {
  // 10% chance to do a small "correction" scroll up
  if (Math.random() < 0.1) {
    const currentY = window.scrollY;
    const upAmount = getRandomDelay(50, 150);
    await smoothScroll(Math.max(0, currentY - upAmount), 400);
    await delay(getRandomDelay(300, 800));
  }
}

async function extractPosts(limit) {
  const maxLimit = Math.min(limit, 2000); // Increased hard limit slightly
  const posts = [];
  const seenTexts = new Set();
  let attempts = 0;
  const maxAttempts = maxLimit * 5; // More attempts allowed for stealth mode
  const startTime = Date.now();
  // Longer timeout for large extractions (up to 2 hours for 1000+ posts)
  const timeout = maxLimit > 500 ? 2 * 60 * 60 * 1000 : 30 * 60 * 1000;

  let consecutiveErrors = 0;
  let postsSinceLastPause = 0;
  let postsSinceLastLongPause = 0;

  // Stealth settings
  const isStealthMode = maxLimit > 50;
  const shortPauseThreshold = getRandomDelay(15, 25); // Pause every 15-25 posts
  const longPauseThreshold = getRandomDelay(80, 120); // Long break every 80-120 posts

  logger.info(`Starting extraction. Target: ${maxLimit}. Stealth Mode: ${isStealthMode ? 'ON' : 'OFF'}`);

  while (posts.length < maxLimit && attempts < maxAttempts && !state.shouldStop) {
    if (Date.now() - startTime > timeout) {
      logger.warn('Extraction timeout reached');
      break;
    }

    try {
      const postElements = getPostElements();

      if (postElements.length === 0) {
        logger.warn('No posts found on page');
        await delay(2000); // Wait longer
        attempts++;
        continue;
      }

      let newPostsFound = false;

      for (const postEl of postElements) {
        if (posts.length >= maxLimit || state.shouldStop) {
          break;
        }

        // Simulate reading/processing time
        if (isStealthMode) {
          await delay(getRandomDelay(50, 150));
        }

        const post = extractPost(postEl);

        if (post && post.text) {
          const textHash = post.text.substring(0, 100);

          if (!seenTexts.has(textHash)) {
            seenTexts.add(textHash);
            posts.push(post);
            newPostsFound = true;
            postsSinceLastPause++;
            postsSinceLastLongPause++;
            consecutiveErrors = 0;

            // Send progress update
            chrome.runtime.sendMessage({
              action: 'EXTRACTION_PROGRESS',
              current: posts.length,
              total: maxLimit,
              posts: posts
            }).catch(err => logger.debug('Failed to send progress:', err));

            logger.debug(`Extracted post ${posts.length}/${maxLimit}`);

            // --- STEALTH LOGIC ---

            // 1. Random "Reading" Pause (Short)
            if (postsSinceLastPause >= shortPauseThreshold) {
              const pauseTime = getRandomDelay(2000, 5000);
              logger.info(`Micro-pause: Reading for ${pauseTime}ms`);
              await delay(pauseTime);
              postsSinceLastPause = 0;
              await simulateUserActivity(); // Maybe scroll up a bit
            }

            // 2. "Coffee Break" Pause (Long) - Only for large extractions
            if (isStealthMode && postsSinceLastLongPause >= longPauseThreshold) {
              const longPauseTime = getRandomDelay(10000, 25000);
              logger.info(`Long pause: Taking a break for ${longPauseTime / 1000}s`);
              await delay(longPauseTime);
              postsSinceLastLongPause = 0;
            }
          }
        }
      }

      if (!newPostsFound) {
        logger.debug('No new posts found, scrolling...');
        await humanLikeScroll();
      } else {
        // Even if we found posts, we need to scroll eventually to find more
        // But maybe not immediately if we just processed a batch. 
        // Let's scroll if we are at the bottom of the current view or just randomly
        await humanLikeScroll();
      }

      attempts++;

    } catch (error) {
      consecutiveErrors++;
      logger.error(`Extraction error (${consecutiveErrors} consecutive):`, error);

      if (error.message && (error.message.includes('429') || error.message.includes('403'))) {
        // Serious rate limit
        const backoffDelay = Math.min(30000 * Math.pow(1.5, consecutiveErrors), 300000); // Up to 5 mins
        logger.warn(`Rate limit detected! Backing off for ${backoffDelay / 1000}s`);
        await delay(backoffDelay);
      } else if (consecutiveErrors >= 10) {
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
