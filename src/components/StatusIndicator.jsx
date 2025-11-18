function StatusIndicator({ status }) {
  const statusText = {
    inactive: 'Inactive',
    active: 'Ready',
    extracting: 'Extracting',
    complete: 'Complete',
    error: 'Error'
  };

  return (
    <div className={`neo-ribbon ${status}`}>
      <span>{statusText[status] || 'Unknown'}</span>
    </div>
  );
}

export default StatusIndicator;
