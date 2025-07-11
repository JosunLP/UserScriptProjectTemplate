/**
 * Type-safe event emitter for UserScript modules
 */
export interface EventMap {
  [event: string]: any;
}

export class EventEmitter<T extends EventMap = EventMap> {
  private listeners: { [K in keyof T]?: Array<(data: T[K]) => void> } = {};

  /**
   * Add event listener
   */
  on<K extends keyof T>(event: K, listener: (data: T[K]) => void): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(listener);
  }

  /**
   * Add one-time event listener
   */
  once<K extends keyof T>(event: K, listener: (data: T[K]) => void): void {
    const onceListener = (data: T[K]) => {
      listener(data);
      this.off(event, onceListener);
    };
    this.on(event, onceListener);
  }

  /**
   * Remove event listener
   */
  off<K extends keyof T>(event: K, listener: (data: T[K]) => void): void {
    const eventListeners = this.listeners[event];
    if (eventListeners) {
      const index = eventListeners.indexOf(listener);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  /**
   * Emit event
   */
  emit<K extends keyof T>(event: K, data: T[K]): void {
    const eventListeners = this.listeners[event];
    if (eventListeners) {
      eventListeners.forEach(listener => {
        try {
          listener(data);
        } catch (error) {
          console.error(`Error in event listener for "${String(event)}":`, error);
        }
      });
    }
  }

  /**
   * Remove all listeners for an event
   */
  removeAllListeners<K extends keyof T>(event?: K): void {
    if (event) {
      delete this.listeners[event];
    } else {
      this.listeners = {};
    }
  }

  /**
   * Get listener count for an event
   */
  listenerCount<K extends keyof T>(event: K): number {
    return this.listeners[event]?.length || 0;
  }
}
