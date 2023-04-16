/*!
  * Tempus Dominus v6.4.4 (https://getdatepicker.com/)
  * Copyright 2013-2023 Jonathan Peterson
  * Licensed under MIT (https://github.com/Eonasdan/tempus-dominus/blob/master/LICENSE)
  */
(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?f(exports):typeof define==='function'&&define.amd?define(['exports'],f):(g=typeof globalThis!=='undefined'?globalThis:g||self,f((g.tempusDominus=g.tempusDominus||{},g.tempusDominus.locales=g.tempusDominus.locales||{},g.tempusDominus.locales.nl={})));})(this,(function(exports){'use strict';const name = 'fa';
const localization = {
    today: 'امروز',
    clear: 'پاک کردن',
    close: 'بستن',
    selectMonth: 'گزینش ماه',
    previousMonth: 'ماه پیشین',
    nextMonth: 'ماه پسین',
    selectYear: 'گزینش سال',
    previousYear: 'سال پیش',
    nextYear: 'سال پسین',
    selectDecade: 'گزینش دهه',
    previousDecade: 'دهه پیشین',
    nextDecade: 'دهه پسین',
    previousCentury: 'سده پیشین',
    nextCentury: 'سده پسین',
    pickHour: 'گزینش ساعت',
    incrementHour: 'افزایش ساعت',
    decrementHour: 'کاهش ساعت',
    pickMinute: 'گزینش دقیقه',
    incrementMinute: 'افزایش دقیقه',
    decrementMinute: 'کاهش دقیقه',
    pickSecond: 'گزینش ثانیه',
    incrementSecond: 'افزایش ثانیه',
    decrementSecond: 'کاهش ثانیه',
    toggleMeridiem: 'گزینش AM/PM',
    selectTime: 'گزینش زمان',
    selectDate: 'گزینش تاریخ',
    dayViewHeaderFormat: { month: 'long', year: '2-digit' },
    locale: 'fa',
    startOfTheWeek: 1,
    dateFormats: {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L: 'dd-MM-yyyy',
        LL: 'd MMMM yyyy',
        LLL: 'd MMMM yyyy HH:mm',
        LLLL: 'dddd d MMMM yyyy HH:mm',
    },
    ordinal: (n) => `[${n}${n === 1 || n === 8 || n >= 20 ? 'ste' : 'de'}]`,
    format: 'L LT',
};exports.localization=localization;exports.name=name;Object.defineProperty(exports,'__esModule',{value:true});}));