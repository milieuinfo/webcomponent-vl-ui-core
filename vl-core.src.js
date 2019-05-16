import '/node_modules/document-register-element/build/document-register-element.js';

window.WebComponents = window.WebComponents || {};
window.WebComponents.root = '/node_modules/@webcomponents/webcomponentsjs/';

/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

(function () {
    'use strict';

    /**
     * Basic flow of the loader process
     *
     * There are 4 flows the loader can take when booting up
     *
     * - Synchronous script, no polyfills needed
     *   - wait for `DOMContentLoaded`
     *   - fire WCR event, as there could not be any callbacks passed to `waitFor`
     *
     * - Synchronous script, polyfills needed
     *   - document.write the polyfill bundle
     *   - wait on the `load` event of the bundle to batch Custom Element upgrades
     *   - wait for `DOMContentLoaded`
     *   - run callbacks passed to `waitFor`
     *   - fire WCR event
     *
     * - Asynchronous script, no polyfills needed
     *   - wait for `DOMContentLoaded`
     *   - run callbacks passed to `waitFor`
     *   - fire WCR event
     *
     * - Asynchronous script, polyfills needed
     *   - Append the polyfill bundle script
     *   - wait for `load` event of the bundle
     *   - batch Custom Element Upgrades
     *   - run callbacks pass to `waitFor`
     *   - fire WCR event
     */

    var polyfillsLoaded = false;
    var whenLoadedFns = [];
    var allowUpgrades = false;
    var flushFn;

    function fireEvent() {
        window.WebComponents.ready = true;
        document.dispatchEvent(new CustomEvent('WebComponentsReady', { bubbles: true }));
    }

    function batchCustomElements() {
        if (window.customElements && customElements.polyfillWrapFlushCallback) {
            customElements.polyfillWrapFlushCallback(function (flushCallback) {
                flushFn = flushCallback;
                if (allowUpgrades) {
                    flushFn();
                }
            });
        }
    }

    function asyncReady() {
        batchCustomElements();
        ready();
    }

    function ready() {
        // bootstrap <template> elements before custom elements
        if (window.HTMLTemplateElement && HTMLTemplateElement.bootstrap) {
            HTMLTemplateElement.bootstrap(window.document);
        }
        polyfillsLoaded = true;
        runWhenLoadedFns().then(fireEvent);
    }

    function runWhenLoadedFns() {
        allowUpgrades = false;
        var fnsMap = whenLoadedFns.map(function (fn) {
            return fn instanceof Function ? fn() : fn;
        });
        whenLoadedFns = [];
        return Promise.all(fnsMap).then(function () {
            allowUpgrades = true;
            flushFn && flushFn();
        }).catch(function (err) {
            console.error(err);
        });
    }

    window.WebComponents = window.WebComponents || {};
    window.WebComponents.ready = window.WebComponents.ready || false;
    window.WebComponents.waitFor = window.WebComponents.waitFor || function (waitFn) {
        if (!waitFn) {
            return;
        }
        whenLoadedFns.push(waitFn);
        if (polyfillsLoaded) {
            runWhenLoadedFns();
        }
    };
    window.WebComponents._batchCustomElements = batchCustomElements;

    var name = 'webcomponents-loader.js';
    // Feature detect which polyfill needs to be imported.
    var polyfills = [];
    if (!('attachShadow' in Element.prototype && 'getRootNode' in Element.prototype) ||
        (window.ShadyDOM && window.ShadyDOM.force)) {
        polyfills.push('sd');
    }
    if (!window.customElements || window.customElements.forcePolyfill) {
        polyfills.push('ce');
    }

    var needsTemplate = (function () {
        // no real <template> because no `content` property (IE and older browsers)
        var t = document.createElement('template');
        if (!('content' in t)) {
            return true;
        }
        // broken doc fragment (older Edge)
        if (!(t.content.cloneNode() instanceof DocumentFragment)) {
            return true;
        }
        // broken <template> cloning (Edge up to at least version 17)
        var t2 = document.createElement('template');
        t2.content.appendChild(document.createElement('div'));
        t.content.appendChild(t2);
        var clone = t.cloneNode(true);
        return (clone.content.childNodes.length === 0 ||
            clone.content.firstChild.content.childNodes.length === 0);
    })();

    // NOTE: any browser that does not have template or ES6 features
    // must load the full suite of polyfills.
    if (!window.Promise || !Array.from || !window.URL || !window.Symbol || needsTemplate) {
        polyfills = ['sd-ce-pf'];
    }

    if (polyfills.length) {
        var url;
        var polyfillFile = 'bundles/webcomponents-' + polyfills.join('-') + '.js';

        // Load it from the right place.
        if (window.WebComponents.root) {
            url = window.WebComponents.root + polyfillFile;
        } else {
            var script = document.querySelector('script[src*="' + name + '"]');
            // Load it from the right place.
            url = script.src.replace(name, polyfillFile);
        }

        var newScript = document.createElement('script');
        newScript.src = url;
        // if readyState is 'loading', this script is synchronous
        if (document.readyState === 'loading') {
            // make sure custom elements are batched whenever parser gets to the injected script
            newScript.setAttribute('onload', 'window.WebComponents._batchCustomElements()');
            document.write(newScript.outerHTML);
            document.addEventListener('DOMContentLoaded', ready);
        } else {
            newScript.addEventListener('load', function () {
                asyncReady();
            });
            newScript.addEventListener('error', function () {
                throw new Error('Could not load polyfill bundle' + url);
            });
            document.head.appendChild(newScript);
        }
    } else {
        // if readyState is 'complete', script is loaded imperatively on a spec-compliant browser, so just fire WCR
        if (document.readyState === 'complete') {
            polyfillsLoaded = true;
            fireEvent();
        } else {
            // this script may come between DCL and load, so listen for both, and cancel load listener if DCL fires
            window.addEventListener('load', ready);
            window.addEventListener('DOMContentLoaded', function () {
                window.removeEventListener('load', ready);
                ready();
            })
        }
    }
})();

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

