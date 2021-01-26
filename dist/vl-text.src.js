import {nativeVlElement, define} from 'vl-ui-core/dist/vl-core.src.js';

export class VlText extends nativeVlElement(HTMLSpanElement) {
  static get _observedClassAttributes() {
    return ['visual-hidden'];
  }

  get _classPrefix() {
    return 'vl-text--';
  }
}

define('vl-text', VlText, {extends: 'span'});

