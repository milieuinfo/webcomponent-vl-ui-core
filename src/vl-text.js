import {nativeVlElement, define} from '/src/vl-core.js';

export class VlText extends nativeVlElement(HTMLSpanElement) {
  static get _observedClassAttributes() {
    return ['visually-hidden'];
  }

  get _classPrefix() {
    return 'vl-u-';
  }
}

define('vl-text', VlText, {extends: 'span'});
