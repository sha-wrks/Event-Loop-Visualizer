# JS Runtime Visualizer

An interactive, browser-based visualization of the JavaScript Event Loop. Write any JavaScript snippet and watch it execute step by step - the Call Stack, Web APIs, Microtask Queue, and Macrotask Queue all update in real time with animated state transitions.

![Version](https://img.shields.io/badge/version-1.0.0-34d399?style=flat-square)
![Nuxt](https://img.shields.io/badge/Nuxt-4.x-00DC82?style=flat-square&logo=nuxt.js)
![Vue](https://img.shields.io/badge/Vue-3.x-4FC08D?style=flat-square&logo=vue.js)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Most developers learn about the JavaScript Event Loop through diagrams or text descriptions. This project makes it tangible - you write real JavaScript, and the visualizer shows exactly what the V8 runtime does with it: which function frames enter and exit the Call Stack, which async operations are delegated to Web APIs, and how Microtasks always flush before the next Macrotask runs.

The engine uses a real AST parser (Acorn) rather than `eval()`, giving it structured control over execution timing so each step is clearly visible in the UI.

---

## Features

- Real-time Call Stack visualization with LIFO push/pop animations
- Web APIs panel showing in-flight async operations with live countdown
- Microtask Queue (Promises) and Macrotask Queue (setTimeout) displayed side by side
- Console output panel showing execution order as it happens
- AST-based interpreter - parses user code into a syntax tree before executing
- Priority enforcement - Microtasks always drain before Macrotasks
- Glassmorphism UI with neon glow accents on a dark background
- GSAP entrance animations and spring-physics list transitions
- Lenis smooth scroll
- Fully responsive layout - works on mobile and desktop
- Client-side only, no server required

---

## Tech Stack

| Technology | Role |
|---|---|
| Nuxt 4 | Application framework (CSR mode, compatibilityVersion: 4) |
| Vue 3 | UI with Composition API and script setup |
| Pinia | Reactive VM state (call stack, queues, logs) |
| Acorn.js | JavaScript AST parser |
| GSAP | Entrance timeline and item animations |
| Lenis | Smooth scroll |
| Tailwind CSS | Utility layout classes |
| @lucide/vue | Icon set |
| JetBrains Mono | Monospace font via Google Fonts |

---

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm 9 or higher

### Installation

Clone the repository:

```bash
git clone https://github.com/sha-wrks/Event-Loop-Visualizer.git
cd Event-Loop-Visualizer
```

Install dependencies:

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

### Static Export

```bash
npm run generate
```

The output will be in the `.output/public` directory, ready to deploy to any static host (Vercel, Netlify, GitHub Pages, Cloudflare Pages).

---

## Project Structure

```
Event-Loop-Visualizer/
- app/
  - app.vue                 # Root layout - header, code input, visualizer grid
  - components/
    - AppLogo.vue           # SVG brand logo with theme gradient
    - visualizer/
      - Stack.vue           # Call Stack panel
      - Queues.vue          # Microtask and Macrotask queue panels
  - logic/
    - engine.ts             # AST interpreter and event loop simulation
  - stores/
    - useVM.ts              # Pinia store - virtual machine state
- public/
  - logo.svg                # SVG favicon
  - robots.txt
- nuxt.config.ts            # Nuxt configuration, head meta, Google Fonts
- tailwind.config.js        # Tailwind theme extensions
- CLAUDE.md                 # AI coding assistant context file
```

---

## How It Works

### 1. Parsing

When you click Execute, the engine passes your code to `acorn.parse()`, which returns an AST - a structured JSON tree of every expression, statement, and declaration in your script.

### 2. Node Processing

The interpreter walks the AST body and identifies three patterns:

- `console.log(...)` - pushed and popped on the Call Stack synchronously with an 800ms visual delay per step
- `setTimeout(fn, ms)` - registered in the Web APIs panel, then moved to the Macrotask Queue after the specified delay
- `Promise.resolve().then(fn)` - added directly to the Microtask Queue

### 3. Event Loop

A background loop polls every 100ms. Whenever the Call Stack is empty, it checks the queues in priority order:

1. Microtask Queue - drained completely before checking macrotasks
2. Macrotask Queue - one task per loop tick

This faithfully reproduces the actual V8 scheduling rules.

### 4. Reactive UI

All state mutations happen through the Pinia `useVMStore`. Vue's reactivity system binds the store directly to the animated components, so every push, pop, enqueue, and dequeue triggers the corresponding CSS transition automatically.

---

## Contributing

Contributions are welcome. Please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes with a descriptive message
4. Push to your branch and open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for full guidelines.

---

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.
