import { useState, useMemo } from 'react';
import TimeOfDayChart from './TimeOfDayChart';
import DayOfWeekChart from './DayOfWeekChart';
import {
  aggregateByHour,
  aggregateByDayOfWeek,
  filterPostsByDateRange,
  findPeakTimes
} from '../utils/timeAggregation';

function AnalyticsDashboard({ posts }) {
  const [dateRange, setDateRange] = useState('all');
  const [showAnalytics, setShowAnalytics] = useState(false);

  const filteredPosts = useMemo(() => {
    return filterPostsByDateRange(posts, dateRange);
  }, [posts, dateRange]);

  const hourlyData = useMemo(() => {
    return aggregateByHour(filteredPosts);
  }, [filteredPosts]);

  const dailyData = useMemo(() => {
    return aggregateByDayOfWeek(filteredPosts);
  }, [filteredPosts]);

  const peakTimes = useMemo(() => {
    if (filteredPosts.length === 0) return null;
    return findPeakTimes(filteredPosts);
  }, [filteredPosts]);

  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <div className="analytics-section">
      <div className="analytics-header">
        <button
          onClick={() => setShowAnalytics(!showAnalytics)}
          className="neo-button secondary"
          style={{ width: '100%', marginBottom: '12px' }}
        >
          {showAnalytics ? '📊 Hide Analytics' : '📊 Show Analytics'}
        </button>
      </div>

      {showAnalytics && (
        <div className="analytics-content">
          <div className="analytics-controls">
            <label htmlFor="date-range">Time Range:</label>
            <select
              id="date-range"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="neo-select"
            >
              <option value="all">All Time</option>
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
            </select>
          </div>

          {peakTimes && (
            <div className="peak-times-summary">
              <div className="peak-time-card">
                <span className="peak-label">Peak Hour:</span>
                <span className="peak-value">
                  {peakTimes.peakHour.label} ({peakTimes.peakHour.count} posts, {peakTimes.peakHour.percentage}%)
                </span>
              </div>
              <div className="peak-time-card">
                <span className="peak-label">Peak Day:</span>
                <span className="peak-value">
                  {peakTimes.peakDay.label} ({peakTimes.peakDay.count} posts, {peakTimes.peakDay.percentage}%)
                </span>
              </div>
            </div>
          )}

          <div className="charts-grid">
            <div className="chart-wrapper">
              <TimeOfDayChart data={hourlyData} />
            </div>
            <div className="chart-wrapper">
              <DayOfWeekChart data={dailyData} />
            </div>
          </div>

          <div className="analytics-info">
            <p>Analyzing {filteredPosts.length} posts</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AnalyticsDashboard;
