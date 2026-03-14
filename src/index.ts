import { TikTokQuickBlockModule } from '@/modules/tiktok-quick-block';
import { EventEmitter } from '@/utils/events';
import { MobileUtils } from '@/utils/mobile';

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
    console.log('🚀 TikTok Quick Block - Starting...');

    // Mobile detection and setup
    const mobileInfo = MobileUtils.detect();
    if (mobileInfo.isMobile) {
      console.log('📱 Mobile browser detected:', mobileInfo.browser);
      MobileUtils.addMobileStyles();
      MobileUtils.logMobileInfo();
    }

    // Initialize modules
    await this.initializeModules();
  }

  /**
   * Initialize application modules
   */
  private async initializeModules(): Promise<void> {
    try {
      // Initialize TikTok Quick Block module
      const tiktokModule = new TikTokQuickBlockModule();
      await tiktokModule.initialize();
      this.registerModule('tiktok-quick-block', tiktokModule);

      // Listen to TikTok module events
      tiktokModule.on('userBlocked', ({ username, timestamp }) => {
        console.log(
          `🚫 User blocked: @${username} at ${new Date(timestamp).toLocaleString()}`
        );
      });

      tiktokModule.on('buttonInjected', ({ count }) => {
        console.log(`✨ Quick block buttons injected: ${count}`);
      });

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
    } catch (error) {
      console.error('❌ Failed to initialize modules:', error);
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
