import { ExampleModule } from '@/modules/example';
import { DOMUtils } from '@/utils/dom';
import { EventEmitter } from '@/utils/events';
import { MobileUtils } from '@/utils/mobile';
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

    // Development-only debug information
    if (__DEV__) {
      console.log('🔧 UserScript starting in development mode');
      console.log('📦 Version:', __VERSION__);
      console.log('🕐 Build time:', __BUILD_TIME__);
    }

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

    // Mobile detection and setup
    const mobileInfo = MobileUtils.detect();
    if (mobileInfo.isMobile) {
      console.log('📱 Mobile browser detected:', mobileInfo.browser);
      MobileUtils.addMobileStyles();
      MobileUtils.logMobileInfo();
    }

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
      this.registerModule('example', exampleModule);

      // Initialize mobile module if on mobile device
      const mobileInfo = MobileUtils.detect();
      if (mobileInfo.isMobile || mobileInfo.hasTouch) {
        const { MobileModule } = await import('@/modules/mobile');
        const mobileModule = new MobileModule();
        await mobileModule.initialize();
        this.registerModule('mobile', mobileModule);

        // Listen to mobile module events
        mobileModule.on('gestureDetected', ({ type, position }) => {
          console.log(`📱 Gesture detected: ${type} at ${position.x}, ${position.y}`);
        });

        mobileModule.on('orientationChanged', ({ orientation }) => {
          console.log(`📱 Orientation changed to: ${orientation}`);
        });
      }

      // Listen to example module events
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
    // Add mobile-optimized styles
    const mobileInfo = MobileUtils.detect();
    const baseCss = `
      .userscript-highlight {
        background-color: yellow !important;
        border: 2px solid red !important;
      }
    `;

    // Add mobile-specific styles if on mobile
    const mobileCss = mobileInfo.isMobile
      ? `
      .userscript-highlight {
        padding: 8px !important;
        border-radius: 4px !important;
        font-size: 16px !important; /* Prevent zoom on iOS */
      }
    `
      : '';

    DOMUtils.addStyles(baseCss + mobileCss, 'userscript-styles');

    // Example: Storage usage
    const visitCount = (Storage.get<number>('visitCount', 0) || 0) + 1;
    Storage.set('visitCount', visitCount);
    console.log(`📊 This is visit #${visitCount}`);

    // Example: Add menu command (with mobile detection)
    if (typeof GM_registerMenuCommand !== 'undefined') {
      GM_registerMenuCommand('Show Visit Count', () => {
        const count = Storage.get<number>('visitCount', 0);

        if (mobileInfo.isMobile) {
          // Mobile-friendly notification
          if (typeof GM_notification !== 'undefined') {
            GM_notification(`Visit Count: ${count}`, 'UserScript Info', undefined, () => {
              console.log('Notification clicked');
            });
          } else {
            alert(`You have visited this page ${count} times!`);
          }
        } else {
          // Desktop alert
          alert(`You have visited this page ${count} times!`);
        }
      });

      // Add mobile-specific menu command
      if (mobileInfo.isMobile) {
        GM_registerMenuCommand('Mobile Info', () => {
          MobileUtils.logMobileInfo();

          const info = `
Device: ${mobileInfo.isAndroid ? 'Android' : mobileInfo.isIOS ? 'iOS' : 'Other'}
Touch Support: ${mobileInfo.hasTouch ? 'Yes' : 'No'}
UserScript Support: ${MobileUtils.supportsUserScripts() ? 'Yes' : 'No'}
Recommended Manager: ${MobileUtils.getRecommendedUserScriptManager()}
          `;

          if (typeof GM_notification !== 'undefined') {
            GM_notification(info, 'Mobile Device Info');
          } else {
            alert(info);
          }
        });
      }
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
