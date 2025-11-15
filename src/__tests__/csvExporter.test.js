import { describe, it, expect } from 'vitest';
import { transformPostsToCSV, generateCSV } from '../utils/csvExporter';

describe('csvExporter', () => {
  const samplePosts = [
    {
      text: 'Test tweet 1',
      author: '@testuser',
      timestamp: '2025-11-15T10:00:00.000Z',
      mediaUrls: ['https://example.com/image1.jpg'],
      engagement: {
        likes: 10,
        retweets: 5,
        replies: 2,
        views: 100
      }
    },
    {
      text: 'Test tweet 2',
      author: '@anotheruser',
      timestamp: '2025-11-15T11:00:00.000Z',
      mediaUrls: [],
      engagement: {
        likes: 20,
        retweets: 8,
        replies: 3,
        views: 200
      }
    }
  ];

  describe('transformPostsToCSV', () => {
    it('transforms posts to CSV format', () => {
      const result = transformPostsToCSV(samplePosts);
      
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('text', 'Test tweet 1');
      expect(result[0]).toHaveProperty('author', '@testuser');
      expect(result[0]).toHaveProperty('likes', 10);
    });

    it('handles missing engagement data', () => {
      const postsWithoutEngagement = [{
        text: 'Test',
        author: '@user',
        timestamp: '2025-11-15T10:00:00.000Z',
        mediaUrls: []
      }];

      const result = transformPostsToCSV(postsWithoutEngagement);
      
      expect(result[0].likes).toBe(0);
      expect(result[0].retweets).toBe(0);
    });

    it('joins multiple media URLs with comma', () => {
      const postsWithMedia = [{
        text: 'Test',
        author: '@user',
        timestamp: '2025-11-15T10:00:00.000Z',
        mediaUrls: ['url1.jpg', 'url2.jpg', 'url3.jpg']
      }];

      const result = transformPostsToCSV(postsWithMedia);
      expect(result[0].media_urls).toBe('url1.jpg, url2.jpg, url3.jpg');
    });

    it('handles empty or missing fields', () => {
      const incompletePosts = [{ text: 'Only text' }];
      
      const result = transformPostsToCSV(incompletePosts);
      
      expect(result[0].text).toBe('Only text');
      expect(result[0].author).toBe('');
      expect(result[0].timestamp).toBe('');
      expect(result[0].media_urls).toBe('');
    });
  });

  describe('generateCSV', () => {
    it('generates CSV string and filename', () => {
      const result = generateCSV(samplePosts);
      
      expect(result).toHaveProperty('csv');
      expect(result).toHaveProperty('filename');
      expect(typeof result.csv).toBe('string');
      expect(result.filename).toMatch(/^x-posts-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}\.csv$/);
    });

    it('CSV contains headers', () => {
      const result = generateCSV(samplePosts);
      
      expect(result.csv).toContain('text');
      expect(result.csv).toContain('author');
      expect(result.csv).toContain('timestamp');
      expect(result.csv).toContain('likes');
    });

    it('CSV contains data rows', () => {
      const result = generateCSV(samplePosts);
      
      expect(result.csv).toContain('Test tweet 1');
      expect(result.csv).toContain('@testuser');
    });

    it('handles empty posts array', () => {
      const result = generateCSV([]);
      
      expect(result.csv).toBeTruthy();
      expect(result.filename).toMatch(/^x-posts-.*\.csv$/);
    });
  });
});
