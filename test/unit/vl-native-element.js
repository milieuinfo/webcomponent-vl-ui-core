import {nativeVlElement, define} from '/src/vl-core.js';

class VlNativeElement extends nativeVlElement(HTMLSpanElement) {
  static get _observedAttributes() {
    return ['attribute'];
  }

  static get _observedClassAttributes() {
    return ['class-attribute'];
  }

  get _classPrefix() {
    return 'vl-span--';
  }

  _attributeChangedCallback(oldValue, newValue) { }
}

class VlNativePrefixedElement extends nativeVlElement(HTMLSpanElement) {
  static get _observedAttributes() {
    return ['attribute'];
  }

  static get _observedClassAttributes() {
    return ['class-attribute'];
  }

  get _classPrefix() {
    return 'vl-span--';
  }

  _dataVlAttributeChangedCallback(oldValue, newValue) { }
}

define('vl-native-element', VlNativeElement, {extends: 'span'});
define('vl-native-prefixed-element', VlNativePrefixedElement, {extends: 'span'});
