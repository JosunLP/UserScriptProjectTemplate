# UserScript Project Template

[![GitHub license](https://img.shields.io/github/license/JosunLP/UserScriptProjectTemplate?style=for-the-badge)](https://github.com/JosunLP/UserScriptProjectTemplate/blob/main/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/JosunLP/UserScriptProjectTemplate?style=for-the-badge)](https://github.com/JosunLP/UserScriptProjectTemplate/issues)
[![GitHub stars](https://img.shields.io/github/stars/JosunLP/UserScriptProjectTemplate?style=for-the-badge)](https://github.com/JosunLP/UserScriptProjectTemplate/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/JosunLP/UserScriptProjectTemplate?style=for-the-badge)](https://github.com/JosunLP/UserScriptProjectTemplate/network)

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-blue?logo=typescript&style=for-the-badge)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.0+-646CFF?logo=vite&style=for-the-badge)](https://vitejs.dev/)
[![ESLint](https://img.shields.io/badge/ESLint-8.57+-4B32C3?logo=eslint&style=for-the-badge)](https://eslint.org/)
[![Prettier](https://img.shields.io/badge/Prettier-3.6+-F7B93E?logo=prettier&style=for-the-badge)](https://prettier.io/)
[![Bun](https://img.shields.io/badge/Bun-1.3+-000000?logo=bun&style=for-the-badge)](https://bun.sh/)

[![Tampermonkey](https://img.shields.io/badge/Tampermonkey-Compatible-00485B?logo=tampermonkey&style=for-the-badge)](https://www.tampermonkey.net/)
[![Greasemonkey](https://img.shields.io/badge/Greasemonkey-Compatible-FF6600?logo=firefox&style=for-the-badge)](https://www.greasespot.net/)
[![Violentmonkey](https://img.shields.io/badge/Violentmonkey-Compatible-663399?logo=violentmonkey&style=for-the-badge)](https://violentmonkey.github.io/)
[![Mobile Support](https://img.shields.io/badge/Mobile-Support-00C851?logo=android&style=for-the-badge)](https://github.com/JosunLP/UserScriptProjectTemplate#mobile-browser-support)

[![Last Commit](https://img.shields.io/github/last-commit/JosunLP/UserScriptProjectTemplate?style=for-the-badge)](https://github.com/JosunLP/UserScriptProjectTemplate/commits)
[![Contributors](https://img.shields.io/github/contributors/JosunLP/UserScriptProjectTemplate?style=for-the-badge)](https://github.com/JosunLP/UserScriptProjectTemplate/graphs/contributors)
[![Repository Size](https://img.shields.io/github/repo-size/JosunLP/UserScriptProjectTemplate?style=for-the-badge)](https://github.com/JosunLP/UserScriptProjectTemplate)

## Description

A modern, production-ready template for building UserScripts using TypeScript and Vite. This template provides a solid foundation with best practices, type safety, and modern development tools for creating sophisticated Tampermonkey and Greasemonkey scripts.

## Features

- 🚀 **Modern Tech Stack:** TypeScript, Vite, ESLint, Prettier, Bun
- 🛡️ **Type Safety:** Strict TypeScript configuration with comprehensive UserScript API definitions
- 🔧 **Development Tools:** ESLint, Prettier, Bun-powered automated build pipeline
- 🎯 **Environment Support:** Separate development and production configurations
- 📦 **Modular Architecture:** Component system with reusable utilities
- 💾 **Storage Management:** Type-safe wrapper for GM_setValue/GM_getValue
- 🛠️ **Build System:** Optimized Vite configuration with automatic header generation
- 🎨 **DOM Utilities:** Helper functions for element manipulation and waiting
- ✨ **Optional bQuery Upgrade Path:** Advanced example using `@bquery/bquery/core`, `reactive`, and `media`
- 🔒 **Error Handling:** Comprehensive error boundary system
- ⚡ **Event System:** Type-safe event emitter for module communication
- 📱 **Mobile Support:** Touch-optimized interface with mobile browser detection
- 🤏 **Touch Gestures:** Built-in touch event handling and gesture recognition
- 📲 **Responsive Design:** Mobile-first CSS with safe area support for notched devices

## Installation

### Quick Start

```bash
git clone https://github.com/JosunLP/UserScriptProjectTemplate.git
cd UserScriptProjectTemplate
bun install
```

### Development Setup

```bash
# Install dependencies
bun install

# Start development mode with auto-rebuild
bun run dev

# Type checking
bun run type-check

# Linting and formatting
bun run validate
```

## Usage

### Project Structure

```bash
src/
├── types/            # TypeScript type definitions
├── utils/            # Utility functions (Storage, DOM, Events)
├── core/             # Core application logic
├── modules/          # Feature modules, including the optional bQuery example
└── index.ts          # Main application entry point

tools/
├── userScriptHeader.ts  # UserScript header generator

assets/               # Icons and static resources
└── icon.afdesign
```

### Configuration

The main configuration is in `header.config.json`. This file controls UserScript metadata generation:

```json
{
  "environments": {
    "development": {
      "includes": ["http://localhost:*/*", "https://localhost:*/*"],
      "grants": ["GM_setValue", "GM_getValue", "GM_log", "GM_notification"]
    },
    "production": {
      "includes": ["https://your-domain.com/*"],
      "grants": ["GM_setValue", "GM_getValue"]
    }
  }
}
```

### Optional bQuery Integration

The template now ships with a selective `@bquery/bquery` example instead of replacing the existing utility layer.

- The existing `DOMUtils`, `EventEmitter`, `Storage`, and mobile helpers remain the default foundation.
- The advanced example in `/home/runner/work/UserScriptProjectTemplate/UserScriptProjectTemplate/src/modules/bquery-example.ts` demonstrates when bQuery adds value:
  - `@bquery/bquery/core` for DOM updates and delegated events
  - `@bquery/bquery/reactive` for signal-driven state
  - `@bquery/bquery/media` for responsive viewport state
- Only subpath imports are used so the bundle stays as small as possible.
- Because bQuery ships modern ESM, the advanced path now targets current UserScript-capable browsers and runtime versions (`node >=24`, `bun >=1.3.11`).
- If you do not want the advanced path, remove the `bquery-example` module import from `/home/runner/work/UserScriptProjectTemplate/UserScriptProjectTemplate/src/index.ts` and uninstall `@bquery/bquery`.

This keeps the base template approachable while still providing a modern upgrade path for more interactive UserScripts.

### Build Commands

```bash
# Development
bun run dev              # Start development with watch mode
bun run dev:build        # Single development build with dev header
bun run dev:header       # Generate header for an existing dev build

# Production
bun run build            # Build for production
bun run build:prod       # Explicit production build

# Quality Assurance
bun run validate         # Type check + lint
bun run lint             # ESLint
bun run lint:fix         # ESLint with auto-fix
bun run format           # Prettier formatting

# Utilities
bun run clean            # Clean dist folder
bun run type-check       # TypeScript type checking
```

### Build Optimization

The template features advanced build optimization for production:

| Build Type      | File Size | Compressed | Features                               |
| --------------- | --------- | ---------- | -------------------------------------- |
| **Development** | ~115 KB   | ~30 KB     | Source maps, debug info, readable code |
| **Production**  | ~25 KB    | ~6 KB      | Minified, tree-shaken, optimized       |

**Production optimizations include:**

- ⚡ **Terser minification** with aggressive compression settings
- 🌳 **Tree-shaking** to remove unused code
- 🎯 **Dead code elimination** for **DEV** blocks
- 📦 **Module inlining** for single-file output
- 🔧 **Property mangling** for smaller variable names
- 🚀 **ES2020 target** for modern JavaScript features
- 💾 **GZIP compression** reducing size by ~75%

### Development Workflow

1. **Configure your script** in `header.config.json`
2. **Install dependencies:** `bun install`
3. **Start development:** `bun run dev`
4. **Write your code** in the `src/` directory
5. **Build for production:** `bun run build`
6. **Install the UserScript** from `dist/` folder in Tampermonkey/Greasemonkey

### Storage Management

The template includes a type-safe storage system:

```typescript
import { Storage } from '@/utils/storage';

// Save data
Storage.set('userData', { name: 'John', visits: 5 });

// Get data with default value
const userData = Storage.get('userData', { name: '', visits: 0 });

// Check if key exists
if (Storage.has('userData')) {
  // Key exists
}

// Remove data
Storage.remove('userData');
```

### DOM Utilities

Helper functions for DOM manipulation:

```typescript
import { DOMUtils } from '@/utils/dom';

// Wait for element to appear
const element = await DOMUtils.waitForElement('.my-selector');

// Add custom styles
DOMUtils.addStyles(`
  .my-class { color: red; }
`);

// Create element with attributes
const button = DOMUtils.createElement('button', {
  textContent: 'Click me',
  onclick: () => console.log('Clicked!'),
});
```

### Event System

Type-safe communication between modules:

```typescript
import { EventEmitter } from '@/utils/events';

interface MyEvents {
  userAction: { userId: string };
  dataLoaded: { count: number };
}

const emitter = new EventEmitter<MyEvents>();

// Listen for events
emitter.on('userAction', ({ userId }) => {
  console.log(`User ${userId} performed an action`);
});

// Emit events
emitter.emit('userAction', { userId: '123' });
```

### Module System

Create reusable, event-driven modules:

```typescript
import { EventEmitter } from '@/utils/events';

interface ModuleEvents {
  initialized: void;
  actionPerformed: { action: string };
}

export class MyModule extends EventEmitter<ModuleEvents> {
  async initialize() {
    // Module initialization logic
    this.emit('initialized', undefined);
  }
}
```

### bQuery Advanced Example

The included advanced example module shows a selective integration strategy:

- keep GM storage in `Storage`
- keep the existing template modules intact
- add bQuery only where it improves ergonomics

It uses:

- reactive signals for counter and panel state
- delegated event handling via bQuery core
- viewport/media tracking via bQuery media helpers

That makes it a good starting point for overlays, dashboards, and richer in-page tools without forcing a full framework-style migration.

### Mobile Utilities

Mobile-specific functionality for touch-enabled devices:

```typescript
import { MobileUtils } from '@/utils/mobile';

// Detect mobile browser and capabilities
const detection = MobileUtils.detect();
console.log('Is Mobile:', detection.isMobile);
console.log('Has Touch:', detection.hasTouch);
console.log('Browser:', detection.browser);

// Add mobile-optimized styles
if (detection.isMobile) {
  MobileUtils.addMobileStyles();
}

// Unified touch/mouse event handling
MobileUtils.addUnifiedEventListener(element, 'start', event => {
  const position = MobileUtils.getEventPosition(event);
  console.log('Touch/click at:', position);
});

// Create mobile-friendly buttons
const button = mobileModule.createMobileButton('Action', () => {
  console.log('Button pressed');
});

// Orientation detection
console.log('Portrait mode:', MobileUtils.isPortrait());
```

## UserScript Compatibility

- **Tampermonkey:** Full support with all GM\_\* APIs
- **Greasemonkey:** Compatible with standard UserScript APIs
- **Violentmonkey:** Full compatibility
- **Safari:** Works with userscript managers

### Mobile Browser Support

**Android:**

- **Kiwi Browser:** Full Chrome extension + UserScript support
- **Microsoft Edge Mobile:** Tampermonkey support
- **Firefox Mobile:** Greasemonkey, Tampermonkey, Violentmonkey
- **Yandex Browser:** Chrome extension support

**iOS:**

- **Safari Mobile:** Tampermonkey or Userscripts App
- Limited support due to iOS restrictions

### Mobile Features

- **Touch Gestures:** Tap, swipe, and pinch detection
- **Responsive Design:** Mobile-first CSS with viewport adaptation
- **Safe Area Support:** Automatic handling of notched devices
- **Orientation Detection:** Portrait/landscape change handling
- **Mobile-Optimized UI:** Touch-friendly buttons and menus

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and ensure tests pass: `bun run validate`
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

## Development Guidelines

- Follow TypeScript best practices
- Use meaningful variable and function names
- Add proper error handling
- Write self-documenting code
- Follow the established project structure
- Run `bun run validate` before committing

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

## Author

**_Jonas Pfalzgraf_**

- Email: [info@josunlp.de](mailto:info@josunlp.de)
- GitHub: [@JosunLP](https://github.com/JosunLP)
- Website: [josunlp.de](https://josunlp.de)

---

**_Built with ❤️ for the UserScript community_**
