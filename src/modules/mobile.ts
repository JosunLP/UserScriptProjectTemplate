import { EventEmitter } from '@/utils/events';
import { MobileUtils } from '@/utils/mobile';

/**
 * Mobile-specific module events
 */
interface MobileModuleEvents {
  gestureDetected: { type: 'tap' | 'swipe' | 'pinch'; position: { x: number; y: number } };
  orientationChanged: { orientation: 'portrait' | 'landscape' };
  touchStart: { touches: number };
  touchEnd: { touches: number };
}

/**
 * Mobile interaction module for touch gestures and mobile-specific features
 */
export class MobileModule extends EventEmitter<MobileModuleEvents> {
  private isInitialized = false;
  private swipeThreshold = 50;
  private tapTimeout = 300;
  private lastTap = 0;
  private touchStartPos: { x: number; y: number } | null = null;

  /**
   * Initialize the mobile module
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    const detection = MobileUtils.detect();

    if (!detection.hasTouch) {
      console.log('⚠️ Mobile module: No touch support detected');
      return;
    }

    console.log('📱 Initializing mobile module...');

    this.setupTouchEvents();
    this.setupOrientationDetection();

    this.isInitialized = true;
    console.log('✅ Mobile module initialized');
  }

  /**
   * Setup touch event handlers
   */
  private setupTouchEvents(): void {
    // Handle touch start
    document.addEventListener(
      'touchstart',
      event => {
        const position = MobileUtils.getEventPosition(event);
        this.touchStartPos = { x: position.x, y: position.y };

        this.emit('touchStart', { touches: event.touches.length });

        // Detect taps
        this.detectTap(event);
      },
      { passive: true }
    );

    // Handle touch move for swipe detection
    document.addEventListener(
      'touchmove',
      event => {
        if (this.touchStartPos && event.touches.length === 1) {
          this.detectSwipe(event);
        }
      },
      { passive: true }
    );

    // Handle touch end
    document.addEventListener(
      'touchend',
      event => {
        this.emit('touchEnd', { touches: event.touches.length });
        this.touchStartPos = null;
      },
      { passive: true }
    );

    // Handle pinch gestures
    document.addEventListener('gesturestart', event => {
      event.preventDefault();
      const position = MobileUtils.getEventPosition(event as any);
      this.emit('gestureDetected', {
        type: 'pinch',
        position: { x: position.x, y: position.y },
      });
    });
  }

  /**
   * Setup orientation change detection
   */
  private setupOrientationDetection(): void {
    const handleOrientationChange = () => {
      const orientation = MobileUtils.isPortrait() ? 'portrait' : 'landscape';
      this.emit('orientationChanged', { orientation });
      console.log(`📱 Orientation changed to: ${orientation}`);
    };

    // Listen for orientation changes
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);

    // Initial orientation
    setTimeout(handleOrientationChange, 100);
  }

  /**
   * Detect tap gestures
   */
  private detectTap(event: TouchEvent): void {
    const currentTime = Date.now();
    const position = MobileUtils.getEventPosition(event);

    if (currentTime - this.lastTap < this.tapTimeout) {
      // Double tap detected
      this.emit('gestureDetected', {
        type: 'tap',
        position: { x: position.x, y: position.y },
      });
    }

    this.lastTap = currentTime;

    // Single tap with delay
    setTimeout(() => {
      if (Date.now() - this.lastTap >= this.tapTimeout) {
        this.emit('gestureDetected', {
          type: 'tap',
          position: { x: position.x, y: position.y },
        });
      }
    }, this.tapTimeout);
  }

  /**
   * Detect swipe gestures
   */
  private detectSwipe(event: TouchEvent): void {
    if (!this.touchStartPos) return;

    const position = MobileUtils.getEventPosition(event);
    const deltaX = position.x - this.touchStartPos.x;
    const deltaY = position.y - this.touchStartPos.y;

    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance > this.swipeThreshold) {
      this.emit('gestureDetected', {
        type: 'swipe',
        position: { x: position.x, y: position.y },
      });
      this.touchStartPos = null; // Reset to prevent multiple swipe events
    }
  }

  /**
   * Create mobile-friendly button
   */
  createMobileButton(text: string, onClick: () => void): HTMLButtonElement {
    const button = document.createElement('button');
    button.textContent = text;
    button.className = 'userscript-mobile-button';

    // Add unified event listener for touch and mouse
    MobileUtils.addUnifiedEventListener(button, 'start', event => {
      event.preventDefault();
      onClick();
    });

    // Prevent double-tap zoom
    MobileUtils.preventDoubleTapZoom(button);

    return button;
  }

  /**
   * Create mobile-friendly menu
   */
  createMobileMenu(items: Array<{ text: string; action: () => void }>): HTMLElement {
    const menu = document.createElement('div');
    menu.className = 'userscript-mobile-menu';

    // Add safe area padding for devices with notches
    const safeArea = MobileUtils.getSafeAreaInsets();
    menu.style.paddingTop = `${Math.max(16, safeArea.top)}px`;
    menu.style.paddingBottom = `${Math.max(16, safeArea.bottom)}px`;
    menu.style.paddingLeft = `${Math.max(16, safeArea.left)}px`;
    menu.style.paddingRight = `${Math.max(16, safeArea.right)}px`;

    items.forEach(item => {
      const button = this.createMobileButton(item.text, () => {
        item.action();
        this.hideMobileMenu(menu);
      });
      menu.appendChild(button);
    });

    return menu;
  }

  /**
   * Show mobile menu at position
   */
  showMobileMenu(menu: HTMLElement, position?: { x: number; y: number }): void {
    document.body.appendChild(menu);

    if (position) {
      const detection = MobileUtils.detect();

      if (detection.isMobile) {
        // On mobile, show at bottom of screen
        menu.style.position = 'fixed';
        menu.style.bottom = '16px';
        menu.style.left = '16px';
        menu.style.right = '16px';
      } else {
        // On desktop, show at cursor position
        menu.style.position = 'fixed';
        menu.style.left = `${position.x}px`;
        menu.style.top = `${position.y}px`;
      }
    }

    // Add backdrop
    const backdrop = document.createElement('div');
    backdrop.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3);
      z-index: 9999;
    `;

    backdrop.addEventListener('click', () => {
      this.hideMobileMenu(menu);
    });

    document.body.appendChild(backdrop);
    menu.dataset.backdrop = 'true';
  }

  /**
   * Hide mobile menu
   */
  hideMobileMenu(menu: HTMLElement): void {
    if (menu.dataset.backdrop) {
      const backdrop = document.querySelector('div[style*="rgba(0, 0, 0, 0.3)"]');
      if (backdrop) {
        backdrop.remove();
      }
    }

    if (menu.parentNode) {
      menu.parentNode.removeChild(menu);
    }
  }

  /**
   * Get module status
   */
  get initialized(): boolean {
    return this.isInitialized;
  }
}
