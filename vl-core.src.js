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
export const VlElement = (SuperClass) => class extends SuperClass {
    constructor(html) {
        super();
        if (html) {
            this.__shadow(html);
        }
    }

    static get observedAttributes() {
        return this._observedAttributes.concat(this._observedClassAttributes).concat(this._observedChildClassAttributes);
    }

    attributeChangedCallback(attr, oldValue, newValue) {
        if (this.constructor._observedClassAttributes) {
            this.constructor._observedClassAttributes.filter(attribute => {
                return attribute == attr;
            }).forEach(attribute => {
                this._changeAttribute(this, oldValue, newValue, attribute);
            });
        }

        if (this.constructor._observedChildClassAttributes) {
            this.constructor._observedChildClassAttributes.filter(attribute => {
                return attribute == attr;
            }).forEach(attribute => {
                this._changeAttribute(this._element, oldValue, newValue, attribute);
            });
        }

        const callback = this['_' + attr + 'ChangedCallback'];
        if (callback) {
            callback.call(this, oldValue, newValue);
        } else if ((!this.constructor._observedClassAttributes || this.constructor._observedClassAttributes.indexOf(attr) == -1) && (!this.constructor._observedChildClassAttributes || this.constructor._observedChildClassAttributes.indexOf(attr) == -1)) {
            console.info('_' + attr + 'ChangedCallback is not defined');
        }
    }

    get _classPrefix() {
        console.error('class prefix is undefined');
    }

    get _element() {
        return this._shadow.lastElementChild;
    }

    _template(html) {
        const template = document.createElement('template');
        template.innerHTML = html;
        return template.content;
    }

    _changeClass(element, oldValue, newValue, classPrefix) {
        if (element.classList.contains((classPrefix || this._classPrefix) + oldValue)) {
            element.classList.remove((classPrefix || this._classPrefix) + oldValue);
        }
        element.classList.add((classPrefix || this._classPrefix) + newValue);
    }

    _changeAttribute(element, oldValue, newValue, attribute, classPrefix) {
        if (oldValue != newValue) {
            if (this.getAttribute(attribute) != undefined) {
                element.classList.add((classPrefix || this._classPrefix) + attribute);
            } else {
                element.classList.remove((classPrefix || this._classPrefix) + attribute);
            }
        }
    }

    __shadow(html) {
        this._shadow = this.attachShadow({mode: 'open'});
        this._shadow.innerHTML = html;
    }
}