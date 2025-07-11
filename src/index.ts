import { ExampleModule } from '@/modules/example';
import { DOMUtils } from '@/utils/dom';
import { EventEmitter } from '@/utils/events';
import { Storage } from '@/utils/storage';

/**
 * Application events interface
 */
interface AppEvents {
  ready: void;
  error: Error;
  moduleLoaded: { name: string };
}

/**
 * Main Application Class
 *
 * This is the entry point for your UserScript.
 * Extend this class to build your specific functionality.
 */
class App extends EventEmitter<AppEvents> {
  private isInitialized = false;
  private modules: Map<string, any> = new Map();

  constructor() {
    super();
    this.initialize();
  }

  /**
   * Initialize the application
   */
  private async initialize(): Promise<void> {
    try {
      console.log('🚀 UserScript starting...');

      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        await new Promise(resolve => {
          document.addEventListener('DOMContentLoaded', resolve, { once: true });
        });
      }

      await this.main();

      this.isInitialized = true;
      this.emit('ready', undefined);

      console.log('✅ UserScript initialized successfully');
    } catch (error) {
      console.error('❌ UserScript initialization failed:', error);
      this.emit('error', error as Error);
    }
  }

  /**
   * Main application logic
   * Override this method in your implementation
   */
  protected async main(): Promise<void> {
    console.log('👋 Hello from UserScript Template!');

    // Example: Add some basic functionality
    this.addExampleFeatures();

    // Initialize modules
    await this.initializeModules();
  }

  /**
   * Initialize application modules
   */
  private async initializeModules(): Promise<void> {
    try {
      // Initialize example module
      const exampleModule = new ExampleModule();
      await exampleModule.initialize();

      // Register the module
      this.registerModule('example', exampleModule);

      // Listen to module events
      exampleModule.on('actionPerformed', ({ action, timestamp }) => {
        console.log(
          `📡 Module action received: ${action} at ${new Date(timestamp).toLocaleString()}`
        );
      });
    } catch (error) {
      console.error('❌ Failed to initialize modules:', error);
    }
  }

  /**
   * Example features to demonstrate the template
   */
  private addExampleFeatures(): void {
    // Example: Add custom styles
    DOMUtils.addStyles(
      `
      .userscript-highlight {
        background-color: yellow !important;
        border: 2px solid red !important;
      }
    `,
      'userscript-styles'
    );

    // Example: Storage usage
    const visitCount = (Storage.get<number>('visitCount', 0) || 0) + 1;
    Storage.set('visitCount', visitCount);
    console.log(`📊 This is visit #${visitCount}`);

    // Example: Add menu command
    if (typeof GM_registerMenuCommand !== 'undefined') {
      GM_registerMenuCommand('Show Visit Count', () => {
        const count = Storage.get<number>('visitCount', 0);
        alert(`You have visited this page ${count} times!`);
      });
    }
  }

  /**
   * Register a module
   */
  protected registerModule(name: string, module: any): void {
    this.modules.set(name, module);
    this.emit('moduleLoaded', { name });
    console.log(`📦 Module "${name}" loaded`);
  }

  /**
   * Get a registered module
   */
  protected getModule<T = any>(name: string): T | undefined {
    return this.modules.get(name);
  }

  /**
   * Check if app is initialized
   */
  public get ready(): boolean {
    return this.isInitialized;
  }
}

// Start the application
new App();
