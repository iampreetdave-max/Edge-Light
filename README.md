# Edge-Light

A Chrome/Edge extension that renders a soft, configurable ambient glow around the browser viewport for reduced eye strain and a calmer reading environment.

![Manifest V3](https://img.shields.io/badge/Manifest-V3-4285F4)
![JavaScript](https://img.shields.io/badge/JavaScript-vanilla-F7DF1E)

## Overview

Edge-Light (extension name "Ambient Glow") injects a fixed, non-interactive overlay into every page and paints a layered inset glow around the edges of the window. The effect is rendered entirely with CSS `box-shadow` layers, so it adds no DOM weight to the page content and never intercepts clicks or scrolling.

All controls live in a popup. Settings are persisted to `chrome.storage.local` and applied live to the active tab through a content script, so adjustments take effect immediately without a reload. On every page load the content script reads the saved configuration and reproduces the last-applied glow.

## Key Features

- Two color modes: warm (orange) and cold (blue/cyan).
- Two edge modes: a glow on all four edges, or a single top-edge wash.
- Adjustable brightness, thickness, and sharpness via sliders.
- Optional breathing animation: a six-second eased intensity cycle for a slow, ambient pulse.
- Four built-in presets: Focus, Cinema, Midnight, and Energy.
- Animation pauses automatically when the tab is hidden (driven by the `visibilitychange` event) to avoid wasted rendering.
- Settings persist across sessions and are reapplied on every page load.

## How It Works

```
popup.html / popup.js  ──(chrome.storage.local + sendMessage)──►  content.js  ──►  overlay div (box-shadow)
```

- `content.js` creates a single fixed, `pointer-events: none` overlay (`#ambient-glow-overlay`) at the top z-index and injects it at `document_start`.
- The glow is built from multiple stacked inset `box-shadow` layers. Thickness scales spread/blur; sharpness controls the blur-to-spread ratio for soft or crisp edges; brightness scales per-layer alpha.
- The popup writes each control change to `chrome.storage.local` and sends an `updateGlow` message to the active tab; the content script recomputes and repaints the overlay.
- When breathing is enabled, a `requestAnimationFrame` loop modulates intensity between 0.85x and 1.0x using an eased sine cycle, and stops when the tab is hidden or breathing is turned off.

## Tech Stack

- Chrome Extensions Manifest V3
- Vanilla JavaScript (content script + popup script)
- `chrome.storage` and `chrome.tabs` / `chrome.runtime` messaging APIs
- CSS `box-shadow` for all rendering

## Getting Started

This is an unpacked extension; no build step is required.

1. Clone the repository.
2. Open `chrome://extensions` (or `edge://extensions`).
3. Enable Developer mode.
4. Choose "Load unpacked" and select the repository root (the folder containing `manifest.json`).
5. Open the toolbar popup to configure the glow.

## Configuration

There are no environment variables or API keys. Runtime state is stored in `chrome.storage.local` under these keys:

- `enabled` — glow on/off
- `colorMode` — `warm` or `cold`
- `edgeMode` — `all` or `single`
- `brightness` — intensity multiplier
- `thickness` — glow spread in pixels
- `sharpness` — edge softness (0 soft to 100 sharp)
- `breathing` — breathing animation on/off

## Project Structure

```
Edge-Light/
├── manifest.json   # Manifest V3 definition, permissions, content script registration
├── content.js      # Overlay injection, glow rendering, breathing animation
├── popup.html      # Popup UI markup
├── popup.js        # Controls, presets, storage persistence, live messaging
└── LICENSE
```

## License

Released under the terms of the LICENSE file in this repository.
