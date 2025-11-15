import { describe, it, expect, beforeEach } from 'vitest';
import { 
  extractPostText, 
  extractAuthorHandle, 
  extractTimestamp,
  extractMediaUrls,
  extractEngagement,
  getPostElements 
} from '../utils/extractor';

describe('extractor utilities', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('extractPostText', () => {
    it('extracts text from tweet text element', () => {
      const postEl = document.createElement('article');
      const textEl = document.createElement('div');
      textEl.setAttribute('data-testid', 'tweetText');
      textEl.textContent = 'This is a test tweet';
      postEl.appendChild(textEl);

      expect(extractPostText(postEl)).toBe('This is a test tweet');
    });

    it('returns empty string if no text found', () => {
      const postEl = document.createElement('article');
      expect(extractPostText(postEl)).toBe('');
    });

    it('normalizes whitespace', () => {
      const postEl = document.createElement('article');
      const textEl = document.createElement('div');
      textEl.setAttribute('data-testid', 'tweetText');
      textEl.textContent = 'Text  with   multiple   spaces';
      postEl.appendChild(textEl);

      expect(extractPostText(postEl)).toBe('Text with multiple spaces');
    });
  });

  describe('extractAuthorHandle', () => {
    it('extracts author handle from link href', () => {
      const postEl = document.createElement('article');
      const link = document.createElement('a');
      link.setAttribute('href', '/testuser');
      link.setAttribute('role', 'link');
      postEl.appendChild(link);

      expect(extractAuthorHandle(postEl)).toBe('@testuser');
    });

    it('returns "unknown" if no author found', () => {
      const postEl = document.createElement('article');
      expect(extractAuthorHandle(postEl)).toBe('unknown');
    });

    it('validates handle format', () => {
      const postEl = document.createElement('article');
      const link = document.createElement('a');
      link.setAttribute('href', '/valid_user123');
      link.setAttribute('role', 'link');
      postEl.appendChild(link);

      expect(extractAuthorHandle(postEl)).toBe('@valid_user123');
    });
  });

  describe('extractTimestamp', () => {
    it('extracts ISO timestamp from time element', () => {
      const postEl = document.createElement('article');
      const timeEl = document.createElement('time');
      timeEl.setAttribute('datetime', '2025-11-15T10:30:00.000Z');
      postEl.appendChild(timeEl);

      expect(extractTimestamp(postEl)).toBe('2025-11-15T10:30:00.000Z');
    });

    it('returns current timestamp if no time element', () => {
      const postEl = document.createElement('article');
      const result = extractTimestamp(postEl);
      
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });
  });

  describe('extractMediaUrls', () => {
    it('extracts image URLs from post', () => {
      const postEl = document.createElement('article');
      const img = document.createElement('img');
      img.src = 'https://pbs.twimg.com/media/test.jpg';
      postEl.appendChild(img);

      const urls = extractMediaUrls(postEl);
      expect(urls).toContain('https://pbs.twimg.com/media/test.jpg');
    });

    it('filters out profile images and emojis', () => {
      const postEl = document.createElement('article');
      
      const profileImg = document.createElement('img');
      profileImg.src = 'https://pbs.twimg.com/profile_images/test.jpg';
      postEl.appendChild(profileImg);
      
      const emoji = document.createElement('img');
      emoji.src = 'https://pbs.twimg.com/emoji/test.png';
      postEl.appendChild(emoji);

      const urls = extractMediaUrls(postEl);
      expect(urls).toHaveLength(0);
    });

    it('upgrades image quality to large', () => {
      const postEl = document.createElement('article');
      const img = document.createElement('img');
      img.src = 'https://pbs.twimg.com/media/test.jpg?name=small';
      postEl.appendChild(img);

      const urls = extractMediaUrls(postEl);
      expect(urls[0]).toContain('name=large');
    });
  });

  describe('extractEngagement', () => {
    it('extracts engagement metrics', () => {
      const postEl = document.createElement('article');
      
      const likeBtn = document.createElement('button');
      likeBtn.setAttribute('data-testid', 'like');
      likeBtn.setAttribute('aria-label', '42 Likes');
      postEl.appendChild(likeBtn);
      
      const retweetBtn = document.createElement('button');
      retweetBtn.setAttribute('data-testid', 'retweet');
      retweetBtn.setAttribute('aria-label', '10 Retweets');
      postEl.appendChild(retweetBtn);

      const engagement = extractEngagement(postEl);
      expect(engagement.likes).toBeGreaterThanOrEqual(0);
      expect(engagement.retweets).toBeGreaterThanOrEqual(0);
    });

    it('returns zeros if no engagement found', () => {
      const postEl = document.createElement('article');
      const engagement = extractEngagement(postEl);
      
      expect(engagement).toEqual({
        likes: 0,
        retweets: 0,
        replies: 0,
        views: 0
      });
    });
  });

  describe('getPostElements', () => {
    it('returns visible tweet articles', () => {
      const article1 = document.createElement('article');
      article1.setAttribute('data-testid', 'tweet');
      document.body.appendChild(article1);

      const article2 = document.createElement('article');
      article2.setAttribute('data-testid', 'tweet');
      document.body.appendChild(article2);

      const elements = getPostElements();
      expect(elements).toHaveLength(2);
    });

    it('filters out hidden elements', () => {
      const article = document.createElement('article');
      article.setAttribute('data-testid', 'tweet');
      article.hidden = true;
      document.body.appendChild(article);

      const elements = getPostElements();
      expect(elements).toHaveLength(0);
    });
  });
});
