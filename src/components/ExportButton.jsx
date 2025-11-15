import { useState } from 'react';
import { generateCSV, downloadCSV } from '../utils/csvExporter';

function ExportButton({ postsData }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleExport = async () => {
    if (!postsData || postsData.length === 0) {
      return;
    }

    setLoading(true);
    try {
      const { csv, filename } = generateCSV(postsData);
      downloadCSV(csv, filename);
      setMessage('✓ Exported successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Export error:', error);
      setMessage('✗ Export failed');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="export-section">
      <button
        onClick={handleExport}
        disabled={!postsData || postsData.length === 0 || loading}
        className="neo-button secondary"
        style={{ width: '100%' }}
      >
        {loading ? (
          <>
            <span>Exporting...</span>
            <div className="spinner"></div>
          </>
        ) : (
          'Export to CSV'
        )}
      </button>

      {message && (
        <div className="neo-toast">
          {message}
        </div>
      )}
    </div>
  );
}

export default ExportButton;
