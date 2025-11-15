const LOG_PREFIX = '[X-Extractor]';

export const logger = {
  info: (...args) => {
    console.log(LOG_PREFIX, ...args);
  },
  
  error: (...args) => {
    console.error(LOG_PREFIX, ...args);
    try {
      chrome.storage.local.get(['errorLog'], (result) => {
        const errorLog = result.errorLog || [];
        errorLog.push({
          timestamp: new Date().toISOString(),
          message: args.map(a => String(a)).join(' ')
        });
        if (errorLog.length > 50) {
          errorLog.shift();
        }
        chrome.storage.local.set({ errorLog });
      });
    } catch (e) {
      console.error('Failed to log error to storage:', e);
    }
  },
  
  warn: (...args) => {
    console.warn(LOG_PREFIX, ...args);
  },
  
  debug: (...args) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(LOG_PREFIX, ...args);
    }
  }
};
