import { isXDomain } from '../utils/isXDomain.js';

chrome.runtime.onInstalled.addListener(() => {
  console.log('[X-Extractor] Extension installed');
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && isXDomain(tab.url)) {
    console.log('[X-Extractor] X.com domain detected, activating extension');

    chrome.action.setBadgeText({ text: 'ON', tabId });
    chrome.action.setBadgeBackgroundColor({ color: '#4ECDC4', tabId });

    chrome.tabs.sendMessage(tabId, { action: 'ACTIVATE_EXTRACTOR' }).catch(() => {
      console.log('[X-Extractor] Content script not ready yet');
    });
  } else if (changeInfo.status === 'complete') {
    chrome.action.setBadgeText({ text: '', tabId });
  }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (isXDomain(tab.url)) {
      chrome.action.setBadgeText({ text: 'ON', tabId: tab.id });
      chrome.action.setBadgeBackgroundColor({ color: '#4ECDC4', tabId: tab.id });
    } else {
      chrome.action.setBadgeText({ text: '', tabId: tab.id });
    }
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[X-Extractor] Background received message:', message.action);

  if (message.action === 'EXTRACTION_PROGRESS' ||
    message.action === 'EXTRACTION_COMPLETE' ||
    message.action === 'EXTRACTION_ERROR') {
    chrome.runtime.sendMessage(message).catch(() => {
      console.log('[X-Extractor] Popup not open');
    });
    sendResponse({ success: true });
  }
});
