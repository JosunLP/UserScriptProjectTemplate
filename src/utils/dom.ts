/**
 * DOM utility functions for UserScript development
 */
export class DOMUtils {
  /**
   * Wait for element to appear in DOM
   */
  static waitForElement(
    selector: string,
    timeout = 10000,
    root: Document | Element = document
  ): Promise<Element> {
    return new Promise((resolve, reject) => {
      const element = root.querySelector(selector);
      if (element) {
        resolve(element);
        return;
      }

      const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
          const nodes = Array.from(mutation.addedNodes);
          for (const node of nodes) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element =
                (node as Element).querySelector?.(selector) || (node as Element).matches?.(selector)
                  ? (node as Element)
                  : null;
              if (element) {
                observer.disconnect();
                resolve(element);
                return;
              }
            }
          }
        }
      });

      observer.observe(root, {
        childList: true,
        subtree: true,
      });

      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Element "${selector}" not found within ${timeout}ms`));
      }, timeout);
    });
  }

  /**
   * Wait for multiple elements
   */
  static waitForElements(
    selectors: string[],
    timeout = 10000,
    root: Document | Element = document
  ): Promise<Element[]> {
    return Promise.all(selectors.map(selector => this.waitForElement(selector, timeout, root)));
  }

  /**
   * Create element with attributes and content
   */
  static createElement<K extends keyof HTMLElementTagNameMap>(
    tagName: K,
    attributes: Partial<HTMLElementTagNameMap[K]> = {},
    content?: string | Node
  ): HTMLElementTagNameMap[K] {
    const element = document.createElement(tagName);

    Object.assign(element, attributes);

    if (content !== undefined) {
      if (typeof content === 'string') {
        element.textContent = content;
      } else {
        element.appendChild(content);
      }
    }

    return element;
  }

  /**
   * Add CSS styles to page
   */
  static addStyles(css: string, id?: string): HTMLStyleElement {
    const style = document.createElement('style');
    style.textContent = css;
    if (id) {
      style.id = id;
    }

    (document.head || document.documentElement).appendChild(style);
    return style;
  }

  /**
   * Remove element safely
   */
  static removeElement(element: Element | string): boolean {
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    if (el && el.parentNode) {
      el.parentNode.removeChild(el);
      return true;
    }
    return false;
  }

  /**
   * Check if element is visible
   */
  static isVisible(element: Element): boolean {
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);

    return (
      rect.width > 0 &&
      rect.height > 0 &&
      style.visibility !== 'hidden' &&
      style.display !== 'none' &&
      style.opacity !== '0'
    );
  }
}
