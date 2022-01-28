/*!
  * Tempus Dominus v6.0.0-beta3 (https://getdatepicker.com/)
  * Copyright 2013-2022 Jonathan Peterson
  * Licensed under MIT (https://github.com/Eonasdan/tempus-dominus/blob/master/LICENSE)
  */
(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?module.exports=f():typeof define==='function'&&define.amd?define(f):(g=typeof globalThis!=='undefined'?globalThis:g||self,(g.tempusDominus=g.tempusDominus||{},g.tempusDominus.plugins=g.tempusDominus.plugins||{},g.tempusDominus.plugins.sample=f()));})(this,(function(){'use strict';var sample = (option, tdClass, tdFactory) => {
    // extend the picker
    // e.g. add new tempusDominus.TempusDominus(...).someFunction()
    tdClass.prototype.someFunction = (a, logger) => {
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
    const oldShow = tdClass.prototype.show;
    tdClass.prototype.show = function (a, logger) {
        logger = logger || console.log;
        alert('from plugin');
        logger(a);
        oldShow.bind(this)();
        // return modified result
    };
};return sample;}));