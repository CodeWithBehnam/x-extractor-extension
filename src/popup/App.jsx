import { useState, useEffect } from 'react';
import StatusIndicator from '../components/StatusIndicator';
import ExtractorPanel from '../components/ExtractorPanel';
import PostPreview from '../components/PostPreview';
import ExportButton from '../components/ExportButton';
import AnalyticsDashboard from '../components/AnalyticsDashboard';

function App() {
  const [status, setStatus] = useState('inactive');
  const [postsData, setPostsData] = useState([]);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [isOnXDomain, setIsOnXDomain] = useState(false);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        const url = tabs[0].url;
        const isX = /^https:\/\/(x\.com|twitter\.com)\//.test(url);
        setIsOnXDomain(isX);
        if (isX) {
          setStatus('active');
        }
      }
    });

    const messageListener = (message) => {
      if (message.action === 'EXTRACTION_PROGRESS') {
        setStatus('extracting');
        setProgress({ current: message.current, total: message.total });
        setPostsData(message.posts);
      } else if (message.action === 'EXTRACTION_COMPLETE') {
        setStatus('complete');
        setPostsData(message.posts);
      } else if (message.action === 'EXTRACTION_ERROR') {
        setStatus('error');
        console.error('Extraction error:', message.error);
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  const handleStartExtraction = (limit) => {
    setStatus('extracting');
    setProgress({ current: 0, total: limit });
    setPostsData([]);

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'START_EXTRACTION',
          limit: limit
        });
      }
    });
  };

  const handleStopExtraction = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'STOP_EXTRACTION' });
      }
    });
    setStatus('active');
  };

  return (
    <div className="neobrutalism-app">
      <header className="app-header">
        <h1>X.com Data Extractor</h1>
      </header>

      {!isOnXDomain && (
        <div className="neo-alert">
          Please navigate to x.com or twitter.com to use this extension.
        </div>
      )}

      {isOnXDomain && (
        <>
          <StatusIndicator status={status} />
          
          <ExtractorPanel
            status={status}
            progress={progress}
            onStart={handleStartExtraction}
            onStop={handleStopExtraction}
          />

          {postsData.length > 0 && (
            <>
              <PostPreview posts={postsData} />
              <AnalyticsDashboard posts={postsData} />
              <ExportButton postsData={postsData} />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;
