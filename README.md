# Edge Light — Ambient Glow

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Chrome Extension](https://img.shields.io/badge/Manifest-V3-4285F4?style=flat&logo=googlechrome&logoColor=white)

> A Manifest V3 browser extension that paints a soft, configurable light glow around the edges of every page — bias lighting, built into the browser.

## Overview

Edge Light injects a full-viewport overlay on every page and uses layered CSS
`box-shadow` to render a ring-light style glow around the window edges. It is
purely visual and ambient: the overlay sits at the top of the stacking context,
ignores pointer events, and never interferes with the page beneath it. A popup
gives you live control over colour, intensity, geometry, and an optional
breathing animation, and every setting persists locally via the Chrome Storage
API so your look follows you across sessions and tabs.

## Key Features

- **Edge glow overlay** rendered with multi-layer inset `box-shadow` for natural,
  depth-aware falloff rather than a flat ring.
- **Two colour modes** — warm (orange) and cold (blue/cyan).
- **Edge modes** — glow on all four edges, or a single top-edge top-down light.
- **Adjustable brightness, thickness, and sharpness** via sliders, with the
  sharpness value surfaced as a readable label (Very Soft → Very Sharp).
- **Breathing animation** — an optional ~6s ease-in-out intensity cycle that
  automatically pauses when the tab is hidden to avoid wasting frames.
- **Four one-click presets** — Focus, Cinema, Midnight, and Energy.
- **Persistent settings** stored with `chrome.storage.local` and reapplied on
  every page load.
- **Lightweight** — no dependencies, no network access; the only permission
  requested is `storage`.

## How It Works

- `content.js` runs at `document_start` on `<all_urls>`. It appends a fixed,
  pointer-events-none overlay `<div>` to the document root, loads saved settings,
  and applies the computed `box-shadow`. It also drives the breathing animation
  loop and listens for `visibilitychange` to pause/resume.
- `popup.js` reads and writes settings to `chrome.storage.local`, updates the
  popup UI, and pushes live changes to the active tab's content script via
  `chrome.tabs.sendMessage`.
- The two scripts communicate through a single `updateGlow` message, so popup
  edits are reflected on the page immediately.

## Tech Stack

- **Language:** JavaScript (vanilla, no build step)
- **Platform:** Chrome / Edge extension, Manifest V3
- **Storage:** Chrome Storage API (`storage.local`)

## Getting Started

### Prerequisites

- A Chromium-based browser (Chrome or Edge)

### Install (unpacked)

1. Clone the repository:
   ```bash
   git clone https://github.com/iampreetdave-max/Edge-Light.git
   ```
2. Open `chrome://extensions/` (or `edge://extensions/`).
3. Enable **Developer mode**.
4. Click **Load unpacked** and select the cloned `Edge-Light` folder.

### Usage

Click the Edge Light toolbar icon to open the popup, then toggle the glow, pick a
colour and edge mode, tune the sliders, or apply a preset. Changes apply to the
active tab instantly and persist for future pages.

## Project Structure

```
Edge-Light/
├── manifest.json    # Manifest V3 definition (storage permission, content script, popup)
├── content.js       # Injects the overlay and renders/animates the glow
├── popup.html       # Settings UI
├── popup.js         # Reads/writes settings and messages the active tab
├── LICENSE
└── README.md
```

## License

Licensed under the MIT License — see [LICENSE](LICENSE).
