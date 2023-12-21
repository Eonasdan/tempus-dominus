/*!
  * Tempus Dominus v6.9.4 (https://getdatepicker.com/)
  * Copyright 2013-2023 Jonathan Peterson
  * Licensed under MIT (https://github.com/Eonasdan/tempus-dominus/blob/master/LICENSE)
  */
(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?f(exports):typeof define==='function'&&define.amd?define(['exports'],f):(g=typeof globalThis!=='undefined'?globalThis:g||self,f((g.tempusDominus=g.tempusDominus||{},g.tempusDominus.locales=g.tempusDominus.locales||{},g.tempusDominus.locales.sr_Latn={})));})(this,(function(exports){'use strict';const name = 'sr-Latn';
const localization = {
    today: 'Danas',
    clear: 'Izbriši izbor',
    close: 'Zatvori',
    selectMonth: 'Izaberi mesec',
    previousMonth: 'Prethodni mesec',
    nextMonth: 'Sledeći mesec',
    selectYear: 'Izaberi godinu',
    previousYear: 'Prethodna godina',
    nextYear: 'Sledeća godina',
    selectDecade: 'Izaberi dekadu',
    previousDecade: 'Prethodna dekada',
    nextDecade: 'Sledeća dekada',
    previousCentury: 'Prethodni vek',
    nextCentury: 'Sledeći vek',
    pickHour: 'Izaberi vreme',
    incrementHour: 'Povećaj vreme',
    decrementHour: 'Smanji vreme',
    pickMinute: 'Izaberi minute',
    incrementMinute: 'Povećaj minute',
    decrementMinute: 'Smanji minute',
    pickSecond: 'Izaberi sekunde',
    incrementSecond: 'Povećaj sekunde',
    decrementSecond: 'Smanji sekunde',
    toggleMeridiem: 'Razmeni AM-PM',
    selectTime: 'Izaberi vreme',
    selectDate: 'Izaberi datum',
    dayViewHeaderFormat: { month: 'long', year: '2-digit' },
    locale: 'sr-Latn',
    startOfTheWeek: 1,
    dateFormats: {
        LT: 'H:mm',
        LTS: 'H:mm:ss',
        L: 'D. M. YYYY.',
        LL: 'D. MMMM YYYY.',
        LLL: 'D. MMMM YYYY. H:mm',
        LLLL: 'dddd, D. MMMM YYYY. H:mm',
    },
    ordinal: (n) => `${n}.`,
    format: 'L LT',
};exports.localization=localization;exports.name=name;Object.defineProperty(exports,'__esModule',{value:true});}));