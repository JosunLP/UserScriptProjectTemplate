# UserScript Project Template

[![GitHub license](https://img.shields.io/github/license/JosunLP/UserScriptProjectTemplate)](https://github.com/JosunLP/UserScriptProjectTemplate/blob/main/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/JosunLP/UserScriptProjectTemplate)](https://github.com/JosunLP/UserScriptProjectTemplate/issues)
[![GitHub stars](https://img.shields.io/github/stars/JosunLP/UserScriptProjectTemplate)](https://github.com/JosunLP/UserScriptProjectTemplate/stargazers)

## Description

A modern, production-ready template for building UserScripts using TypeScript and Vite. This template provides a solid foundation with best practices, type safety, and modern development tools for creating sophisticated Tampermonkey and Greasemonkey scripts.

## Features

• 🚀 **Modern Tech Stack:** TypeScript, Vite, ESLint, Prettier
• 🛡️ **Type Safety:** Strict TypeScript configuration with comprehensive UserScript API definitions
• 🔧 **Development Tools:** ESLint, Prettier, automated build pipeline
• 🎯 **Environment Support:** Separate development and production configurations
• 📦 **Modular Architecture:** Component system with reusable utilities
• 💾 **Storage Management:** Type-safe wrapper for GM_setValue/GM_getValue
• 🛠️ **Build System:** Optimized Vite configuration with automatic header generation
• 🎨 **DOM Utilities:** Helper functions for element manipulation and waiting
• 🔒 **Error Handling:** Comprehensive error boundary system
• ⚡ **Event System:** Type-safe event emitter for module communication

## Installation

### Quick Start

```bash
git clone https://github.com/JosunLP/UserScriptProjectTemplate.git
cd UserScriptProjectTemplate
npm install
```

### Development Setup

```bash
# Install dependencies
npm install

# Start development mode with auto-rebuild
npm run dev

# Type checking
npm run type-check

# Linting and formatting
npm run validate
```

## Usage

### Project Structure

```bash
src/
├── types/            # TypeScript type definitions
├── utils/            # Utility functions (Storage, DOM, Events)
├── core/             # Core application logic
├── modules/          # Feature modules
└── index.ts          # Main application entry point

tools/
├── userScriptHeader.ts  # UserScript header generator
└── userScriptHeader.js  # Compiled header generator

assets/               # Icons and static resources
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

### Build Commands

```bash
# Development
npm run dev              # Start development with watch mode
npm run dev:build        # Single development build with header
npm run dev:header       # Generate header for existing dev build

# Production
npm run build            # Build for production
npm run build:prod       # Explicit production build

# Quality Assurance
npm run validate         # Type check + lint
npm run lint            # ESLint with auto-fix
npm run format          # Prettier formatting

# Utilities
npm run clean           # Clean dist folder
npm run type-check      # TypeScript type checking
```

### Development Workflow

1. **Configure your script** in `header.config.json`
2. **Start development:** `npm run dev`
3. **Write your code** in the `src/` directory
4. **Build for production:** `npm run build`
5. **Install the UserScript** from `dist/` folder in Tampermonkey/Greasemonkey

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

## UserScript Compatibility

• **Tampermonkey:** Full support with all GM\_\* APIs
• **Greasemonkey:** Compatible with standard UserScript APIs
• **Violentmonkey:** Full compatibility
• **Safari:** Works with userscript managers

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and ensure tests pass: `npm run validate`
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

## Development Guidelines

• Follow TypeScript best practices
• Use meaningful variable and function names
• Add proper error handling
• Write self-documenting code
• Follow the established project structure
• Run `npm run validate` before committing

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

## Author

**_Jonas Pfalzgraf_**

• Email: [info@josunlp.de](mailto:info@josunlp.de)
• GitHub: [@JosunLP](https://github.com/JosunLP)

## Changelog

### v0.0.1 (Current)

• ✨ Modern TypeScript setup with strict type checking
• 🛡️ Comprehensive UserScript API definitions
• 🎨 Modular architecture with utilities and components
• 🔧 ESLint and Prettier configuration
• 📦 Optimized Vite build system
• 🚀 Environment-based configuration
• 💾 Type-safe storage management
• 🎯 Event-driven module system
• ⚡ DOM manipulation utilities
• 🛠️ Automated header generation

---

**_Built with ❤️ for the UserScript community_**
