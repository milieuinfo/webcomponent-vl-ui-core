import {vlElement, define} from '/src/vl-core.js';

class VlElementImpl extends vlElement(HTMLElement) {
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
            <div></div>
        `);
  }

  get _classPrefix() {
    return 'vl-span--';
  }

  _attributeChangedCallback(oldValue, newValue) { }
}

class VlPrefixedElementImpl extends vlElement(HTMLElement) {
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
            <div></div>
        `);
  }

  get _classPrefix() {
    return 'vl-span--';
  }

  _dataVlAttributeChangedCallback(oldValue, newValue) { }
}

define('vl-element', VlElementImpl);
define('vl-prefixed-element', VlPrefixedElementImpl);
