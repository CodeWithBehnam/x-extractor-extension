function StatusIndicator({ status }) {
  const statusText = {
    inactive: 'Inactive',
    active: 'Ready',
    extracting: 'Extracting...',
    complete: 'Complete',
    error: 'Error'
  };

  return (
    <div className={`status-badge ${status}`}>
      <span>{statusText[status] || 'Unknown'}</span>
      {status === 'extracting' && <div className="spinner"></div>}
    </div>
  );
}

export default StatusIndicator;
