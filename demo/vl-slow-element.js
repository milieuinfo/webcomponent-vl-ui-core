import {vlElement, define} from '/src/vl-core.js';

class VlSlowElement extends vlElement(HTMLElement) {
  constructor() {
    super(`
              <div>Only visible when defined!</div>
          `);
  }

  get _classPrefix() {
    return 'vl-span--';
  }
}

setTimeout(() => {
  define('vl-slow-element', VlSlowElement);
}, 2000);

