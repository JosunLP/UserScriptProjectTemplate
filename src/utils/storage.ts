/**
 * Storage utility for UserScript persistent data
 */
export class Storage {
  /**
   * Set a value in persistent storage
   */
  static set<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value);
      GM_setValue(key, serialized);
    } catch (error) {
      console.error(`Failed to store value for key "${key}":`, error);
    }
  }

  /**
   * Get a value from persistent storage
   */
  static get<T>(key: string, defaultValue?: T): T | undefined {
    try {
      const stored = GM_getValue(key);
      if (stored === undefined) {
        return defaultValue;
      }
      return JSON.parse(stored) as T;
    } catch (error) {
      console.error(`Failed to retrieve value for key "${key}":`, error);
      return defaultValue;
    }
  }

  /**
   * Remove a value from persistent storage
   */
  static remove(key: string): void {
    GM_deleteValue(key);
  }

  /**
   * Check if a key exists in storage
   */
  static has(key: string): boolean {
    return GM_getValue(key) !== undefined;
  }

  /**
   * Get all keys from storage
   */
  static getAllKeys(): string[] {
    return GM_listValues();
  }

  /**
   * Clear all storage (use with caution!)
   */
  static clear(): void {
    const keys = GM_listValues();
    keys.forEach(key => GM_deleteValue(key));
  }
}
