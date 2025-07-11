# UserScript Project Template

A modern, scalable UserScript project template for building large and structured TypeScript projects for Tampermonkey or Greasemonkey. Originally designed for the Ingress community, but adaptable for any web-based project.

## ✨ Features

- 🔧 **Modern TypeScript** with strict type checking
- 🚀 **Vite** for fast builds and development
- 📦 **Modular Architecture** with utilities and event system
- 🎯 **Environment-specific** configurations (dev/prod)
- 🧹 **ESLint + Prettier** for code quality
- 💾 **Storage utilities** for persistent data
- 🎨 **DOM utilities** for easier manipulation
- 📡 **Event system** for modular communication
- 🔒 **TypeScript definitions** for UserScript APIs

## 🚀 Quick Start

1. **Clone or use this template:**

   ```bash
   git clone https://github.com/JosunLP/UserScriptProjectTemplate.git my-userscript
   cd my-userscript
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure your script:**
   - Edit `header.config.json` to set your target domains
   - Update `package.json` with your script details

4. **Start development:**

   ```bash
   npm run dev
   ```

5. **Build for production:**

   ```bash
   npm run build:prod
   ```

## 📁 Project Structure

```bash
src/
├── index.ts          # Main application entry point
├── types/            # TypeScript definitions
│   └── userscript.d.ts
├── utils/            # Utility functions
│   ├── storage.ts    # Persistent storage helpers
│   ├── dom.ts        # DOM manipulation utilities
│   └── events.ts     # Event system
├── core/             # Core application logic
└── modules/          # Feature modules
```

## 🛠️ Available Scripts

- `npm run dev` - Build with watch mode for development
- `npm run build` - Build for production
- `npm run build:prod` - Build for production (explicit)
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking
- `npm run clean` - Clean dist folder

## ⚙️ Configuration

### Header Configuration

Edit `header.config.json` to configure your UserScript metadata:

```json
{
  "environments": {
    "development": {
      "includes": ["http://localhost:*/*"],
      "grants": ["GM_setValue", "GM_getValue", "GM_log"]
    },
    "production": {
      "includes": ["https://your-domain.com/*"],
      "grants": ["GM_setValue", "GM_getValue"]
    }
  }
}
```

### Environment Variables

The build system automatically detects the environment:

- `NODE_ENV=development` for development builds
- `NODE_ENV=production` for production builds

## 🧰 Utilities

### Storage

```typescript
import { Storage } from '@/utils/storage';

// Store data
Storage.set('key', { some: 'data' });

// Retrieve data
const data = Storage.get('key', defaultValue);

// Check existence
if (Storage.has('key')) {
  // Key exists
}
```

### DOM Utilities

```typescript
import { DOMUtils } from '@/utils/dom';

// Wait for element
const element = await DOMUtils.waitForElement('.my-selector');

// Add styles
DOMUtils.addStyles(`
  .my-class { color: red; }
`);

// Create element
const button = DOMUtils.createElement('button', {
  textContent: 'Click me',
  onclick: () => console.log('Clicked!')
});
```

### Events

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

## 🎯 Extending the Template

1. **Add new modules** in `src/modules/`
2. **Register modules** in your main App class
3. **Use the event system** for module communication
4. **Add utilities** in `src/utils/` for reusable functionality

Example module:

```typescript
// src/modules/example.ts
import { EventEmitter } from '@/utils/events';
import { Storage } from '@/utils/storage';

export class ExampleModule extends EventEmitter {
  initialize() {
    console.log('Example module initialized');
    // Your module logic here
  }
}
```

## 🔧 Development Tips

- Use `console.log()` freely - it's enabled in UserScripts
- Test in development mode with localhost includes
- Use TypeScript strict mode for better code quality
- Leverage the storage utilities for persistent data
- Use the event system for loose coupling between modules

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 💡 Originally for Ingress

This template was originally designed for the Ingress community but is versatile enough for any web-based UserScript project. The modular architecture makes it easy to build complex scripts while maintaining code quality and organization.
