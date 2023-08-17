/*!
  * Tempus Dominus v6.7.13 (https://getdatepicker.com/)
  * Copyright 2013-2023 Jonathan Peterson
  * Licensed under MIT (https://github.com/Eonasdan/tempus-dominus/blob/master/LICENSE)
  */
(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?module.exports=f():typeof define==='function'&&define.amd?define(f):(g=typeof globalThis!=='undefined'?globalThis:g||self,(g.tempusDominus=g.tempusDominus||{},g.tempusDominus.plugins=g.tempusDominus.plugins||{},g.tempusDominus.plugins.custom_paint_job=f()));})(this,(function(){'use strict';/* eslint-disable */
// noinspection JSUnusedGlobalSymbols
var customPaintJob = (option, tdClasses, tdFactory) => {
    // noinspection JSUnusedLocalSymbols
    tdClasses.Display.prototype.paint = (unit, date, classes, element) => {
        if (unit === tdFactory.Unit.date) {
            if (date.isSame(new tdFactory.DateTime(), unit)) {
                classes.push('special-day');
            }
        }
    };
};return customPaintJob;}));