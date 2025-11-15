import { describe, it, expect } from 'vitest';
import {
  aggregateByHour,
  aggregateByDayOfWeek,
  findPeakTimes,
  filterPostsByDateRange
} from '../utils/timeAggregation';

describe('timeAggregation utilities', () => {
  const mockPosts = [
    { timestamp: '2025-11-15T09:30:00.000Z', text: 'Morning post' },
    { timestamp: '2025-11-15T09:45:00.000Z', text: 'Another morning post' },
    { timestamp: '2025-11-15T14:20:00.000Z', text: 'Afternoon post' },
    { timestamp: '2025-11-14T09:30:00.000Z', text: 'Previous day post' },
  ];

  describe('aggregateByHour', () => {
    it('aggregates posts by hour of day', () => {
      const result = aggregateByHour(mockPosts);
      
      expect(result).toHaveLength(24);
      expect(result[0]).toHaveProperty('hour');
      expect(result[0]).toHaveProperty('label');
      expect(result[0]).toHaveProperty('count');
      expect(result[0]).toHaveProperty('percentage');
    });

    it('calculates percentages correctly', () => {
      const result = aggregateByHour(mockPosts);
      const totalPercentage = result.reduce((sum, item) => sum + parseFloat(item.percentage), 0);
      
      expect(totalPercentage).toBeCloseTo(100, 0);
    });

    it('handles empty posts array', () => {
      const result = aggregateByHour([]);
      
      expect(result).toHaveLength(24);
      expect(result.every(item => item.count === 0)).toBe(true);
    });

    it('handles invalid timestamps gracefully', () => {
      const postsWithInvalid = [
        { timestamp: 'invalid', text: 'Bad timestamp' },
        { timestamp: '2025-11-15T09:30:00.000Z', text: 'Good timestamp' }
      ];
      
      const result = aggregateByHour(postsWithInvalid);
      expect(result).toHaveLength(24);
    });
  });

  describe('aggregateByDayOfWeek', () => {
    it('aggregates posts by day of week', () => {
      const result = aggregateByDayOfWeek(mockPosts);
      
      expect(result).toHaveLength(7);
      expect(result[0]).toHaveProperty('day');
      expect(result[0]).toHaveProperty('label');
      expect(result[0]).toHaveProperty('count');
      expect(result[0]).toHaveProperty('percentage');
    });

    it('includes all day names', () => {
      const result = aggregateByDayOfWeek(mockPosts);
      const dayNames = result.map(item => item.label);
      
      expect(dayNames).toContain('Monday');
      expect(dayNames).toContain('Sunday');
      expect(dayNames).toContain('Friday');
    });

    it('handles empty posts array', () => {
      const result = aggregateByDayOfWeek([]);
      
      expect(result).toHaveLength(7);
      expect(result.every(item => item.count === 0)).toBe(true);
    });
  });

  describe('findPeakTimes', () => {
    it('identifies peak hour and day', () => {
      const result = findPeakTimes(mockPosts);
      
      expect(result).toHaveProperty('peakHour');
      expect(result).toHaveProperty('peakDay');
      expect(result.peakHour).toHaveProperty('hour');
      expect(result.peakHour).toHaveProperty('count');
      expect(result.peakDay).toHaveProperty('day');
      expect(result.peakDay).toHaveProperty('count');
    });

    it('returns correct peak values', () => {
      const result = findPeakTimes(mockPosts);
      
      expect(result.peakHour.count).toBeGreaterThan(0);
      expect(result.peakDay.count).toBeGreaterThan(0);
    });
  });

  describe('filterPostsByDateRange', () => {
    it('returns all posts when range is "all"', () => {
      const result = filterPostsByDateRange(mockPosts, 'all');
      
      expect(result).toHaveLength(mockPosts.length);
    });

    it('filters posts by days', () => {
      const result = filterPostsByDateRange(mockPosts, 1);
      
      expect(result.length).toBeLessThanOrEqual(mockPosts.length);
    });

    it('handles posts without timestamps', () => {
      const postsWithoutTimestamp = [
        { text: 'No timestamp' },
        ...mockPosts
      ];
      
      const result = filterPostsByDateRange(postsWithoutTimestamp, 7);
      
      expect(result.length).toBeLessThanOrEqual(postsWithoutTimestamp.length);
    });
  });
});
