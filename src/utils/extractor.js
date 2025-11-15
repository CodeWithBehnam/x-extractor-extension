import { logger } from './logger.js';

export const POST_SELECTOR = 'article[data-testid="tweet"]';

export function getPostElements() {
  const elements = Array.from(document.querySelectorAll(POST_SELECTOR));
  return elements.filter(el => !el.hidden && el.offsetParent !== null);
}

export function extractPostText(postEl) {
  try {
    const textEl = postEl.querySelector('[data-testid="tweetText"]');
    if (textEl) {
      return textEl.innerText.trim().replace(/\s+/g, ' ');
    }
    return '';
  } catch (error) {
    logger.error('Error extracting text:', error);
    return '';
  }
}

export function extractAuthorHandle(postEl) {
  try {
    const authorLink = postEl.querySelector('a[href^="/"][role="link"]');
    if (authorLink) {
      const href = authorLink.getAttribute('href');
      const handle = href.split('/')[1];
      if (handle && /^[a-zA-Z0-9_]+$/.test(handle)) {
        return `@${handle}`;
      }
    }
    
    const authorEl = postEl.querySelector('[data-testid="User-Name"]');
    if (authorEl) {
      const handleEl = authorEl.querySelector('a');
      if (handleEl) {
        const text = handleEl.textContent;
        const match = text.match(/@([a-zA-Z0-9_]+)/);
        if (match) {
          return match[0];
        }
      }
    }
    
    return 'unknown';
  } catch (error) {
    logger.error('Error extracting author:', error);
    return 'unknown';
  }
}

export function extractTimestamp(postEl) {
  try {
    const timeEl = postEl.querySelector('time');
    if (timeEl?.datetime) {
      return timeEl.datetime;
    }
    
    if (timeEl?.textContent) {
      const relativeTime = timeEl.textContent;
      const now = new Date();
      
      const hourMatch = relativeTime.match(/(\d+)h/);
      if (hourMatch) {
        now.setHours(now.getHours() - parseInt(hourMatch[1]));
        return now.toISOString();
      }
      
      const minMatch = relativeTime.match(/(\d+)m/);
      if (minMatch) {
        now.setMinutes(now.getMinutes() - parseInt(minMatch[1]));
        return now.toISOString();
      }
    }
    
    return new Date().toISOString();
  } catch (error) {
    logger.error('Error extracting timestamp:', error);
    return new Date().toISOString();
  }
}

export function extractMediaUrls(postEl) {
  try {
    const mediaUrls = [];
    
    const imgs = postEl.querySelectorAll('img[src*="pbs.twimg.com"]');
    imgs.forEach(img => {
      let src = img.src;
      if (src && !src.includes('profile_images') && !src.includes('emoji')) {
        src = src.replace(/&name=\w+/, '&name=large');
        if (!mediaUrls.includes(src)) {
          mediaUrls.push(src);
        }
      }
    });
    
    const videos = postEl.querySelectorAll('video');
    videos.forEach(video => {
      const src = video.src || video.dataset.src;
      if (src && !mediaUrls.includes(src)) {
        mediaUrls.push(src);
      }
    });
    
    return mediaUrls;
  } catch (error) {
    logger.error('Error extracting media:', error);
    return [];
  }
}

export function extractEngagement(postEl) {
  try {
    function parseMetric(text) {
      if (!text) return 0;
      
      const cleanText = text.replace(/,/g, '');
      const match = cleanText.match(/([\d.]+)([KMB]?)/i);
      
      if (match) {
        const value = parseFloat(match[1]);
        const multiplier = match[2].toUpperCase();
        
        if (multiplier === 'K') return Math.floor(value * 1000);
        if (multiplier === 'M') return Math.floor(value * 1000000);
        if (multiplier === 'B') return Math.floor(value * 1000000000);
        
        return Math.floor(value);
      }
      
      return 0;
    }
    
    function getMetric(selector) {
      const el = postEl.querySelector(selector);
      if (!el) return 0;
      
      const ariaLabel = el.getAttribute('aria-label');
      if (ariaLabel) {
        const match = ariaLabel.match(/(\d+[\d,KMB]*)/i);
        if (match) {
          return parseMetric(match[1]);
        }
      }
      
      const text = el.textContent || '';
      return parseMetric(text);
    }
    
    return {
      likes: getMetric('[data-testid="like"]'),
      retweets: getMetric('[data-testid="retweet"]'),
      replies: getMetric('[data-testid="reply"]'),
      views: getMetric('[href$="/analytics"]') || 0
    };
  } catch (error) {
    logger.error('Error extracting engagement:', error);
    return { likes: 0, retweets: 0, replies: 0, views: 0 };
  }
}

export function extractPost(postEl, retryCount = 0) {
  try {
    const post = {
      text: extractPostText(postEl),
      author: extractAuthorHandle(postEl),
      timestamp: extractTimestamp(postEl),
      mediaUrls: extractMediaUrls(postEl),
      engagement: extractEngagement(postEl)
    };
    
    if (!post.text && !post.author && retryCount < 2) {
      logger.warn(`Post extraction incomplete, retry ${retryCount + 1}`);
      return null;
    }
    
    return post;
  } catch (error) {
    logger.error('Error extracting post:', error);
    if (retryCount < 2) {
      return null;
    }
    return null;
  }
}
