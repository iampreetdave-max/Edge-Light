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
    border-radius: 8px;
    transition: box-shadow 0.3s ease, opacity 0.3s ease;
  `;
  document.documentElement.appendChild(glow);
  return glow;
}

let overlay = null;
let currentSettings = null;
let animationId = null;
let breathPhase = 0;

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
    rgb: '0, 180, 255',      // Cool blue/cyan
    hex: '#00B4FF'
  }
};

// Generate layered box-shadow for realistic ring light depth (all edges)
function generateAllEdgesGlow(colorRgb, brightness, thickness, sharpness, breathMultiplier = 1) {
  const adjustedBrightness = brightness * breathMultiplier;

  // Sharpness: 0 (soft) to 100 (sharp)
  // Higher sharpness = less blur, more defined edges
  const softness = (100 - sharpness) / 100;

  // Base values scaled by thickness
  const baseSpread = 20 + thickness * 0.6;
  const baseBlur = 30 + thickness * 0.8;

  // Create multiple layers for depth and natural falloff
  const layers = [
    // Layer 1: Outermost soft ambient glow
    `inset 0 0 ${baseBlur * 2.5 * (0.5 + softness * 0.5)}px ${baseSpread * 1.5}px rgba(${colorRgb}, ${adjustedBrightness * 0.15})`,
    // Layer 2: Mid-range glow for body
    `inset 0 0 ${baseBlur * 1.5 * (0.5 + softness * 0.5)}px ${baseSpread}px rgba(${colorRgb}, ${adjustedBrightness * 0.3})`,
    // Layer 3: Inner glow for intensity
    `inset 0 0 ${baseBlur * (0.3 + softness * 0.7)}px ${baseSpread * 0.6}px rgba(${colorRgb}, ${adjustedBrightness * 0.5})`,
    // Layer 4: Edge highlight - crisp rim light
    `inset 0 0 ${baseBlur * 0.3 * (0.2 + softness * 0.8)}px ${baseSpread * 0.3}px rgba(${colorRgb}, ${adjustedBrightness * 0.7})`
  ];

  return layers.join(', ');
}

// Generate layered box-shadow for single edge glow (top edge)
function generateSingleEdgeGlow(colorRgb, brightness, thickness, sharpness, breathMultiplier = 1) {
  const adjustedBrightness = brightness * breathMultiplier;

  const softness = (100 - sharpness) / 100;
  const baseSpread = 30 + thickness * 0.8;
  const baseBlur = 50 + thickness;

  // Layered top-down lighting
  const layers = [
    // Layer 1: Wide ambient from top
    `inset 0 ${baseSpread * 1.2}px ${baseBlur * 2 * (0.5 + softness * 0.5)}px ${-baseSpread * 0.3}px rgba(${colorRgb}, ${adjustedBrightness * 0.2})`,
    // Layer 2: Mid glow
    `inset 0 ${baseSpread * 0.8}px ${baseBlur * 1.2 * (0.5 + softness * 0.5)}px ${-baseSpread * 0.4}px rgba(${colorRgb}, ${adjustedBrightness * 0.4})`,
    // Layer 3: Focused top light
    `inset 0 ${baseSpread * 0.4}px ${baseBlur * 0.5 * (0.3 + softness * 0.7)}px ${-baseSpread * 0.5}px rgba(${colorRgb}, ${adjustedBrightness * 0.6})`
  ];

  return layers.join(', ');
}

// Smooth easing function for breathing animation
function easeInOutSine(t) {
  return (Math.sin(t * Math.PI * 2 - Math.PI / 2) + 1) / 2;
}

// Breathing animation loop
function animateBreathing(timestamp) {
  if (!currentSettings || !currentSettings.enabled || !currentSettings.breathing) {
    animationId = null;
    return;
  }

  // 6 second breath cycle for calm, natural rhythm
  const cycleDuration = 6000;
  breathPhase = (timestamp % cycleDuration) / cycleDuration;

  // Subtle intensity variation: 0.85 to 1.0
  const breathMultiplier = 0.85 + easeInOutSine(breathPhase) * 0.15;

  applyGlow(currentSettings, breathMultiplier);
  animationId = requestAnimationFrame(animateBreathing);
}

// Start breathing animation
function startBreathing() {
  if (animationId) return;
  animationId = requestAnimationFrame(animateBreathing);
}

// Stop breathing animation
function stopBreathing() {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
}

// Apply glow effect
function applyGlow(settings, breathMultiplier = 1) {
  if (!overlay) return;

  const colorRgb = COLOR_MODES[settings.colorMode || 'warm'].rgb;
  const brightness = settings.brightness || 0.8;
  const thickness = settings.thickness || 60;
  const sharpness = settings.sharpness || 60;
  const edgeMode = settings.edgeMode || 'all';

  let boxShadow;
  if (edgeMode === 'single') {
    boxShadow = generateSingleEdgeGlow(colorRgb, brightness, thickness, sharpness, breathMultiplier);
  } else {
    boxShadow = generateAllEdgesGlow(colorRgb, brightness, thickness, sharpness, breathMultiplier);
  }

  overlay.style.boxShadow = boxShadow;
}

// Update glow effect
function updateGlow(settings) {
  if (!overlay) return;

  currentSettings = settings;

  if (!settings.enabled) {
    overlay.style.boxShadow = 'none';
    overlay.style.opacity = '0';
    stopBreathing();
    return;
  }

  overlay.style.opacity = '1';

  if (settings.breathing && !document.hidden) {
    startBreathing();
  } else {
    stopBreathing();
    applyGlow(settings);
  }
}

// Handle visibility changes - pause animation when tab is hidden
function handleVisibilityChange() {
  if (!currentSettings) return;

  if (document.hidden) {
    stopBreathing();
  } else if (currentSettings.enabled && currentSettings.breathing) {
    startBreathing();
  }
}

document.addEventListener('visibilitychange', handleVisibilityChange);

// Listen for messages from popup with updated settings
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'updateGlow') {
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
    sharpness: 60,
    breathing: false
  }, (data) => {
    updateGlow(data);
  });
}

// Initialize when script loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeGlow);
} else {
  initializeGlow();
}
