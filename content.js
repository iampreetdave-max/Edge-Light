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
    box-shadow: inset 0 0 60px 20px rgba(255, 140, 0, 0.3);
  `;
  document.documentElement.appendChild(glow);
  return glow;
}

let overlay = createGlowOverlay();

// Listen for messages from popup with updated settings
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'updateGlow') {
    const { brightness, thickness } = msg;
    const blur = 40 + thickness * 0.6;
    const spread = 10 + thickness * 0.4;
    overlay.style.boxShadow = `inset 0 0 ${blur}px ${spread}px rgba(255, 140, 0, ${brightness})`;
  }
});

// Load saved settings on page load
chrome.storage.local.get({ brightness: 0.3, thickness: 50 }, (data) => {
  const { brightness, thickness } = data;
  const blur = 40 + thickness * 0.6;
  const spread = 10 + thickness * 0.4;
  overlay.style.boxShadow = `inset 0 0 ${blur}px ${spread}px rgba(255, 140, 0, ${brightness})`;
});