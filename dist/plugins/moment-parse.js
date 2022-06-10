/*!
  * Tempus Dominus v6.0.0-beta8 (https://getdatepicker.com/)
  * Copyright 2013-2022 Jonathan Peterson
  * Licensed under MIT (https://github.com/Eonasdan/tempus-dominus/blob/master/LICENSE)
  */
(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?f(exports):typeof define==='function'&&define.amd?define(['exports'],f):(g=typeof globalThis!=='undefined'?globalThis:g||self,f((g.tempusDominus=g.tempusDominus||{},g.tempusDominus.plugins=g.tempusDominus.plugins||{},g.tempusDominus.plugins.moment_parse={})));})(this,(function(exports){'use strict';const load = (option, tdClasses, tdFactory) => {
    tdClasses.Dates.prototype.setFromInput = function (value, index) {
        let converted = moment(value, option);
        if (converted.isValid()) {
            let date = tdFactory.DateTime.convert(converted.toDate(), this.optionsStore.options.localization.locale);
            this.setValue(date, index);
        }
        else {
            console.warn('Momentjs failed to parse the input date.');
        }
    };
    tdClasses.Dates.prototype.formatInput = function (date) {
        return moment(date).format(option);
    };
};exports.load=load;Object.defineProperty(exports,'__esModule',{value:true});}));