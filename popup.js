// Load saved settings
chrome.storage.local.get({ brightness: 0.3, thickness: 50 }, (data) => {
  document.getElementById('brightness').value = data.brightness;
  document.getElementById('thickness').value = data.thickness;
  updateDisplay();
});

// Brightness slider
document.getElementById('brightness').addEventListener('input', (e) => {
  const brightness = parseFloat(e.target.value);
  chrome.storage.local.set({ brightness });
  updateDisplay();
  sendUpdate();
});

// Thickness slider
document.getElementById('thickness').addEventListener('input', (e) => {
  const thickness = parseFloat(e.target.value);
  chrome.storage.local.set({ thickness });
  updateDisplay();
  sendUpdate();
});

function updateDisplay() {
  const brightness = parseFloat(document.getElementById('brightness').value);
  const thickness = parseFloat(document.getElementById('thickness').value);
  document.getElementById('brightness-value').textContent = Math.round(brightness * 100) + '%';
  document.getElementById('thickness-value').textContent = Math.round(thickness);
}

function sendUpdate() {
  const brightness = parseFloat(document.getElementById('brightness').value);
  const thickness = parseFloat(document.getElementById('thickness').value);
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: 'updateGlow',
        brightness,
        thickness
      }).catch(() => {}); // Ignore errors if content script not loaded
    }
  });
}