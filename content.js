// Create and inject the glow overlay
function createGlowOverlay() {
  const glow = document.createElement('div');
  glow.id = 'ambient-glow-overlay';
  glow.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 2147483647;
    background: transparent;
    will-change: box-shadow;
  `;
  document.documentElement.appendChild(glow);
  console.log('Glow overlay created and injected');
  return glow;
}

let overlay = null;

// Wait for DOM to be ready
if (document.documentElement) {
  overlay = createGlowOverlay();
} else {
  document.addEventListener('DOMContentLoaded', () => {
    overlay = createGlowOverlay();
  });
}

// Color configurations
const COLOR_MODES = {
  warm: {
    rgb: '255, 140, 0',      // Warm orange
    hex: '#FF8C00'
  },
  cold: {
    rgb: '0, 180, 255',      // Cool blue/cyan (brighter)
    hex: '#00B4FF'
  }
};

// Generate box-shadow for all edges glow
function generateAllEdgesGlow(colorRgb, brightness, thickness) {
  const blur = 80 + thickness;
  const spread = 30 + thickness * 0.8;
  return `inset 0 0 ${blur}px ${spread}px rgba(${colorRgb}, ${brightness})`;
}

// Generate box-shadow for single edge glow (top edge)
function generateSingleEdgeGlow(colorRgb, brightness, thickness) {
  const blur = 100 + thickness * 1.2;
  const spread = 40 + thickness;
  // Create a layered top glow for more visibility
  return `inset 0 ${spread}px ${blur}px -${Math.max(0, spread - 20)}px rgba(${colorRgb}, ${brightness})`;
}

// Update glow effect
function updateGlow(settings) {
  if (!overlay) return;

  if (!settings.enabled) {
    overlay.style.boxShadow = 'none';
    console.log('Glow disabled');
    return;
  }

  const colorMode = settings.colorMode || 'warm';
  const edgeMode = settings.edgeMode || 'all';
  const brightness = settings.brightness || 0.5;
  const thickness = settings.thickness || 60;

  const colorRgb = COLOR_MODES[colorMode].rgb;

  let boxShadow;
  if (edgeMode === 'single') {
    boxShadow = generateSingleEdgeGlow(colorRgb, brightness, thickness);
  } else {
    boxShadow = generateAllEdgesGlow(colorRgb, brightness, thickness);
  }

  overlay.style.boxShadow = boxShadow;
  console.log('Glow updated:', { colorMode, edgeMode, brightness, thickness, boxShadow });
}

// Listen for messages from popup with updated settings
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'updateGlow') {
    console.log('Received message:', msg);
    updateGlow(msg);
  }
});

// Load saved settings on page load
function initializeGlow() {
  chrome.storage.local.get({
    enabled: true,
    colorMode: 'warm',
    edgeMode: 'all',
    brightness: 0.5,
    thickness: 60
  }, (data) => {
    console.log('Loaded settings:', data);
    updateGlow(data);
  });
}

// Initialize when script loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeGlow);
} else {
  initializeGlow();
}