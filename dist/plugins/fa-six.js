/*!
  * Tempus Dominus v6.0.0-beta4 (https://getdatepicker.com/)
  * Copyright 2013-2022 Jonathan Peterson
  * Licensed under MIT (https://github.com/Eonasdan/tempus-dominus/blob/master/LICENSE)
  */
(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?f(exports):typeof define==='function'&&define.amd?define(['exports'],f):(g=typeof globalThis!=='undefined'?globalThis:g||self,f((g.tempusDominus=g.tempusDominus||{},g.tempusDominus.plugins=g.tempusDominus.plugins||{},g.tempusDominus.plugins.fa_six={})));})(this,(function(exports){'use strict';// this obviously requires the FA 6 libraries to be loaded
const faSixIcons = {
    type: 'icons',
    time: 'fa-solid fa-clock',
    date: 'fa-solid fa-calendar',
    up: 'fa-solid fa-arrow-up',
    down: 'fa-solid fa-arrow-down',
    previous: 'fa-solid fa-chevron-left',
    next: 'fa-solid fa-chevron-right',
    today: 'fa-solid fa-calendar-check',
    clear: 'fa-solid fa-trash',
    close: 'fa-solid fa-xmark'
};
// noinspection JSUnusedGlobalSymbols
const load = (_, __, tdFactory) => {
    tdFactory.DefaultOptions.display.icons = faSixIcons;
};exports.faSixIcons=faSixIcons;exports.load=load;Object.defineProperty(exports,'__esModule',{value:true});}));