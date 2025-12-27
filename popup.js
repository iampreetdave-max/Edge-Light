const toggle = document.getElementById('toggle');

// Load saved state
chrome.storage.local.get({ enabled: true }, (data) => {
  toggle.checked = data.enabled;
});

// Handle toggle change
toggle.addEventListener('change', () => {
  const enabled = toggle.checked;

  // Save state
  chrome.storage.local.set({ enabled });

  // Notify content script
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, { type: 'toggle', enabled }).catch(() => {});
    }
  });
});
