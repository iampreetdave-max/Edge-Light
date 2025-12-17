// Presets configuration
const PRESETS = {
  focus: {
    name: 'Focus',
    enabled: true,
    colorMode: 'warm',
    edgeMode: 'all',
    brightness: 0.45,
    thickness: 50
  },
  cinema: {
    name: 'Cinema',
    enabled: true,
    colorMode: 'cold',
    edgeMode: 'all',
    brightness: 0.65,
    thickness: 75
  },
  midnight: {
    name: 'Midnight',
    enabled: true,
    colorMode: 'warm',
    edgeMode: 'all',
    brightness: 0.25,
    thickness: 80
  },
  energy: {
    name: 'Energy',
    enabled: true,
    colorMode: 'cold',
    edgeMode: 'all',
    brightness: 0.75,
    thickness: 60
  }
};

// Load saved settings
chrome.storage.local.get({
  enabled: true,
  colorMode: 'warm',
  edgeMode: 'all',
  brightness: 0.5,
  thickness: 60
}, (data) => {
  initializeUI(data);
  updateDisplay();
});

function initializeUI(data) {
  // Set enable toggle
  document.getElementById('enable-toggle').checked = data.enabled;

  // Set color mode
  document.querySelectorAll('.button').forEach(btn => {
    if (btn.id === 'warm-btn' && data.colorMode === 'warm') {
      btn.classList.add('active');
    } else if (btn.id === 'cold-btn' && data.colorMode === 'cold') {
      btn.classList.add('active');
    } else if ((btn.id === 'warm-btn' || btn.id === 'cold-btn') && data.colorMode !== btn.dataset.mode) {
      btn.classList.remove('active');
    }
  });

  // Set edge mode
  document.querySelectorAll('.button').forEach(btn => {
    if (btn.id === 'all-edges-btn' && data.edgeMode === 'all') {
      btn.classList.add('active');
    } else if (btn.id === 'single-edge-btn' && data.edgeMode === 'single') {
      btn.classList.add('active');
    } else if ((btn.id === 'all-edges-btn' || btn.id === 'single-edge-btn') && data.edgeMode !== btn.dataset.mode) {
      btn.classList.remove('active');
    }
  });

  // Set sliders
  document.getElementById('brightness').value = data.brightness;
  document.getElementById('thickness').value = data.thickness;
}

// Enable/Disable toggle
document.getElementById('enable-toggle').addEventListener('change', (e) => {
  const enabled = e.target.checked;
  chrome.storage.local.set({ enabled });
  sendUpdate();
});

// Color mode buttons
document.getElementById('warm-btn').addEventListener('click', () => {
  setColorMode('warm');
});

document.getElementById('cold-btn').addEventListener('click', () => {
  setColorMode('cold');
});

function setColorMode(mode) {
  chrome.storage.local.set({ colorMode: mode });
  document.querySelectorAll('#warm-btn, #cold-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.getElementById(mode + '-btn').classList.add('active');
  sendUpdate();
}

// Edge mode buttons
document.getElementById('all-edges-btn').addEventListener('click', () => {
  setEdgeMode('all');
});

document.getElementById('single-edge-btn').addEventListener('click', () => {
  setEdgeMode('single');
});

function setEdgeMode(mode) {
  chrome.storage.local.set({ edgeMode: mode });
  document.querySelectorAll('#all-edges-btn, #single-edge-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.getElementById(mode === 'all' ? 'all-edges-btn' : 'single-edge-btn').classList.add('active');
  sendUpdate();
}

// Preset buttons
document.getElementById('preset-focus').addEventListener('click', () => applyPreset('focus'));
document.getElementById('preset-cinema').addEventListener('click', () => applyPreset('cinema'));
document.getElementById('preset-midnight').addEventListener('click', () => applyPreset('midnight'));
document.getElementById('preset-energy').addEventListener('click', () => applyPreset('energy'));

function applyPreset(presetName) {
  const preset = PRESETS[presetName];
  chrome.storage.local.set({
    enabled: preset.enabled,
    colorMode: preset.colorMode,
    edgeMode: preset.edgeMode,
    brightness: preset.brightness,
    thickness: preset.thickness
  });

  // Update UI
  document.getElementById('enable-toggle').checked = preset.enabled;
  setColorMode(preset.colorMode);
  setEdgeMode(preset.edgeMode);
  document.getElementById('brightness').value = preset.brightness;
  document.getElementById('thickness').value = preset.thickness;
  updateDisplay();
  sendUpdate();
}

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
  chrome.storage.local.get({
    enabled: true,
    colorMode: 'warm',
    edgeMode: 'all',
    brightness: 0.5,
    thickness: 60
  }, (data) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'updateGlow',
          ...data
        }).catch(() => {}); // Ignore errors if content script not loaded
      }
    });
  });
}