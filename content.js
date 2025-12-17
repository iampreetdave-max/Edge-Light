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
  `;
  document.documentElement.appendChild(glow);
  return glow;
}

let overlay = createGlowOverlay();

// Color configurations
const COLOR_MODES = {
  warm: {
    rgb: '255, 140, 0',      // Warm orange
    hex: '#FF8C00'
  },
  cold: {
    rgb: '0, 150, 255',      // Cool blue/cyan
    hex: '#0096FF'
  }
};

// Generate box-shadow for all edges glow
function generateAllEdgesGlow(colorRgb, brightness, thickness) {
  const blur = 50 + thickness * 0.8;
  const spread = 15 + thickness * 0.5;
  return `inset 0 0 ${blur}px ${spread}px rgba(${colorRgb}, ${brightness})`;
}

// Generate box-shadow for single edge glow (top edge)
function generateSingleEdgeGlow(colorRgb, brightness, thickness) {
  const blur = 60 + thickness;
  const spread = 20 + thickness * 0.6;
  // Create a top-heavy glow effect
  return `inset 0 ${spread}px ${blur}px 0px rgba(${colorRgb}, ${brightness * 0.8}), inset 0 ${spread * 0.5}px ${blur * 0.6}px 0px rgba(${colorRgb}, ${brightness * 0.4})`;
}

// Update glow effect
function updateGlow(settings) {
  if (!settings.enabled) {
    overlay.style.boxShadow = 'none';
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
}

// Listen for messages from popup with updated settings
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'updateGlow') {
    updateGlow(msg);
  }
});

// Load saved settings on page load
chrome.storage.local.get({
  enabled: true,
  colorMode: 'warm',
  edgeMode: 'all',
  brightness: 0.5,
  thickness: 60
}, (data) => {
  updateGlow(data);
});