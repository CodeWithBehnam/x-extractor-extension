import { useState } from 'react';

function PostPreview({ posts }) {
  const [showPosts, setShowPosts] = useState(false);

  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <div className="preview-container">
      <div className="preview-header">
        <button
          onClick={() => setShowPosts(!showPosts)}
          className="neo-button secondary"
          style={{ width: '100%', marginBottom: '12px' }}
        >
          {showPosts ? `📝 Hide Extracted Posts (${posts.length})` : `📝 Show Extracted Posts (${posts.length})`}
        </button>
      </div>

      {showPosts && (
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
      )}
    </div>
  );
}

export default PostPreview;
