function PostPreview({ posts }) {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <div className="preview-container">
      <div className="preview-header">
        Extracted Posts ({posts.length})
      </div>
      <div className="preview-list">
        {posts.map((post, index) => (
          <div key={index} className="post-card">
            <div className="post-author">{post.author || 'Unknown'}</div>
            <div className="post-text">
              {post.text ? (post.text.length > 150 ? `${post.text.slice(0, 150)}...` : post.text) : 'No text content'}
            </div>
            {post.engagement && (
              <div className="post-metrics">
                <span>❤️ {post.engagement.likes || 0}</span>
                <span>🔄 {post.engagement.retweets || 0}</span>
                <span>💬 {post.engagement.replies || 0}</span>
                {post.engagement.views !== undefined && (
                  <span>👁️ {post.engagement.views || 0}</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostPreview;
