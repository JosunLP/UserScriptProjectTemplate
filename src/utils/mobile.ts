/**
 * Mobile browser detection and touch event utilities for UserScript development
 */

/**
 * Mobile browser detection interface
 */
interface MobileDetection {
  isMobile: boolean;
  isAndroid: boolean;
  isIOS: boolean;
  isTablet: boolean;
  hasTouch: boolean;
  userAgent: string;
  browser: {
    isKiwi: boolean;
    isEdgeMobile: boolean;
    isFirefoxMobile: boolean;
    isSafariMobile: boolean;
    isYandex: boolean;
  };
}

/**
 * Touch event handler interface
 */
interface TouchPosition {
  x: number;
  y: number;
  identifier: number;
}

/**
 * Mobile utility class for UserScript development
 */
export class MobileUtils {
  private static _detection: MobileDetection | null = null;

  /**
   * Detect mobile browser and capabilities
   */
  static detect(): MobileDetection {
    if (this._detection) {
      return this._detection;
    }

    const ua = navigator.userAgent.toLowerCase();
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Mobile OS detection
    const isAndroid = /android/.test(ua);
    const isIOS = /ipad|iphone|ipod/.test(ua);
    const isTablet = /ipad/.test(ua) || (isAndroid && !/mobile/.test(ua));

    // Mobile browser detection
    const isKiwi = /kiwi/.test(ua) || (/chrome/.test(ua) && isAndroid);
    const isEdgeMobile = /edg\//.test(ua) && (isAndroid || isIOS);
    const isFirefoxMobile = /firefox/.test(ua) && (isAndroid || isIOS);
    const isSafariMobile = /safari/.test(ua) && isIOS && !/chrome|crios|fxios/.test(ua);
    const isYandex = /yabrowser/.test(ua);

    const isMobile =
      isAndroid ||
      isIOS ||
      hasTouch ||
      /mobile|phone|android|iphone|ipod|blackberry|windows phone/.test(ua);

    this._detection = {
      isMobile,
      isAndroid,
      isIOS,
      isTablet,
      hasTouch,
      userAgent: navigator.userAgent,
      browser: {
        isKiwi,
        isEdgeMobile,
        isFirefoxMobile,
        isSafariMobile,
        isYandex,
      },
    };

    return this._detection;
  }

  /**
   * Check if current browser supports UserScripts
   */
  static supportsUserScripts(): boolean {
    const detection = this.detect();

    // Desktop browsers - full support
    if (!detection.isMobile) {
      return true;
    }

    // Mobile browsers with known UserScript support
    return (
      detection.browser.isKiwi ||
      detection.browser.isEdgeMobile ||
      detection.browser.isFirefoxMobile ||
      detection.browser.isSafariMobile ||
      detection.browser.isYandex
    );
  }

  /**
   * Get recommended UserScript manager for current browser
   */
  static getRecommendedUserScriptManager(): string {
    const detection = this.detect();

    if (!detection.isMobile) {
      return 'Tampermonkey (Desktop)';
    }

    if (detection.browser.isKiwi) {
      return 'Built-in Chrome Extension support';
    }
    if (detection.browser.isEdgeMobile) {
      return 'Tampermonkey for Edge Mobile';
    }
    if (detection.browser.isFirefoxMobile) {
      return 'Greasemonkey or Tampermonkey';
    }
    if (detection.browser.isSafariMobile) {
      return 'Tampermonkey or Userscripts App';
    }
    if (detection.browser.isYandex) {
      return 'Built-in extension support';
    }

    return 'Not supported';
  }

  /**
   * Normalize touch/mouse event to get position
   */
  static getEventPosition(event: TouchEvent | MouseEvent): TouchPosition {
    if ('touches' in event && event.touches.length > 0) {
      const touch = event.touches[0];
      return {
        x: touch.clientX,
        y: touch.clientY,
        identifier: touch.identifier,
      };
    } else if ('clientX' in event) {
      return {
        x: event.clientX,
        y: event.clientY,
        identifier: 0,
      };
    }
    return { x: 0, y: 0, identifier: 0 };
  }

  /**
   * Get all touch positions from touch event
   */
  static getAllTouchPositions(event: TouchEvent): TouchPosition[] {
    const positions: TouchPosition[] = [];
    for (let i = 0; i < event.touches.length; i++) {
      const touch = event.touches[i];
      positions.push({
        x: touch.clientX,
        y: touch.clientY,
        identifier: touch.identifier,
      });
    }
    return positions;
  }

