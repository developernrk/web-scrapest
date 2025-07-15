
/**
 * Web Pulse - Background Service Worker
 *
 * This script runs in the background and handles communication
 * between the popup and content scripts.
 */

// Log when the service worker is installed
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Web Pulse extension installed');
  } else if (details.reason === 'update') {
    console.log(`Web Pulse extension updated from ${details.previousVersion} to ${chrome.runtime.getManifest().version}`);
  }
});



// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getTabInfo') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        sendResponse({
          url: tabs[0].url,
          title: tabs[0].title,
          tabId: tabs[0].id
        });
      } else {
        sendResponse({ error: 'No active tab found' });
      }
    });
    return true; // Required for async sendResponse
  }
});

// Keep service worker alive
chrome.runtime.onConnect.addListener(port => {
  if (port.name === 'keepAlive') {
    port.onDisconnect.addListener(() => {
      console.log('Port disconnected');
    });
  }
});
