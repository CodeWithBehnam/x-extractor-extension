export function aggregateByHour(posts) {
  const hourCounts = Array(24).fill(0);
  
  posts.forEach(post => {
    if (post.timestamp) {
      try {
        const date = new Date(post.timestamp);
        const hour = date.getHours();
        hourCounts[hour]++;
      } catch (error) {
        console.error('Invalid timestamp:', post.timestamp);
      }
    }
  });
  
  const total = posts.length || 1;
  
  return hourCounts.map((count, hour) => ({
    hour,
    label: formatHourLabel(hour),
    count,
    percentage: ((count / total) * 100).toFixed(1)
  }));
}

export function aggregateByDayOfWeek(posts) {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayCounts = Array(7).fill(0);
  
  posts.forEach(post => {
    if (post.timestamp) {
      try {
        const date = new Date(post.timestamp);
        const day = date.getDay();
        dayCounts[day]++;
      } catch (error) {
        console.error('Invalid timestamp:', post.timestamp);
      }
    }
  });
  
  const total = posts.length || 1;
  
  return dayCounts.map((count, day) => ({
    day,
    label: dayNames[day],
    count,
    percentage: ((count / total) * 100).toFixed(1)
  }));
}

export function aggregateHeatmap(posts) {
  const heatmapData = [];
  
  for (let hour = 0; hour < 24; hour++) {
    for (let day = 0; day < 7; day++) {
      heatmapData.push({ hour, day, count: 0 });
    }
  }
  
  posts.forEach(post => {
    if (post.timestamp) {
      try {
        const date = new Date(post.timestamp);
        const hour = date.getHours();
        const day = date.getDay();
        const index = hour * 7 + day;
        heatmapData[index].count++;
      } catch (error) {
        console.error('Invalid timestamp:', post.timestamp);
      }
    }
  });
  
  return heatmapData;
}

export function findPeakTimes(posts) {
  const hourly = aggregateByHour(posts);
  const daily = aggregateByDayOfWeek(posts);
  
  const peakHour = hourly.reduce((max, current) => 
    current.count > max.count ? current : max, hourly[0]);
  
  const peakDay = daily.reduce((max, current) => 
    current.count > max.count ? current : max, daily[0]);
  
  return {
    peakHour: {
      hour: peakHour.hour,
      label: peakHour.label,
      count: peakHour.count,
      percentage: peakHour.percentage
    },
    peakDay: {
      day: peakDay.day,
      label: peakDay.label,
      count: peakDay.count,
      percentage: peakDay.percentage
    }
  };
}

export function filterPostsByDateRange(posts, days) {
  if (!days || days === 'all') return posts;
  
  const now = new Date();
  const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  
  return posts.filter(post => {
    if (!post.timestamp) return false;
    try {
      const postDate = new Date(post.timestamp);
      return postDate >= cutoffDate;
    } catch (error) {
      return false;
    }
  });
}

function formatHourLabel(hour) {
  if (hour === 0) return '12 AM';
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return '12 PM';
  return `${hour - 12} PM`;
}