  /**
   * Add unified touch/mouse event listener
   */
  static addUnifiedEventListener(
    element: Element,
    eventType: 'start' | 'move' | 'end',
    handler: (event: TouchEvent | MouseEvent) => void,
    options?: AddEventListenerOptions
  ): () => void {
    const detection = this.detect();
    const removeListeners: (() => void)[] = [];

    if (detection.hasTouch) {
      const touchEvent = {
        start: 'touchstart',
        move: 'touchmove',
        end: 'touchend',
      }[eventType];

      element.addEventListener(touchEvent, handler as EventListener, options);
      removeListeners.push(() => {
        element.removeEventListener(touchEvent, handler as EventListener, options);
      });
    }

    // Always add mouse events as fallback
    const mouseEvent = {
      start: 'mousedown',
      move: 'mousemove',
      end: 'mouseup',
    }[eventType];

    element.addEventListener(mouseEvent, handler as EventListener, options);
    removeListeners.push(() => {
      element.removeEventListener(mouseEvent, handler as EventListener, options);
    });

    return () => {
      removeListeners.forEach(remove => remove());
    };
  }

  /**
   * Add CSS for mobile-friendly interface
   */
  static addMobileStyles(): void {
    const detection = this.detect();

    if (!detection.isMobile) {
      return;
    }

    const css = `
      /* Mobile-first UserScript styles */
      .userscript-mobile-container {
        touch-action: manipulation;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;
      }

      .userscript-mobile-button {
        min-height: 44px; /* iOS minimum touch target */
        min-width: 44px;
        padding: 12px 16px;
        font-size: 16px; /* Prevents zoom on iOS */
        border-radius: 8px;
        cursor: pointer;
        touch-action: manipulation;
      }

      .userscript-mobile-input {
        font-size: 16px; /* Prevents zoom on iOS */
        padding: 12px;
        border-radius: 4px;
      }

      .userscript-mobile-menu {
        position: fixed;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        max-width: 90vw;
        max-height: 80vh;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
      }

      /* Dark mode support */
      @media (prefers-color-scheme: dark) {
        .userscript-mobile-menu {
          background: rgba(40, 40, 40, 0.95);
          color: white;
        }
      }

      /* Tablet optimizations */
      @media (min-width: 768px) and (max-width: 1024px) {
        .userscript-mobile-container {
          max-width: 600px;
          margin: 0 auto;
        }
      }

      /* Phone optimizations */
      @media (max-width: 767px) {
        .userscript-mobile-container {
          padding: 16px;
        }

        .userscript-mobile-menu {
          left: 8px !important;
          right: 8px !important;
          bottom: 8px !important;
          top: auto !important;
          max-height: 60vh;
        }
      }
    `;

    const styleElement = document.createElement('style');
    styleElement.id = 'userscript-mobile-styles';
    styleElement.textContent = css;
    (document.head || document.documentElement).appendChild(styleElement);
  }

  /**
   * Check if viewport is in portrait mode
   */
  static isPortrait(): boolean {
    return window.innerHeight > window.innerWidth;
  }

  /**
   * Check if viewport is in landscape mode
   */
  static isLandscape(): boolean {
    return window.innerWidth > window.innerHeight;
  }

  /**
   * Get safe area insets (for devices with notches)
   */
  static getSafeAreaInsets(): { top: number; bottom: number; left: number; right: number } {
    const computedStyle = getComputedStyle(document.documentElement);

    return {
      top: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-top)') || '0'),
      bottom: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-bottom)') || '0'),
      left: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-left)') || '0'),
      right: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-right)') || '0'),
    };
  }

  /**
   * Prevent page zoom when double-tapping elements
   */
  static preventDoubleTapZoom(element: Element): void {
    let lastTap = 0;

    element.addEventListener('touchend', event => {
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTap;

      if (tapLength < 500 && tapLength > 0) {
        event.preventDefault();
      }

      lastTap = currentTime;
    });
  }

  /**
   * Log mobile detection information for debugging
   */
  static logMobileInfo(): void {
    const detection = this.detect();
    const manager = this.getRecommendedUserScriptManager();

    console.group('📱 Mobile Detection Info');
    console.log('Is Mobile:', detection.isMobile);
    console.log('Platform:', detection.isAndroid ? 'Android' : detection.isIOS ? 'iOS' : 'Desktop');
    console.log('Has Touch:', detection.hasTouch);
    console.log('Browser:', detection.browser);
    console.log('UserScript Support:', this.supportsUserScripts());
    console.log('Recommended Manager:', manager);
    console.log('User Agent:', detection.userAgent);
    console.groupEnd();
  }
}
