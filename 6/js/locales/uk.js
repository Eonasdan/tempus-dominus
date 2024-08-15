/*!
  * Tempus Dominus v6.9.4 (https://getdatepicker.com/)
  * Copyright 2013-2024 Jonathan Peterson
  * Licensed under MIT (https://github.com/Eonasdan/tempus-dominus/blob/master/LICENSE)
  */
(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?f(exports):typeof define==='function'&&define.amd?define(['exports'],f):(g=typeof globalThis!=='undefined'?globalThis:g||self,f((g.tempusDominus=g.tempusDominus||{},g.tempusDominus.locales=g.tempusDominus.locales||{},g.tempusDominus.locales.uk={})));})(this,(function(exports){'use strict';const name = 'uk';
const localization = {
    today: 'Сьогодні',
    clear: 'Очистити',
    close: 'Закрити',
    selectMonth: 'Обрати місяць',
    previousMonth: 'Попередній місяць',
    nextMonth: 'У наступному місяці',
    selectYear: 'Обрати рік',
    previousYear: 'Попередній рік',
    nextYear: 'У наступному році',
    selectDecade: 'Обрати десятиліття',
    previousDecade: 'Попереднє десятиліття',
    nextDecade: 'Наступне десятиліття',
    previousCentury: 'Попереднє століття',
    nextCentury: 'Наступне століття',
    pickHour: 'Оберіть годину',
    incrementHour: 'Час збільшення',
    decrementHour: 'Зменшити годину',
    pickMinute: 'Обрати хвилину',
    incrementMinute: 'Хвилина приросту',
    decrementMinute: 'Зменшити хвилину',
    pickSecond: 'Обрати другий',
    incrementSecond: 'Збільшення секунди',
    decrementSecond: 'Зменшення секунди',
    toggleMeridiem: 'Переключити період',
    selectTime: 'Обрати час',
    selectDate: 'Обрати дату',
    dayViewHeaderFormat: { month: 'long', year: 'numeric' },
    locale: 'uk',
    startOfTheWeek: 1,
    dateFormats: {
        LT: 'H:mm',
        LTS: 'H:mm:ss',
        L: 'dd.MM.yyyy',
        LL: 'd MMMM yyyy р.',
        LLL: 'd MMMM yyyy р., H:mm',
        LLLL: 'dddd, d MMMM yyyy р., H:mm',
    },
    ordinal: (n) => n,
    format: 'L LT',
};exports.localization=localization;exports.name=name;Object.defineProperty(exports,'__esModule',{value:true});}));