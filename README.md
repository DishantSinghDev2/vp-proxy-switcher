<p align="center">
  <img src="assets/icon.png" width="80" alt="VP Proxy Switcher" />
</p>

<h1 align="center">VP Proxy Switcher</h1>

<p align="center">
  A fast, minimal Chrome extension to manage, rotate, and test proxies — built for power users and developers.
</p>

<p align="center">
  <a href="https://v-proxies.com?utm_source=github&utm_medium=readme&utm_campaign=vp_proxy_switcher&ref=github">
    <img src="https://img.shields.io/badge/Powered%20by-v--proxies-22c55e?style=flat-square&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMjJzOC00IDgtMTBWNWwtOC0zLTggM3Y3YzAgNiA4IDEwIDggMTB6IiBmaWxsPSIjMjJjNTVlIi8+PC9zdmc+" alt="v-proxies" />
  </a>
  <a href="https://github.com/DishantSinghDev2/vp-proxy-switcher/releases">
    <img src="https://img.shields.io/github/v/release/DishantSinghDev2/vp-proxy-switcher?style=flat-square&color=22c55e" alt="Release" />
  </a>
  <img src="https://img.shields.io/badge/Chrome-MV3-4285F4?style=flat-square&logo=googlechrome&logoColor=white" alt="Chrome MV3" />
  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="License" />
</p>

---

## ✦ What is this?

VP Proxy Switcher is a lightweight Chrome extension that lets you instantly switch between HTTP/HTTPS proxies, rotate them automatically, and see your real external IP and latency — all from a clean popup, no backend required.

Built to work seamlessly with **[v-proxies](https://v-proxies.com?utm_source=github&utm_medium=readme&utm_campaign=vp_proxy_switcher&ref=github)** — residential, datacenter, and mobile proxies starting at just **$0.99/gb** with a **free trial**.

---

## Features

- **One-click proxy switching** — switch between proxies instantly, reload the active tab automatically
- **Bulk import** — paste a list of proxies (`host:port` or `host:port:user:pass`) and import all at once
- **Auto-rotate** — cycle through your proxy list on a configurable interval (30s, 1m, 5m, or custom)
- **Live IP display** — see your real external IP after each switch, powered by [ipwho.is](https://ipwho.is)
- **Latency indicator** — color-coded dot + ms readout for each proxy
- **Flag + geo enrichment** — automatically detects country, city, and flag for each proxy host
- **User agent spoofing** — 20+ presets: Chrome, Firefox, Safari, Edge, mobile, and bots
- **Proxy auth** — supports `username:password` authentication for private proxies
- **Delete protection** — active proxy cannot be accidentally removed

---

## Installation

### From GitHub Releases (recommended)

1. Download the latest `vp-proxy-switcher-v*.zip` from [Releases](https://github.com/DishantSinghDev2/vp-proxy-switcher/releases)
2. Unzip the file
3. Open Chrome and go to `chrome://extensions`
4. Enable **Developer mode** (toggle in top-right)
5. Click **Load unpacked** and select the unzipped folder
6. The VP Proxy Switcher icon will appear in your toolbar

### From Source

**Prerequisites:** Node.js 18+, npm

```bash
git clone https://github.com/DishantSinghDev2/vp-proxy-switcher.git
cd vp-proxy-switcher
npm install
npm run build
```

Then load the `build/chrome-mv3-prod` folder as an unpacked extension in `chrome://extensions`.

For live development with hot reload:

```bash
npm run dev
```

---

## Adding Proxies

### Single proxy

Click **Proxy → + Add proxy** and fill in:

| Field | Example |
|---|---|
| Host / IP | `73.42.108.221` |
| Port | `8000` |
| Username | `user` *(optional)* |
| Password | `pass` *(optional)* |

### Bulk import

Click **Proxy → Import** and paste one proxy per line:

```
73.42.108.221:8000
88.198.41.92:8000:user:pass
192.168.1.100:3128
```

Supports `host:port` and `host:port:username:password` formats.

---

## Auto-Rotate

Enable **Auto-rotate proxy** in the extension popup and choose an interval:

- **30s** — every 30 seconds
- **1m / 5m / 10m / 30m** — standard presets
- **Custom** — any value ≥ 10 seconds

Requires at least **2 proxies** in your list. The active tab reloads automatically on each rotation (if "Reload tab when proxy changes" is enabled).

---

## Get Proxies — $0.99/gb · Free Trial

VP Proxy Switcher is designed to work perfectly with **[v-proxies](https://v-proxies.com?utm_source=github&utm_medium=readme&utm_campaign=vp_proxy_switcher&ref=github)**:

- Residential, datacenter, and mobile proxies
- 195+ countries
- Rotating and sticky sessions
- No monthly commitment — pay per GB
- **Starting at $0.99/gb**
- **Free trial available**

→ [Get started at v-proxies.com](https://v-proxies.com?utm_source=github&utm_medium=readme&utm_campaign=vp_proxy_switcher&ref=github)

---

## Tech Stack

| | |
|---|---|
| Framework | [Plasmo](https://docs.plasmo.com) (Chrome MV3) |
| UI | React + Tailwind CSS |
| Bundler | Parcel (via Plasmo) |
| IP/Geo API | [ipwho.is](https://ipwho.is) (free, no key) |
| Latency check | `https://1.1.1.1/cdn-cgi/trace` |

---

## Development

```bash
npm run dev     # hot-reload dev build
npm run build   # production build → build/chrome-mv3-prod
```

Project structure:

```
popup.tsx              # main popup UI
background.ts          # service worker (proxy switching, alarms)
components/
  Header.tsx
  RoutingCard.tsx       # live IP + latency card
  ProxySelector.tsx     # proxy list + add/import
  RotationSettings.tsx  # auto-rotate config
  UserAgentSelector.tsx
  Toggle.tsx
  ActionButtons.tsx
lib/
  types.ts
  storage.ts
  defaults.ts
  proxyManager.ts
  ipInfo.ts
  tester.ts
assets/
  icon.png
```

---

## License

MIT © [v-proxies.com](https://v-proxies.com?utm_source=github&utm_medium=readme&utm_campaign=vp_proxy_switcher&ref=github)
