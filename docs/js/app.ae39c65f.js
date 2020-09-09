(function(e){function t(t){for(var n,s,i=t[0],u=t[1],c=t[2],p=0,d=[];p<i.length;p++)s=i[p],Object.prototype.hasOwnProperty.call(a,s)&&a[s]&&d.push(a[s][0]),a[s]=0;for(n in u)Object.prototype.hasOwnProperty.call(u,n)&&(e[n]=u[n]);l&&l(t);while(d.length)d.shift()();return o.push.apply(o,c||[]),r()}function r(){for(var e,t=0;t<o.length;t++){for(var r=o[t],n=!0,i=1;i<r.length;i++){var u=r[i];0!==a[u]&&(n=!1)}n&&(o.splice(t--,1),e=s(s.s=r[0]))}return e}var n={},a={app:0},o=[];function s(t){if(n[t])return n[t].exports;var r=n[t]={i:t,l:!1,exports:{}};return e[t].call(r.exports,r,r.exports,s),r.l=!0,r.exports}s.m=e,s.c=n,s.d=function(e,t,r){s.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},s.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.t=function(e,t){if(1&t&&(e=s(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(s.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)s.d(r,n,function(t){return e[t]}.bind(null,n));return r},s.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="/kahzum-route-organizer/";var i=window["webpackJsonp"]=window["webpackJsonp"]||[],u=i.push.bind(i);i.push=t,i=i.slice();for(var c=0;c<i.length;c++)t(i[c]);var l=u;o.push([0,"chunk-vendors"]),r()})({0:function(e,t,r){e.exports=r("cd49")},"5c0b":function(e,t,r){"use strict";var n=r("9c0c"),a=r.n(n);a.a},"9c0c":function(e,t,r){},cd49:function(e,t,r){"use strict";r.r(t);r("e260"),r("e6cf"),r("cca6"),r("a79d");var n,a,o=r("2b0e"),s=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{attrs:{id:"app"}},[r("simple-modal",{model:{value:e.showModal,callback:function(t){e.showModal=t},expression:"showModal"}},[r("template",{slot:"body"},[r("a",{attrs:{target:"_blank",href:e.mapsURL}},[e._v("Link To Google Maps route from your location to your destinations")])])],2),r("simple-modal",{model:{value:e.isOptionRight,callback:function(t){e.isOptionRight=t},expression:"isOptionRight"}},[r("template",{slot:"body"},[r("p",[e._v("Please click on the right address.")]),e._l(e.addressOption,(function(t,n){return r("FormulateInput",{key:n+"-address-for-modal",attrs:{type:"button",label:t},on:{click:function(r){return e.handlePromise("resolve",t)}}})})),r("FormulateInput",{attrs:{type:"button",label:"None are right."},on:{click:function(t){return e.handlePromise("reject")}}})],2)],2),r("h1",[e._v("Kahzum Route Organizer")]),r("h2",[e._v("Your API Key")]),e._m(0),r("FormulateInput",{attrs:{type:"text",name:"api-key",validation:"required","validation-messages":{required:"You must enter an API key."},label:"Please enter your API key."},model:{value:e.apiKey,callback:function(t){e.apiKey=t},expression:"apiKey"}}),e.locationSuccess?e._e():r("h2",[e._v("Your Location")]),e.locationSuccess?e._e():r("p",[e._v(" Please enter your location, or allow us to get it automatically via gps. ")]),e.locationSuccess?e._e():r("div",{staticClass:"location-form"},[r("FormulateInput",{attrs:{type:"button",name:"location",label:"Get My Location"},on:{click:function(t){return e.getLocationStatus()}}}),r("p",[e._v("OR")]),r("FormulateInput",{attrs:{label:"Address of your location"},model:{value:e.userLocation,callback:function(t){e.userLocation=t},expression:"userLocation"}}),"string"==typeof e.userLocation&&""!==e.userLocation?r("FormulateInput",{attrs:{label:"Validate Location Address",type:"button"},on:{click:e.validateUserLocation}}):e._e()],1),e.locationError?r("div",{staticClass:"locationError"},[e._v(" Couldn't get your location. It is probably blocked by your browser or the address you entered couldn't be found. Please enter it into the textbox below or try being more specific. ")]):e._e(),e.locationSuccess?r("h2",[e._v("Success! Got your coordinates!")]):e._e(),r("h2",[e._v("Add Locations")]),e._l(e.addresses,(function(t,n){return r("div",{key:"address-"+n,staticClass:"address"},[r("h2",[e._v("Location "+e._s(n+1))]),r("FormulateInput",{attrs:{type:"file",name:"address",uploader:function(t,r,a,o){e.readFile(t,r,a,o,n)},label:"Add From Shipping label"}}),r("FormulateInput",{attrs:{type:"text",label:"Enter Address Manually"},model:{value:e.addresses[n],callback:function(t){e.$set(e.addresses,n,t)},expression:"addresses[index]"}}),e.addressErrors[n]?r("div",{staticClass:"error-message"},[e._v(" Please try making this address more specific. ")]):e._e()],1)})),r("br"),r("FormulateInput",{attrs:{type:"button",label:"Add another location"},on:{click:function(t){return e.newLocation()}}}),r("br"),""!==e.apiKey?r("FormulateInput",{attrs:{type:"submit",label:"Validate Addresses"},on:{click:function(t){return e.validate()}}}):e._e(),e.noLocation||e.locationError?r("div",{staticClass:"need-location"},[e._v(" You must select your location before you are allowed to route ")]):e._e(),e.noLocation||e.locationError?e._e():r("FormulateInput",{attrs:{type:"submit",label:"Get Routes"},on:{click:function(t){return e.runRouting()}}}),r("br")],2)},i=[function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("p",[e._v(" API key can be found at "),r("a",{attrs:{href:"https://openrouteservice.org/dev/#/home",target:"_blank"}},[e._v("openrouteservice")])])}],u=(r("4de4"),r("4160"),r("caad"),r("c975"),r("d81d"),r("fb6a"),r("d3b7"),r("ac1f"),r("2532"),r("3ca3"),r("466d"),r("1276"),r("159b"),r("ddb0"),r("b85c")),c=r("2909"),l=(r("96cf"),r("1da1")),p=r("d4ec"),d=r("bee2"),h=r("262e"),f=r("2caf"),g=r("9ab4"),y=r("60a3"),b=(r("baa5"),r("5904"),r("5904"));function m(e){return v.apply(this,arguments)}function v(){return v=Object(l["a"])(regeneratorRuntime.mark((function e(t){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:console.log("registering api key!"),new b.Directions({api_key:t}),n=new b.Geocode({api_key:t}),a=new b.Matrix({api_key:t}),console.log("API key has successfully been applied");case 5:case"end":return e.stop()}}),e)}))),v.apply(this,arguments)}function w(e){return x.apply(this,arguments)}function x(){return x=Object(l["a"])(regeneratorRuntime.mark((function e(t){var r,a,o,s;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:console.log("to coordinates"),r=[],a=0;case 3:if(!(a<t.addresses.length)){e.next=13;break}return console.log("starting, i="+a),e.next=7,n.geocode({text:t.addresses[a],boundary_circle:{lat_lng:[36.967259,-122.035505],radius:80},boundary_country:["US"]});case 7:o=e.sent;try{console.log("response",o.features[0].geometry.coordinates),r.push(o.features[0].geometry.coordinates)}catch(i){s="An error occured: "+i,console.log(s)}console.log("finished, i="+a);case 10:++a,e.next=3;break;case 13:return e.abrupt("return",r);case 14:case"end":return e.stop()}}),e)}))),x.apply(this,arguments)}function k(e){return O.apply(this,arguments)}function O(){return O=Object(l["a"])(regeneratorRuntime.mark((function e(t){var r,n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return console.log("hopefully this is an array of arrays",t),e.next=3,a.calculate({locations:t,profile:"driving-car",sources:[0],destinations:["all"]});case 3:return r=e.sent,e.prev=4,console.log("response matrix:",r),e.abrupt("return",r);case 9:return e.prev=9,e.t0=e["catch"](4),n="An error occured: "+e.t0,console.log(n),e.abrupt("return",null);case 14:case"end":return e.stop()}}),e,null,[[4,9]])}))),O.apply(this,arguments)}function _(e){return R.apply(this,arguments)}function R(){return R=Object(l["a"])(regeneratorRuntime.mark((function e(t){var r,n,a,o,s;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:for(r=Object(c["a"])(t.destinations),n=Object(c["a"])(t.durations[0]),console.log("the initial dest, duration",r,n),a=[],o=0;o<r.length;o++)a.push({duration:n[o],destination:r[o]});for(console.log("pre sort, matrix objects",a),a.sort((function(e,t){return e.duration<t.duration?-1:e.duration==t.duration?0:1})),console.log("post sort, matrix objects",a),s=0;s<a.length;s++)r[s]=a[s].destination,n[s]=a[s].duration;return console.log("the final (sorted by duration) dest, duration",r,n),e.abrupt("return",a);case 11:case"end":return e.stop()}}),e)}))),R.apply(this,arguments)}function j(e){return L.apply(this,arguments)}function L(){return L=Object(l["a"])(regeneratorRuntime.mark((function e(t){var r,n,a,o,s,i;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:for(r="https://www.google.com/maps/dir/?api=1",n="origin="+t[0].destination.location[1]+"%2C"+t[0].destination.location[0],a="waypoints=",o=1;o<t.length-1;++o)a+=t[o].destination.location[1]+"%2C"+t[o].destination.location[0]+"%7C";return a=a.slice(0,a.lastIndexOf("%7C")),s="destination="+t[t.length-1].destination.location[1]+"%2C"+t[t.length-1].destination.location[0],i=r+"&"+n+"&"+a+"&"+s+"&dir_action=navigate",e.abrupt("return",i);case 8:case"end":return e.stop()}}),e)}))),L.apply(this,arguments)}function A(e,t){return P.apply(this,arguments)}function P(){return P=Object(l["a"])(regeneratorRuntime.mark((function e(t,r){var n,a,o;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return n=new b.Geocode({api_key:r}),e.next=3,n.geocode({text:t,boundary_circle:{lat_lng:[36.967259,-122.035505],radius:80},boundary_country:["US"]});case 3:return a=e.sent,e.prev=4,console.log("response",a.features[0].geometry.coordinates),e.abrupt("return",a.features[0].geometry.coordinates);case 9:return e.prev=9,e.t0=e["catch"](4),o="An error occured: "+e.t0,console.log(o),e.abrupt("return",null);case 14:case"end":return e.stop()}}),e,null,[[4,9]])}))),P.apply(this,arguments)}function S(e,t){return I.apply(this,arguments)}function I(){return I=Object(l["a"])(regeneratorRuntime.mark((function e(t,r){var n,a,o;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return n=new b.Geocode({api_key:r}),e.next=3,n.geocode({text:t,boundary_country:["USA"],boundary_circle:{lat_lng:[36.967259,-122.035505],radius:80}});case 3:return a=e.sent,console.log("the result",a),o=a.features.map((function(e){return e.properties.label})),e.abrupt("return",o);case 7:case"end":return e.stop()}}),e)}))),I.apply(this,arguments)}function E(e){return C.apply(this,arguments)}function C(){return C=Object(l["a"])(regeneratorRuntime.mark((function e(t){var r,n,a,o,s;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return r={"api-key":"5b3ce3597851110001cf6248dac90b49937d49c0a21afb76244b3647",addresses:["300 Main Street, Santa Cruz, CA","Home/Work Soquel","True Olive Connection, Santa Cruz"],currentLocation:[-121.044992,39.0135808]},console.log("worth noting that the first should match the second: ",t,r),e.next=4,m(t["api-key"]);case 4:return e.next=6,w(t);case 6:return n=e.sent,n.unshift(t.currentLocation),e.next=10,k(n);case 10:return a=e.sent,e.next=13,_(a);case 13:return o=e.sent,e.next=16,j(o);case 16:return s=e.sent,e.abrupt("return",s);case 18:case"end":return e.stop()}}),e)}))),C.apply(this,arguments)}var K=r("2976"),M=r.n(K),F=r("c9bf"),z=r.n(F),U=function(e){Object(h["a"])(r,e);var t=Object(f["a"])(r);function r(){var e;return Object(p["a"])(this,r),e=t.apply(this,arguments),e.mapsURL="",e.apiKey=e.getAPIKey(),e.numAddresses=1,e.userLocation=[],e.showModal=!1,e.addresses=[""],e.addressPrevVal=[""],e.addressErrors=[!1],e.locationError=!1,e.locationSuccess=!1,e.isOptionRight=!1,e.addressOption=null,e.promise={resolve:null,reject:null},e.toBase64=function(e){return new Promise((function(t,r){var n=new FileReader;n.readAsDataURL(e),n.onload=function(){return t(n.result)},n.onerror=function(e){return r(e)}}))},e}return Object(d["a"])(r,[{key:"newLocation",value:function(){this.addressPrevVal.push(""),this.addresses.push(""),this.addressErrors.push(!1),this.numAddresses++}},{key:"handlePromise",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;"resolve"==e?this.promise.resolve(t):this.promise.reject()}},{key:"validateUserLocation",value:function(){var e=Object(l["a"])(regeneratorRuntime.mark((function e(){var t=this;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,S(this.userLocation,this.apiKey);case 2:return this.addressOption=e.sent,this.isOptionRight=!0,e.next=6,new Promise((function(e,r){t.promise["resolve"]=e,t.promise["reject"]=r})).then((function(e){t.locationError=!1,t.userLocation=e,t.isOptionRight=!1}),(function(){t.locationError=!0,t.isOptionRight=!1}));case 6:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}()},{key:"validate",value:function(){var e=Object(l["a"])(regeneratorRuntime.mark((function e(){var t,r,n=this;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:t=regeneratorRuntime.mark((function e(t){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,S(n.addresses[t],n.apiKey);case 2:return n.addressOption=e.sent,n.isOptionRight=!0,e.next=6,new Promise((function(e,t){n.promise["resolve"]=e,n.promise["reject"]=t})).then((function(e){n.$set(n.addresses,t,e),n.isOptionRight=!1}),(function(){n.$set(n.addressErrors,t,!0),n.isOptionRight=!1}));case 6:case"end":return e.stop()}}),e)})),r=0;case 2:if(!(r<this.addresses.length)){e.next=7;break}return e.delegateYield(t(r),"t0",4);case 4:++r,e.next=2;break;case 7:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}()},{key:"updateApiKey",value:function(){localStorage.setItem("apiKey",this.apiKey)}},{key:"addressUpdate",value:function(){var e=this,t=this.addresses.map((function(t){return!e.addressPrevVal.includes(t)}));t.forEach((function(t,r){e.addressErrors[r]=!t&&e.addressErrors[r]})),this.addressPrevVal=Object(c["a"])(this.addresses)}},{key:"getAPIKey",value:function(){var e=localStorage.getItem("apiKey");return e||""}},{key:"updateAddresses",value:function(e,t){this.$set(this.addresses,t,e),this.$set(this.addressPrevVal,t,e)}},{key:"readShipping",value:function(){var e=Object(l["a"])(regeneratorRuntime.mark((function e(t){var r,n,a,o,s,i,c,l,p,d,h,f,g,y;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:r=t.split("\n"),n=-1,r.forEach((function(e){n++;var t=0,a=e.split(" ");a.forEach((function(a){var o,s=Object(u["a"])(a);try{for(s.s();!(o=s.n()).done;){var i=o.value;if(i.match(/^[A-Za-z]/)||i.match(/^[0-9]/)){t+=a.length+1;break}var c=e.slice(0,t)+e.slice(0,t+a.length+1);r[n]=c}}catch(l){s.e(l)}finally{s.f()}}))})),r=r.filter((function(e){return""!==e&&""!==e})),n=-1,a=[],o=Object(u["a"])(r);try{for(o.s();!(s=o.n()).done;)i=s.value,n+=1,c=/\d+[ ]([a-z]\.\s)?([a-z](\s)?)+\w\.?/i,l=/(\w[ ]?)+[ CA ]\b\d{5}(?:-\d{4})?\b/i,i.match(c)?(p=i.toLowerCase().indexOf("to: "),d=i.toLowerCase().indexOf("to "),p>=0?(h=i.slice(p+"to: ".length),a.push({type:"street",line:h})):d>=0&&(f=i.slice(d+"to ".length),a.push({type:"street",line:f}))):i.match(l)&&a.push({type:"cityZip",line:i})}catch(b){o.e(b)}finally{o.f()}for(g={street:"",cityZip:""},y=a.length-1;y>=0;--y)""==g[a[y].type]&&(g[a[y].type]=a[y].line);return e.abrupt("return",[g.street,g.cityZip]);case 11:case"end":return e.stop()}}),e)})));function t(t){return e.apply(this,arguments)}return t}()},{key:"readFile",value:function(){var e=Object(l["a"])(regeneratorRuntime.mark((function e(t,r,n,a,o){var s,i,u,c,l,p;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return s=["",""],e.next=3,z.a.recognize(t,"eng",{logger:function(e){"recognizing text"==e.status&&(console.log(e),r(Math.floor(100*e.progress)/2))}});case 3:return i=e.sent,u=i.data.text,e.next=7,this.readShipping(u);case 7:if(s=e.sent,!s.includes("")){e.next=22;break}return e.next=11,this.toBase64(t);case 11:return c=e.sent,e.next=14,this.rotate180(c);case 14:return l=e.sent,e.next=17,z.a.recognize(l,"eng",{logger:function(e){"recognizing text"==e.status&&(console.log(e),r(50+Math.floor(100*e.progress)/2))}});case 17:return i=e.sent,u=i.data.text,e.next=21,this.readShipping(u);case 21:s=e.sent;case 22:r(100),s.includes("")?n("Couldn't read the shipping label. Please try entering it manually."):(p=s[0]+", "+s[1],this.updateAddresses(p,o));case 24:case"end":return e.stop()}}),e,this)})));function t(t,r,n,a,o){return e.apply(this,arguments)}return t}()},{key:"rotate180",value:function(){var e=Object(l["a"])(regeneratorRuntime.mark((function e(t){var r,n,a;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return r=new Image,r.src=t,e.next=4,r.onload;case 4:return n=document.createElement("canvas"),n.width=r.height,n.height=r.width,n.style.position="absolute",a=n.getContext("2d"),a.translate(r.width/2,r.height/2),a.rotate(Math.PI),a.drawImage(r,-r.width/2,-r.height/2),e.abrupt("return",n.toDataURL());case 13:case"end":return e.stop()}}),e)})));function t(t){return e.apply(this,arguments)}return t}()},{key:"getLocationStatus",value:function(){var e=Object(l["a"])(regeneratorRuntime.mark((function e(){var t;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return this.locationError=!1,e.next=3,this.$getLocation({enableHighAccuracy:!0});case 3:t=e.sent;try{this.locationSuccess=!0,this.userLocation.push(t.lng),this.userLocation.push(t.lat)}catch(r){console.log("an error occured:",r),this.locationError=!0}case 5:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}()},{key:"buildData",value:function(){var e=Object(l["a"])(regeneratorRuntime.mark((function e(){var t;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(t=void 0,Array.isArray(this.userLocation)){e.next=7;break}return e.next=4,A(this.userLocation,this.apiKey);case 4:if(t=e.sent,null!=t){e.next=7;break}return e.abrupt("return",null);case 7:return e.abrupt("return",{"api-key":this.apiKey,addresses:this.addresses,currentLocation:t||Object(c["a"])(this.userLocation)});case 8:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}()},{key:"runRouting",value:function(){var e=Object(l["a"])(regeneratorRuntime.mark((function e(){var t;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,this.buildData();case 2:if(t=e.sent,null===t){e.next=10;break}return e.next=6,E(t);case 6:this.mapsURL=e.sent,this.showModal=!0,e.next=11;break;case 10:this.locationError=!0;case 11:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}()},{key:"noLocation",get:function(){return!!("string"==typeof this.userLocation&&""==this.userLocation||Array.isArray(this.userLocation)&&0==this.userLocation.length)}}]),r}(y["b"]);Object(g["a"])([Object(y["c"])("apiKey")],U.prototype,"updateApiKey",null),Object(g["a"])([Object(y["c"])("addresses")],U.prototype,"addressUpdate",null),U=Object(g["a"])([Object(y["a"])({components:{SimpleModal:M.a}})],U);var $=U,G=$,V=(r("5c0b"),r("2877")),D=Object(V["a"])(G,s,i,!1,null,null,null),T=D.exports,Y=r("d644"),Z=r("ebfd"),q=r.n(Z),B=r("0126"),H=r.n(B);o["a"].use(Y["default"],{plugins:[H()({features:{formEvents:!0}})]}),o["a"].use(q.a),o["a"].config.productionTip=!1,o["a"].config.devtools=!0,new o["a"]({render:function(e){return e(T)}}).$mount("#app")}});
//# sourceMappingURL=app.ae39c65f.js.map