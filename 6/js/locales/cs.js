/*!
  * Tempus Dominus v6.9.4 (https://getdatepicker.com/)
  * Copyright 2013-2024 Jonathan Peterson
  * Licensed under MIT (https://github.com/Eonasdan/tempus-dominus/blob/master/LICENSE)
  */
(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?f(exports):typeof define==='function'&&define.amd?define(['exports'],f):(g=typeof globalThis!=='undefined'?globalThis:g||self,f((g.tempusDominus=g.tempusDominus||{},g.tempusDominus.locales=g.tempusDominus.locales||{},g.tempusDominus.locales.cs={})));})(this,(function(exports){'use strict';const name = 'cs';
const localization = {
    today: 'Dnes',
    clear: 'Vymazat výběr',
    close: 'Zavřít výběrové okno',
    selectMonth: 'Vybrat měsíc',
    previousMonth: 'Předchozí měsíc',
    nextMonth: 'Následující měsíc',
    selectYear: 'Vybrat rok',
    previousYear: 'Předchozí rok',
    nextYear: 'Následující rok',
    selectDecade: 'Vybrat desetiletí',
    previousDecade: 'Předchozí desetiletí',
    nextDecade: 'Následující desetiletí',
    previousCentury: 'Předchozí století',
    nextCentury: 'Následující století',
    pickHour: 'Vybrat hodinu',
    incrementHour: 'Zvýšit hodinu',
    decrementHour: 'Snížit hodinu',
    pickMinute: 'Vybrat minutu',
    incrementMinute: 'Zvýšit minutu',
    decrementMinute: 'Snížit minutu',
    pickSecond: 'Vybrat sekundu',
    incrementSecond: 'Zvýšit sekundu',
    decrementSecond: 'Snížit sekundu',
    toggleMeridiem: 'Přepnout ráno / odpoledne',
    selectTime: 'Vybrat čas',
    selectDate: 'Vybrat datum',
    dayViewHeaderFormat: { month: 'long', year: '2-digit' },
    locale: 'cs',
    startOfTheWeek: 1,
    dateFormats: {
        LTS: 'HH:mm:ss',
        LT: 'HH:mm',
        L: 'dd.MM.yyyy',
        LL: 'd. MMMM yyyy',
        LLL: 'd. MMMM yyyy HH:mm',
        LLLL: 'dddd, d. MMMM yyyy HH:mm',
    },
    ordinal: (n) => `${n}.`,
    format: 'L LT',
};exports.localization=localization;exports.name=name;Object.defineProperty(exports,'__esModule',{value:true});}));