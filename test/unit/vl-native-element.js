import { NativeVlElement, define } from '/src/vl-core.js';

class VlNativeElement extends NativeVlElement(HTMLSpanElement) {
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

class VlNativePrefixedElement extends NativeVlElement(HTMLSpanElement) {
    static get _observedAttributes() {
        return ['attribute'];
    }

    static get _observedClassAttributes() {
        return ['class-attribute'];
    }

    get _classPrefix() {
        return 'vl-span--';
    }

    _data_vl_attributeChangedCallback(oldValue, newValue) { }
}

define('vl-native-element', VlNativeElement, { extends: 'span' });
define('vl-native-prefixed-element', VlNativePrefixedElement, { extends: 'span' });