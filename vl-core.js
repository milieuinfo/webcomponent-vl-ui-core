import"/node_modules/document-register-element/build/document-register-element.js";(()=>{function t(){var t=document.createElement("link");return t.setAttribute("id",e),t.setAttribute("rel","stylesheet"),t.setAttribute("type","text/css"),t.setAttribute("href","/node_modules/vl-ui-core/core-style.css"),t}const e="vl-core-style";!function(){if(!document.head.querySelector("#"+e)){var s=t();document.head.appendChild(s)}}()})();export const VlElement=SuperClass=>{class VlElement extends SuperClass{constructor(html){super();if(html){this.__shadow(html)}}static get customAttributesPrefix(){return"data-vl-"}getAttribute(attribute){if(super.hasAttribute(VlElement.customAttributesPrefix.concat(attribute)))return super.getAttribute(VlElement.customAttributesPrefix.concat(attribute));else return super.getAttribute(attribute)}static get observedAttributes(){return this._rawObservedAttributes.map(attribute=>this.customAttributesPrefix.concat(attribute)).concat(this._rawObservedAttributes)}static get _rawObservedAttributes(){return this._observedAttributes.concat(this._observedClassAttributes).concat(this._observedChildClassAttributes)}static get _observedAttributes(){return[]}static get _observedClassAttributes(){return[]}static get _observedChildClassAttributes(){return[]}get customAttributesPrefix(){return VlElement.customAttributesPrefix}attributeChangedCallback(attr,oldValue,newValue){if(attr.startsWith(this.customAttributesPrefix)){attr=attr.slice(this.customAttributesPrefix.length)}else if(this.constructor._rawObservedAttributes.includes(attr)){console.info(attr+" is defined as an observed attribute. To avoid conflicts, it should be used as "+this.customAttributesPrefix.concat(attr)+" in markup.")}this.__onAttributeChanged(attr,oldValue,newValue)}__onAttributeChanged(attr,oldValue,newValue){if(this.constructor._observedClassAttributes){this.constructor._observedClassAttributes.filter(attribute=>{return attribute==attr}).forEach(attribute=>{this.__changeAttribute(this,oldValue,newValue,attribute)})}if(this.constructor._observedChildClassAttributes){this.constructor._observedChildClassAttributes.filter(attribute=>{return attribute==attr}).forEach(attribute=>{this.__changeAttribute(this._element,oldValue,newValue,attribute)})}const callback=this["_"+attr.split("-").join("_")+"ChangedCallback"];if(callback){callback.call(this,oldValue,newValue)}else if((!this.constructor._observedClassAttributes||this.constructor._observedClassAttributes.indexOf(attr)==-1)&&(!this.constructor._observedChildClassAttributes||this.constructor._observedChildClassAttributes.indexOf(attr)==-1)){console.info("_"+attr+"ChangedCallback is not defined")}}get _classPrefix(){console.error("class prefix is undefined")}get _element(){if(this._shadow){return this._shadow.lastElementChild}else{return this}}_template(html){const template=document.createElement("template");template.innerHTML=html;return template.content}_changeClass(element,oldValue,newValue,classPrefix){if(element.classList.contains((classPrefix||this._classPrefix)+oldValue)){element.classList.remove((classPrefix||this._classPrefix)+oldValue)}if(newValue!=undefined){element.classList.add((classPrefix||this._classPrefix)+newValue)}}_toggleClass(element,value,clazz){if(value!=undefined||!!value){element.classList.add(clazz)}else{element.classList.remove(clazz)}}_addStyleLink(){const id=this.constructor.name+"-style";if(!document.head.querySelector("#"+id)){document.head.appendChild(this.__generateStyleLink(id))}}__shadow(html){this._shadow=this.attachShadow({mode:"open"});this._shadow.innerHTML=html}__changeAttribute(element,oldValue,newValue,attribute,classPrefix){if(oldValue!=newValue){if(this.getAttribute(attribute)!=undefined){element.classList.add((classPrefix||this._classPrefix)+attribute)}else{element.classList.remove((classPrefix||this._classPrefix)+attribute)}}}__generateStyleLink(id){if(!this._stylePath){console.error("style path is not defined")}var link=document.createElement("link");link.setAttribute("id",id);link.setAttribute("rel","stylesheet");link.setAttribute("type","text/css");link.setAttribute("href",this._stylePath);return link}}return VlElement};export const NativeVlElement=SuperClass=>{class NativeVlElement extends VlElement(SuperClass){constructor(){super();this._addStyleLink()}get _element(){return this}}return NativeVlElement};export const define=(name,constructor,options)=>{if(customElements.get(name)){console.warn(`${name} werd reeds gedefinieerd als custom element`)}else{customElements.define(name,constructor,options)}};