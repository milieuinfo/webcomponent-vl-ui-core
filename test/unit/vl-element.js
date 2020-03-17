import { VlElement, define } from '/src/vl-core.js';

class VlElementImpl extends VlElement(HTMLElement) {
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

define('vl-element', VlElementImpl);