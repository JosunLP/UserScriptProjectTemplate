import { $ } from '@bquery/bquery/core';
import { mediaQuery, useViewport } from '@bquery/bquery/media';
import { computed, effect, signal } from '@bquery/bquery/reactive';
import { DOMUtils } from '@/utils/dom';
import { EventEmitter } from '@/utils/events';
import { Storage } from '@/utils/storage';

interface BQueryExampleModuleEvents {
  initialized: void;
  actionPerformed: {
    trigger: string;
    count: number;
    compact: boolean;
    viewport: string;
  };
}

export class BQueryExampleModule extends EventEmitter<BQueryExampleModuleEvents> {
  private static readonly panelId = 'bquery-example-panel';
  private static readonly panelContentId = 'bquery-example-panel-content';
  private static readonly toggleButtonId = 'bquery-example-toggle';
  private static getInitialActionCount(): number {
    const initialActionCount = Storage.get<number>('bqueryExample.actionCount', 0);
    return typeof initialActionCount === 'number' ? initialActionCount : 0;
  }

  private isInitialized = false;
  private panelElement: HTMLElement | null = null;
  private panelContentElement: HTMLDivElement | null = null;
  private toggleButtonElement: HTMLButtonElement | null = null;
  private toggleLabelElement: HTMLSpanElement | null = null;
  private countElement: HTMLElement | null = null;
  private viewportElement: HTMLElement | null = null;
  private summaryElement: HTMLElement | null = null;
  private statusElement: HTMLParagraphElement | null = null;
  private readonly actionCount = signal<number>(BQueryExampleModule.getInitialActionCount());
  private readonly panelOpen = signal(false);
  private readonly status = signal('Ready to test selective bQuery integration.');
  private readonly viewport = useViewport();
  private readonly isCompact = mediaQuery('(max-width: 768px)');
  private readonly summary = computed(() => {
    const viewport = this.viewport.value;
    const count = this.actionCount.value;
    const mode = this.isCompact.value ? 'compact' : 'wide';

    return `${count} reactive update${count === 1 ? '' : 's'} • ${viewport.width}×${viewport.height} • ${mode}`;
  });

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      console.log('✨ Initializing bQuery example module...');

      await DOMUtils.waitForElement('body', 5000);
      this.addModuleStyles();
      this.renderPanel();
      this.cachePanelElements();
      this.bindPanel();
      this.registerMenuCommands();

      this.isInitialized = true;
      this.emit('initialized', undefined);

