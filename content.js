/**
 * Ring Light - A soft, elegant glow around the browser viewport
 */

(function() {
  'use strict';

  const RING_LIGHT_ID = 'ring-light-overlay';

  // Soft warm white - like a real ring light
  const GLOW_COLOR = '255, 250, 245';

  // Animation timing
  const BREATH_DURATION = 4000; // 4 seconds per cycle
  const INTENSITY_MIN = 0.03;
  const INTENSITY_MAX = 0.08;

  let overlay = null;
  let animationId = null;
  let startTime = null;
  let isEnabled = true;

  /**
   * Creates the ring light overlay element
   */
  function createOverlay() {
    if (document.getElementById(RING_LIGHT_ID)) return;

    overlay = document.createElement('div');
    overlay.id = RING_LIGHT_ID;

    Object.assign(overlay.style, {
      position: 'fixed',
      inset: '0',
      pointerEvents: 'none',
      zIndex: '2147483647',
      borderRadius: '8px',
      transition: 'opacity 0.3s ease'
    });

    document.documentElement.appendChild(overlay);
  }

  /**
   * Generates layered box-shadows for realistic ring light depth
   * Multiple layers create natural falloff and soft edges
   */
  function generateGlow(intensity) {
    const layers = [
      // Outermost soft glow - large blur, wide spread
      `inset 0 0 120px 40px rgba(${GLOW_COLOR}, ${intensity * 0.4})`,
      // Mid layer - medium blur for body
      `inset 0 0 80px 20px rgba(${GLOW_COLOR}, ${intensity * 0.6})`,
      // Inner layer - tighter, more defined
      `inset 0 0 40px 8px rgba(${GLOW_COLOR}, ${intensity * 0.8})`,
      // Edge highlight - subtle bright rim
      `inset 0 0 16px 2px rgba(${GLOW_COLOR}, ${intensity})`
    ];

    return layers.join(', ');
  }

  /**
   * Updates the glow effect
   */
  function updateGlow(intensity) {
    if (!overlay) return;
    overlay.style.boxShadow = generateGlow(intensity);
  }

  /**
   * Easing function for natural breathing rhythm
   * Creates a smooth sine wave oscillation
   */
  function easeBreath(t) {
    return (Math.sin(t * Math.PI * 2 - Math.PI / 2) + 1) / 2;
  }

  /**
   * Animation loop for subtle breathing effect
   */
  function animate(timestamp) {
    if (!isEnabled) return;

    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;

    // Calculate breathing phase (0 to 1)
    const phase = (elapsed % BREATH_DURATION) / BREATH_DURATION;
    const breath = easeBreath(phase);

    // Interpolate between min and max intensity
    const intensity = INTENSITY_MIN + (INTENSITY_MAX - INTENSITY_MIN) * breath;

    updateGlow(intensity);
    animationId = requestAnimationFrame(animate);
  }

  /**
   * Starts the breathing animation
   */
  function startAnimation() {
    if (animationId) return;
    startTime = null;
    animationId = requestAnimationFrame(animate);
  }

  /**
   * Stops the animation
   */
  function stopAnimation() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }

  /**
   * Handles visibility changes - pause when tab is hidden
   */
  function handleVisibilityChange() {
    if (document.hidden) {
      stopAnimation();
    } else if (isEnabled) {
      startAnimation();
    }
  }

  /**
   * Enables the ring light
   */
  function enable() {
    isEnabled = true;
    if (overlay) {
      overlay.style.opacity = '1';
    }
    if (!document.hidden) {
      startAnimation();
    }
  }

  /**
   * Disables the ring light
   */
  function disable() {
    isEnabled = false;
    stopAnimation();
    if (overlay) {
      overlay.style.opacity = '0';
    }
  }

  /**
   * Initializes the ring light
   */
  function init() {
    createOverlay();

    // Load saved state
    chrome.storage.local.get({ enabled: true }, (data) => {
      isEnabled = data.enabled;
      if (isEnabled) {
        enable();
      } else {
        disable();
      }
    });

    // Listen for visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Listen for toggle messages from popup
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.type === 'toggle') {
        if (msg.enabled) {
          enable();
        } else {
          disable();
        }
      }
    });
  }

  // Initialize when DOM is ready
  if (document.documentElement) {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();
