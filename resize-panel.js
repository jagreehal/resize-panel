class ResizePanel extends HTMLElement {
  static get observedAttributes() {
    return [
      'outer-w',
      'outer-h',
      'w',
      'h',
      'src',
      'aria-label',
      'min-w',
      'max-w',
      'min-h',
      'max-h',
      'scrolling',
      'data-display-position',
      'data-theme',
    ];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
    this.setupResizeDisplay();
  }

  // Public getter and setter for width
  get width() {
    return this.getAttribute('w');
  }

  set width(value) {
    this.setAttribute('w', value);
    this.updateDimensions();
  }

  // Public getter and setter for height
  get height() {
    return this.getAttribute('h');
  }

  set height(value) {
    this.setAttribute('h', value);
    this.updateDimensions();
  }

  // Public method to resize the panel programmatically
  resizeTo(width, height) {
    this.width = width;
    this.height = height;
  }

  // Update the dimensions dynamically
  updateDimensions() {
    const container = this.shadowRoot.querySelector('.panel-container');
    container.style.width = this.width;
    container.style.height = this.height;
  }

  render() {
    const outerW = this.getAttribute('outer-w') || 'auto';
    const outerH = this.getAttribute('outer-h') || 'auto';
    const w = this.getAttribute('w') || '19rem'; // ~300px
    const h = this.getAttribute('h') || '12.5rem'; // ~200px
    const src = this.getAttribute('src');
    const scrolling = this.getAttribute('scrolling') || 'auto';
    const displayPosition =
      this.getAttribute('data-display-position') || 'top-right';
    const theme = this.getAttribute('data-theme') || 'light';

    const minW = this.getAttribute('min-w') || '12.5rem'; // ~200px
    const maxW = this.getAttribute('max-w') || '100%';
    const minH = this.getAttribute('min-h') || '9.375rem'; // ~150px
    const maxH = this.getAttribute('max-h') || '100%';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --resize-panel-bg: var(--color-gray-50);
          --resize-panel-border: var(--color-gray-300);
          --resize-panel-text: var(--color-gray-900);
          --resize-panel-shadow: rgba(0, 0, 0, 0.1);
          --resize-panel-resize-bg: rgba(0, 0, 0, 0.7);
          --resize-panel-resize-text: #ffffff;

          /* Dark theme overrides */
          &[data-theme="dark"] {
            --resize-panel-bg: var(--color-gray-900);
            --resize-panel-border: var(--color-gray-600);
            --resize-panel-text: var(--color-gray-50);
            --resize-panel-shadow: rgba(0, 0, 0, 0.6);
            --resize-panel-resize-bg: rgba(255, 255, 255, 0.8);
            --resize-panel-resize-text: #000000;
          }
        }

        /* Tailwind-inspired color palette */
        :host {
          --color-gray-50: #f9fafb;
          --color-gray-300: #d1d5db;
          --color-gray-600: #4b5563;
          --color-gray-900: #111827;
          --color-white: #ffffff;
          --color-black: #000000;
        }

        .outer-container {
          display: block;
          width: ${outerW};
          height: ${outerH};
          background-color: var(--resize-panel-bg);
          padding: 1rem; /* ~16px */
          box-sizing: border-box;
          overflow: hidden;
          position: relative;
        }

        .panel-container {
          min-width: ${minW};
          max-width: ${maxW};
          min-height: ${minH};
          max-height: ${maxH};
          width: ${w};
          height: ${h};
          background: var(--resize-panel-bg);
          border: 1px solid var(--resize-panel-border);
          border-radius: 0.25rem; /* ~4px */
          box-shadow: 0 0.125rem 0.625rem var(--resize-panel-shadow); /* ~2px 10px */
          resize: both;
          overflow: auto;
          position: relative;
          color: var(--resize-panel-text);
        }

        .panel-content {
          height: 100%;
          width: 100%;
        }

        iframe.panel-content {
          border: none;
          width: 100%;
          height: 100%;
        }

        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.8);
          font-size: 1.2rem;
          color: #666;
        }

        .resize-display {
          position: fixed;
          padding: 0.25rem 0.5rem; /* ~4px 8px */
          background-color: var(--resize-panel-resize-bg);
          color: var(--resize-panel-resize-text);
          font-size: 0.75rem; /* ~12px */
          border-radius: 0.25rem; /* ~4px */
          pointer-events: none;
          z-index: 1000;
          display: none;
        }

        .top-left { top: 0.625rem; left: 0.625rem; } /* ~10px */
        .top-right { top: 0.625rem; right: 0.625rem; }
        .bottom-left { bottom: 0.625rem; left: 0.625rem; }
        .bottom-right { bottom: 0.625rem; right: 0.625rem; }
      </style>

      <div class="outer-container">
        <div class="panel-container" part="container">
          ${
            src
              ? `
            <div class="loading">Loading...</div>
            <iframe class="panel-content" src="${src}" scrolling="${scrolling}" frameborder="0"></iframe>
          `
              : `
            <div class="panel-content">
              <slot></slot>
            </div>
          `
          }
          <div class="resize-display ${displayPosition}"></div>
        </div>
      </div>
    `;

    // Hide loading overlay on iframe load
    const iframe = this.shadowRoot.querySelector('iframe');
    if (iframe) {
      iframe.addEventListener('load', () => {
        const loadingDiv = iframe.previousElementSibling;
        if (loadingDiv) loadingDiv.style.display = 'none';
      });
    }
  }

  setupResizeDisplay() {
    const container = this.shadowRoot.querySelector('.panel-container');
    const resizeDisplay = this.shadowRoot.querySelector('.resize-display');
    const displayPosition = this.getAttribute('data-display-position');

    if (displayPosition === 'none') {
      resizeDisplay.style.display = 'none';
      return;
    }

    const updateDisplay = () => {
      const width = container.style.width || container.offsetWidth + 'px';
      const height = container.style.height || container.offsetHeight + 'px';

      resizeDisplay.textContent = `${width} × ${height}`;
      resizeDisplay.className = `resize-display ${displayPosition}`;
      resizeDisplay.style.display = 'block';

      // Dispatch custom 'resize' event
      this.dispatchEvent(
        new CustomEvent('resize', {
          detail: { width, height },
          bubbles: true,
          composed: true,
        })
      );
    };

    const showResizeDisplay = () => {
      requestAnimationFrame(updateDisplay);
      clearTimeout(this.hideTimeout);
      this.hideTimeout = setTimeout(() => {
        resizeDisplay.style.display = 'none';
      }, 1000);
    };

    updateDisplay();
    this.resizeObserver = new ResizeObserver(showResizeDisplay);
    this.resizeObserver.observe(container);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      if (name === 'data-display-position' || name === 'data-theme') {
        this.render();
        this.setupResizeDisplay();
      }
    }
  }

  disconnectedCallback() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }
}

customElements.define('resize-panel', ResizePanel);