      console.log('✅ bQuery example module initialized');
    } catch (error) {
      console.error('❌ bQuery example module initialization failed:', error);
      throw error;
    }
  }

  private addModuleStyles(): void {
    DOMUtils.addStyles(
      `
      #bquery-example-panel {
        position: fixed;
        bottom: 20px;
        left: 20px;
        z-index: 9997;
        width: min(320px, calc(100vw - 40px));
        padding: 16px;
        border-radius: 12px;
        border: 1px solid rgba(0, 124, 186, 0.25);
        background: rgba(17, 24, 39, 0.95);
        color: #f9fafb;
        box-shadow: 0 12px 28px rgba(15, 23, 42, 0.28);
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        transform: translateY(calc(100% + 24px));
        opacity: 0;
        pointer-events: none;
        transition: transform 0.2s ease, opacity 0.2s ease;
      }

      #bquery-example-panel.is-open {
        transform: translateY(0);
        opacity: 1;
        pointer-events: auto;
      }

      #bquery-example-panel.is-compact {
        left: 12px;
        right: 12px;
        bottom: 12px;
        width: auto;
      }

      .bquery-example-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 12px;
      }

      .bquery-example-title {
        margin: 0;
        font-size: 15px;
        font-weight: 700;
      }

      .bquery-example-description,
      .bquery-example-metric,
      .bquery-example-status {
        margin: 0;
        font-size: 13px;
        line-height: 1.5;
      }

      .bquery-example-description,
      .bquery-example-status {
        color: #d1d5db;
      }

      .bquery-example-metrics {
        display: grid;
        gap: 8px;
        margin: 12px 0;
        padding: 12px;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.08);
      }

      .bquery-example-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 12px;
      }

      .bquery-example-button {
        border: none;
        border-radius: 999px;
        padding: 8px 12px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
      }

      .bquery-example-button--primary {
        background: #38bdf8;
        color: #082f49;
      }

      .bquery-example-button--secondary {
        background: rgba(255, 255, 255, 0.12);
        color: #f9fafb;
      }
    `,
      'bquery-example-styles'
    );
  }

  private renderPanel(): void {
    if (document.getElementById(BQueryExampleModule.panelId)) {
      return;
    }

    const isOpen = this.panelOpen.value;
    const panel = document.createElement('aside');
    panel.id = BQueryExampleModule.panelId;
    panel.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    panel.innerHTML = `
      <div class="bquery-example-header">
        <h2 class="bquery-example-title">✨ bQuery Advanced Example</h2>
        <button
          id="${BQueryExampleModule.toggleButtonId}"
          class="bquery-example-button bquery-example-button--secondary"
          type="button"
          data-bquery-action="toggle"
          aria-expanded="${isOpen ? 'true' : 'false'}"
          aria-controls="${BQueryExampleModule.panelContentId}"
        >
          <span id="bquery-example-toggle-label">Show panel</span>
        </button>
      </div>
      <div
        id="${BQueryExampleModule.panelContentId}"
        aria-hidden="${isOpen ? 'false' : 'true'}"
        ${isOpen ? '' : 'inert'}
      >
        <p class="bquery-example-description">
          This demo keeps the existing template utilities and adds a selective bQuery layer for DOM updates, reactivity, and responsive state.
        </p>
        <div class="bquery-example-metrics">
          <p class="bquery-example-metric">Reactive count: <strong id="bquery-example-count">0</strong></p>
          <p class="bquery-example-metric">Viewport: <strong id="bquery-example-viewport">0×0</strong></p>
          <p class="bquery-example-metric">Summary: <strong id="bquery-example-summary">Loading…</strong></p>
        </div>
        <p class="bquery-example-status" id="bquery-example-status" aria-live="polite" aria-atomic="true">Ready to test selective bQuery integration.</p>
        <div class="bquery-example-actions">
          <button class="bquery-example-button bquery-example-button--primary" type="button" data-bquery-action="increment">
            Trigger reactive update
          </button>
          <button class="bquery-example-button bquery-example-button--secondary" type="button" data-bquery-action="reset">
            Reset
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(panel);
  }

  private cachePanelElements(): void {
    this.panelElement = document.getElementById(BQueryExampleModule.panelId);
    this.panelContentElement = document.getElementById(
      BQueryExampleModule.panelContentId
    ) as HTMLDivElement | null;
    this.toggleButtonElement = document.getElementById(
      BQueryExampleModule.toggleButtonId
    ) as HTMLButtonElement | null;
    this.toggleLabelElement = document.getElementById(
      'bquery-example-toggle-label'
    ) as HTMLSpanElement | null;
    this.countElement = document.getElementById('bquery-example-count');
    this.viewportElement = document.getElementById('bquery-example-viewport');
    this.summaryElement = document.getElementById('bquery-example-summary');
    this.statusElement = document.getElementById(
      'bquery-example-status'
    ) as HTMLParagraphElement | null;
  }

  private bindPanel(): void {
    const panel = $(`#${BQueryExampleModule.panelId}`);

    panel.delegate('click', '[data-bquery-action]', (_event, target) => {
      const action = target.getAttribute('data-bquery-action');

      switch (action) {
        case 'toggle':
          this.togglePanel();
          break;
        case 'increment':
          this.performAction('panel-button');
          break;
        case 'reset':
          this.reset();
          break;
        default:
          break;
      }
    });

    panel.on('bquery:action', event => {
      const customEvent = event as CustomEvent<{ trigger: string; count: number }>;
      const detail = customEvent.detail;
      if (detail) {
        console.log(`✨ bQuery action via ${detail.trigger} (count: ${detail.count})`);
      }
    });

    effect(() => {
      Storage.set('bqueryExample.actionCount', this.actionCount.value);
    });

    effect(() => {
      const viewport = this.viewport.value;
      const isOpen = this.panelOpen.value;

      panel.toggleClass('is-open', isOpen);
      panel.toggleClass('is-compact', this.isCompact.value);
      this.toggleButtonElement?.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      this.panelElement?.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
      this.panelContentElement?.setAttribute('aria-hidden', isOpen ? 'false' : 'true');

      if (this.panelContentElement) {
        if (isOpen) {
          this.panelContentElement.removeAttribute('inert');
        } else {
          this.panelContentElement.setAttribute('inert', '');
        }
      }

      if (this.toggleLabelElement) {
        this.toggleLabelElement.textContent = isOpen ? 'Hide panel' : 'Show panel';
      }

      if (this.countElement) {
        this.countElement.textContent = String(this.actionCount.value);
      }

      if (this.viewportElement) {
        this.viewportElement.textContent = `${viewport.width}×${viewport.height} (${viewport.orientation})`;
      }

      if (this.summaryElement) {
        this.summaryElement.textContent = this.summary.value;
      }

      if (this.statusElement) {
        this.statusElement.textContent = this.status.value;
      }
    });
  }

  private registerMenuCommands(): void {
    if (typeof GM_registerMenuCommand === 'undefined') {
      return;
    }

    GM_registerMenuCommand('✨ Toggle bQuery Demo', () => {
      this.togglePanel();
    });

    GM_registerMenuCommand('⚡ Run bQuery Demo Action', () => {
      this.performAction('menu-command');
    });
  }

  private togglePanel(): void {
    this.panelOpen.value = !this.panelOpen.value;
    this.status.value = this.panelOpen.value
      ? 'Panel opened via bQuery core event delegation.'
      : 'Panel hidden, state kept in reactive signals.';
  }

  private performAction(trigger: string): void {
    this.actionCount.update(current => current + 1);
    this.panelOpen.value = true;

    const count = this.actionCount.value;
    const viewport = this.viewport.value;
    const viewportLabel = `${viewport.width}×${viewport.height}`;

    this.status.value = `Last action via ${trigger} at ${new Date().toLocaleTimeString()}.`;
    $('#bquery-example-panel').trigger('bquery:action', { trigger, count });

    this.emit('actionPerformed', {
      trigger,
      count,
      compact: this.isCompact.value,
      viewport: viewportLabel,
    });
  }

  private reset(): void {
    this.actionCount.value = 0;
    this.status.value = 'Counter reset, reactive bindings still active.';
  }
}
