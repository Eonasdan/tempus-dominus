/*!
  * Tempus Dominus v6.9.4 (https://getdatepicker.com/)
  * Copyright 2013-2023 Jonathan Peterson
  * Licensed under MIT (https://github.com/Eonasdan/tempus-dominus/blob/master/LICENSE)
  */
(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?f(exports):typeof define==='function'&&define.amd?define(['exports'],f):(g=typeof globalThis!=='undefined'?globalThis:g||self,f((g.tempusDominus=g.tempusDominus||{},g.tempusDominus.locales=g.tempusDominus.locales||{},g.tempusDominus.locales.hr={})));})(this,(function(exports){'use strict';const name = 'hr';
const localization = {
    today: 'Danas',
    clear: 'Poništi odabir',
    close: 'Zatvori',
    selectMonth: 'Odaberi mjesec',
    previousMonth: 'Prethodni mjesec',
    nextMonth: 'Sljedeći mjesec',
    selectYear: 'Odaberi godinu',
    previousYear: 'Prethodna godina',
    nextYear: 'Sljedeće godina',
    selectDecade: 'Odaberi desetljeće',
    previousDecade: 'Prethodno desetljeće',
    nextDecade: 'Sljedeće desetljeće',
    previousCentury: 'Prethodno stoljeće',
    nextCentury: 'Sljedeće stoljeće',
    pickHour: 'Odaberi vrijeme',
    incrementHour: 'Povećaj vrijeme',
    decrementHour: 'Smanji vrijeme',
    pickMinute: 'Odaberi minutu',
    incrementMinute: 'Povećaj minute',
    decrementMinute: 'Smanji minute',
    pickSecond: 'Odaberi sekundu',
    incrementSecond: 'Povećaj sekunde',
    decrementSecond: 'Smanji sekunde',
    toggleMeridiem: 'Razmijeni AM-PM',
    selectTime: 'Odaberi vrijeme',
    selectDate: 'Odaberi datum',
    dayViewHeaderFormat: { month: 'long', year: '2-digit' },
    locale: 'hr',
    startOfTheWeek: 1,
    dateFormats: {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L: 'dd/MM/yyyy',
        LL: 'd MMMM yyyy',
        LLL: 'd MMMM yyyy HH:mm',
        LLLL: 'dddd d MMMM yyyy HH:mm',
    },
    ordinal: (n) => `${n}.`,
    format: 'L LT',
};exports.localization=localization;exports.name=name;Object.defineProperty(exports,'__esModule',{value:true});}));