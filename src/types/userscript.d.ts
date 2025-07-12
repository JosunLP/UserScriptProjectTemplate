/**
 * TypeScript definitions for UserScript environment
 */

declare global {
  /**
   * Greasemonkey/Tampermonkey API
   */
  function GM_setValue(key: string, value: any): void;
  function GM_getValue(key: string, defaultValue?: any): any;
  function GM_deleteValue(key: string): void;
  function GM_listValues(): string[];

  function GM_log(message: string): void;
  function GM_notification(
    text: string,
    title?: string,
    image?: string,
    onclick?: () => void
  ): void;

  function GM_openInTab(
    url: string,
    options?: { active?: boolean; insert?: boolean; setParent?: boolean }
  ): void;
  function GM_registerMenuCommand(name: string, fn: () => void, accessKey?: string): number;
  function GM_unregisterMenuCommand(menuCmdId: number): void;

  function GM_xmlhttpRequest(details: GM_XHRDetails): GM_XHRResponse;

  interface GM_XHRDetails {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
    url: string;
    headers?: Record<string, string>;
    data?: string | FormData | Blob;
    binary?: boolean;
    timeout?: number;
    context?: any;
    responseType?: 'text' | 'json' | 'blob' | 'arraybuffer' | 'document';
    overrideMimeType?: string;
    anonymous?: boolean;
    fetch?: boolean;
    username?: string;
    password?: string;
    onload?: (response: GM_XHRResponse) => void;
    onerror?: (response: GM_XHRResponse) => void;
    onabort?: () => void;
    ontimeout?: () => void;
    onprogress?: (response: GM_XHRProgressResponse) => void;
    onreadystatechange?: (response: GM_XHRResponse) => void;
    onloadstart?: (response: GM_XHRResponse) => void;
    onloadend?: (response: GM_XHRResponse) => void;
  }

  interface GM_XHRResponse {
    readyState: number;
    responseHeaders: string;
    responseText: string;
    response: any;
    status: number;
    statusText: string;
    finalUrl: string;
  }

  interface GM_XHRProgressResponse extends GM_XHRResponse {
    lengthComputable: boolean;
    loaded: number;
    total: number;
  }

  /**
   * UserScript Info
   */
  interface GM_Info {
    script: {
      description: string;
      excludes: string[];
      includes: string[];
      matches: string[];
      name: string;
      namespace: string;
      resources: Record<string, string>;
      runAt: string;
      version: string;
    };
    scriptMetaStr: string;
    scriptWillUpdate: boolean;
    version: string;
  }

  const GM_info: GM_Info;

  /**
   * UnsafeWindow for accessing page's global scope
   */
  const unsafeWindow: Window & typeof globalThis;

  /**
   * Build-time constants injected by Vite
   */
  const __DEV__: boolean;
  const __VERSION__: string;
  const __DEBUG__: boolean;
  const __USERSCRIPT__: boolean;
  const __BUILD_TIME__: string;
}

export {};
