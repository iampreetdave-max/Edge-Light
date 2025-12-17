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
function generateAllEdgesGlow(colorRgb, brightness, thickness, sharpness) {
  // Sharpness: 0 (soft) to 100 (sharp)
  // Convert sharpness to blur: high sharpness = low blur
  const blurBase = 200 - (sharpness * 1.8); // 200 (soft) down to ~20 (sharp)
  const blur = Math.max(10, blurBase) + thickness * 0.5;
  const spread = 40 + thickness * 0.8;
  return `inset 0 0 ${blur}px ${spread}px rgba(${colorRgb}, ${brightness})`;
}

// Generate box-shadow for single edge glow (top edge)
function generateSingleEdgeGlow(colorRgb, brightness, thickness, sharpness) {
  // Single edge glow from top
  const blurBase = 250 - (sharpness * 2); // 250 (soft) to ~30 (sharp)
  const blur = Math.max(15, blurBase) + thickness * 0.6;
  const spread = 50 + thickness;
  return `inset 0 ${spread}px ${blur}px -${Math.max(5, spread - 30)}px rgba(${colorRgb}, ${brightness})`;
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
  const brightness = settings.brightness || 0.8;
  const thickness = settings.thickness || 60;
  const sharpness = settings.sharpness || 60;

  const colorRgb = COLOR_MODES[colorMode].rgb;

  let boxShadow;
  if (edgeMode === 'single') {
    boxShadow = generateSingleEdgeGlow(colorRgb, brightness, thickness, sharpness);
  } else {
    boxShadow = generateAllEdgesGlow(colorRgb, brightness, thickness, sharpness);
  }

  overlay.style.boxShadow = boxShadow;
  console.log('Glow updated:', { colorMode, edgeMode, brightness, thickness, sharpness, boxShadow });
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
    brightness: 0.8,
    thickness: 60,
    sharpness: 60
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