/*!
  * Tempus Dominus v6.0.0-beta7 (https://getdatepicker.com/)
  * Copyright 2013-2022 Jonathan Peterson
  * Licensed under MIT (https://github.com/Eonasdan/tempus-dominus/blob/master/LICENSE)
  */
(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?f(exports):typeof define==='function'&&define.amd?define(['exports'],f):(g=typeof globalThis!=='undefined'?globalThis:g||self,f((g.tempusDominus=g.tempusDominus||{},g.tempusDominus.plugins=g.tempusDominus.plugins||{},g.tempusDominus.plugins.sample={})));})(this,(function(exports){'use strict';// noinspection JSUnusedGlobalSymbols
const load = (option, tdClasses, tdFactory) => {
    // extend the picker
    // e.g. add new tempusDominus.TempusDominus(...).someFunction()
    tdClasses.TempusDominus.prototype.someFunction = (a, logger) => {
        logger = logger || console.log;
        logger(a);
    };
    // extend tempusDominus
    // e.g. add tempusDominus.example()
    tdFactory.example = (a, logger) => {
        logger = logger || console.log;
        logger(a);
    };
    // overriding existing API
    // e.g. extend new tempusDominus.TempusDominus(...).show()
    const oldShow = tdClasses.TempusDominus.prototype.show;
    tdClasses.TempusDominus.prototype.show = function (a, logger) {
        logger = logger || console.log;
        alert('from plugin');
        logger(a);
        oldShow.bind(this)();
        // return modified result
    };
};exports.load=load;Object.defineProperty(exports,'__esModule',{value:true});}));