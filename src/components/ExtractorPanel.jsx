import { useState } from 'react';

function ExtractorPanel({ status, progress, onStart, onStop }) {
  const [limit, setLimit] = useState(100);

  const handleLimitChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 1 && value <= 1000) {
      setLimit(value);
    }
  };

  const handleStart = () => {
    if (limit >= 1 && limit <= 1000) {
      onStart(limit);
    }
  };

  const isExtracting = status === 'extracting';

  return (
    <div className="neo-card">
      <div className="extractor-controls">
        <div className="input-group">
          <label htmlFor="post-limit">Number of Posts (1-1000)</label>
          <input
            id="post-limit"
            type="number"
            min="1"
            max="1000"
            value={limit}
            onChange={handleLimitChange}
            disabled={isExtracting}
            className="neo-input"
          />
        </div>

        <div className="button-group">
          {!isExtracting ? (
            <button
              onClick={handleStart}
              className="neo-button primary"
              disabled={status === 'inactive'}
            >
              Start Extraction
            </button>
          ) : (
            <button
              onClick={onStop}
              className="neo-button danger"
            >
              Stop
            </button>
          )}
        </div>

        {isExtracting && (
          <div className="progress-text">
            Progress: {progress.current} / {progress.total}
          </div>
        )}
      </div>
    </div>
  );
}

export default ExtractorPanel;
