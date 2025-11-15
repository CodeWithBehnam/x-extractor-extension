import Papa from 'papaparse';

export const csvOptions = {
  header: true,
  delimiter: ',',
  encoding: 'utf-8'
};

export function transformPostsToCSV(posts) {
  return posts.map(post => ({
    text: post.text || '',
    author: post.author || '',
    timestamp: post.timestamp || '',
    media_urls: (post.mediaUrls || []).join(', '),
    likes: post.engagement?.likes || 0,
    retweets: post.engagement?.retweets || 0,
    replies: post.engagement?.replies || 0,
    views: post.engagement?.views || 0
  }));
}

export function generateCSV(posts) {
  const data = transformPostsToCSV(posts);
  const csv = Papa.unparse(data, csvOptions);
  const timestamp = new Date().toISOString().slice(0, 16).replace(/:/g, '-');
  const filename = `x-posts-${timestamp}.csv`;
  
  return { csv, filename };
}

export function downloadCSV(csv, filename) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
