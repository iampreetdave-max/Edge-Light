# Edge Light (Ambient Glow)

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Chrome Extension](https://img.shields.io/badge/Chrome_Extension-Manifest_V3-4285F4?style=flat&logo=googlechrome&logoColor=white)

> A browser extension that adds a soft, warm ambient light glow around browser edges — like bias lighting for your screen.

## About

Ambient Glow is a Chrome/Edge extension that overlays a customizable warm glow effect around your browser viewport. Built as a Manifest V3 extension with a popup UI for controlling glow settings. The content script injects the glow overlay on every page, while user preferences persist via Chrome's storage API.

## Tech Stack

- **Language:** JavaScript
- **Platform:** Chrome Extension (Manifest V3)
- **Storage:** Chrome Storage API

## Features

- **Ambient glow overlay** on all web pages
- **Customizable settings** via popup UI
- **Persistent preferences** saved across sessions
- **Lightweight** — minimal impact on page performance
- **Works on all URLs** — content script injected at document start

## Getting Started

### Prerequisites

- Chrome or Edge browser

### Installation

1. Clone the repository:

```bash
git clone https://github.com/iampreetdave-max/Edge-Light.git
```

2. Open `chrome://extensions/` in your browser
3. Enable **Developer mode**
4. Click **Load unpacked** and select the `Edge-Light` folder

### Usage

Click the extension icon in the toolbar to open the popup and adjust glow settings.

## Project Structure

```
Edge-Light/
├── manifest.json    # Extension manifest (V3)
├── content.js       # Injects ambient glow overlay
├── popup.html       # Settings popup UI
├── popup.js         # Popup logic and storage
├── LICENSE
└── README.md
```

## License

This project is licensed under the [MIT License](LICENSE).
