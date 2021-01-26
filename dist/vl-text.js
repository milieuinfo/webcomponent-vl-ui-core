import {nativeVlElement, define} from '/node_modules/vl-ui-core/dist/vl-core.js';

export class VlText extends nativeVlElement(HTMLSpanElement) {
  static get _observedClassAttributes() {
    return ['visual-hidden'];
  }

  get _classPrefix() {
    return 'vl-text--';
  }
}

define('vl-text', VlText, {extends: 'span'});
