/*!
  * Tempus Dominus v6.9.4 (https://getdatepicker.com/)
  * Copyright 2013-2024 Jonathan Peterson
  * Licensed under MIT (https://github.com/Eonasdan/tempus-dominus/blob/master/LICENSE)
  */
(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?f(exports):typeof define==='function'&&define.amd?define(['exports'],f):(g=typeof globalThis!=='undefined'?globalThis:g||self,f((g.tempusDominus=g.tempusDominus||{},g.tempusDominus.locales=g.tempusDominus.locales||{},g.tempusDominus.locales.zh_CN={})));})(this,(function(exports){'use strict';const name = 'zh-CN';
const localization = {
    today: '今天',
    clear: '清空',
    close: '关闭',
    selectMonth: '选择月份',
    previousMonth: '上个月',
    nextMonth: '下个月',
    selectYear: '选择年份',
    previousYear: '上一年',
    nextYear: '下一年',
    selectDecade: '选择年代',
    previousDecade: '下个年代',
    nextDecade: '上个年代',
    previousCentury: '上个世纪',
    nextCentury: '下个世纪',
    pickHour: '选取时钟',
    incrementHour: '加一小时',
    decrementHour: '减一小时',
    pickMinute: '选取分钟',
    incrementMinute: '加一分钟',
    decrementMinute: '减一分钟',
    pickSecond: '选取秒钟',
    incrementSecond: '加一秒钟',
    decrementSecond: '减一秒钟',
    toggleMeridiem: '切换上下午',
    selectTime: '选择时间',
    selectDate: '选择日期',
    dayViewHeaderFormat: { month: 'long', year: '2-digit' },
    locale: 'zh-CN',
    startOfTheWeek: 1,
    dateFormats: {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L: 'yyyy/MM/dd',
        LL: 'yyyy年Md日',
        LLL: 'yyyy年Md日Th点mm分',
        LLLL: 'yyyy年Md日ddddTh点mm分',
    },
    ordinal: (n) => n,
    format: 'L LT',
};exports.localization=localization;exports.name=name;Object.defineProperty(exports,'__esModule',{value:true});}));