/*!
  * Tempus Dominus v6.9.4 (https://getdatepicker.com/)
  * Copyright 2013-2024 Jonathan Peterson
  * Licensed under MIT (https://github.com/Eonasdan/tempus-dominus/blob/master/LICENSE)
  */
(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?f(exports):typeof define==='function'&&define.amd?define(['exports'],f):(g=typeof globalThis!=='undefined'?globalThis:g||self,f((g.tempusDominus=g.tempusDominus||{},g.tempusDominus.locales=g.tempusDominus.locales||{},g.tempusDominus.locales.sr={})));})(this,(function(exports){'use strict';const name = 'sr';
const localization = {
    today: 'Данас',
    clear: 'Избриши избор',
    close: 'Затвори',
    selectMonth: 'Изабери месец',
    previousMonth: 'Претходни месец',
    nextMonth: 'Следећи месец',
    selectYear: 'Изабери годину',
    previousYear: 'Претходна година',
    nextYear: 'Следећа година',
    selectDecade: 'Изабери декаду',
    previousDecade: 'Претходна декада',
    nextDecade: 'Следећа декада',
    previousCentury: 'Претходни век',
    nextCentury: 'Следећи век',
    pickHour: 'Изабери време',
    incrementHour: 'Повећај време',
    decrementHour: 'Смањи време',
    pickMinute: 'Изабери минуте',
    incrementMinute: 'Повећај минуте',
    decrementMinute: 'Смањи минуте',
    pickSecond: 'Изабери секунде',
    incrementSecond: 'Повећај секунде',
    decrementSecond: 'Смањи секунде',
    toggleMeridiem: 'Размени AM-PM',
    selectTime: 'Изабери време',
    selectDate: 'Изабери датум',
    dayViewHeaderFormat: { month: 'long', year: '2-digit' },
    locale: 'sr',
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