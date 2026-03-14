import { DOMUtils } from '@/utils/dom';
import { EventEmitter } from '@/utils/events';
import { Storage } from '@/utils/storage';

/**
 * Events emitted by TikTokQuickBlock module
 */
interface TikTokQuickBlockEvents {
  initialized: void;
  userBlocked: { username: string; timestamp: number };
  buttonInjected: { count: number };
}

/**
 * TikTok Quick Block Module
 *
 * Adds a quick block button to TikTok comments that allows blocking comment authors
 * with a single click directly from the comment interface.
 */
export class TikTokQuickBlockModule extends EventEmitter<TikTokQuickBlockEvents> {
  private blockedUsers: Set<string> = new Set();
  private processedComments: WeakSet<Element> = new WeakSet();
  private observer: MutationObserver | null = null;
  private buttonCount = 0;

  constructor() {
    super();
  }

  /**
   * Initialize the module
   */
  async initialize(): Promise<void> {
    console.log('🚀 TikTok Quick Block: Initializing...');

    // Load blocked users from storage
    this.loadBlockedUsers();

    // Add custom styles
    this.addStyles();

    // Wait for the page to load and start observing
    if (document.readyState === 'loading') {
      await new Promise(resolve => {
        document.addEventListener('DOMContentLoaded', resolve, { once: true });
      });
    }

    // Wait a bit for TikTok's dynamic content to load
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Start observing for comments
    this.startObserving();

    // Process any existing comments
    this.processExistingComments();

    // Register menu commands
    this.registerMenuCommands();

    this.emit('initialized', undefined);
    console.log('✅ TikTok Quick Block: Initialized successfully');
  }

  /**
   * Load blocked users from storage
   */
  private loadBlockedUsers(): void {
    const blocked = Storage.get<string[]>('tiktok_blocked_users', []);
    this.blockedUsers = new Set(blocked || []);
    console.log(`📋 Loaded ${this.blockedUsers.size} blocked users`);
  }

  /**
   * Save blocked users to storage
   */
  private saveBlockedUsers(): void {
    Storage.set('tiktok_blocked_users', Array.from(this.blockedUsers));
  }

  /**
   * Add custom styles for the quick block button
   */
  private addStyles(): void {
    const css = `
      .tiktok-quick-block-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 4px 12px;
        margin-left: 8px;
        font-size: 12px;
        font-weight: 600;
        color: #fff;
        background: linear-gradient(135deg, #fe2c55 0%, #ff0050 100%);
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s ease;
        white-space: nowrap;
        box-shadow: 0 2px 4px rgba(254, 44, 85, 0.2);
      }

      .tiktok-quick-block-btn:hover {
        background: linear-gradient(135deg, #ff0050 0%, #d40042 100%);
        box-shadow: 0 4px 8px rgba(254, 44, 85, 0.3);
        transform: translateY(-1px);
      }

      .tiktok-quick-block-btn:active {
        transform: translateY(0);
        box-shadow: 0 1px 2px rgba(254, 44, 85, 0.2);
      }

      .tiktok-quick-block-btn.blocked {
        background: linear-gradient(135deg, #666 0%, #444 100%);
        cursor: default;
        opacity: 0.7;
      }

      .tiktok-quick-block-btn.blocked:hover {
        background: linear-gradient(135deg, #666 0%, #444 100%);
        transform: none;
      }

      /* Notification styles */
      .tiktok-quick-block-notification {
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 16px 24px;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 999999;
        opacity: 0;
        transform: translateX(400px);
        transition: all 0.3s ease;
        max-width: 300px;
      }

      .tiktok-quick-block-notification.show {
        opacity: 1;
        transform: translateX(0);
      }

      .tiktok-quick-block-notification.success {
        background: linear-gradient(135deg, #00f2ea 0%, #00d4ff 100%);
        color: #000;
      }

      /* Mobile optimizations */
      @media (max-width: 768px) {
        .tiktok-quick-block-btn {
          padding: 6px 10px;
          font-size: 11px;
          margin-left: 4px;
        }

        .tiktok-quick-block-notification {
          top: 60px;
          right: 10px;
          left: 10px;
          max-width: none;
          text-align: center;
        }
      }
    `;

    DOMUtils.addStyles(css, 'tiktok-quick-block-styles');
  }

