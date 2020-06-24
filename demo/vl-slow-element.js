import {vlElement, define} from '/src/vl-core.js';

class VlSlowElement extends vlElement(HTMLElement) {
  static get _observedAttributes() {
    return ['attribute'];
  }

  static get _observedClassAttributes() {
    return ['class-attribute'];
  }

  static get _observedChildClassAttributes() {
    return ['child-class-attribute'];
  }

  constructor() {
    super(`
              <div>Only visible when defined!</div>
          `);
  }

  get _classPrefix() {
    return 'vl-span--';
  }

  _attributeChangedCallback(oldValue, newValue) { }
}

setTimeout(() => {
  define('vl-slow-element', VlSlowElement);
}, 2000);

