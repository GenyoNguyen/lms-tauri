(window.webpackJsonp=window.webpackJsonp||[]).push([[70],{1822:function(e,t,o){var n=o(29),a=o(1823);"string"==typeof(a=a.__esModule?a.default:a)&&(a=[[e.i,a,""]]);var r={insert:function(e){if(!window.isApryseWebViewerWebComponent)return void document.head.appendChild(e);let t;t=document.getElementsByTagName("apryse-webviewer"),t.length||(t=function e(t,o=document){const n=[];return o.querySelectorAll(t).forEach(e=>n.push(e)),o.querySelectorAll("*").forEach(o=>{o.shadowRoot&&n.push(...e(t,o.shadowRoot))}),n}("apryse-webviewer"));const o=[];for(let n=0;n<t.length;n++){const a=t[n];if(0===n)a.shadowRoot.appendChild(e),e.onload=function(){o.length>0&&o.forEach(t=>{t.innerHTML=e.innerHTML})};else{const t=e.cloneNode(!0);a.shadowRoot.appendChild(t),o.push(t)}}},singleton:!1};n(a,r);e.exports=a.locals||{}},1823:function(e,t,o){(t=e.exports=o(30)(!1)).push([e.i,".open.SaveModal{visibility:visible}.closed.SaveModal{visibility:hidden}:host{display:inline-block;container-type:inline-size;width:100%;height:100%;overflow:hidden}@media(min-width:901px){.App:not(.is-web-component) .hide-in-desktop{display:none}}@container (min-width: 901px){.hide-in-desktop{display:none}}@media(min-width:641px)and (max-width:900px){.App:not(.is-in-desktop-only-mode):not(.is-web-component) .hide-in-tablet{display:none}}@container (min-width: 641px) and (max-width: 900px){.App.is-web-component:not(.is-in-desktop-only-mode) .hide-in-tablet{display:none}}@media(max-width:640px)and (min-width:431px){.App:not(.is-web-component) .hide-in-mobile{display:none}}@container (max-width: 640px) and (min-width: 431px){.App.is-web-component .hide-in-mobile{display:none}}@media(max-width:430px){.App:not(.is-web-component) .hide-in-small-mobile{display:none}}@container (max-width: 430px){.App.is-web-component .hide-in-small-mobile{display:none}}.always-hide{display:none}.SaveModal .footer .modal-button.confirm:hover,.SaveModal .modal-container .footer button:hover:not(:disabled){background:var(--primary-button-hover);border-color:var(--primary-button-hover);color:var(--gray-0)}.SaveModal .footer .modal-button.confirm{background:var(--primary-button);border-color:var(--primary-button);color:var(--primary-button-text)}.SaveModal .footer .modal-button.confirm.disabled,.SaveModal .modal-container .footer button:disabled{cursor:default;background:var(--disabled-button-color);color:var(--primary-button-text)}.SaveModal .footer .modal-button.confirm.disabled span,.SaveModal .modal-container .footer button:disabled span{color:var(--primary-button-text)}.SaveModal .footer .modal-button.cancel:hover,.SaveModal .footer .modal-button.secondary-btn-custom:hover{border:none;box-shadow:inset 0 0 0 1px var(--blue-6);color:var(--blue-6)}.SaveModal .footer .modal-button.cancel,.SaveModal .footer .modal-button.secondary-btn-custom{border:none;box-shadow:inset 0 0 0 1px var(--primary-button);color:var(--primary-button)}.SaveModal .footer .modal-button.cancel.disabled,.SaveModal .footer .modal-button.secondary-btn-custom.disabled{cursor:default;border:none;box-shadow:inset 0 0 0 1px rgba(43,115,171,.5);color:rgba(43,115,171,.5)}.SaveModal .footer .modal-button.cancel.disabled span,.SaveModal .footer .modal-button.secondary-btn-custom.disabled span{color:rgba(43,115,171,.5)}.SaveModal{position:fixed;left:0;bottom:0;z-index:100;width:100%;height:100%;display:flex;justify-content:center;align-items:center;background:var(--modal-negative-space)}.SaveModal .modal-container .wrapper .modal-content{padding:10px}.SaveModal .footer{display:flex;flex-direction:row;justify-content:flex-end;width:100%;margin-top:13px}.SaveModal .footer.modal-footer{padding:16px;margin:0;border-top:1px solid var(--divider)}.SaveModal .footer .modal-button{display:flex;justify-content:center;align-items:center;padding:6px 18px;margin:8px 0 0;width:auto;width:-moz-fit-content;width:fit-content;border-radius:4px;height:30px;cursor:pointer}.SaveModal .footer .modal-button.confirm{margin-left:4px}.SaveModal .footer .modal-button.secondary-btn-custom{border-radius:4px;padding:2px 20px 4px;cursor:pointer}@media(max-width:640px){.App:not(.is-in-desktop-only-mode):not(.is-web-component) .SaveModal .footer .modal-button{padding:23px 8px}}@container (max-width: 640px){.App.is-web-component:not(.is-in-desktop-only-mode) .SaveModal .footer .modal-button{padding:23px 8px}}.SaveModal .swipe-indicator{background:var(--swipe-indicator-bg);border-radius:2px;height:4px;width:38px;position:absolute;top:12px;margin-left:auto;margin-right:auto;left:0;right:0}@media(min-width:641px){.App:not(.is-in-desktop-only-mode):not(.is-web-component) .SaveModal .swipe-indicator{display:none}}@container (min-width: 641px){.App.is-web-component:not(.is-in-desktop-only-mode) .SaveModal .swipe-indicator{display:none}}@media(max-width:640px){.App:not(.is-in-desktop-only-mode):not(.is-web-component) .SaveModal .swipe-indicator{width:32px}}@container (max-width: 640px){.App.is-web-component:not(.is-in-desktop-only-mode) .SaveModal .swipe-indicator{width:32px}}.SaveModal{flex-direction:column}.SaveModal .modal-container{overflow:visible;display:flex;flex-direction:column;justify-content:space-evenly;height:auto;width:480px;padding:0}.SaveModal .modal-container .header{border-bottom:1px solid var(--gray-5);padding:16px;height:64px;width:100%;display:flex;align-items:center;justify-content:space-between}.SaveModal .modal-container .header .header-text{font-size:var(--font-size-large);font-weight:var(--font-weight-bold)}.SaveModal .modal-container .header .Button{width:32px;height:32px}.SaveModal .modal-container .modal-body{padding:16px;display:flex;flex-direction:column;font-size:var(--font-size-default);font-family:var(--font-family);grid-gap:12px;gap:12px}.SaveModal .modal-container .modal-body .title{line-height:16px;font-weight:var(--font-weight-bold)}.SaveModal .modal-container .modal-body .input-container{align-items:baseline;display:flex;grid-gap:16px;gap:16px;height:32px;margin-bottom:20px}.SaveModal .modal-container .modal-body .input-container .label{min-width:60px}.SaveModal .modal-container .modal-body .input-container .ui__input{border-color:var(--border)}.SaveModal .modal-container .modal-body .input-container .ui__input.ui__input--focused{box-shadow:none;border-color:var(--focus-border)}.SaveModal .modal-container .modal-body .input-container .ui__input.ui__input--message-warning{border-color:var(--error-border-color)}.SaveModal .modal-container .modal-body .input-container .ui__input.ui__input--message-warning .ui__icon svg{fill:var(--error-border-color)}.SaveModal .modal-container .modal-body .input-container .ui__input__messageText{color:var(--error-text-color);margin:8px 0;font-size:13px}.SaveModal .modal-container .modal-body .input-container input{padding:8px;height:32px;font-size:var(--font-size-default);flex:1 1 auto}.SaveModal .modal-container .modal-body .input-container .Dropdown__wrapper{height:32px;flex:1 1 auto}.SaveModal .modal-container .modal-body .input-container .Dropdown__wrapper .Dropdown{height:100%;width:100%!important}.SaveModal .modal-container .modal-body .input-container .Dropdown__wrapper .Dropdown .picked-option .picked-option-text{width:auto;flex:none}.SaveModal .modal-container .modal-body .input-container .Dropdown__wrapper .Dropdown .picked-option .arrow{flex:none}.SaveModal .modal-container .modal-body .input-container .Dropdown__wrapper .Dropdown__items{width:100%}.SaveModal .modal-container .modal-body .radio-container{grid-gap:8px;gap:8px;height:90px;display:grid;grid-template-columns:repeat(2,1fr)}.SaveModal .modal-container .modal-body .radio-container .ui__choice--checked .ui__choice__input__check{border-color:var(--blue-5)}.SaveModal .modal-container .modal-body .radio-container .ui__choice__input__check{border-color:var(--gray-7)}.SaveModal .modal-container .modal-body .radio-container .page-number-input-container.error .page-number-input{border:1px solid var(--error-border-color)}.SaveModal .modal-container .modal-body .radio-container .page-number-input-container .page-number-input{width:208px}.SaveModal .modal-container .modal-body .radio-container .page-number-input-container .specifyPagesChoiceLabel{display:flex;margin-bottom:8px}.SaveModal .modal-container .modal-body .radio-container .page-number-input-container .specifyPagesChoiceLabel .specifyPagesExampleLabel{margin-left:4px;color:var(--faded-text)}.SaveModal .modal-container .modal-body .radio-container .page-range-column{display:grid;grid-gap:16px;gap:16px;align-content:baseline}.SaveModal .modal-container .modal-body .radio-container .page-range-column.custom-page-ranges .ui__choice{align-items:unset}.SaveModal .modal-container .modal-body .checkbox-container{display:grid;grid-template-columns:repeat(2,1fr)}.SaveModal .modal-container .footer{padding:16px;display:flex;justify-content:flex-end;border-top:1px solid var(--gray-5)}.SaveModal .modal-container .footer button{border:none;border-radius:4px;background:var(--primary-button)!important;width:82px;height:32px;color:var(--primary-button-text)}",""]),t.locals={LEFT_HEADER_WIDTH:"41px",RIGHT_HEADER_WIDTH:"41px"}},1931:function(e,t,o){"use strict";o.r(t);o(245),o(46),o(35),o(89),o(8),o(41),o(19),o(11),o(13),o(14),o(10),o(9),o(12),o(16),o(15),o(20),o(17),o(59),o(22),o(64),o(65),o(66),o(67),o(37),o(39),o(23),o(24),o(40),o(63);var n=o(0),a=o.n(n),r=o(6),i=o(3),l=o(2),d=o(396),c=o(5),p=o(43),u=o(1893),s=o(1262),m=o(1),f=o(18),h=o.n(f),v=o(80),b=o(436),g=o(174),y=o(73),x=o(70),w=o(518),S=o.n(w),E=o(334),M=o(170);o(1822);function _(e){return(_="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function O(){/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */O=function(){return e};var e={},t=Object.prototype,o=t.hasOwnProperty,n=Object.defineProperty||function(e,t,o){e[t]=o.value},a="function"==typeof Symbol?Symbol:{},r=a.iterator||"@@iterator",i=a.asyncIterator||"@@asyncIterator",l=a.toStringTag||"@@toStringTag";function d(e,t,o){return Object.defineProperty(e,t,{value:o,enumerable:!0,configurable:!0,writable:!0}),e[t]}try{d({},"")}catch(e){d=function(e,t,o){return e[t]=o}}function c(e,t,o,a){var r=t&&t.prototype instanceof s?t:s,i=Object.create(r.prototype),l=new k(a||[]);return n(i,"_invoke",{value:w(e,o,l)}),i}function p(e,t,o){try{return{type:"normal",arg:e.call(t,o)}}catch(e){return{type:"throw",arg:e}}}e.wrap=c;var u={};function s(){}function m(){}function f(){}var h={};d(h,r,(function(){return this}));var v=Object.getPrototypeOf,b=v&&v(v(L([])));b&&b!==t&&o.call(b,r)&&(h=b);var g=f.prototype=s.prototype=Object.create(h);function y(e){["next","throw","return"].forEach((function(t){d(e,t,(function(e){return this._invoke(t,e)}))}))}function x(e,t){var a;n(this,"_invoke",{value:function(n,r){function i(){return new t((function(a,i){!function n(a,r,i,l){var d=p(e[a],e,r);if("throw"!==d.type){var c=d.arg,u=c.value;return u&&"object"==_(u)&&o.call(u,"__await")?t.resolve(u.__await).then((function(e){n("next",e,i,l)}),(function(e){n("throw",e,i,l)})):t.resolve(u).then((function(e){c.value=e,i(c)}),(function(e){return n("throw",e,i,l)}))}l(d.arg)}(n,r,a,i)}))}return a=a?a.then(i,i):i()}})}function w(e,t,o){var n="suspendedStart";return function(a,r){if("executing"===n)throw new Error("Generator is already running");if("completed"===n){if("throw"===a)throw r;return j()}for(o.method=a,o.arg=r;;){var i=o.delegate;if(i){var l=S(i,o);if(l){if(l===u)continue;return l}}if("next"===o.method)o.sent=o._sent=o.arg;else if("throw"===o.method){if("suspendedStart"===n)throw n="completed",o.arg;o.dispatchException(o.arg)}else"return"===o.method&&o.abrupt("return",o.arg);n="executing";var d=p(e,t,o);if("normal"===d.type){if(n=o.done?"completed":"suspendedYield",d.arg===u)continue;return{value:d.arg,done:o.done}}"throw"===d.type&&(n="completed",o.method="throw",o.arg=d.arg)}}}function S(e,t){var o=t.method,n=e.iterator[o];if(void 0===n)return t.delegate=null,"throw"===o&&e.iterator.return&&(t.method="return",t.arg=void 0,S(e,t),"throw"===t.method)||"return"!==o&&(t.method="throw",t.arg=new TypeError("The iterator does not provide a '"+o+"' method")),u;var a=p(n,e.iterator,t.arg);if("throw"===a.type)return t.method="throw",t.arg=a.arg,t.delegate=null,u;var r=a.arg;return r?r.done?(t[e.resultName]=r.value,t.next=e.nextLoc,"return"!==t.method&&(t.method="next",t.arg=void 0),t.delegate=null,u):r:(t.method="throw",t.arg=new TypeError("iterator result is not an object"),t.delegate=null,u)}function E(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function M(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function k(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(E,this),this.reset(!0)}function L(e){if(e){var t=e[r];if(t)return t.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var n=-1,a=function t(){for(;++n<e.length;)if(o.call(e,n))return t.value=e[n],t.done=!1,t;return t.value=void 0,t.done=!0,t};return a.next=a}}return{next:j}}function j(){return{value:void 0,done:!0}}return m.prototype=f,n(g,"constructor",{value:f,configurable:!0}),n(f,"constructor",{value:m,configurable:!0}),m.displayName=d(f,l,"GeneratorFunction"),e.isGeneratorFunction=function(e){var t="function"==typeof e&&e.constructor;return!!t&&(t===m||"GeneratorFunction"===(t.displayName||t.name))},e.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,f):(e.__proto__=f,d(e,l,"GeneratorFunction")),e.prototype=Object.create(g),e},e.awrap=function(e){return{__await:e}},y(x.prototype),d(x.prototype,i,(function(){return this})),e.AsyncIterator=x,e.async=function(t,o,n,a,r){void 0===r&&(r=Promise);var i=new x(c(t,o,n,a),r);return e.isGeneratorFunction(o)?i:i.next().then((function(e){return e.done?e.value:i.next()}))},y(g),d(g,l,"Generator"),d(g,r,(function(){return this})),d(g,"toString",(function(){return"[object Generator]"})),e.keys=function(e){var t=Object(e),o=[];for(var n in t)o.push(n);return o.reverse(),function e(){for(;o.length;){var n=o.pop();if(n in t)return e.value=n,e.done=!1,e}return e.done=!0,e}},e.values=L,k.prototype={constructor:k,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method="next",this.arg=void 0,this.tryEntries.forEach(M),!e)for(var t in this)"t"===t.charAt(0)&&o.call(this,t)&&!isNaN(+t.slice(1))&&(this[t]=void 0)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var t=this;function n(o,n){return i.type="throw",i.arg=e,t.next=o,n&&(t.method="next",t.arg=void 0),!!n}for(var a=this.tryEntries.length-1;a>=0;--a){var r=this.tryEntries[a],i=r.completion;if("root"===r.tryLoc)return n("end");if(r.tryLoc<=this.prev){var l=o.call(r,"catchLoc"),d=o.call(r,"finallyLoc");if(l&&d){if(this.prev<r.catchLoc)return n(r.catchLoc,!0);if(this.prev<r.finallyLoc)return n(r.finallyLoc)}else if(l){if(this.prev<r.catchLoc)return n(r.catchLoc,!0)}else{if(!d)throw new Error("try statement without catch or finally");if(this.prev<r.finallyLoc)return n(r.finallyLoc)}}}},abrupt:function(e,t){for(var n=this.tryEntries.length-1;n>=0;--n){var a=this.tryEntries[n];if(a.tryLoc<=this.prev&&o.call(a,"finallyLoc")&&this.prev<a.finallyLoc){var r=a;break}}r&&("break"===e||"continue"===e)&&r.tryLoc<=t&&t<=r.finallyLoc&&(r=null);var i=r?r.completion:{};return i.type=e,i.arg=t,r?(this.method="next",this.next=r.finallyLoc,u):this.complete(i)},complete:function(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),u},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var o=this.tryEntries[t];if(o.finallyLoc===e)return this.complete(o.completion,o.afterLoc),M(o),u}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var o=this.tryEntries[t];if(o.tryLoc===e){var n=o.completion;if("throw"===n.type){var a=n.arg;M(o)}return a}}throw new Error("illegal catch attempt")},delegateYield:function(e,t,o){return this.delegate={iterator:L(e),resultName:t,nextLoc:o},"next"===this.method&&(this.arg=void 0),u}},e}function k(e,t,o,n,a,r,i){try{var l=e[r](i),d=l.value}catch(e){return void o(e)}l.done?t(d):Promise.resolve(d).then(n,a)}function L(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var o=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=o){var n,a,r,i,l=[],d=!0,c=!1;try{if(r=(o=o.call(e)).next,0===t){if(Object(o)!==o)return;d=!1}else for(;!(d=(n=r.call(o)).done)&&(l.push(n.value),l.length!==t);d=!0);}catch(e){c=!0,a=e}finally{try{if(!d&&null!=o.return&&(i=o.return(),Object(i)!==i))return}finally{if(c)throw a}}return l}}(e,t)||function(e,t){if(!e)return;if("string"==typeof e)return j(e,t);var o=Object.prototype.toString.call(e).slice(8,-1);"Object"===o&&e.constructor&&(o=e.constructor.name);if("Map"===o||"Set"===o)return Array.from(e);if("Arguments"===o||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o))return j(e,t)}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function j(e,t){(null==t||t>e.length)&&(t=e.length);for(var o=0,n=new Array(t);o<t;o++)n[o]=e[o];return n}var A="all",N="currentPage",C="currentView",F="specify",D={OFFICE:{label:"OFFICE (*.pptx,*.docx,*.xlsx)",extension:"office"},PDF:{label:"PDF (*.pdf)",extension:"pdf"},IMAGE:{label:"PNG (*.png)",extension:"png"},OFFICE_EDITOR:{label:"Word Document (*.docx)",extension:"office"}},I=[".ppt",".xls"],P=function(){var e=Object(r.f)(),t=Object(r.d)(),o=Object(d.a)().t,f=L(Object(r.e)((function(e){return[i.a.isElementOpen(e,c.a.SAVE_MODAL),i.a.getActiveDocumentViewerKey(e)]})),2),w=f[0],_=f[1],j=[D.PDF,D.IMAGE],P=L(Object(n.useState)(j),2),T=P[0],R=P[1],G=L(Object(n.useState)(""),2),z=G[0],H=G[1],V=L(Object(n.useState)(T[0]),2),W=V[0],B=V[1],U=L(Object(n.useState)(A),2),q=U[0],J=U[1],K=L(Object(n.useState)(),2),Y=K[0],$=K[1],Q=L(Object(n.useState)(!0),2),X=Q[0],Z=Q[1],ee=L(Object(n.useState)(!1),2),te=ee[0],oe=ee[1],ne=L(Object(n.useState)(1),2),ae=ne[0],re=ne[1],ie=L(Object(n.useState)(""),2),le=ie[0],de=ie[1];Object(n.useEffect)((function(){var e=function(){var e,t=(e=O().mark((function e(){var t,o,n,a,r,i;return O().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!(t=m.a.getDocument(_))){e.next=18;break}if(B(D.PDF),R(j),o=t.getFilename(),n=o.substring(0,o.lastIndexOf("."))||o,H(n),(a=t.getType())!==x.a.OFFICE){e.next=16;break}return r=o.split("."),i=".".concat(r[r.length-1]),I.includes(i)||R([].concat(j,[D.OFFICE])),e.next=14,t.getDocumentCompletePromise();case 14:e.next=17;break;case 16:a===x.a.OFFICE_EDITOR&&(R([D.OFFICE_EDITOR,D.PDF]),B(D.OFFICE_EDITOR));case 17:re(m.a.getTotalPages(_));case 18:case"end":return e.stop()}}),e)})),function(){var t=this,o=arguments;return new Promise((function(n,a){var r=e.apply(t,o);function i(e){k(r,n,a,i,l,"next",e)}function l(e){k(r,n,a,i,l,"throw",e)}i(void 0)}))});return function(){return t.apply(this,arguments)}}(),o=function(){H(""),re(0),R(j),B(j[0]),t(l.a.closeElement(c.a.SAVE_MODAL))};return e(),m.a.addEventListener("documentUnloaded",o,void 0,_),m.a.addEventListener("documentLoaded",e,void 0,_),function(){m.a.removeEventListener("documentUnloaded",o,_),m.a.removeEventListener("documentLoaded",e,_)}}),[_]),Object(n.useEffect)((function(){var e=m.a.getDocument(_);if(Object(y.f)()&&e){B(D.OFFICE_EDITOR);var t=e.getFilename(),o=t.substring(0,t.lastIndexOf("."))||t;H(o)}}),[w]);var ce=function(){return t(l.a.closeElement(c.a.SAVE_MODAL))},pe=Object(M.a)(ce),ue=function(){return de("")},se=L(Object(n.useState)(!1),2),me=se[0],fe=se[1],he=(le||!me)&&q===F||!z,ve="office"===W.extension||Object(y.f)(),be=a.a.createElement("div",{className:h()("page-number-input-container",{error:!!le})},a.a.createElement("label",{className:"specifyPagesChoiceLabel"},a.a.createElement("span",null,o("option.print.specifyPages")),q===F&&a.a.createElement("span",{className:"specifyPagesExampleLabel"},"- ",o("option.thumbnailPanel.multiSelectPagesExample"))),q===F&&a.a.createElement(b.a,{selectedPageNumbers:Y,pageCount:ae,onBlurHandler:$,onSelectedPageNumbersChange:function(e){me||fe(!0),e.length>0&&ue()},onError:function(){return de(o("saveModal.pageError")+ae)},pageNumberError:le}));return a.a.createElement("div",{className:h()("SaveModal",{open:w,closed:!w}),"data-element":c.a.SAVE_MODAL},a.a.createElement(E.a,{isOpen:w,title:o("saveModal.saveAs"),closeHandler:ce,onCloseClick:ce,swipeToClose:!0},a.a.createElement("div",{className:"modal-body"},a.a.createElement("div",{className:"title"},o("saveModal.general")),a.a.createElement("div",{className:"input-container"},a.a.createElement("label",{htmlFor:"fileNameInput",className:"label"},o("saveModal.fileName")),a.a.createElement(u.a,{type:"text",id:"fileNameInput","data-testid":"fileNameInput",onChange:function(e){var t;H(null==e||null===(t=e.target)||void 0===t?void 0:t.value)},value:z,fillWidth:"false",padMessageText:!0,messageText:""===z?o("saveModal.fileNameCannotBeEmpty"):"",message:""===z?"warning":"default"})),a.a.createElement("div",{className:"input-container"},a.a.createElement("div",{className:"label",id:"file-type-dropdown-label"},o("saveModal.fileType")),a.a.createElement(v.a,{id:"fileTypeDropdown",labelledById:"file-type-dropdown-label",items:T.map((function(e){return e.label})),onClickItem:function(e){B(T.find((function(t){return t.label===e}))),e===D.OFFICE.label&&J(A)},currentSelectionKey:W.label})),!ve&&a.a.createElement(a.a.Fragment,null,a.a.createElement("div",{className:"title"},o("saveModal.pageRange")),a.a.createElement("form",{className:"radio-container",onChange:function(e){e.target.classList.contains("page-number-input")||(J(e.target.value),le&&(fe(!1),ue()))},onSubmit:function(e){return e.preventDefault()}},a.a.createElement("div",{className:"page-range-column"},a.a.createElement(s.a,{checked:q===A,radio:!0,name:"page-range-option",label:o("saveModal.all"),value:A}),a.a.createElement(s.a,{checked:q===N,radio:!0,name:"page-range-option",label:o("saveModal.currentPage"),value:N})),a.a.createElement("div",{className:"page-range-column custom-page-ranges"},a.a.createElement(s.a,{checked:q===F,radio:!0,name:"page-range-option",label:be,value:F}))),a.a.createElement("div",{className:"title"},o("saveModal.properties")),a.a.createElement("div",{className:"checkbox-container"},a.a.createElement(s.a,{checked:X,name:"include-annotation-option",label:o("saveModal.includeAnnotation"),onChange:function(){return Z(!X)}}),a.a.createElement(s.a,{checked:te,name:"include-comment-option",label:o("saveModal.includeComments"),onChange:function(){return oe(!te)}})))),a.a.createElement("div",{className:"footer"},a.a.createElement(p.a,{disabled:he,onClick:function(){var o;z&&(o=q===F?null!=Y&&Y.length?Y:[m.a.getCurrentPage(_)]:q===N||q===C?[m.a.getCurrentPage(_)]:S()(1,m.a.getTotalPages(_)+1,1),Object(g.a)(t,{includeAnnotations:X,includeComments:te,filename:z||"untitled",downloadType:W.extension,pages:o,store:e},_),pe())},label:o("saveModal.save")}))))};t.default=P}}]);
//# sourceMappingURL=70.chunk.js.map