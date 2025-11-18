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
    <div className="neo-card compact">
      <div className="extractor-controls compact">
        <div className="input-row">
          <label htmlFor="post-limit">POSTS (1-1000):</label>
          <input
            id="post-limit"
            type="number"
            min="1"
            max="1000"
            value={limit}
            onChange={handleLimitChange}
            disabled={isExtracting}
            className="neo-input compact"
          />
        </div>

        <div className="button-row">
          <button
            onClick={handleStart}
            className={`neo-button primary ${isExtracting ? 'extracting' : ''}`}
            disabled={status === 'inactive' || isExtracting}
          >
            {isExtracting ? (
              <span className="btn-content">
                {progress.current} / {progress.total} <div className="spinner-small"></div>
              </span>
            ) : (
              "EXTRACT"
            )}
          </button>

          <button
            onClick={onStop}
            className="neo-button danger"
            disabled={!isExtracting}
          >
            STOP
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExtractorPanel;
