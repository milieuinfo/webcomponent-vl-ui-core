(() => {
    const id = 'vl-core-style';
    addStyle();

    function addStyle() {
        if (!document.head.querySelector('#' + id)) {
            var style = getStyle();
            document.head.appendChild(style);
        }
    }

    function getStyle() {
        var link = document.createElement('link');
        link.setAttribute('id', id);
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('type', 'text/css');
        link.setAttribute('href', '../style.css');
        return link;
    }
})();

/**
 * `vl-element`
 * De root element class.
 */
export class VlElement extends HTMLElement {
    constructor(html) {
        super();
        if (html) {
            this.__shadow(html);
        }
    }

    static get observedAttributes() {
        return this._observedAttributes;
    }

    attributeChangedCallback(attr, oldValue, newValue) {
        const callback = this['_' + attr + 'ChangedCallback'];
        if (callback) {
            callback.call(this, oldValue, newValue);
        } else {
            console.info('_' + attr + 'ChangedCallback is not defined');
        }
    }

    get _element() {
        return this._shadow.lastElementChild;
    }

    _template(html) {
        const template = document.createElement('template');
        template.innerHTML = html;
        return template.content;
    }

    _changeClass(element, oldValue, newValue) {
        if (element.classList.contains(oldValue)) {
            element.classList.remove(oldValue);
        }
        element.classList.add(newValue);
    }

    _changeAttribute(element, attribute, oldValue, newValue) {
        if (oldValue != newValue) {
            if (element.getAttribute(attribute) != null) {
                element.classList.add(attribute);
            } else {
                element.classList.remove(attribute);
            }
        }
    }

    __shadow(html) {
        this._shadow = this.attachShadow({mode: 'open'});
        this._shadow.innerHTML = html;
    }
}