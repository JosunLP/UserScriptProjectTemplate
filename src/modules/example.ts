import { DOMUtils } from '@/utils/dom';
import { EventEmitter } from '@/utils/events';
import { Storage } from '@/utils/storage';

/**
 * Example module events
 */
interface ExampleModuleEvents {
  initialized: void;
  actionPerformed: { action: string; timestamp: number };
}

/**
 * Example module to demonstrate the template structure
 *
 * This module shows how to:
 * - Extend the EventEmitter for module communication
 * - Use storage for persistent data
 * - Manipulate DOM elements
 * - Register menu commands
 */
export class ExampleModule extends EventEmitter<ExampleModuleEvents> {
  private isInitialized = false;
  private actionCount = 0;
  private lastActionTime = 0;

  constructor() {
    super();
  }

  /**
   * Initialize the module
   */
  async initialize(): Promise<void> {
    try {
      console.log('📦 Initializing ExampleModule...');

      // Load persistent data
      this.actionCount = Storage.get<number>('exampleModule.actionCount', 0) || 0;
      this.lastActionTime = Storage.get<number>('exampleModule.lastActionTime', 0) || 0;

      // Wait for required DOM elements (example)
      await this.waitForPageElements();

      // Add custom styles
      this.addModuleStyles();

      // Register menu commands
      this.registerMenuCommands();

      // Set up event listeners
      this.setupEventListeners();

      this.isInitialized = true;
      this.emit('initialized', undefined);

      console.log('✅ ExampleModule initialized successfully');
    } catch (error) {
      console.error('❌ ExampleModule initialization failed:', error);
      throw error;
    }
  }

  /**
   * Wait for required page elements
   */
  private async waitForPageElements(): Promise<void> {
    // Example: Wait for body to be available
    await DOMUtils.waitForElement('body', 5000);
    console.log('📄 Page body is ready');
  }

  /**
   * Add module-specific styles
   */
  private addModuleStyles(): void {
    DOMUtils.addStyles(
      `
      .example-module-button {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        padding: 10px 15px;
        background: #007cba;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        transition: background 0.2s;
      }

      .example-module-button:hover {
        background: #005a87;
      }

      .example-module-notification {
        position: fixed;
        top: 70px;
        right: 20px;
        z-index: 9998;
        padding: 10px;
        background: #28a745;
        color: white;
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        opacity: 0;
        transition: opacity 0.3s;
      }

      .example-module-notification.show {
        opacity: 1;
      }
    `,
      'example-module-styles'
    );
  }

  /**
   * Register UserScript menu commands
   */
  private registerMenuCommands(): void {
    if (typeof GM_registerMenuCommand !== 'undefined') {
      GM_registerMenuCommand('🎯 Perform Example Action', () => {
        this.performAction('menu-command');
      });

      GM_registerMenuCommand('📊 Show Module Stats', () => {
        this.showStats();
      });

      GM_registerMenuCommand('🧹 Reset Module Data', () => {
        this.resetData();
      });
    }
  }

  /**
   * Set up event listeners
   */
  private setupEventListeners(): void {
    // Add a floating button for demonstration
    const button = DOMUtils.createElement('button', {
      className: 'example-module-button',
      textContent: '🎯 Example Action',
      onclick: () => this.performAction('button-click'),
    });

    document.body.appendChild(button);

    // Listen to keyboard shortcuts
    document.addEventListener('keydown', event => {
      // Ctrl+Shift+E to perform action
      if (event.ctrlKey && event.shiftKey && event.key === 'E') {
        event.preventDefault();
        this.performAction('keyboard-shortcut');
      }
    });
  }

  /**
   * Perform an example action
   */
  public performAction(trigger: string): void {
    this.actionCount++;
    const timestamp = Date.now();
    this.lastActionTime = timestamp;

    // Store the updated count and last action time
    Storage.set('exampleModule.actionCount', this.actionCount);
    Storage.set('exampleModule.lastActionTime', timestamp);

    // Emit event
    this.emit('actionPerformed', { action: trigger, timestamp });

    // Show notification
    this.showNotification(`Action performed via ${trigger}! (Total: ${this.actionCount})`);

    console.log(`🎯 Example action performed via ${trigger} (count: ${this.actionCount})`);
  }

  /**
   * Show a temporary notification
   */
  private showNotification(message: string, duration = 3000): void {
    const notification = DOMUtils.createElement('div', {
      className: 'example-module-notification',
      textContent: message,
    });

    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);

    // Remove after duration
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => DOMUtils.removeElement(notification), 300);
    }, duration);
  }

  /**
   * Show module statistics
   */
  private showStats(): void {
    const stats = {
      initialized: this.isInitialized,
      actionCount: this.actionCount,
      lastAction: this.lastActionTime,
    };

    const message = [
      'Example Module Statistics:',
      `• Initialized: ${stats.initialized ? 'Yes' : 'No'}`,
      `• Actions performed: ${stats.actionCount}`,
      `• Last action: ${stats.lastAction ? new Date(stats.lastAction).toLocaleString() : 'Never'}`,
    ].join('\n');

    if (typeof GM_notification !== 'undefined') {
      GM_notification(message, 'Module Stats');
    } else {
      alert(message);
    }
  }

  /**
   * Reset module data
   */
  private resetData(): void {
    if (confirm('Are you sure you want to reset all module data?')) {
      Storage.remove('exampleModule.actionCount');
      Storage.remove('exampleModule.lastActionTime');
      this.actionCount = 0;
      this.lastActionTime = 0;
      console.log('🧹 Example module data reset');
      this.showNotification('Module data reset!');
    }
  }

  /**
   * Get module status
   */
  public get initialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Get action count
   */
  public get totalActions(): number {
    return this.actionCount;
  }
}
