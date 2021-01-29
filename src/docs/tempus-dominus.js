(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('delegated-events')) :
    typeof define === 'function' && define.amd ? define(['exports', 'delegated-events'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.tempusdominus = {}, global.delegatedEvents));
}(this, (function (exports, delegatedEvents) { 'use strict';

    var Unit;
    (function (Unit) {
        Unit["seconds"] = "seconds";
        Unit["minutes"] = "minutes";
        Unit["hours"] = "hours";
        Unit["date"] = "date";
        Unit["month"] = "month";
        Unit["year"] = "year";
    })(Unit || (Unit = {}));
    /**
     * For the most part this object behaves exactly the same way
     * as the native Date object with a little extra spice.
     */
    class DateTime extends Date {
        constructor() {
            super(...arguments);
            /**
             * Used with Intl.DateTimeFormat
             */
            this.locale = 'default';
        }
        /**
         * Chainable way to set the {@link locale}
         * @param value
         */
        setLocale(value) {
            this.locale = value;
            return this;
        }
        /**
         * Converts a plain JS date object to a DateTime object.
         * Doing this allows access to format, etc.
         * @param  date
         */
        static convert(date) {
            if (!date)
                throw `A date is required`;
            return new DateTime(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
        }
        /**
         * Native date manipulations are not pure functions. This function creates a duplicate of the DateTime object.
         */
        get clone() {
            return new DateTime(this.year, this.month, this.date, this.hours, this.minutes, this.seconds, this.getMilliseconds()).setLocale(this.locale);
        }
        /**
         * Sets the current date to the start of the {@link unit} provided
         * Example: Consider a date of "April 30, 2021, 11:45:32.984 AM" => new DateTime(2021, 3, 30, 11, 45, 32, 984).startOf('month')
         * would return April 1, 2021, 12:00:00.000 AM (midnight)
         * @param unit
         */
        startOf(unit) {
            if (this[unit] === undefined)
                throw `Unit '${unit}' is not valid`;
            switch (unit) {
                case 'seconds':
                    this.setMilliseconds(0);
                    break;
                case 'minutes':
                    this.setSeconds(0, 0);
                    break;
                case 'hours':
                    this.setMinutes(0, 0, 0);
                    break;
                case 'date':
                    this.setHours(0, 0, 0, 0);
                    break;
                case 'weekDay':
                    this.startOf(Unit.date);
                    this.manipulate(0 - this.weekDay, Unit.date);
                    break;
                case 'month':
                    this.startOf(Unit.date);
                    this.setDate(1);
                    break;
                case 'year':
                    this.startOf(Unit.date);
                    this.setMonth(0, 1);
                    break;
            }
            return this;
        }
        /**
         * Sets the current date to the end of the {@link unit} provided
         * Example: Consider a date of "April 30, 2021, 11:45:32.984 AM" => new DateTime(2021, 3, 30, 11, 45, 32, 984).endOf('month')
         * would return April 30, 2021, 11:59:59.999 PM
         * @param unit
         */
        endOf(unit) {
            if (this[unit] === undefined)
                throw `Unit '${unit}' is not valid`;
            switch (unit) {
                case 'seconds':
                    this.setMilliseconds(999);
                    break;
                case 'minutes':
                    this.setSeconds(59, 999);
                    break;
                case 'hours':
                    this.setMinutes(59, 59, 999);
                    break;
                case 'date':
                    this.setHours(23, 59, 59, 999);
                    break;
                case 'weekDay':
                    this.startOf(Unit.date);
                    this.manipulate(6 - this.weekDay, Unit.date);
                    break;
                case 'month':
                    this.endOf(Unit.date);
                    this.manipulate(1, Unit.month);
                    this.setDate(0);
                    break;
                case 'year':
                    this.endOf(Unit.date);
                    this.manipulate(1, Unit.year);
                    this.setDate(0);
                    break;
            }
            return this;
        }
        /**
         * Change a {@link unit} value. Value can be positive or negative
         * Example: Consider a date of "April 30, 2021, 11:45:32.984 AM" => new DateTime(2021, 3, 30, 11, 45, 32, 984).manipulate(1, 'month')
         * would return May 30, 2021, 11:45:32.984 AM
         * @param value A positive or negative number
         * @param unit
         */
        manipulate(value, unit) {
            if (this[unit] === undefined)
                throw `Unit '${unit}' is not valid`;
            this[unit] += value;
            return this;
        }
        /**
         * Returns a string format.
         * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
         * for valid templates and locale objects
         * @param template An object. Uses browser defaults otherwise.
         * @param locale Can be a string or an array of strings. Uses browser defaults otherwise.
         */
        format(template, locale = this.locale) {
            return new Intl.DateTimeFormat(locale, template).format(this);
        }
        /**
         * Return true if {@link compare} is before this date
         * @param compare The Date/DateTime to compare
         * @param unit If provided, uses {@link startOf} for
         * comparision.
         */
        isBefore(compare, unit) {
            if (!unit)
                return this < compare;
            if (this[unit] === undefined)
                throw `Unit '${unit}' is not valid`;
            return this.clone.startOf(unit).valueOf() < compare.startOf(unit).valueOf();
        }
        /**
         * Return true if {@link compare} is after this date
         * @param compare The Date/DateTime to compare
         * @param unit If provided, uses {@link startOf} for
         * comparision.
         */
        isAfter(compare, unit) {
            if (!unit)
                return this > compare;
            if (this[unit] === undefined)
                throw `Unit '${unit}' is not valid`;
            return this.clone.startOf(unit).valueOf() > compare.startOf(unit).valueOf();
        }
        /**
         * Return true if {@link compare} is same this date
         * @param compare The Date/DateTime to compare
         * @param unit If provided, uses {@link startOf} for
         * comparision.
         */
        isSame(compare, unit) {
            if (!unit)
                return this.valueOf() === compare.valueOf();
            if (this[unit] === undefined)
                throw `Unit '${unit}' is not valid`;
            compare = DateTime.convert(compare);
            return (this.clone.startOf(unit).valueOf() === compare.startOf(unit).valueOf());
        }
        /**
         * Check if this is between two other DateTimes, optionally looking at unit scale. The match is exclusive.
         * @param left
         * @param right
         * @param unit.
         * @param inclusivity. A [ indicates inclusion of a value. A ( indicates exclusion.
         * If the inclusivity parameter is used, both indicators must be passed.
         */
        isBetween(left, right, unit, inclusivity = '()') {
            if (this[unit] === undefined)
                throw `Unit '${unit}' is not valid`;
            const leftInclusivity = inclusivity[0] === '(';
            const rightInclusivity = inclusivity[1] === ')';
            return (((leftInclusivity ? this.isAfter(left, unit) : !this.isBefore(left, unit)) &&
                (rightInclusivity ? this.isBefore(right, unit) : !this.isAfter(right, unit))) ||
                ((leftInclusivity ? this.isBefore(left, unit) : !this.isAfter(left, unit)) &&
                    (rightInclusivity ? this.isAfter(right, unit) : !this.isBefore(right, unit))));
        }
        /**
         * Returns flattened object of the date. Does not include literals
         * @param locale
         * @param template
         */
        parts(locale = this.locale, template = { dateStyle: 'full', timeStyle: 'long' }) {
            const parts = {};
            new Intl.DateTimeFormat(locale, template).formatToParts(this).filter(x => x.type !== 'literal').forEach(x => parts[x.type] = x.value);
            return parts;
        }
        /**
         * Shortcut to Date.getSeconds()
         */
        get seconds() {
            return this.getSeconds();
        }
        /**
         * Shortcut to Date.setSeconds()
         */
        set seconds(value) {
            this.setSeconds(value);
        }
        /**
         * Returns two digit hours
         */
        get secondsFormatted() {
            return this.seconds < 10 ? (`0${this.seconds}`) : `${this.seconds}`;
        }
        /**
         * Shortcut to Date.getMinutes()
         */
        get minutes() {
            return this.getMinutes();
        }
        /**
         * Shortcut to Date.setMinutes()
         */
        set minutes(value) {
            this.setMinutes(value);
        }
        /**
         * Returns two digit hours
         */
        get minutesFormatted() {
            return this.minutes < 10 ? (`0${this.minutes}`) : `${this.minutes}`;
        }
        /**
         * Shortcut to Date.getHours()
         */
        get hours() {
            return this.getHours();
        }
        /**
         * Shortcut to Date.setHours()
         */
        set hours(value) {
            this.setHours(value);
        }
        /**
         * Returns two digit hours
         */
        get hoursFormatted() {
            return this.hours < 10 ? (`0${this.hours}`) : `${this.hours}`;
        }
        /**
         * Get the meridiem of the date. E.g. AM or PM.
         * If the {@link locale} provides a "dayPeriod" then this will be returned,
         * otherwise it will return AM or PM.
         * @param locale
         */
        meridiem(locale = this.locale) {
            var _a;
            const dayPeriod = (_a = new Intl.DateTimeFormat(locale, {
                hour: 'numeric',
                dayPeriod: 'narrow'
            })
                .formatToParts(this)
                .find(p => p.type === 'dayPeriod')) === null || _a === void 0 ? void 0 : _a.value;
            return dayPeriod ? dayPeriod : this.getHours() <= 12 ? 'AM' : 'PM';
        }
        /**
         * Shortcut to Date.getDate()
         */
        get date() {
            return this.getDate();
        }
        /**
         * Shortcut to Date.setDate()
         */
        set date(value) {
            this.setDate(value);
        }
        /**
         * Return two digit date
         */
        get dateFormatted() {
            return this.date < 10 ? (`0${this.date}`) : `${this.date}`;
        }
        // https://github.com/you-dont-need/You-Dont-Need-Momentjs#week-of-year
        /**
         * Gets the week of the year
         */
        get week() {
            const day = new Date();
            const MILLISECONDS_IN_WEEK = 604800000;
            const firstDayOfWeek = 1; // monday as the first day (0 = sunday)
            const startOfYear = new Date(day.getFullYear(), 0, 1);
            startOfYear.setDate(startOfYear.getDate() + (firstDayOfWeek - (startOfYear.getDay() % 7)));
            return Math.round((day.valueOf() - startOfYear.valueOf()) / MILLISECONDS_IN_WEEK) + 1;
        }
        /**
         * Shortcut to Date.getDay()
         */
        get weekDay() {
            return this.getDay();
        }
        /**
         * Shortcut to Date.getMonth()
         */
        get month() {
            return this.getMonth();
        }
        /**
         * Shortcut to Date.setMonth()
         */
        set month(value) {
            this.setMonth(value);
        }
        /**
         * Return two digit, human expected month. E.g. January = 1, December = 12
         */
        get monthFormatted() {
            return this.month + 1 < 10 ? (`0${this.month}`) : `${this.month}`;
        }
        /**
         * Shortcut to Date.getFullYear()
         */
        get year() {
            return this.getFullYear();
        }
        /**
         * Shortcut to Date.setFullYear()
         */
        set year(value) {
            this.setFullYear(value);
        }
    }

    const Default = {
        restrictions: {
            minDate: false,
            maxDate: false,
            disabledDates: false,
            enabledDates: false,
            daysOfWeekDisabled: false,
            disabledTimeIntervals: false,
            disabledHours: false,
            enabledHours: false,
        },
        display: {
            icons: {
                type: 'icons',
                time: 'fas fa-clock',
                date: 'fas fa-calendar',
                up: 'fas fa-arrow-up',
                down: 'fas fa-arrow-down',
                previous: 'fas fa-chevron-left',
                next: 'fas fa-chevron-right',
                today: 'fas fa-calendar-check',
                clear: 'fas fa-trash',
                close: 'fas fa-times'
            },
            collapse: true,
            sideBySide: false,
            calendarWeeks: false,
            viewMode: 'days',
            toolbarPlacement: 'default',
            buttons: {
                showToday: false,
                showClear: false,
                showClose: false
            },
            widgetPositioning: {
                horizontal: 'auto',
                vertical: 'auto'
            },
            components: {
                century: true,
                decades: true,
                year: true,
                month: true,
                date: true,
                hours: true,
                minutes: true,
                seconds: false,
                useTwentyfourHour: false
            }
        },
        stepping: 1,
        useCurrent: true,
        defaultDate: false,
        localization: {
            today: 'Go to today',
            clear: 'Clear selection',
            close: 'Close the picker',
            selectMonth: 'Select Month',
            previousMonth: 'Previous Month',
            nextMonth: 'Next Month',
            selectYear: 'Select Year',
            previousYear: 'Previous Year',
            nextYear: 'Next Year',
            selectDecade: 'Select Decade',
            previousDecade: 'Previous Decade',
            nextDecade: 'Next Decade',
            previousCentury: 'Previous Century',
            nextCentury: 'Next Century',
            pickHour: 'Pick Hour',
            incrementHour: 'Increment Hour',
            decrementHour: 'Decrement Hour',
            pickMinute: 'Pick Minute',
            incrementMinute: 'Increment Minute',
            decrementMinute: 'Decrement Minute',
            pickSecond: 'Pick Second',
            incrementSecond: 'Increment Second',
            decrementSecond: 'Decrement Second',
            togglePeriod: 'Toggle Period',
            selectTime: 'Select Time',
            selectDate: 'Select Date',
            dayViewHeaderFormat: 'long'
        },
        widgetParent: null,
        readonly: false,
        ignoreReadonly: false,
        keepOpen: false,
        focusOnShow: true,
        inline: false,
        keepInvalid: false,
        keyBinds: {
            up: function () {
                if (!this.widget) {
                    return false;
                }
                const d = this._dates[0] || this.getMoment();
                if (this.widget.find('.datepicker').is(':visible')) {
                    this.date(d.clone().subtract(7, 'd'));
                }
                else {
                    this.date(d.clone().add(this.stepping(), 'm'));
                }
                return true;
            },
            down: function () {
                if (!this.widget) {
                    this.show();
                    return false;
                }
                const d = this._dates[0] || this.getMoment();
                if (this.widget.find('.datepicker').is(':visible')) {
                    this.date(d.clone().add(7, 'd'));
                }
                else {
                    this.date(d.clone().subtract(this.stepping(), 'm'));
                }
                return true;
            },
            'control up': function () {
                if (!this.widget) {
                    return false;
                }
                const d = this._dates[0] || this.getMoment();
                if (this.widget.find('.datepicker').is(':visible')) {
                    this.date(d.clone().subtract(1, 'y'));
                }
                else {
                    this.date(d.clone().add(1, 'h'));
                }
                return true;
            },
            'control down': function () {
                if (!this.widget) {
                    return false;
                }
                const d = this._dates[0] || this.getMoment();
                if (this.widget.find('.datepicker').is(':visible')) {
                    this.date(d.clone().add(1, 'y'));
                }
                else {
                    this.date(d.clone().subtract(1, 'h'));
                }
                return true;
            },
            left: function () {
                if (!this.widget) {
                    return false;
                }
                const d = this._dates[0] || this.getMoment();
                if (this.widget.find('.datepicker').is(':visible')) {
                    this.date(d.clone().subtract(1, 'd'));
                }
                return true;
            },
            right: function () {
                if (!this.widget) {
                    return false;
                }
                const d = this._dates[0] || this.getMoment();
                if (this.widget.find('.datepicker').is(':visible')) {
                    this.date(d.clone().add(1, 'd'));
                }
                return true;
            },
            pageUp: function () {
                if (!this.widget) {
                    return false;
                }
                const d = this._dates[0] || this.getMoment();
                if (this.widget.find('.datepicker').is(':visible')) {
                    this.date(d.clone().subtract(1, 'M'));
                }
                return true;
            },
            pageDown: function () {
                if (!this.widget) {
                    return false;
                }
                const d = this._dates[0] || this.getMoment();
                if (this.widget.find('.datepicker').is(':visible')) {
                    this.date(d.clone().add(1, 'M'));
                }
                return true;
            },
            enter: function () {
                if (!this.widget) {
                    return false;
                }
                this.hide();
                return true;
            },
            escape: function () {
                if (!this.widget) {
                    return false;
                }
                this.hide();
                return true;
            },
            'control space': function () {
                if (!this.widget) {
                    return false;
                }
                if (this.widget.find('.timepicker').is(':visible')) {
                    this.widget.find('.btn[data-action="togglePeriod"]').click();
                }
                return true;
            },
            t: function () {
                if (!this.widget) {
                    return false;
                }
                this.date(this.getMoment());
                return true;
            },
            'delete': function () {
                if (!this.widget) {
                    return false;
                }
                this.clear();
                return true;
            }
        },
        debug: false,
        allowInputToggle: false,
        viewDate: false,
        allowMultidate: false,
        multidateSeparator: ', ',
        promptTimeOnDateChange: false,
        promptTimeOnDateChangeTransitionDelay: 200
    };
    const DatePickerModes = [{
            CLASS_NAME: 'days',
            NAV_FUNCTION: Unit.month,
            NAV_STEP: 1
        }, {
            CLASS_NAME: 'months',
            NAV_FUNCTION: Unit.year,
            NAV_STEP: 1
        }, {
            CLASS_NAME: 'years',
            NAV_FUNCTION: Unit.year,
            NAV_STEP: 10
        }, {
            CLASS_NAME: 'decades',
            NAV_FUNCTION: Unit.year,
            NAV_STEP: 100
        }];
    class Namespace {
    }
    Namespace.NAME = 'datetimepicker'; //'tempus-dominus' todo
    Namespace.VERSION = '6.0.0-alpha1';
    Namespace.DATA_KEY = 'datetimepicker'; //todo 'td'
    Namespace.EVENT_KEY = `.${Namespace.DATA_KEY}`;
    Namespace.DATA_API_KEY = '.data-api';
    Namespace.EVENT_CHANGE = `hide${Namespace.EVENT_KEY}`;
    Namespace.EVENT_ERROR = `error${Namespace.EVENT_KEY}`;
    Namespace.EVENT_UPDATE = `update${Namespace.EVENT_KEY}`;
    Namespace.EVENT_SHOW = `show${Namespace.EVENT_KEY}`;
    Namespace.EVENT_HIDE = `hide${Namespace.EVENT_KEY}`;
    Namespace.EVENT_BLUR = `blur${Namespace.EVENT_KEY}`;
    Namespace.EVENT_KEYUP = `keyup${Namespace.EVENT_KEY}`;
    Namespace.EVENT_KEYDOWN = `keydown${Namespace.EVENT_KEY}`;
    Namespace.EVENT_FOCUS = `focus${Namespace.EVENT_KEY}`;
    Namespace.EVENT_CLICK_DATA_API = `click${Namespace.EVENT_KEY}${Namespace.DATA_API_KEY}`;

    class Actions {
        constructor(context) {
            this.context = context;
        }
        do(e, action) {
            if (e.currentTarget.classList.contains('disabled'))
                return false;
            action = action || e.currentTarget.dataset.action;
            console.log('action', action);
            switch (action) {
                case ActionTypes.next:
                case ActionTypes.previous:
                    const { NAV_FUNCTION, NAV_STEP } = DatePickerModes[this.context.currentViewMode];
                    if (action === ActionTypes.next)
                        this.context._viewDate.manipulate(NAV_STEP, NAV_FUNCTION);
                    else
                        this.context._viewDate.manipulate(NAV_STEP * -1, NAV_FUNCTION);
                    this.context.display.updateDateView();
                    this.context._viewUpdate(NAV_FUNCTION);
                    break;
                case ActionTypes.pickerSwitch:
                    this.context.display._showMode(1);
                    break;
                case ActionTypes.selectMonth:
                    const month = +e.target.getAttribute('data-value');
                    this.context._viewDate.month = month;
                    if (this.context.currentViewMode === this.context.minViewModeNumber) {
                        //todo in the old td this only used month/year and not the whole viewdate
                        this.context.dates._setValue(this.context._viewDate, this.context.dates.lastPickedIndex);
                        if (!this.context._options.inline) {
                            this.context.display.hide();
                        }
                    }
                    else {
                        this.context.display._showMode(-1);
                        this.context.display.updateDateView();
                    }
                    this.context._viewUpdate('month');
                    break;
                case ActionTypes.selectYear:
                    break;
                case ActionTypes.selectDecade:
                    break;
                case ActionTypes.selectDay:
                    const day = this.context._viewDate.clone;
                    if (e.target.classList.contains('old')) {
                        day.manipulate(-11, Unit.month);
                    }
                    if (e.target.classList.contains('new')) {
                        day.manipulate(1, Unit.month);
                    }
                    day.date = +e.target.innerText;
                    let index = 0;
                    if (this.context._options.allowMultidate) {
                        index = this.context.dates.pickedIndex(day, Unit.date);
                        if (index !== -1) {
                            this.context.dates._setValue(null, index); //deselect multidate
                        }
                        else {
                            this.context.dates._setValue(day, this.context.dates.lastPickedIndex + 1);
                        }
                    }
                    else {
                        this.context.dates._setValue(day, this.context.dates.lastPickedIndex);
                    }
                    if (!this.context.display._hasTime() && !this.context._options.keepOpen && !this.context._options.inline && !this.context._options.allowMultidate) {
                        this.context.display.hide();
                    }
                    //todo register events or look at Document.createEvent or at dom/event-handler
                    break;
                case ActionTypes.selectHour:
                    break;
                case ActionTypes.selectMinute:
                    break;
                case ActionTypes.selectSecond:
                    break;
                case ActionTypes.incrementHours:
                    break;
                case ActionTypes.incrementMinutes:
                    break;
                case ActionTypes.incrementSeconds:
                    break;
                case ActionTypes.decrementHours:
                    break;
                case ActionTypes.decrementMinutes:
                    break;
                case ActionTypes.decrementSeconds:
                    break;
                case ActionTypes.togglePeriod:
                    break;
                case ActionTypes.togglePicker:
                    break;
                case ActionTypes.showPicker:
                    break;
                case ActionTypes.showHours:
                    break;
                case ActionTypes.showMinutes:
                    break;
                case ActionTypes.showSeconds:
                    break;
                case ActionTypes.clear:
                    break;
                case ActionTypes.close:
                    break;
                case ActionTypes.today:
                    break;
            }
        }
    }
    let ActionTypes;
    (function (ActionTypes) {
        ActionTypes["next"] = "next";
        ActionTypes["previous"] = "previous";
        ActionTypes["pickerSwitch"] = "pickerSwitch";
        ActionTypes["selectMonth"] = "selectMonth";
        ActionTypes["selectYear"] = "selectYear";
        ActionTypes["selectDecade"] = "selectDecade";
        ActionTypes["selectDay"] = "selectDay";
        ActionTypes["selectHour"] = "selectHour";
        ActionTypes["selectMinute"] = "selectMinute";
        ActionTypes["selectSecond"] = "selectSecond";
        ActionTypes["incrementHours"] = "incrementHours";
        ActionTypes["incrementMinutes"] = "incrementMinutes";
        ActionTypes["incrementSeconds"] = "incrementSeconds";
        ActionTypes["decrementHours"] = "decrementHours";
        ActionTypes["decrementMinutes"] = "decrementMinutes";
        ActionTypes["decrementSeconds"] = "decrementSeconds";
        ActionTypes["togglePeriod"] = "togglePeriod";
        ActionTypes["togglePicker"] = "togglePicker";
        ActionTypes["showPicker"] = "showPicker";
        ActionTypes["showHours"] = "showHours";
        ActionTypes["showMinutes"] = "showMinutes";
        ActionTypes["showSeconds"] = "showSeconds";
        ActionTypes["clear"] = "clear";
        ActionTypes["close"] = "close";
        ActionTypes["today"] = "today";
    })(ActionTypes || (ActionTypes = {}));

    class DateDisplay {
        constructor(context) {
            this.context = context;
        }
        get picker() {
            const daysDiv = document.createElement('div');
            daysDiv.classList.add('datepicker-days');
            const dayTable = document.createElement('table');
            dayTable.classList.add('table', 'table-sm'); //todo bootstrap
            dayTable.appendChild(this.context.display.headTemplate);
            dayTable.appendChild(document.createElement('tbody'));
            daysDiv.appendChild(dayTable);
            return daysDiv;
        }
        update() {
            const datesDiv = this.context.display.widget.getElementsByClassName('datepicker-days')[0];
            const [previous, switcher, next] = datesDiv.getElementsByTagName('thead')[0].getElementsByTagName('th');
            previous.getElementsByTagName('span')[0].setAttribute('title', this.context._options.localization.previousMonth);
            switcher.setAttribute('title', this.context._options.localization.selectMonth);
            next.getElementsByTagName('span')[0].setAttribute('title', this.context._options.localization.nextMonth);
            switcher.innerText = this.context._viewDate.format({ month: this.context._options.localization.dayViewHeaderFormat });
            if (!this.context.validation.isValid(this.context._viewDate.clone.manipulate(1, Unit.month), Unit.month)) {
                previous.classList.add('disabled');
            }
            if (!this.context.validation.isValid(this.context._viewDate.clone.manipulate(1, Unit.month), Unit.month)) {
                next.classList.add('disabled');
            }
            const dayBody = datesDiv.getElementsByTagName('tbody')[0];
            dayBody.querySelectorAll('*').forEach(n => n.remove());
            dayBody.appendChild(this._daysOfTheWeek());
            this._grid().forEach(row => dayBody.appendChild(row));
        }
        /***
         * Generates an html row that contains the days of the week.
         */
        _daysOfTheWeek() {
            let innerDate = this.context._viewDate.clone.startOf('weekDay').startOf(Unit.date);
            const row = document.createElement('tr');
            if (this.context._options.display.calendarWeeks) {
                const th = document.createElement('th');
                th.classList.add('cw');
                th.innerText = '#';
                row.appendChild(th);
            }
            let i = 0;
            while (i < 7) {
                const th = document.createElement('th');
                th.classList.add('dow');
                th.innerText = innerDate.format({ weekday: 'short' });
                innerDate.manipulate(1, Unit.date);
                row.appendChild(th);
                i++;
            }
            return row;
        }
        _grid() {
            const rows = [];
            let innerDate = this.context._viewDate.clone.startOf(Unit.month).startOf('weekDay').manipulate(12, Unit.hours), row;
            for (let i = 0; i < 42; i++) {
                if (innerDate.weekDay === 0) {
                    if (row)
                        rows.push(row);
                    row = document.createElement('tr');
                    if (this.context._options.display.calendarWeeks) {
                        const td = document.createElement('td');
                        td.classList.add('cw');
                        td.innerText = `${innerDate.week}`;
                    }
                }
                let classes = [];
                classes.push('day');
                if (innerDate.isBefore(this.context._viewDate, Unit.month)) {
                    classes.push('old');
                }
                if (innerDate.isAfter(this.context._viewDate, Unit.month)) {
                    classes.push('new');
                }
                if (!this.context.unset && this.context.dates.isPicked(innerDate, Unit.date)) {
                    classes.push('active');
                }
                if (!this.context.validation.isValid(innerDate, Unit.date)) {
                    classes.push('disabled');
                }
                if (innerDate.isSame(new DateTime(), Unit.date)) {
                    classes.push('today');
                }
                if (innerDate.weekDay === 0 || innerDate.weekDay === 6) {
                    classes.push('weekend');
                }
                const td = document.createElement('td');
                td.setAttribute('data-action', ActionTypes.selectDay);
                td.setAttribute('data-day', `${innerDate.year}-${innerDate.monthFormatted}-${innerDate.dateFormatted}`);
                td.classList.add(...classes);
                td.innerText = `${innerDate.date}`;
                row.appendChild(td);
                innerDate.manipulate(1, Unit.date);
            }
            return rows;
        }
    }

    class MonthDisplay {
        constructor(context) {
            this.context = context;
        }
        get picker() {
            const container = document.createElement('div');
            container.classList.add('datepicker-months');
            const table = document.createElement('table');
            table.classList.add('table', 'table-sm'); //todo bootstrap
            const headTemplate = this.context.display.headTemplate;
            const [previous, switcher, next] = headTemplate.getElementsByTagName('th');
            previous.getElementsByTagName('span')[0].setAttribute('title', this.context._options.localization.previousYear);
            switcher.setAttribute('title', this.context._options.localization.selectYear);
            switcher.setAttribute('colspan', '1');
            next.getElementsByTagName('span')[0].setAttribute('title', this.context._options.localization.nextYear);
            switcher.innerText = this.context._viewDate.format({ year: 'numeric' });
            if (!this.context.validation.isValid(this.context._viewDate.clone.manipulate(-1, Unit.year), Unit.year)) {
                previous.classList.add('disabled');
            }
            if (!this.context.validation.isValid(this.context._viewDate.clone.manipulate(1, Unit.year), Unit.year)) {
                next.classList.add('disabled');
            }
            table.appendChild(headTemplate);
            const tableBody = document.createElement('tbody');
            this._grid().forEach(row => tableBody.appendChild(row));
            table.appendChild(tableBody);
            container.appendChild(table);
            return container;
        }
        update() {
            this.context.display.widget.querySelector('[data-action="pickerSwitch"]').innerText = this.context._viewDate.format({ year: 'numeric' });
        }
        /**
         *
         * @private
         */
        _grid() {
            const rows = [], container = document.createElement('span');
            let innerDate = this.context._viewDate.clone.startOf(Unit.year), row = document.createElement('tr');
            container.setAttribute('data-action', 'selectMonth');
            container.classList.add(Unit.month);
            for (let i = 0; i <= 12; i++) {
                if (i !== 0 && i % 3 === 0) {
                    rows.push(row);
                    row = document.createElement('tr');
                }
                let classes = [];
                if (!this.context.unset && this.context.dates.isPicked(innerDate, Unit.month)) {
                    classes.push('active');
                }
                if (!this.context.validation.isValid(innerDate, Unit.month)) {
                    classes.push('disabled');
                }
                const td = document.createElement('td');
                const containerClone = container.cloneNode(true);
                containerClone.setAttribute('data-value', `${i}`);
                containerClone.classList.add(...classes);
                containerClone.innerText = `${innerDate.format({ month: 'long' })}`;
                td.appendChild(containerClone);
                row.appendChild(td);
                innerDate.manipulate(1, Unit.month);
            }
            return rows;
        }
    }

    class YearDisplay {
        constructor(context) {
            this.context = context;
            /*const yearCaps = Dates.getStartEndYear(10, this.context._viewDate.year());
            this._startYear = this.context._viewDate.year(yearCaps[0]);
            this._endYear = this.context._viewDate.year(yearCaps[1]);*/
            this._startYear = this.context._viewDate.clone.manipulate(-1, Unit.year);
            this._endYear = this.context._viewDate.clone.manipulate(10, Unit.year);
        }
        get picker() {
            const container = document.createElement('div');
            container.classList.add('datepicker-years');
            const table = document.createElement('table');
            table.classList.add('table', 'table-sm'); //todo bootstrap
            const headTemplate = this.context.display.headTemplate;
            const heads = headTemplate.getElementsByTagName('th');
            const previous = heads[0];
            const switcher = heads[1];
            const next = heads[2];
            previous.getElementsByTagName('span')[0].setAttribute('title', this.context._options.localization.previousDecade);
            switcher.setAttribute('title', this.context._options.localization.selectDecade);
            switcher.setAttribute('colspan', '1');
            next.getElementsByTagName('span')[0].setAttribute('title', this.context._options.localization.nextDecade);
            switcher.innerText = `${this._startYear.year}-${this._endYear.year}`;
            if (!this.context.validation.isValid(this._startYear, Unit.year)) {
                previous.classList.add('disabled');
            }
            if (!this.context.validation.isValid(this._endYear, Unit.year)) {
                next.classList.add('disabled');
            }
            table.appendChild(headTemplate);
            const tableBody = document.createElement('tbody');
            this._grid().forEach(row => tableBody.appendChild(row));
            table.appendChild(tableBody);
            container.appendChild(table);
            return container;
        }
        _grid() {
            const rows = [], container = document.createElement('span');
            let innerDate = this.context._viewDate.clone.startOf(Unit.year).manipulate(-1, Unit.year), row = document.createElement('tr');
            container.setAttribute('data-action', 'selectYear');
            container.classList.add('year');
            for (let i = 0; i <= 12; i++) {
                if (i !== 0 && i % 3 === 0) {
                    rows.push(row);
                    row = document.createElement('tr');
                }
                let classes = [];
                if (!this.context.unset && this.context.dates.isPicked(innerDate, Unit.year)) {
                    classes.push('active');
                }
                if (!this.context.validation.isValid(innerDate, Unit.year)) {
                    classes.push('disabled');
                }
                const td = document.createElement('td');
                const containerClone = container.cloneNode(true);
                containerClone.classList.add(...classes);
                containerClone.innerText = `${innerDate.year}`;
                td.appendChild(containerClone);
                row.appendChild(td);
                innerDate.manipulate(1, Unit.year);
            }
            return rows;
        }
    }

    class Dates {
        constructor(context) {
            this._dates = [];
            this.context = context;
        }
        get picked() {
            return this._dates;
        }
        get lastPicked() {
            return this._dates[this.lastPickedIndex];
        }
        get lastPickedIndex() {
            return this._dates.length - 1;
        }
        add(date) {
            this._dates.push(date);
        }
        /**
         *
         * @param innerDate
         * @param unit
         */
        isPicked(innerDate, unit) {
            if (!unit)
                return this._dates.find(x => x === innerDate) !== undefined;
            let format = {}, innerDateFormatted = '';
            switch (unit) {
                case 'date':
                    format = { dateStyle: 'short' };
                    break;
                case 'month':
                    format = {
                        month: 'numeric',
                        year: 'numeric'
                    };
                    break;
                case 'year':
                    format = { year: 'numeric' };
                    break;
            }
            innerDateFormatted = innerDate.format(format);
            return this._dates.map(x => x.format(format)).find(x => x === innerDateFormatted) !== undefined;
        }
        pickedIndex(innerDate, unit) {
            if (!unit)
                return this._dates.indexOf(innerDate);
            let format = {}, innerDateFormatted = '';
            switch (unit) {
                case 'date':
                    format = { dateStyle: 'short' };
                    break;
                case 'month':
                    format = {
                        month: 'numeric',
                        year: 'numeric'
                    };
                    break;
                case 'year':
                    format = { year: 'numeric' };
                    break;
            }
            innerDateFormatted = innerDate.format(format);
            return this._dates.map(x => x.format(format)).indexOf(innerDateFormatted);
        }
        static getStartEndYear(factor, year) {
            const step = factor / 10, startYear = Math.floor(year / factor) * factor, endYear = startYear + step * 9, focusValue = Math.floor(year / step) * step;
            return [startYear, endYear, focusValue];
        }
        _setValue(target, index) {
            const noIndex = (typeof index === 'undefined'), isClear = !target && noIndex;
            let isValid = true, oldDate = this.context.unset ? null : this._dates[index];
            if (!oldDate && !this.context.unset && noIndex && isClear) {
                oldDate = this.lastPicked;
            }
            // case of calling setValue(null or false)
            if (!target) {
                if (!this.context._options.allowMultidate || this._dates.length === 1 || isClear) {
                    this.context.unset = true;
                    this._dates = [];
                }
                else {
                    this._dates.splice(index, 1);
                }
                this.context._notifyEvent({
                    type: Namespace.EVENT_CHANGE,
                    date: undefined,
                    oldDate,
                    isClear,
                    isValid,
                });
                this.context.display.update();
                return;
            }
            target = target.clone;
            if (this.context._options.stepping !== 1) {
                target.minutes = Math.round(target.minutes / this.context._options.stepping) * this.context._options.stepping;
                target.seconds = 0;
            }
            if (this.context.validation.isValid(target)) {
                this._dates[index] = target;
                this.context._viewDate = target.clone;
                this.context.unset = false;
                this.context.display.update();
                this.context._notifyEvent({
                    type: Namespace.EVENT_CHANGE,
                    date: this._dates[index],
                    oldDate,
                    isClear,
                    isValid,
                });
            }
            else {
                isValid = false;
                if (this.context._options.keepInvalid) {
                    this._dates[index] = target;
                    this.context._viewDate = target.clone;
                    this.context._notifyEvent({
                        type: Namespace.EVENT_CHANGE,
                        date: target,
                        oldDate,
                        isClear,
                        isValid,
                    });
                }
                this.context._notifyEvent({
                    type: Namespace.EVENT_ERROR,
                    date: target,
                    oldDate
                });
            }
        }
    }

    class DecadeDisplay {
        constructor(context) {
            this.context = context;
            const [start, end] = Dates.getStartEndYear(100, this.context._viewDate.year);
            this._startDecade = this.context._viewDate.clone.startOf(Unit.year);
            this._startDecade.year = start;
            this._endDecade = this.context._viewDate.clone.startOf(Unit.year);
            this._endDecade.year = end;
        }
        get picker() {
            const container = document.createElement('div');
            container.classList.add('datepicker-decades');
            const table = document.createElement('table');
            table.classList.add('table', 'table-sm'); //todo bootstrap
            const headTemplate = this.context.display.headTemplate;
            const [previous, switcher, next] = headTemplate.getElementsByTagName('th');
            previous.getElementsByTagName('span')[0].setAttribute('title', this.context._options.localization.previousCentury);
            switcher.setAttribute('title', this.context._options.localization.selectDecade);
            switcher.setAttribute('colspan', '1');
            next.getElementsByTagName('span')[0].setAttribute('title', this.context._options.localization.nextCentury);
            switcher.innerText = `${this._startDecade.year}-${this._endDecade.year}`;
            if (!this.context.validation.isValid(this._startDecade, Unit.year)) {
                previous.classList.add('disabled');
            }
            if (!this.context.validation.isValid(this._endDecade, Unit.year)) {
                next.classList.add('disabled');
            }
            table.appendChild(headTemplate);
            const tableBody = document.createElement('tbody');
            this._grid().forEach(row => tableBody.appendChild(row));
            table.appendChild(tableBody);
            container.appendChild(table);
            return container;
        }
        _grid() {
            const rows = [], container = document.createElement('span');
            let row = document.createElement('tr');
            container.setAttribute('data-action', 'selectDecade');
            container.classList.add('decade');
            if (this._startDecade.year - 10 < 0) {
                const td = document.createElement('td');
                const containerClone = document.createElement('span');
                containerClone.innerText = '&nbsp;';
                td.appendChild(containerClone);
                row.appendChild(td);
            }
            else {
                const td = document.createElement('td');
                const containerClone = container.cloneNode(true);
                containerClone.classList.add('old');
                containerClone.innerText = `${this._startDecade.year - 10}`;
                container.setAttribute('data-selection', `${this._startDecade.year + 6}`);
                td.appendChild(containerClone);
                row.appendChild(td);
            }
            const pickedYears = this.context.dates.picked.map(x => x.year);
            for (let i = 1; i <= 10; i++) {
                const startDecadeYear = this._startDecade.year;
                const endDecadeYear = this._startDecade.year + 9;
                if (i !== 0 && i % 3 === 0) {
                    rows.push(row);
                    row = document.createElement('tr');
                }
                let classes = [];
                if (!this.context.unset && pickedYears.filter(x => x >= startDecadeYear && x <= endDecadeYear).length > 0) {
                    classes.push('active');
                }
                /* if (!this.context.validation.isValid(innerDate, 'y')) { //todo between
                     classes.push('disabled');
                 }*/
                const td = document.createElement('td');
                const containerClone = container.cloneNode(true);
                containerClone.classList.add(...classes);
                container.setAttribute('data-selection', `${this._startDecade.year + 6}`);
                containerClone.innerText = `${this._startDecade.year}`;
                td.appendChild(containerClone);
                row.appendChild(td);
                this._startDecade.manipulate(10, Unit.year);
            }
            const td = document.createElement('td');
            const containerClone = container.cloneNode(true);
            containerClone.classList.add('old');
            containerClone.innerText = `${this._startDecade.year}`;
            container.setAttribute('data-selection', `${this._startDecade.year + 6}`);
            td.appendChild(containerClone);
            row.appendChild(td);
            rows.push(row);
            return rows;
        }
    }

    class TimeDisplay {
        constructor(context) {
            this.context = context;
        }
        get picker() {
            //todo could move some of this stuff to the ctor
            //then picker function clears and appends table body
            const container = document.createElement('div');
            container.classList.add('timepicker-picker');
            const table = document.createElement('table');
            const tableBody = document.createElement('tbody');
            this._grid().forEach(row => tableBody.appendChild(row));
            table.appendChild(tableBody);
            container.appendChild(table);
            return container;
        }
        update() {
            const timesDiv = this.context.display.widget.getElementsByClassName('timepicker-picker')[0];
            const lastPicked = (this.context.dates.lastPicked || this.context._viewDate).clone;
            if (!this.context._options.display.components.use24Hours) {
                const toggle = timesDiv.querySelector('[data-action=togglePeriod]');
                toggle.innerText = lastPicked.meridiem();
                if (!this.context.validation.isValid(lastPicked.clone.manipulate(lastPicked.hours >= 12 ? -12 : 12, Unit.hours))) {
                    toggle.classList.add('disabled');
                }
                else {
                    toggle.classList.remove('disabled');
                }
            }
            timesDiv.querySelectorAll('.disabled').forEach(element => element.classList.remove('disabled'));
            if (!this.context.validation.isValid(this.context._viewDate.clone.manipulate(1, Unit.hours), Unit.hours)) {
                timesDiv.querySelector('[data-action=incrementHours]').classList.add('disabled');
            }
            if (!this.context.validation.isValid(this.context._viewDate.clone.manipulate(-1, Unit.hours), Unit.hours)) {
                timesDiv.querySelector('[data-action=decrementHours]').classList.add('disabled');
            }
            if (!this.context.validation.isValid(this.context._viewDate.clone.manipulate(1, Unit.minutes), Unit.minutes)) {
                timesDiv.querySelector('[data-action=incrementMinutes]').classList.add('disabled');
            }
            if (!this.context.validation.isValid(this.context._viewDate.clone.manipulate(-1, Unit.minutes), Unit.minutes)) {
                timesDiv.querySelector('[data-action=decrementMinutes]').classList.add('disabled');
            }
            if (!this.context.validation.isValid(this.context._viewDate.clone.manipulate(1, Unit.seconds), Unit.seconds)) {
                timesDiv.querySelector('[data-action=incrementSeconds]').classList.add('disabled');
            }
            if (!this.context.validation.isValid(this.context._viewDate.clone.manipulate(-1, Unit.seconds), Unit.seconds)) {
                timesDiv.querySelector('[data-action=decrementSeconds]').classList.add('disabled');
            }
            if (this.context._options.display.components.hours)
                timesDiv.querySelector('[data-time-component=hours]').innerText = lastPicked.hoursFormatted;
            if (this.context._options.display.components.minutes)
                timesDiv.querySelector('[data-time-component=minutes]').innerText = lastPicked.minutesFormatted;
            if (this.context._options.display.components.seconds)
                timesDiv.querySelector('[data-time-component=seconds]').innerText = lastPicked.secondsFormatted;
        }
        _grid() {
            const rows = [], separator = document.createElement('td'), separatorColon = separator.cloneNode(true), topRow = document.createElement('tr'), middleRow = document.createElement('tr'), bottomRow = document.createElement('tr'), upIcon = this.context.display.iconTag(this.context._options.display.icons.up), downIcon = this.context.display.iconTag(this.context._options.display.icons.down), actionLink = document.createElement('a');
            separator.classList.add('separator');
            separatorColon.innerHTML = ':';
            actionLink.classList.add('btn');
            actionLink.setAttribute('href', 'javascript:void(0);');
            actionLink.setAttribute('tabindex', '-1');
            if (this.context._options.display.components.hours) {
                let td = document.createElement('td');
                let actionLinkClone = actionLink.cloneNode(true);
                actionLinkClone.setAttribute('title', this.context._options.localization.incrementHour);
                actionLinkClone.setAttribute('data-action', 'incrementHours');
                actionLinkClone.appendChild(upIcon.cloneNode(true));
                td.appendChild(actionLinkClone);
                topRow.appendChild(td);
                td = document.createElement('td');
                const span = document.createElement('span');
                span.classList.add('timepicker-hour');
                span.setAttribute('title', this.context._options.localization.pickHour);
                span.setAttribute('data-action', 'showHours');
                span.setAttribute('data-time-component', 'hours');
                td.appendChild(span);
                middleRow.appendChild(td);
                td = document.createElement('td');
                actionLinkClone = actionLink.cloneNode(true);
                actionLinkClone.setAttribute('title', this.context._options.localization.decrementHour);
                actionLinkClone.setAttribute('data-action', 'decrementHours');
                actionLinkClone.appendChild(downIcon.cloneNode(true));
                td.appendChild(actionLinkClone);
                bottomRow.appendChild(td);
            }
            if (this.context._options.display.components.minutes) {
                if (this.context._options.display.components.hours) {
                    topRow.appendChild(separator.cloneNode(true));
                    middleRow.appendChild(separatorColon.cloneNode(true));
                    bottomRow.appendChild(separator.cloneNode(true));
                }
                let td = document.createElement('td');
                let actionLinkClone = actionLink.cloneNode(true);
                actionLinkClone.setAttribute('title', this.context._options.localization.incrementMinute);
                actionLinkClone.setAttribute('data-action', 'incrementMinutes');
                actionLinkClone.appendChild(upIcon.cloneNode(true));
                td.appendChild(actionLinkClone);
                topRow.appendChild(td);
                td = document.createElement('td');
                const span = document.createElement('span');
                span.classList.add('timepicker-minute');
                span.setAttribute('title', this.context._options.localization.pickMinute);
                span.setAttribute('data-action', 'showMinutes');
                span.setAttribute('data-time-component', 'minutes');
                td.appendChild(span);
                middleRow.appendChild(td);
                td = document.createElement('td');
                actionLinkClone = actionLink.cloneNode(true);
                actionLinkClone.setAttribute('title', this.context._options.localization.decrementMinute);
                actionLinkClone.setAttribute('data-action', 'decrementMinutes');
                actionLinkClone.appendChild(downIcon.cloneNode(true));
                td.appendChild(actionLinkClone);
                bottomRow.appendChild(td);
            }
            if (this.context._options.display.components.seconds) {
                if (this.context._options.display.components.minutes) {
                    topRow.appendChild(separator.cloneNode(true));
                    middleRow.appendChild(separatorColon.cloneNode(true));
                    bottomRow.appendChild(separator.cloneNode(true));
                }
                let td = document.createElement('td');
                let actionLinkClone = actionLink.cloneNode(true);
                actionLinkClone.setAttribute('title', this.context._options.localization.incrementSecond);
                actionLinkClone.setAttribute('data-action', 'incrementSeconds');
                actionLinkClone.appendChild(upIcon.cloneNode(true));
                td.appendChild(actionLinkClone);
                topRow.appendChild(td);
                td = document.createElement('td');
                const span = document.createElement('span');
                span.classList.add('timepicker-second');
                span.setAttribute('title', this.context._options.localization.pickSecond);
                span.setAttribute('data-action', 'showSeconds');
                span.setAttribute('data-time-component', 'seconds');
                td.appendChild(span);
                middleRow.appendChild(td);
                td = document.createElement('td');
                actionLinkClone = actionLink.cloneNode(true);
                actionLinkClone.setAttribute('title', this.context._options.localization.decrementSecond);
                actionLinkClone.setAttribute('data-action', 'decrementSeconds');
                actionLinkClone.appendChild(downIcon.cloneNode(true));
                td.appendChild(actionLinkClone);
                bottomRow.appendChild(td);
            }
            if (!this.context._options.display.components.useTwentyfourHour) {
                topRow.appendChild(separator.cloneNode(true));
                let td = document.createElement('td');
                let button = document.createElement('button');
                button.classList.add('btn', 'btn-primary'); //todo bootstrap
                button.setAttribute('title', this.context._options.localization.togglePeriod);
                button.setAttribute('data-action', 'togglePeriod');
                button.setAttribute('tabindex', '-1');
                td.appendChild(button);
                middleRow.appendChild(td);
                bottomRow.appendChild(separator.cloneNode(true));
            }
            rows.push(topRow, middleRow, bottomRow);
            return rows;
        }
    }

    class Display {
        constructor(context) {
            this.context = context;
            this._dateDisplay = new DateDisplay(context);
            this._monthDisplay = new MonthDisplay(context);
            this._yearDisplay = new YearDisplay(context);
            this._decadeDisplay = new DecadeDisplay(context);
            this._timeDisplay = new TimeDisplay(context);
            this._widget = undefined;
        }
        get widget() {
            return this._widget;
        }
        update() {
            if (!this._widget)
                return;
            this.updateDateView();
            this.updateTimeView();
        }
        updateDateView() {
            if (this._hasDate())
                this._dateDisplay.update();
        }
        updateTimeView() {
            if (this._hasTime())
                this._timeDisplay.update();
        }
        show() {
            if (this.context._options.useCurrent) {
                //todo in the td4 branch a pr changed this to allow granularity
                this.context.dates._setValue(new DateTime());
            }
            this._buildWidget();
            this._showMode();
            window.addEventListener('resize', () => this._place());
            this._place();
            //todo unhide widget
            this.context._notifyEvent({
                type: Namespace.EVENT_SHOW
            });
        }
        _showMode(direction) {
            if (!this.widget) {
                return;
            }
            if (direction) {
                this.context.currentViewMode = Math.max(this.context.minViewModeNumber, Math.min(3, this.context.currentViewMode + direction));
            }
            this.widget.querySelectorAll('.datepicker > div, .timepicker > div').forEach((e) => e.style.display = 'none');
            const datePickerMode = DatePickerModes[this.context.currentViewMode];
            let picker = this.widget.querySelector(`.datepicker-${datePickerMode.CLASS_NAME}`);
            if (picker == null) {
                const dateContainer = this.widget.querySelector('.datepicker');
                switch (datePickerMode.CLASS_NAME) {
                    case 'years':
                        break;
                    case 'months':
                        dateContainer.appendChild(this._monthDisplay.picker);
                        this._monthDisplay.update();
                        break;
                    case 'days':
                        dateContainer.appendChild(this._dateDisplay.picker);
                        this._dateDisplay.update();
                        break;
                }
                picker = this.widget.querySelector(`.datepicker-${datePickerMode.CLASS_NAME}`);
                /*const actions = this.widget.querySelectorAll('[data-action]');
                actions.forEach(element => element.removeEventListener('click', (e) => {
                    this.context.action.do(e);
                }))
                actions.forEach(element => element.addEventListener('click', (e) => {
                    this.context.action.do(e);
                }));*/
            }
            picker.style.display = 'block';
        }
        hide() {
        }
        _place() {
            console.log('place called');
        }
        _buildWidget() {
            const template = document.createElement('div');
            //todo bootstrap, need to namespace classes
            template.classList.add('bootstrap-datetimepicker-widget');
            if (this.context._options.calendarWeeks)
                template.classList.add('tempusdominus-bootstrap-datetimepicker-widget-with-calendar-weeks'); //todo namespace
            const dateView = document.createElement('div');
            dateView.classList.add('datepicker'); //todo I think I want to rename these to datepicker-container or something
            //dateView.appendChild(this._dateDisplay.picker); //todo remove both of these appends. I'd rather only build then when needed
            const timeView = document.createElement('div');
            timeView.classList.add('timepicker');
            timeView.appendChild(this._timeDisplay.picker);
            const toolbar = document.createElement('li');
            toolbar.classList.add('picker-switch');
            if (this.context._options.collapse)
                toolbar.classList.add('accordion-toggle'); //todo bootstrap
            toolbar.appendChild(this._toolbar);
            /*if (!this.context._options.inline) { //todo restore this. for now I don't want the position stuff it adds
                template.classList.add('dropdown-menu'); //todo bootstrap
            }*/
            if (this.context._options.display.components.useTwentyfourHour) {
                template.classList.add('useTwentyfour'); //todo namespace
            }
            if (this.context._options.display.components.second && !this.context._options.display.components.useTwentyfourHour) {
                template.classList.add('wider'); //todo namespace?
            }
            if (this.context._options.sideBySide && this._hasDate() && this._hasTime()) {
                template.classList.add('timepicker-sbs'); //todo namespace?
                if (this.context._options.toolbarPlacement === 'top') {
                    template.appendChild(toolbar);
                }
                const row = document.createElement('div');
                row.classList.add('row'); //todo bootstrap
                dateView.classList.add('col-md-6');
                timeView.classList.add('col-md-6');
                row.appendChild(dateView);
                row.appendChild(timeView);
                if (this.context._options.toolbarPlacement === 'bottom' || this.context._options.toolbarPlacement === 'default') {
                    template.appendChild(toolbar);
                }
                this._widget = template;
                return;
            }
            const content = document.createElement('ul');
            content.classList.add('list-unstyled'); //todo bootstrap
            if (this.context._options.toolbarPlacement === 'top') {
                content.appendChild(toolbar);
            }
            if (this._hasDate()) {
                const li = document.createElement('li');
                if (this.context._options.collapse && this._hasTime()) {
                    //li.classList.add('collapse'); //todo bootstrap
                    if (this.context._options.viewMode !== 'times')
                        li.classList.add('show');
                }
                li.appendChild(dateView);
                content.appendChild(li);
            }
            if (this.context._options.toolbarPlacement === 'default') {
                content.appendChild(toolbar);
            }
            if (this._hasTime()) {
                const li = document.createElement('li');
                if (this.context._options.collapse && this._hasDate()) {
                    //li.classList.add('collapse'); //todo bootstrap
                    if (this.context._options.viewMode === 'times')
                        li.classList.add('show');
                }
                li.appendChild(timeView);
                content.appendChild(li);
            }
            if (this.context._options.toolbarPlacement === 'bottom') {
                content.appendChild(toolbar);
            }
            template.appendChild(content);
            this._widget = template;
        }
        _hasTime() {
            return this.context._options.display.components.hours || this.context._options.display.components.minutes || this.context._options.display.components.seconds;
        }
        _hasDate() {
            return this.context._options.display.components.year || this.context._options.display.components.month || this.context._options.display.components.date;
        }
        get _toolbar() {
            const tbody = document.createElement('tbody');
            if (this.context._options.display.buttons.showToday) {
                const td = document.createElement('td');
                const a = document.createElement('a');
                a.setAttribute('href', 'javascript:void(0);');
                a.setAttribute('tabindex', '-1');
                a.setAttribute('data-action', 'today');
                a.setAttribute('title', this.context._options.localization.today);
                a.appendChild(this.iconTag(this.context._options.display.icons.today));
                td.appendChild(a);
                tbody.appendChild(td);
            }
            if (!this.context._options.sideBySide && this.context._options.collapse && this._hasDate() && this._hasTime()) {
                let title, icon;
                if (this.context._options.viewMode === 'times') {
                    title = this.context._options.localization.selectDate;
                    icon = this.context._options.display.icons.date;
                }
                else {
                    title = this.context._options.localization.selectTime;
                    icon = this.context._options.display.icons.time;
                }
                const td = document.createElement('td');
                const a = document.createElement('a');
                a.setAttribute('href', 'javascript:void(0);');
                a.setAttribute('tabindex', '-1');
                a.setAttribute('data-action', 'togglePicker');
                a.setAttribute('title', title);
                a.appendChild(this.iconTag(icon));
                td.appendChild(a);
                tbody.appendChild(td);
            }
            if (this.context._options.display.buttons.showClear) {
                const td = document.createElement('td');
                const a = document.createElement('a');
                a.setAttribute('href', 'javascript:void(0);');
                a.setAttribute('tabindex', '-1');
                a.setAttribute('data-action', 'clear');
                a.setAttribute('title', this.context._options.localization.clear);
                a.appendChild(this.iconTag(this.context._options.display.icons.today));
                td.appendChild(a);
                tbody.appendChild(td);
            }
            if (this.context._options.display.buttons.showClose) {
                const td = document.createElement('td');
                const a = document.createElement('a');
                a.setAttribute('href', 'javascript:void(0);');
                a.setAttribute('tabindex', '-1');
                a.setAttribute('data-action', 'close');
                a.setAttribute('title', this.context._options.localization.close);
                a.appendChild(this.iconTag(this.context._options.display.icons.today));
                td.appendChild(a);
                tbody.appendChild(td);
            }
            const table = document.createElement('table');
            table.appendChild(tbody);
            return table;
        }
        /***
         *
         */
        get headTemplate() {
            const headTemplate = document.createElement('thead');
            const previous = document.createElement('th');
            previous.classList.add('prev');
            previous.setAttribute('data-action', 'previous');
            previous.appendChild(this.iconTag(this.context._options.display.icons.previous));
            headTemplate.appendChild(previous);
            const switcher = document.createElement('th');
            switcher.classList.add('picker-switch');
            switcher.setAttribute('data-action', 'pickerSwitch');
            switcher.setAttribute('colspan', this.context._options.calendarWeeks ? '6' : '5');
            headTemplate.appendChild(switcher);
            const next = document.createElement('th');
            next.classList.add('next');
            next.setAttribute('data-action', 'next');
            next.appendChild(this.iconTag(this.context._options.display.icons.next));
            headTemplate.appendChild(next);
            return headTemplate.cloneNode(true);
        }
        get contentTemplate() {
            const contentTemplate = document.createElement('tbody');
            const rowElement = document.createElement('tr');
            const td = document.createElement('td');
            td.setAttribute('colspan', this.context._options.calendarWeeks ? '6' : '5');
            rowElement.appendChild(td);
            contentTemplate.appendChild(rowElement);
            return contentTemplate.cloneNode(true);
        }
        iconTag(i) {
            const container = document.createElement('span');
            if (this.context._options.display.icons.type === 'sprites') {
                const svg = document.createElement('svg');
                svg.innerHTML = `<use xlink:href="${i}"></use>`;
                container.appendChild(svg);
                return container;
            }
            const icon = document.createElement('i');
            DOMTokenList.prototype.add.apply(icon.classList, i.split(' '));
            container.appendChild(icon);
            return container;
        }
    }

    class Validation {
        constructor(context) {
            this.context = context;
        }
        /**
         *
         * @param targetDate
         * @param granularity
         */
        isValid(targetDate, granularity) {
            return true;
        }
    }

    class TempusDominus {
        constructor(element, options) {
            this._options = this._getOptions(options);
            this._element = element;
            this._viewDate = new DateTime();
            this.currentViewMode = null;
            this.unset = true;
            this.minViewModeNumber = 0;
            this.display = new Display(this);
            this.validation = new Validation(this);
            this.dates = new Dates(this);
            this.action = new Actions(this);
            //#region temp - REMOVE THIS STUFF
            //this.dates.add(new DateTime());
            //#endregion
            this._initFormatting();
            this.currentViewMode = 1; //todo temp
            this.display.show();
            element.appendChild(this.display.widget);
            /* this.display.widget.querySelectorAll('[data-action]').forEach(element => element.addEventListener('click', (e) => {
                 this.action.do(e);
             }));*/
            delegatedEvents.on('click', '[data-action', (e) => this.action.do(e));
        }
        _getOptions(config) {
            config = Object.assign(Object.assign({}, Default), config);
            //todo missing Feather defaults
            //typeCheckConfig(NAME, config, DefaultType) //todo after the default structure gets changed, we can provide a object with value types
            return config;
        }
        _initFormatting() {
            if (this._options.display.components.year) {
                this.minViewModeNumber = 2;
            }
            if (this._options.display.components.month) {
                this.minViewModeNumber = 1;
            }
            if (this._options.display.components.date) {
                this.minViewModeNumber = 0;
            }
            this.currentViewMode = Math.max(this.minViewModeNumber, this.currentViewMode);
        }
        _notifyEvent(config) {
            console.log('notify', JSON.stringify(config, null, 2));
        }
        /**
         *
         * @param {Unit} e
         * @private
         */
        _viewUpdate(e) {
            this._notifyEvent({
                type: Namespace.EVENT_UPDATE,
                change: e,
                viewDate: this._viewDate.clone
            });
        }
    }

    exports.TempusDominus = TempusDominus;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