export const VlElement = (SuperClass) => {
    /**
     * VlElement
     * @class
     * @classdesc De root element class voor custom HTML elementen.
     */
    class VlElement extends SuperClass {
        /**
         * VlElement constructor die een shadow DOM voorziet op basis van de HTML {Literal} parameter.
         * 
         * @param {Literal} html - HTML literal die de DOM representeert
         * @returns {void}
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
         * @protected
         * @returns {Array} array van attributen waar naar geluisterd moet worden
         */
        static get _observedAttributes() {
            return [];
        }

        /**
         * Een lijst van attributen die geobserveerd zullen worden. Bij een wijziging van de attribuut waarde zal een class toegevoegd worden aan het root element. De naam van de class is gebaseerd op de element prefix (`_classPrefix`) en de naam van het attribuut.
         * 
         * @protected
         * @returns {Array} array van attributen waar naar geluisterd moet worden
         */
        static get _observedClassAttributes() {
            return [];
        }

        /**
         * Een lijst van attributen die geobserveerd zullen worden. Bij een wijziging van de attribuut waarde zal een class toegevoegd worden aan het eerste shadow DOM element. De naam van de class is gebaseerd op de element prefix (`_classPrefix`) en de naam van het attribuut.
         * 
         * @protected
         * @returns {Array} array van attributen waar naar geluisterd moet worden
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
         * @protected
         * @returns {void}
         */
        get _classPrefix() {
            console.error('class prefix is undefined');
        }

        /**
         * DOM element getter.
         * 
         * @protected
         * @returns {Element}
         */
        get _element() {
            if (this._shadow) {
                return this._shadow.lastElementChild;
            } else {
                return this;
            }
        }

        /**
         * Genereert een {HTMLTemplateElement} template met de HTML Literal.
         * 
         * @protected
         * @param {Literal} html - HTML literal
         * @returns {HTMLTemplateElement}
         */
        _template(html) {
            const template = document.createElement('template');
            template.innerHTML = html;
            return template.content;
        }

        /**
         * Het class attribuut op basis van de oude waarde zal vervangen worden door het class attribuut op basis van de nieuwe waarde.
         * 
         * @protected
         * @param {Element} element - HTML element
         * @param {Object} oldValue - oude waarde
         * @param {Object} newValue - nieuwe waarde
         * @param {String} classPrefix - class prefix 
         * @returns {void}
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
         * @protected
         * @param {Element} element - HTML element
         * @param {Object} value - attribuut waarde
         * @param {String} clazz- class waarde 
         * @returns {void}
         */
        _toggleClass(element, value, clazz) {
            if (value != undefined || !!value) {
                element.classList.add(clazz);
            } else {
                element.classList.remove(clazz);
            }
        }

        /**
         * Voegt een stijl link tag toe aan de header
         * 
         * @protected
         * @returns {void}
         */
        _addStyleLink() {
            const id = this.constructor.name + '-style';
            if (!document.head.querySelector('#' + id)) {
                document.head.appendChild(this.__generateStyleLink(id));
            }
        }

        /**
         * @private
         */
        __shadow(html) {
            this._shadow = this.attachShadow({ mode: 'open' });
            this._shadow.innerHTML = html;
        }

        /**
         * @private
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

        /**
         * @private
         */
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
    };

    return VlElement;
};

export const NativeVlElement = (SuperClass) => {
    /**
     * NativeVlElement
     * @class
     * @classdesc De root element class voor native HTML elementen.
     * 
     * @extends VlElement
     */
    class NativeVlElement extends VlElement(SuperClass) {
        /**
         * NativeVlElement constructor die het element CSS link element automatisch zal toevoegen aan de DOM head tag.
         * 
         * @returns {void}
         */
        constructor() {
            super();
            this._addStyleLink();
        }

        /**
         * DOM element getter.
         * 
         * @returns {Element}
         */
        get _element() {
            return this;
        }
    }

    return NativeVlElement;
};

export const VlRegisterElement = (callback) => {
    WebComponents.waitFor(() => {
        if (callback) {
            callback();
        }
    });
}