  /**
   * Start observing DOM changes for new comments
   */
  private startObserving(): void {
    this.observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
          this.processExistingComments();
        }
      }
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    console.log('👀 Started observing for new comments');
  }

  /**
   * Process all existing comments in the page
   */
  private processExistingComments(): void {
    // TikTok uses various selectors for comments
    // We'll try multiple common selectors
    const commentSelectors = [
      '[data-e2e="comment-item"]',
      '[class*="Comment"]',
      '[class*="comment"]',
      'div[class*="DivCommentItemContainer"]',
      'div[class*="CommentItem"]',
    ];

    let comments: Element[] = [];
    for (const selector of commentSelectors) {
      const found = Array.from(document.querySelectorAll(selector));
      if (found.length > 0) {
        comments = found;
        console.log(`📝 Found ${comments.length} comments using selector: ${selector}`);
        break;
      }
    }

    if (comments.length === 0) {
      // Try a more generic approach - look for elements that might contain usernames
      console.log('⚠️ No comments found with known selectors, trying fallback...');
      return;
    }

    let newButtons = 0;
    for (const comment of comments) {
      if (!this.processedComments.has(comment)) {
        if (this.injectQuickBlockButton(comment)) {
          newButtons++;
          this.processedComments.add(comment);
        }
      }
    }

    if (newButtons > 0) {
      this.buttonCount += newButtons;
      this.emit('buttonInjected', { count: this.buttonCount });
      console.log(`✨ Injected ${newButtons} quick block buttons (total: ${this.buttonCount})`);
    }
  }

  /**
   * Inject quick block button into a comment element
   */
  private injectQuickBlockButton(commentElement: Element): boolean {
    try {
      // Try to find the username/author element
      const usernameSelectors = [
        '[data-e2e="comment-username"]',
        'a[class*="Username"]',
        'a[class*="user"]',
        'span[class*="Username"]',
        'span[class*="user"]',
      ];

      let usernameElement: Element | null = null;
      for (const selector of usernameSelectors) {
        usernameElement = commentElement.querySelector(selector);
        if (usernameElement) break;
      }

      if (!usernameElement) {
        return false;
      }

      // Extract username
      const username = this.extractUsername(usernameElement);
      if (!username) {
        return false;
      }

      // Check if already blocked
      const isBlocked = this.blockedUsers.has(username);

      // Create the quick block button
      const blockButton = DOMUtils.createElement('button', {
        className: `tiktok-quick-block-btn ${isBlocked ? 'blocked' : ''}`,
        textContent: isBlocked ? '🚫 Blocked' : '⚡ Quick Block',
        title: isBlocked ? `${username} is already blocked` : `Quick block ${username}`,
        onclick: (e: Event) => {
          e.preventDefault();
          e.stopPropagation();
          if (!isBlocked) {
            this.blockUser(username, commentElement);
          }
        },
      });

      // Find the best place to inject the button
      // Try to find an action bar or button container
      const actionBarSelectors = [
        '[class*="ActionBar"]',
        '[class*="action"]',
        '[class*="button-container"]',
      ];

      let actionBar: Element | null = null;
      for (const selector of actionBarSelectors) {
        actionBar = commentElement.querySelector(selector);
        if (actionBar) break;
      }

      if (actionBar) {
        actionBar.appendChild(blockButton);
      } else {
        // Fallback: insert after username
        usernameElement.parentElement?.appendChild(blockButton);
      }

      return true;
    } catch (error) {
      console.error('❌ Error injecting button:', error);
      return false;
    }
  }

  /**
   * Extract username from element
   */
  private extractUsername(element: Element): string | null {
    // Try textContent first
    let username = element.textContent?.trim() || '';

    // Remove @ symbol if present
    username = username.replace(/^@/, '');

    // Try href attribute if it's a link
    if (!username && element instanceof HTMLAnchorElement) {
      const href = element.getAttribute('href');
      if (href) {
        const match = href.match(/@([^/?]+)/);
        if (match) {
          username = match[1];
        }
      }
    }

    return username || null;
  }

  /**
   * Block a user
   */
  private blockUser(username: string, commentElement: Element): void {
    console.log(`🚫 Blocking user: ${username}`);

    // Add to blocked users
    this.blockedUsers.add(username);
    this.saveBlockedUsers();

    // Hide the comment
    if (commentElement instanceof HTMLElement) {
      commentElement.style.opacity = '0.3';
      commentElement.style.pointerEvents = 'none';
      commentElement.style.filter = 'blur(2px)';
    }

    // Update button state
    const button = commentElement.querySelector('.tiktok-quick-block-btn');
    if (button) {
      button.textContent = '🚫 Blocked';
      button.classList.add('blocked');
    }

    // Show notification
    this.showNotification(`Successfully blocked @${username}`, 'success');

    // Emit event
    this.emit('userBlocked', { username, timestamp: Date.now() });

    // Show GM notification if available
    if (typeof GM_notification !== 'undefined') {
      GM_notification(
        `User @${username} has been blocked`,
        'TikTok Quick Block',
        undefined,
        undefined
      );
    }
  }

  /**
   * Show a temporary notification
   */
  private showNotification(message: string, type: 'success' | 'info' = 'info'): void {
    const notification = DOMUtils.createElement('div', {
      className: `tiktok-quick-block-notification ${type}`,
      textContent: message,
    });

    document.body.appendChild(notification);

    // Show with animation
    setTimeout(() => notification.classList.add('show'), 10);

    // Hide and remove
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => DOMUtils.removeElement(notification), 300);
    }, 3000);
  }

  /**
   * Register menu commands
   */
  private registerMenuCommands(): void {
    if (typeof GM_registerMenuCommand !== 'undefined') {
      GM_registerMenuCommand('View Blocked Users', () => {
        const count = this.blockedUsers.size;
        const users = Array.from(this.blockedUsers).join('\n');
        alert(
          `Blocked Users (${count}):\n\n${users || 'No users blocked yet'}\n\nTo unblock users, clear your browser data or use the "Clear Blocked Users" command.`
        );
      });

      GM_registerMenuCommand('Clear Blocked Users', () => {
        if (confirm('Are you sure you want to clear all blocked users?')) {
          this.blockedUsers.clear();
          this.saveBlockedUsers();
          this.showNotification('All blocked users cleared', 'success');
          // Reload to show comments again
          location.reload();
        }
      });

      GM_registerMenuCommand('Show Statistics', () => {
        const stats = `
TikTok Quick Block Statistics

Blocked Users: ${this.blockedUsers.size}
Quick Block Buttons: ${this.buttonCount}

This session:
- Initialized: ✅
- Observer: ${this.observer ? 'Active' : 'Inactive'}
        `;
        alert(stats);
      });
    }
  }

  /**
   * Cleanup when module is destroyed
   */
  public destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    console.log('🛑 TikTok Quick Block: Module destroyed');
  }
}
