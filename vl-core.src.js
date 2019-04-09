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
        link.setAttribute('href', '../core-style.css');
        return link;
    }
})();

/**
 * `VlElement`
 * De root element class voor custom HTML elementen.
 */
export const VlElement = (SuperClass) => class extends SuperClass {
    /**
     * VlElement constructor die een shadow DOM voorziet op basis van de HTML {Literal} parameter.
     * 
     * @param {Literal} html - HTML literal die de DOM representeert
     * @Return {void}
     */
    constructor(html) {
        super();
        if (html) {
            this.__shadow(html);
        }
    }

    static get observedAttributes() {
        return this._observedAttributes.concat(this._observedClassAttributes).concat(this._observedChildClassAttributes);
    }

    /**
     * Een lijst van attributen die geobserveerd zullen worden. Bij een wijziging van de attribuut waarde zal een functie (`_attribuutChangedCallback`) functie aangeroepen worden met de oude en nieuwe waarde als parameters. Indien de attribuut `-` bevat in de naam zal dit vervangen worden door `_` bij het aanroepen van de functie (`_attribuut_naamChangedCallback`).
     * 
     * @Return {Array} array van attributen waar naar geluisterd moet worden
     */
    static get _observedAttributes() {
        return [];
    }

    /**
     * Een lijst van attributen die geobserveerd zullen worden. Bij een wijziging van de attribuut waarde zal een class toegevoegd worden aan het root element. De naam van de class is gebaseerd op de element prefix (`_classPrefix`) en de naam van het attribuut.
     * 
     * @Return {Array} array van attributen waar naar geluisterd moet worden
     */
    static get _observedClassAttributes() {
        return [];
    }

    /**
     * Een lijst van attributen die geobserveerd zullen worden. Bij een wijziging van de attribuut waarde zal een class toegevoegd worden aan het eerste shadow DOM element. De naam van de class is gebaseerd op de element prefix (`_classPrefix`) en de naam van het attribuut.
     * 
     * @Return {Array} array van attributen waar naar geluisterd moet worden
     */
    static get _observedChildClassAttributes() {
        return [];
    }

    attributeChangedCallback(attr, oldValue, newValue) {
        if (this.constructor._observedClassAttributes) {
            this.constructor._observedClassAttributes.filter(attribute => {
                return attribute == attr;
            }).forEach(attribute => {
                this.__changeAttribute(this, oldValue, newValue, attribute);
            });
        }

        if (this.constructor._observedChildClassAttributes) {
            this.constructor._observedChildClassAttributes.filter(attribute => {
                return attribute == attr;
            }).forEach(attribute => {
                this.__changeAttribute(this._element, oldValue, newValue, attribute);
            });
        }

        const callback = this['_' + attr.split('-').join('_') + 'ChangedCallback'];
        if (callback) {
            callback.call(this, oldValue, newValue);
        } else if ((!this.constructor._observedClassAttributes || this.constructor._observedClassAttributes.indexOf(attr) == -1) && (!this.constructor._observedChildClassAttributes || this.constructor._observedChildClassAttributes.indexOf(attr) == -1)) {
            console.info('_' + attr + 'ChangedCallback is not defined');
        }
    }

    /**
     * De class prefix bepaalt de prefix van het class attribuut dat automatisch toegevoegd wordt op basis van attributen.
     * 
     * @Return {void}
     */
    get _classPrefix() {
        console.error('class prefix is undefined');
    }

    /**
     * DOM element getter.
     * 
     * @Return {Element}
     */
    get _element() {
        return this._shadow.lastElementChild;
    }

    /**
     * Genereert een {HTMLTemplateElement} template met de HTML Literal.
     * 
     * @param {Literal} html - HTML literal
     * @Return {HTMLTemplateElement}
     */
    _template(html) {
        const template = document.createElement('template');
        template.innerHTML = html;
        return template.content;
    }

    /**
     * Het class attribuut op basis van de oude waarde zal vervangen worden door het class attribuut op basis van de nieuwe waarde.
     * 
     * @param {Element} element - HTML element
     * @param {Object} oldValue - oude waarde
     * @param {Object} newValue - nieuwe waarde
     * @param {String} classPrefix - class prefix 
     * @return {void}
     */
    _changeClass(element, oldValue, newValue, classPrefix) {
        if (element.classList.contains((classPrefix || this._classPrefix) + oldValue)) {
            element.classList.remove((classPrefix || this._classPrefix) + oldValue);
        }

        if (newValue != undefined) {
            element.classList.add((classPrefix || this._classPrefix) + newValue);
        }
    }

    /**
     * Zal op basis van de attribuut waarde de class verwijderen of toevoegen.
     * 
     * @param {Element} element - HTML element
     * @param {Object} value - attribuut waarde
     * @param {String} clazz- class waarde 
     * @return {void}
     */
    _toggleClass(element, value, clazz) {
        if (value != undefined || !!value) {
            element.classList.add(clazz);
        } else {
            element.classList.remove(clazz);
        }
    }

    /**
     * Wijzigt het class attribuut van het HTML element als de oude en nieuwe waarde van het attribuut niet identiek zijn. Indien de nieuwe waarde bestaat zal een class toegevoegd worden op basis van deze waarde, anders zal de bestaande class op basis van de oude waarde verwijderd worden.
     * 
     * @param {Element} element - HTML element
     * @param {Object} oldValue - oude waarde 
     * @param {Object} newValue - nieuwe waarde 
     * @param {String} attribute - attribuut naam
     * @param {String} classPrefix - class prefix
     * @return {void}
     */
    __changeAttribute(element, oldValue, newValue, attribute, classPrefix) {
        if (oldValue != newValue) {
            if (this.getAttribute(attribute) != undefined) {
                element.classList.add((classPrefix || this._classPrefix) + attribute);
            } else {
                element.classList.remove((classPrefix || this._classPrefix) + attribute);
            }
        }
    }

    _bevatClass(value) {
        return this._element.classList.contains(value);
    }

    __shadow(html) {
        this._shadow = this.attachShadow({mode: 'open'});
        this._shadow.innerHTML = html;
    }
}

/**
 * `NativeVlElement`
 * De root element class voor native HTML elementen.
 */
export const NativeVlElement = (SuperClass) => class extends VlElement(SuperClass) {
    /**
     * NativeVlElement constructor die het element CSS link element automatisch zal toevoegen aan de DOM head tag.
     * 
     * @Return {void}
     */
    constructor() {
        super();
        this.__addStyleLink();
    }  
    
    /**
     * DOM element getter.
     * 
     * @Return {Element}
     */
    get _element() {
        return this;
    }

    __addStyleLink() {
        const id = this.constructor.name + '-style';
        if (!document.head.querySelector('#' + id)) {
            document.head.appendChild(this.__generateStyleLink(id));
        }
    }

    __generateStyleLink(id) {
        if (!this._stylePath) {
            console.error('style path is not defined');
        }

        var link = document.createElement('link');
        link.setAttribute('id', id);
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('type', 'text/css');
        link.setAttribute('href', this._stylePath);
        return link;
    }
}