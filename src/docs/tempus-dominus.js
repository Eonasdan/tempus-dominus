(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@popperjs/core')) :
    typeof define === 'function' && define.amd ? define(['exports', '@popperjs/core'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.tempusdominus = {}, global.Popper));
}(this, (function (exports, core) { 'use strict';

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
        formatWithOptions(options) {
            return this.format({
                year: options.display.components.date ? 'numeric' : undefined,
                month: options.display.components.date ? '2-digit' : undefined,
                day: options.display.components.date ? '2-digit' : undefined,
                hour: options.display.components.hours ? '2-digit' : undefined,
                minute: options.display.components.minutes ? '2-digit' : undefined,
                second: options.display.components.seconds ? '2-digit' : undefined,
                hour12: !options.display.components.useTwentyfourHour
            });
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
            return this.clone.startOf(unit).valueOf() < compare.clone.startOf(unit).valueOf();
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
            return this.clone.startOf(unit).valueOf() > compare.clone.startOf(unit).valueOf();
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
         * Returns two digit hours but in twelve hour mode e.g. 13 -> 1
         */
        get twelveHoursFormatted() {
            let hour = this.hours;
            if (hour > 12)
                hour = hour - 12;
            if (hour === 0)
                hour = 12;
            return hour < 10 ? (`0${hour}`) : `${hour}`;
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
            const MILLISECONDS_IN_WEEK = 604800000;
            const firstDayOfWeek = 1; // monday as the first day (0 = sunday)
            const startOfYear = new Date(this.year, 0, 1);
            startOfYear.setDate(startOfYear.getDate() + (firstDayOfWeek - (startOfYear.getDay() % 7)));
            return Math.round((this.valueOf() - startOfYear.valueOf()) / MILLISECONDS_IN_WEEK) + 1;
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
            minDate: undefined,
            maxDate: undefined,
            disabledDates: [],
            enabledDates: [],
            daysOfWeekDisabled: [],
            disabledTimeIntervals: [],
            disabledHours: [],
            enabledHours: [],
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
                close: 'fas fa-times',
            },
            collapse: true,
            sideBySide: false,
            calendarWeeks: false,
            viewMode: 'days',
            toolbarPlacement: 'default',
            buttons: {
                today: false,
                clear: false,
                close: false,
            },
            widgetPositioning: {
                horizontal: 'auto',
                vertical: 'auto',
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
                useTwentyfourHour: false,
            },
        },
        stepping: 1,
        useCurrent: true,
        defaultDate: false,
        localization: {
            //todo plugin
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
            dayViewHeaderFormat: 'long',
        },
        widgetParent: null,
        readonly: false,
        ignoreReadonly: false,
        keepOpen: false,
        focusOnShow: true,
        inline: false,
        keepInvalid: false,
        keyBinds: {
            //todo plugin //todo jquery //todo moment
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
            delete: function () {
                if (!this.widget) {
                    return false;
                }
                this.clear();
                return true;
            },
        },
        debug: false,
        allowInputToggle: false,
        viewDate: new DateTime(),
        allowMultidate: false,
        multidateSeparator: ', ',
        promptTimeOnDateChange: false,
        promptTimeOnDateChangeTransitionDelay: 200,
    };
    //this is not the way I want this to stay but nested classes seemed to blown once its compiled.
    const NAME = 'tempus-dominus';
    const VERSION = '6.0.0-alpha1';
    const DATA_KEY = 'td';
    const DATA_API_KEY = '.data-api';
    class Events {
        constructor() {
            this.KEY = `.${DATA_KEY}`;
            this.CHANGE = `change${this.KEY}`;
            this.UPDATE = `update${this.KEY}`;
            this.ERROR = `error${this.KEY}`;
            this.SHOW = `show${this.KEY}`;
            this.HIDE = `hide${this.KEY}`;
            this.BLUR = `blur${this.KEY}`;
            this.KEYUP = `keyup${this.KEY}`;
            this.KEYDOWN = `keydown${this.KEY}`;
            this.FOCUS = `focus${this.KEY}`;
            this.CLICK_DATA_API = `click${this.KEY}${DATA_API_KEY}`;
            this.clickAction = `click${this.KEY}.action`;
        }
    }
    class Css {
        constructor() {
            this.widget = `${NAME}-widget`;
            this.switch = 'picker-switch';
            // todo the next several classes are to represent states of the picker that would
            // make it wider then usual and it seems like this could be cleaned up.
            this.widgetCalendarWeeks = `${this.widget}-with-calendar-weeks`;
            this.useTwentyfour = 'useTwentyfour';
            this.wider = 'wider';
            this.sideBySide = 'timepicker-sbs';
            this.previous = 'previous';
            this.next = 'next';
            this.disabled = 'disabled';
            this.old = 'old';
            this.new = 'new';
            this.active = 'active';
            this.separator = 'separator';
            //#region date container
            this.dateContainer = 'date-container';
            this.decadesContainer = `${this.dateContainer}-decades`;
            this.decade = 'decade';
            this.yearsContainer = `${this.dateContainer}-years`;
            this.year = 'year';
            this.monthsContainer = `${this.dateContainer}-months`;
            this.month = 'month';
            this.daysContainer = `${this.dateContainer}-days`;
            this.day = 'day';
            this.calendarWeeks = 'cw';
            this.dayOfTheWeek = 'dow';
            this.today = 'today';
            this.weekend = 'weekend';
            //#endregion
            //#region time container
            this.timeContainer = 'time-container';
            this.clockContainer = `${this.timeContainer}-clock`;
            this.hourContainer = `${this.timeContainer}-hour`;
            this.minuteContainer = `${this.timeContainer}-minute`;
            this.secondContainer = `${this.timeContainer}-second`;
            this.hour = 'hour';
            this.minute = 'minute';
            this.second = 'second';
            //#endregion
            //#region collapse
            this.show = 'show';
            this.collapsing = 'td-collapsing';
            this.collapse = 'td-collapse';
            //#endregion
        }
    }
    class ErrorMessages {
        constructor() {
            this.dateString = 'TD: Using a string for date options is not recommended unless you specify an ISO string.';
            //#endregion
            //#region used with notify.error
            this.failedToSetInvalidDate = 'Failed to set invalid date';
            //#endregion
        }
        //#region out to console
        unexpectedOption(optionName) {
            return `TD: Unexpected option: ${optionName} does not match a known option.`;
        }
        typeMismatch(optionName, badType, expectedType) {
            return `TD: Mismatch types: ${optionName} has a type of ${badType} instead of the required ${expectedType}`;
        }
        numbersOutOfRage(optionName, lower, upper) {
            return `'TD: ${optionName} expected an array of number between ${lower} and ${upper}.'`;
        }
        failedToParseDate(optionName, date) {
            return `TD: Could not correctly parse "${date}" to a date for option ${optionName}.`;
        }
    }
    class Namespace {
    }
    Namespace.NAME = NAME;
    Namespace.VERSION = VERSION;
    Namespace.DATA_KEY = DATA_KEY;
    Namespace.DATA_API_KEY = DATA_API_KEY;
    Namespace.Events = new Events();
    Namespace.Css = new Css();
    Namespace.ErrorMessages = new ErrorMessages();
    const DatePickerModes = [
        {
            CLASS_NAME: Namespace.Css.daysContainer,
            NAV_FUNCTION: Unit.month,
            NAV_STEP: 1,
        },
        {
            CLASS_NAME: Namespace.Css.monthsContainer,
            NAV_FUNCTION: Unit.year,
            NAV_STEP: 1,
        },
        {
            CLASS_NAME: Namespace.Css.yearsContainer,
            NAV_FUNCTION: Unit.year,
            NAV_STEP: 10,
        },
        {
            CLASS_NAME: Namespace.Css.decadesContainer,
            NAV_FUNCTION: Unit.year,
            NAV_STEP: 100,
        },
    ];

    class Collapse {
        constructor() {
            this.getTransitionDurationFromElement = element => {
                if (!element) {
                    return 0;
                }
                // Get transition-duration of the element
                let { transitionDuration, transitionDelay } = window.getComputedStyle(element);
                const floatTransitionDuration = Number.parseFloat(transitionDuration);
                const floatTransitionDelay = Number.parseFloat(transitionDelay);
                // Return 0 if element or transition duration is not found
                if (!floatTransitionDuration && !floatTransitionDelay) {
                    return 0;
                }
                // If multiple durations are defined, take the first
                transitionDuration = transitionDuration.split(',')[0];
                transitionDelay = transitionDelay.split(',')[0];
                return ((Number.parseFloat(transitionDuration) +
                    Number.parseFloat(transitionDelay)) *
                    1000);
            };
        }
        toggle(target) {
            if (target.classList.contains(Namespace.Css.show)) {
                this.hide(target);
            }
            else {
                this.show(target);
            }
        }
        show(target) {
            if (target.classList.contains(Namespace.Css.collapsing) ||
                target.classList.contains(Namespace.Css.show))
                return;
            const complete = () => {
                target.classList.remove(Namespace.Css.collapsing);
                target.classList.add(Namespace.Css.collapse, Namespace.Css.show);
                target.style.height = '';
                this.timeOut = null;
            };
            target.style.height = '0';
            target.classList.remove(Namespace.Css.collapse);
            target.classList.add(Namespace.Css.collapsing);
            this.timeOut = setTimeout(complete, this.getTransitionDurationFromElement(target));
            target.style.height = `${target.scrollHeight}px`;
        }
        hide(target) {
            if (target.classList.contains(Namespace.Css.collapsing) ||
                !target.classList.contains(Namespace.Css.show))
                return;
            const complete = () => {
                target.classList.remove(Namespace.Css.collapsing);
                target.classList.add(Namespace.Css.collapse);
                this.timeOut = null;
            };
            target.style.height = `${target.getBoundingClientRect()['height']}px`;
            const reflow = element => element.offsetHeight;
            reflow(target);
            target.classList.remove(Namespace.Css.collapse, Namespace.Css.show);
            target.classList.add(Namespace.Css.collapsing);
            target.style.height = '';
            this.timeOut = setTimeout(complete, this.getTransitionDurationFromElement(target));
        }
    }

    class Actions {
        constructor(context) {
            this.context = context;
            this.collapse = new Collapse();
        }
        do(e, action) {
            const currentTarget = e.currentTarget;
            if (currentTarget.classList.contains(Namespace.Css.disabled))
                return false;
            action = action || currentTarget.dataset.action;
            const lastPicked = (this.context.dates.lastPicked || this.context._viewDate).clone;
            console.log('action', action);
            const modifyTime = (unit, value = 1) => {
                const newDate = lastPicked.manipulate(value, unit);
                if (this.context.validation.isValid(newDate, unit)) {
                    /*if (this.context.dates.lastPickedIndex < 0) {
                        this.date(newDate);
                    }*/
                    this.context.dates._setValue(newDate, this.context.dates.lastPickedIndex);
                }
            };
            switch (action) {
                case ActionTypes.next:
                case ActionTypes.previous:
                    const { NAV_FUNCTION, NAV_STEP } = DatePickerModes[this.context.currentViewMode];
                    if (action === ActionTypes.next)
                        this.context._viewDate.manipulate(NAV_STEP, NAV_FUNCTION);
                    else
                        this.context._viewDate.manipulate(NAV_STEP * -1, NAV_FUNCTION);
                    this.context.display.update('calendar');
                    this.context._viewUpdate(NAV_FUNCTION);
                    break;
                case ActionTypes.pickerSwitch:
                    this.context.display._showMode(1);
                    break;
                case ActionTypes.selectMonth:
                case ActionTypes.selectYear:
                case ActionTypes.selectDecade:
                    const value = +currentTarget.getAttribute('data-value');
                    switch (action) {
                        case ActionTypes.selectMonth:
                            this.context._viewDate.month = value;
                            this.context._viewUpdate(Unit.month);
                            break;
                        case ActionTypes.selectYear:
                            this.context._viewDate.year = value;
                            this.context._viewUpdate(Unit.year);
                            break;
                        case ActionTypes.selectDecade:
                            this.context._viewDate.year = value;
                            this.context._viewUpdate(Unit.year);
                            break;
                    }
                    if (this.context.currentViewMode === this.context.minViewModeNumber) {
                        this.context.dates._setValue(this.context._viewDate, this.context.dates.lastPickedIndex);
                        if (!this.context._options.inline) {
                            this.context.display.hide();
                        }
                    }
                    else {
                        this.context.display._showMode(-1);
                    }
                    break;
                case ActionTypes.selectDay:
                    const day = this.context._viewDate.clone;
                    if (currentTarget.classList.contains(Namespace.Css.old)) {
                        day.manipulate(-1, Unit.month);
                    }
                    if (currentTarget.classList.contains(Namespace.Css.new)) {
                        day.manipulate(1, Unit.month);
                    }
                    day.date = +currentTarget.innerText;
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
                    if (!this.context.display._hasTime() && !this.context._options.keepOpen &&
                        !this.context._options.inline && !this.context._options.allowMultidate) {
                        this.context.display.hide();
                    }
                    break;
                case ActionTypes.selectHour:
                    let hour = +currentTarget.getAttribute('data-value');
                    lastPicked.hours = hour;
                    this.context.dates._setValue(lastPicked, this.context.dates.lastPickedIndex);
                    if (this.context._options.display.components.useTwentyfourHour &&
                        !this.context._options.display.components.minutes && !this.context._options.keepOpen && !this.context._options.inline) {
                        this.context.display.hide();
                    }
                    else {
                        this.do(e, ActionTypes.showClock);
                    }
                    break;
                case ActionTypes.selectMinute:
                    lastPicked.minutes = +currentTarget.innerText;
                    this.context.dates._setValue(lastPicked, this.context.dates.lastPickedIndex);
                    if (this.context._options.display.components.useTwentyfourHour &&
                        !this.context._options.display.components.seconds && !this.context._options.keepOpen && !this.context._options.inline) {
                        this.context.display.hide();
                    }
                    else {
                        this.do(e, ActionTypes.showClock);
                    }
                    break;
                case ActionTypes.selectSecond:
                    lastPicked.seconds = +currentTarget.innerText;
                    this.context.dates._setValue(lastPicked, this.context.dates.lastPickedIndex);
                    if (this.context._options.display.components.useTwentyfourHour && !this.context._options.keepOpen &&
                        !this.context._options.inline) {
                        this.context.display.hide();
                    }
                    else {
                        this.do(e, ActionTypes.showClock);
                    }
                    break;
                case ActionTypes.incrementHours:
                    modifyTime(Unit.hours);
                    break;
                case ActionTypes.incrementMinutes:
                    modifyTime(Unit.minutes, this.context._options.stepping);
                    break;
                case ActionTypes.incrementSeconds:
                    modifyTime(Unit.seconds);
                    break;
                case ActionTypes.decrementHours:
                    modifyTime(Unit.hours, -1);
                    break;
                case ActionTypes.decrementMinutes:
                    modifyTime(Unit.minutes, this.context._options.stepping * -1);
                    break;
                case ActionTypes.decrementSeconds:
                    modifyTime(Unit.seconds, -1);
                    break;
                case ActionTypes.togglePeriod:
                    modifyTime(Unit.hours, this.context.dates.lastPicked.hours >= 12 ? -12 : 12);
                    break;
                case ActionTypes.togglePicker:
                    this.context.display.widget
                        .querySelectorAll(`.${Namespace.Css.dateContainer}, .${Namespace.Css.timeContainer}`)
                        .forEach((e) => this.collapse.toggle(e));
                    if (currentTarget.getAttribute('title') === this.context._options.localization.selectDate) {
                        currentTarget.setAttribute('title', this.context._options.localization.selectTime);
                        currentTarget.innerHTML = this.context.display.iconTag(this.context._options.display.icons.time).outerHTML;
                        this.context.display.update('calendar');
                    }
                    else {
                        currentTarget.setAttribute('title', this.context._options.localization.selectDate);
                        currentTarget.innerHTML = this.context.display.iconTag(this.context._options.display.icons.date).outerHTML;
                        this.do(e, ActionTypes.showClock);
                        this.context.display.update('clock');
                    }
                    break;
                case ActionTypes.showClock:
                case ActionTypes.showHours:
                case ActionTypes.showMinutes:
                case ActionTypes.showSeconds:
                    this.context.display.widget.querySelectorAll(`.${Namespace.Css.timeContainer} > div`)
                        .forEach((e) => e.style.display = 'none');
                    let classToUse = '';
                    switch (action) {
                        case ActionTypes.showClock:
                            classToUse = Namespace.Css.clockContainer;
                            this.context.display.update('clock');
                            break;
                        case ActionTypes.showHours:
                            classToUse = Namespace.Css.hourContainer;
                            this.context.display.update(Unit.hours);
                            break;
                        case ActionTypes.showMinutes:
                            classToUse = Namespace.Css.minuteContainer;
                            this.context.display.update(Unit.minutes);
                            break;
                        case ActionTypes.showSeconds:
                            classToUse = Namespace.Css.secondContainer;
                            this.context.display.update(Unit.seconds);
                            break;
                    }
                    this.context.display.widget.getElementsByClassName(classToUse)[0].style.display = 'block';
                    break;
                case ActionTypes.clear:
                    this.context.dates._setValue(null);
                    break;
                case ActionTypes.close:
                    this.context.display.hide();
                    break;
                case ActionTypes.today:
                    const today = new DateTime();
                    this.context._viewDate = today;
                    if (this.context.validation.isValid(today, Unit.date))
                        this.context.dates._setValue(today, this.context.dates.lastPickedIndex);
                    break;
            }
        }
    }
    var ActionTypes;
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
        ActionTypes["showClock"] = "showClock";
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
            const container = document.createElement('div');
            container.classList.add(Namespace.Css.daysContainer);
            const table = document.createElement('table');
            //table.classList.add('table', 'table-sm'); //todo bootstrap
            const headTemplate = this.context.display.headTemplate;
            const [previous, switcher, next] = headTemplate.getElementsByTagName('th');
            previous.getElementsByTagName('span')[0].setAttribute('title', this.context._options.localization.previousMonth);
            switcher.setAttribute('title', this.context._options.localization.selectMonth);
            next.getElementsByTagName('span')[0].setAttribute('title', this.context._options.localization.nextMonth);
            table.appendChild(headTemplate);
            const tableBody = document.createElement('tbody');
            tableBody.appendChild(this._daysOfTheWeek());
            let row = document.createElement('tr');
            if (this.context._options.display.calendarWeeks) {
                const td = document.createElement('td');
                const span = document.createElement('span');
                span.classList.add(Namespace.Css.calendarWeeks); //todo this option needs to be watched and the grid rebuilt if changed
                td.appendChild(span);
                row.appendChild(td);
            }
            for (let i = 0; i <= 42; i++) {
                if (i !== 0 && i % 7 === 0) {
                    tableBody.appendChild(row);
                    row = document.createElement('tr');
                    if (this.context._options.display.calendarWeeks) {
                        const td = document.createElement('td');
                        const span = document.createElement('span');
                        span.classList.add(Namespace.Css.calendarWeeks); //todo this option needs to be watched and the grid rebuilt if changed
                        td.appendChild(span);
                        row.appendChild(td);
                    }
                }
                const td = document.createElement('td');
                const span = document.createElement('span');
                span.setAttribute('data-action', ActionTypes.selectDay);
                td.appendChild(span);
                row.appendChild(td);
            }
            table.appendChild(tableBody);
            container.appendChild(table);
            return container;
        }
        update() {
            const container = this.context.display.widget.getElementsByClassName(Namespace.Css.daysContainer)[0];
            const [previous, switcher, next] = container.getElementsByTagName('thead')[0].getElementsByTagName('th');
            switcher.innerText = this.context._viewDate.format({ month: this.context._options.localization.dayViewHeaderFormat });
            this.context.validation.isValid(this.context._viewDate.clone.manipulate(-1, Unit.month), Unit.month) ?
                previous.classList.remove(Namespace.Css.disabled) : previous.classList.add(Namespace.Css.disabled);
            this.context.validation.isValid(this.context._viewDate.clone.manipulate(1, Unit.month), Unit.month) ?
                next.classList.remove(Namespace.Css.disabled) : next.classList.add(Namespace.Css.disabled);
            this.grid(container.querySelectorAll('tbody td span'));
        }
        grid(nodeList) {
            let innerDate = this.context._viewDate.clone.startOf(Unit.month).startOf('weekDay').manipulate(12, Unit.hours);
            nodeList.forEach((containerClone, index) => {
                if (this.context._options.display.calendarWeeks && containerClone.classList.contains(Namespace.Css.calendarWeeks)) {
                    containerClone.innerText = `${innerDate.week}`;
                    return;
                }
                let classes = [];
                classes.push(Namespace.Css.day);
                if (innerDate.isBefore(this.context._viewDate, Unit.month)) {
                    classes.push(Namespace.Css.old);
                }
                if (innerDate.isAfter(this.context._viewDate, Unit.month)) {
                    classes.push(Namespace.Css.new);
                }
                if (!this.context.unset && this.context.dates.isPicked(innerDate, Unit.date)) {
                    classes.push(Namespace.Css.active);
                }
                if (!this.context.validation.isValid(innerDate, Unit.date)) {
                    classes.push(Namespace.Css.disabled);
                }
                if (innerDate.isSame(new DateTime(), Unit.date)) {
                    classes.push(Namespace.Css.today);
                }
                if (innerDate.weekDay === 0 || innerDate.weekDay === 6) {
                    classes.push(Namespace.Css.weekend);
                }
                containerClone.classList.remove(...containerClone.classList);
                containerClone.classList.add(...classes);
                containerClone.setAttribute('data-value', `${innerDate.year}-${innerDate.monthFormatted}-${innerDate.dateFormatted}`);
                containerClone.innerText = `${innerDate.date}`;
                innerDate.manipulate(1, Unit.date);
            });
        }
        /***
         * Generates an html row that contains the days of the week.
         */
        _daysOfTheWeek() {
            let innerDate = this.context._viewDate.clone.startOf('weekDay').startOf(Unit.date);
            const row = document.createElement('tr');
            if (this.context._options.display.calendarWeeks) {
                const th = document.createElement('th');
                th.classList.add(Namespace.Css.calendarWeeks);
                th.innerText = '#';
                row.appendChild(th);
            }
            let i = 0;
            while (i < 7) {
                const th = document.createElement('th');
                th.classList.add(Namespace.Css.dayOfTheWeek);
                th.innerText = innerDate.format({ weekday: 'short' });
                innerDate.manipulate(1, Unit.date);
                row.appendChild(th);
                i++;
            }
            return row;
        }
    }

    class MonthDisplay {
        constructor(context) {
            this.context = context;
        }
        get picker() {
            const container = document.createElement('div');
            container.classList.add(Namespace.Css.monthsContainer);
            const table = document.createElement('table');
            //table.classList.add('table', 'table-sm'); //todo bootstrap
            const headTemplate = this.context.display.headTemplate;
            const [previous, switcher, next] = headTemplate.getElementsByTagName('th');
            previous.getElementsByTagName('span')[0].setAttribute('title', this.context._options.localization.previousYear);
            switcher.setAttribute('title', this.context._options.localization.selectYear);
            switcher.setAttribute('colspan', '1');
            next.getElementsByTagName('span')[0].setAttribute('title', this.context._options.localization.nextYear);
            table.appendChild(headTemplate);
            const tableBody = document.createElement('tbody');
            let row = document.createElement('tr');
            for (let i = 0; i <= 12; i++) {
                if (i !== 0 && i % 3 === 0) {
                    tableBody.appendChild(row);
                    row = document.createElement('tr');
                }
                const td = document.createElement('td');
                const span = document.createElement('span');
                span.setAttribute('data-action', ActionTypes.selectMonth);
                td.appendChild(span);
                row.appendChild(td);
            }
            table.appendChild(tableBody);
            container.appendChild(table);
            return container;
        }
        update() {
            const container = this.context.display.widget.getElementsByClassName(Namespace.Css.monthsContainer)[0];
            const [previous, switcher, next] = container.getElementsByTagName('thead')[0].getElementsByTagName('th');
            switcher.innerText = this.context._viewDate.format({ year: 'numeric' });
            this.context.validation.isValid(this.context._viewDate.clone.manipulate(-1, Unit.year), Unit.year) ?
                previous.classList.remove(Namespace.Css.disabled) : previous.classList.add(Namespace.Css.disabled);
            this.context.validation.isValid(this.context._viewDate.clone.manipulate(1, Unit.year), Unit.year) ?
                next.classList.remove(Namespace.Css.disabled) : next.classList.add(Namespace.Css.disabled);
            this.grid(container.querySelectorAll('tbody td span'));
        }
        grid(nodeList) {
            let innerDate = this.context._viewDate.clone.startOf(Unit.year);
            nodeList.forEach((containerClone, index) => {
                let classes = [];
                classes.push(Namespace.Css.month);
                if (!this.context.unset && this.context.dates.isPicked(innerDate, Unit.month)) {
                    classes.push(Namespace.Css.active);
                }
                if (!this.context.validation.isValid(innerDate, Unit.month)) {
                    classes.push(Namespace.Css.disabled);
                }
                containerClone.classList.remove(...containerClone.classList);
                containerClone.classList.add(...classes);
                containerClone.setAttribute('data-value', `${index}`);
                containerClone.innerText = `${innerDate.format({ month: 'long' })}`;
                innerDate.manipulate(1, Unit.month);
            });
        }
    }

    class YearDisplay {
        constructor(context) {
            this.context = context;
            this._startYear = this.context._viewDate.clone.manipulate(-1, Unit.year);
            this._endYear = this.context._viewDate.clone.manipulate(10, Unit.year);
        }
        get picker() {
            const container = document.createElement('div');
            container.classList.add(Namespace.Css.yearsContainer);
            const table = document.createElement('table');
            //table.classList.add('table', 'table-sm'); //todo bootstrap
            const headTemplate = this.context.display.headTemplate;
            const [previous, switcher, next] = headTemplate.getElementsByTagName('th');
            previous.getElementsByTagName('span')[0].setAttribute('title', this.context._options.localization.previousDecade);
            switcher.setAttribute('title', this.context._options.localization.selectDecade);
            switcher.setAttribute('colspan', '1');
            next.getElementsByTagName('span')[0].setAttribute('title', this.context._options.localization.nextDecade);
            table.appendChild(headTemplate);
            const tableBody = document.createElement('tbody');
            let row = document.createElement('tr');
            for (let i = 0; i <= 12; i++) {
                if (i !== 0 && i % 3 === 0) {
                    tableBody.appendChild(row);
                    row = document.createElement('tr');
                }
                const td = document.createElement('td');
                const span = document.createElement('span');
                span.setAttribute('data-action', ActionTypes.selectYear);
                td.appendChild(span);
                row.appendChild(td);
            }
            table.appendChild(tableBody);
            container.appendChild(table);
            return container;
        }
        update() {
            const container = this.context.display.widget.getElementsByClassName(Namespace.Css.yearsContainer)[0];
            const [previous, switcher, next] = container.getElementsByTagName('thead')[0].getElementsByTagName('th');
            switcher.innerText = `${this._startYear.year}-${this._endYear.year}`;
            this.context.validation.isValid(this._startYear, Unit.year) ? previous.classList.remove(Namespace.Css.disabled) : previous.classList.add(Namespace.Css.disabled);
            this.context.validation.isValid(this._endYear, Unit.year) ? next.classList.remove(Namespace.Css.disabled) : next.classList.add(Namespace.Css.disabled);
            this.grid(container.querySelectorAll('tbody td span'));
        }
        grid(nodeList) {
            let innerDate = this.context._viewDate.clone.startOf(Unit.year).manipulate(-1, Unit.year);
            nodeList.forEach((containerClone, index) => {
                let classes = [];
                classes.push(Namespace.Css.year);
                if (!this.context.unset && this.context.dates.isPicked(innerDate, Unit.year)) {
                    classes.push(Namespace.Css.active);
                }
                if (!this.context.validation.isValid(innerDate, Unit.year)) {
                    classes.push(Namespace.Css.disabled);
                }
                containerClone.classList.remove(...containerClone.classList);
                containerClone.classList.add(...classes);
                containerClone.innerText = `${innerDate.year}`;
                innerDate.manipulate(1, Unit.year);
            });
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
            if (this._dates.length === 0)
                return 0;
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
            const format = Dates.getFormatByUnit(unit);
            let innerDateFormatted = innerDate.format(format);
            return this._dates.map(x => x.format(format)).find(x => x === innerDateFormatted) !== undefined;
        }
        pickedIndex(innerDate, unit) {
            if (!unit)
                return this._dates.indexOf(innerDate);
            const format = Dates.getFormatByUnit(unit);
            let innerDateFormatted = innerDate.format(format);
            return this._dates.map(x => x.format(format)).indexOf(innerDateFormatted);
        }
        static getStartEndYear(factor, year) {
            const step = factor / 10, startYear = Math.floor(year / factor) * factor, endYear = startYear + step * 9, focusValue = Math.floor(year / step) * step;
            return [startYear, endYear, focusValue];
        }
        _setValue(target, index) {
            const noIndex = (typeof index === 'undefined'), isClear = !target && noIndex;
            let oldDate = this.context.unset ? null : this._dates[index];
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
                    type: Namespace.Events.CHANGE,
                    date: undefined,
                    oldDate,
                    isClear,
                    isValid: true,
                });
                this.context.display.update('all');
                return;
            }
            index = 0;
            target = target.clone;
            if (this.context._options.stepping !== 1) {
                target.minutes = Math.round(target.minutes / this.context._options.stepping) * this.context._options.stepping;
                target.seconds = 0;
            }
            if (this.context.validation.isValid(target)) {
                this._dates[index] = target;
                this.context._viewDate = target.clone;
                //TODO: format to the proper string
                if (this.context._input && this.context._input.value != target.toString()) {
                    this.context._input.value = this.context._viewDate.formatWithOptions(this.context._options);
                }
                this.context.unset = false;
                this.context.display.update('all');
                this.context._notifyEvent({
                    type: Namespace.Events.CHANGE,
                    date: target,
                    oldDate,
                    isClear,
                    isValid: true,
                });
                //todo remove this
                console.log(JSON.stringify(this._dates.map(d => d.format({ dateStyle: 'full', timeStyle: 'long' })), null, 2)); //todo remove
                return;
            }
            if (this.context._options.keepInvalid) {
                this._dates[index] = target;
                this.context._viewDate = target.clone;
                this.context._notifyEvent({
                    type: Namespace.Events.CHANGE,
                    date: target,
                    oldDate,
                    isClear,
                    isValid: false,
                });
            }
            this.context._notifyEvent({
                type: Namespace.Events.ERROR,
                reason: Namespace.ErrorMessages.failedToSetInvalidDate,
                date: target,
                oldDate
            });
        }
        static getFormatByUnit(unit) {
            switch (unit) {
                case 'date':
                    return { dateStyle: 'short' };
                case 'month':
                    return {
                        month: 'numeric',
                        year: 'numeric'
                    };
                case 'year':
                    return { year: 'numeric' };
            }
        }
    }

    class DecadeDisplay {
        constructor(context) {
            this.context = context;
        }
        get picker() {
            const container = document.createElement('div');
            container.classList.add(Namespace.Css.decadesContainer);
            const table = document.createElement('table');
            //table.classList.add('table', 'table-sm'); //todo bootstrap
            const headTemplate = this.context.display.headTemplate;
            const [previous, switcher, next] = headTemplate.getElementsByTagName('th');
            previous.getElementsByTagName('span')[0].setAttribute('title', this.context._options.localization.previousCentury);
            switcher.setAttribute('title', '');
            switcher.removeAttribute('data-action');
            switcher.setAttribute('colspan', '1');
            next.getElementsByTagName('span')[0].setAttribute('title', this.context._options.localization.nextCentury);
            table.appendChild(headTemplate);
            const tableBody = document.createElement('tbody');
            let row = document.createElement('tr');
            for (let i = 0; i <= 12; i++) {
                if (i !== 0 && i % 3 === 0) {
                    tableBody.appendChild(row);
                    row = document.createElement('tr');
                }
                const td = document.createElement('td');
                const span = document.createElement('span');
                span.setAttribute('data-action', ActionTypes.selectDecade);
                td.appendChild(span);
                row.appendChild(td);
            }
            table.appendChild(tableBody);
            container.appendChild(table);
            return container;
        }
        update() {
            const [start, end] = Dates.getStartEndYear(100, this.context._viewDate.year);
            this._startDecade = this.context._viewDate.clone.startOf(Unit.year);
            this._startDecade.year = start;
            this._endDecade = this.context._viewDate.clone.startOf(Unit.year);
            this._endDecade.year = end;
            const container = this.context.display.widget.getElementsByClassName(Namespace.Css.decadesContainer)[0];
            const [previous, switcher, next] = container.getElementsByTagName('thead')[0].getElementsByTagName('th');
            switcher.innerText = `${this._startDecade.year}-${this._endDecade.year}`;
            this.context.validation.isValid(this._startDecade, Unit.year) ? previous.classList.remove(Namespace.Css.disabled) : previous.classList.add(Namespace.Css.disabled);
            this.context.validation.isValid(this._endDecade, Unit.year) ? next.classList.remove(Namespace.Css.disabled) : next.classList.add(Namespace.Css.disabled);
            this.grid(container.querySelectorAll('tbody td span'));
        }
        grid(nodeList) {
            const pickedYears = this.context.dates.picked.map(x => x.year);
            nodeList.forEach((containerClone, index) => {
                if (index === 0) {
                    containerClone.classList.add(Namespace.Css.old);
                    if (this._startDecade.year - 10 < 0) {
                        containerClone.innerText = '&nbsp;';
                        return;
                    }
                    else {
                        containerClone.innerText = `${this._startDecade.year - 10}`;
                        containerClone.setAttribute('data-value', `${this._startDecade.year + 6}`);
                        return;
                    }
                }
                let classes = [];
                classes.push(Namespace.Css.decade);
                const startDecadeYear = this._startDecade.year;
                const endDecadeYear = this._startDecade.year + 9;
                if (!this.context.unset && pickedYears.filter(x => x >= startDecadeYear && x <= endDecadeYear).length > 0) {
                    classes.push(Namespace.Css.active);
                }
                /* if (!this.context.validation.isValid(innerDate, 'y')) { //todo between
                     classes.push('disabled');
                 }*/
                containerClone.classList.remove(...containerClone.classList);
                containerClone.classList.add(...classes);
                containerClone.setAttribute('data-value', `${this._startDecade.year + 6}`);
                containerClone.innerText = `${this._startDecade.year}`;
                if (nodeList.length === index + 1) {
                    containerClone.classList.add(Namespace.Css.old);
                }
                this._startDecade.manipulate(10, Unit.year);
            });
        }
    }

    class TimeDisplay {
        constructor(context) {
            this.context = context;
        }
        get picker() {
            const container = document.createElement('div');
            container.classList.add(Namespace.Css.clockContainer);
            const table = document.createElement('table');
            const tableBody = document.createElement('tbody');
            this._grid().forEach(row => tableBody.appendChild(row));
            table.appendChild(tableBody);
            container.appendChild(table);
            return container;
        }
        update() {
            const timesDiv = this.context.display.widget.getElementsByClassName(Namespace.Css.timeContainer)[0];
            const lastPicked = (this.context.dates.lastPicked || this.context._viewDate).clone;
            if (!this.context._options.display.components.useTwentyfourHour) {
                const toggle = timesDiv.querySelector(`[data-action=${ActionTypes.togglePeriod}]`);
                toggle.innerText = lastPicked.meridiem();
                if (!this.context.validation.isValid(lastPicked.clone.manipulate(lastPicked.hours >= 12 ? -12 : 12, Unit.hours))) {
                    toggle.classList.add(Namespace.Css.disabled);
                }
                else {
                    toggle.classList.remove(Namespace.Css.disabled);
                }
            }
            timesDiv.querySelectorAll('.disabled').forEach(element => element.classList.remove(Namespace.Css.disabled));
            if (this.context._options.display.components.hours) {
                if (!this.context.validation.isValid(this.context._viewDate.clone.manipulate(1, Unit.hours), Unit.hours)) {
                    timesDiv.querySelector(`[data-action=${ActionTypes.incrementHours}]`).classList.add(Namespace.Css.disabled);
                }
                if (!this.context.validation.isValid(this.context._viewDate.clone.manipulate(-1, Unit.hours), Unit.hours)) {
                    timesDiv.querySelector(`[data-action=${ActionTypes.decrementHours}]`).classList.add(Namespace.Css.disabled);
                }
                timesDiv.querySelector(`[data-time-component=${Unit.hours}]`).innerText =
                    this.context._options.display.components.useTwentyfourHour ? lastPicked.hoursFormatted : lastPicked.twelveHoursFormatted;
            }
            if (this.context._options.display.components.minutes) {
                if (!this.context.validation.isValid(this.context._viewDate.clone.manipulate(1, Unit.minutes), Unit.minutes)) {
                    timesDiv.querySelector(`[data-action=${ActionTypes.incrementMinutes}]`).classList.add(Namespace.Css.disabled);
                }
                if (!this.context.validation.isValid(this.context._viewDate.clone.manipulate(-1, Unit.minutes), Unit.minutes)) {
                    timesDiv.querySelector(`[data-action=${ActionTypes.decrementMinutes}]`).classList.add(Namespace.Css.disabled);
                }
                timesDiv.querySelector(`[data-time-component=${Unit.minutes}]`).innerText = lastPicked.minutesFormatted;
            }
            if (this.context._options.display.components.seconds) {
                if (!this.context.validation.isValid(this.context._viewDate.clone.manipulate(1, Unit.seconds), Unit.seconds)) {
                    timesDiv.querySelector(`[data-action=${ActionTypes.incrementSeconds}]`).classList.add(Namespace.Css.disabled);
                }
                if (!this.context.validation.isValid(this.context._viewDate.clone.manipulate(-1, Unit.seconds), Unit.seconds)) {
                    timesDiv.querySelector(`[data-action=${ActionTypes.decrementSeconds}]`).classList.add(Namespace.Css.disabled);
                }
                timesDiv.querySelector(`[data-time-component=${Unit.seconds}]`).innerText = lastPicked.secondsFormatted;
            }
        }
        _grid() {
            const rows = [], separator = document.createElement('td'), separatorColon = separator.cloneNode(true), topRow = document.createElement('tr'), middleRow = document.createElement('tr'), bottomRow = document.createElement('tr'), upIcon = this.context.display.iconTag(this.context._options.display.icons.up), downIcon = this.context.display.iconTag(this.context._options.display.icons.down), actionSpan = document.createElement('span');
            separator.classList.add(Namespace.Css.separator);
            separatorColon.innerHTML = ':';
            actionSpan.classList.add('btn'); //todo bootstrap
            if (this.context._options.display.components.hours) {
                let td = document.createElement('td');
                let actionLinkClone = actionSpan.cloneNode(true);
                actionLinkClone.setAttribute('title', this.context._options.localization.incrementHour);
                actionLinkClone.setAttribute('data-action', ActionTypes.incrementHours);
                actionLinkClone.appendChild(upIcon.cloneNode(true));
                td.appendChild(actionLinkClone);
                topRow.appendChild(td);
                td = document.createElement('td');
                const span = document.createElement('span');
                span.setAttribute('title', this.context._options.localization.pickHour);
                span.setAttribute('data-action', ActionTypes.showHours);
                span.setAttribute('data-time-component', Unit.hours);
                td.appendChild(span);
                middleRow.appendChild(td);
                td = document.createElement('td');
                actionLinkClone = actionSpan.cloneNode(true);
                actionLinkClone.setAttribute('title', this.context._options.localization.decrementHour);
                actionLinkClone.setAttribute('data-action', ActionTypes.decrementHours);
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
                let actionLinkClone = actionSpan.cloneNode(true);
                actionLinkClone.setAttribute('title', this.context._options.localization.incrementMinute);
                actionLinkClone.setAttribute('data-action', ActionTypes.incrementMinutes);
                actionLinkClone.appendChild(upIcon.cloneNode(true));
                td.appendChild(actionLinkClone);
                topRow.appendChild(td);
                td = document.createElement('td');
                const span = document.createElement('span');
                span.setAttribute('title', this.context._options.localization.pickMinute);
                span.setAttribute('data-action', ActionTypes.showMinutes);
                span.setAttribute('data-time-component', Unit.minutes);
                td.appendChild(span);
                middleRow.appendChild(td);
                td = document.createElement('td');
                actionLinkClone = actionSpan.cloneNode(true);
                actionLinkClone.setAttribute('title', this.context._options.localization.decrementMinute);
                actionLinkClone.setAttribute('data-action', ActionTypes.decrementMinutes);
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
                let actionLinkClone = actionSpan.cloneNode(true);
                actionLinkClone.setAttribute('title', this.context._options.localization.incrementSecond);
                actionLinkClone.setAttribute('data-action', ActionTypes.incrementSeconds);
                actionLinkClone.appendChild(upIcon.cloneNode(true));
                td.appendChild(actionLinkClone);
                topRow.appendChild(td);
                td = document.createElement('td');
                const span = document.createElement('span');
                span.setAttribute('title', this.context._options.localization.pickSecond);
                span.setAttribute('data-action', ActionTypes.showSeconds);
                span.setAttribute('data-time-component', Unit.seconds);
                td.appendChild(span);
                middleRow.appendChild(td);
                td = document.createElement('td');
                actionLinkClone = actionSpan.cloneNode(true);
                actionLinkClone.setAttribute('title', this.context._options.localization.decrementSecond);
                actionLinkClone.setAttribute('data-action', ActionTypes.decrementSeconds);
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
                button.setAttribute('data-action', ActionTypes.togglePeriod);
                button.setAttribute('tabindex', '-1');
                td.appendChild(button);
                middleRow.appendChild(td);
                bottomRow.appendChild(separator.cloneNode(true));
            }
            rows.push(topRow, middleRow, bottomRow);
            return rows;
        }
    }

    class HourDisplay {
        constructor(context) {
            this.context = context;
        }
        get picker() {
            const container = document.createElement('div');
            container.classList.add(Namespace.Css.hourContainer);
            const table = document.createElement('table');
            //table.classList.add('table', 'table-sm'); //todo bootstrap
            const tableBody = document.createElement('tbody');
            let row = document.createElement('tr');
            for (let i = 0; i <= (this.context._options.display.components.useTwentyfourHour ? 24 : 12); i++) {
                if (i !== 0 && i % 4 === 0) {
                    tableBody.appendChild(row);
                    row = document.createElement('tr');
                }
                const td = document.createElement('td');
                const span = document.createElement('span');
                span.setAttribute('data-action', ActionTypes.selectHour);
                td.appendChild(span);
                row.appendChild(td);
            }
            table.appendChild(tableBody);
            container.appendChild(table);
            return container;
        }
        update() {
            const container = this.context.display.widget.getElementsByClassName(Namespace.Css.hourContainer)[0];
            let innerDate = this.context._viewDate.clone.startOf(Unit.date);
            container.querySelectorAll('tbody td span').forEach((containerClone, index) => {
                let classes = [];
                classes.push(Namespace.Css.hour);
                if (!this.context.validation.isValid(innerDate, Unit.hours)) {
                    classes.push(Namespace.Css.disabled);
                }
                containerClone.classList.remove(...containerClone.classList);
                containerClone.classList.add(...classes);
                containerClone.setAttribute('data-value', `${innerDate.hours}`);
                containerClone.innerText = this.context._options.display.components.useTwentyfourHour ? innerDate.hoursFormatted : innerDate.twelveHoursFormatted;
                innerDate.manipulate(1, Unit.hours);
            });
        }
    }

    class MinuteDisplay {
        constructor(context) {
            this.context = context;
        }
        get picker() {
            const container = document.createElement('div');
            container.classList.add(Namespace.Css.minuteContainer);
            const table = document.createElement('table');
            //table.classList.add('table', 'table-sm'); //todo bootstrap
            const tableBody = document.createElement('tbody');
            let row = document.createElement('tr');
            let step = this.context._options.stepping === 1 ? 5 : this.context._options.stepping;
            for (let i = 0; i <= 60 / step; i++) {
                if (i !== 0 && i % 4 === 0) {
                    tableBody.appendChild(row);
                    row = document.createElement('tr');
                }
                const td = document.createElement('td');
                const span = document.createElement('span');
                span.setAttribute('data-action', ActionTypes.selectMinute);
                td.appendChild(span);
                row.appendChild(td);
            }
            table.appendChild(tableBody);
            container.appendChild(table);
            return container;
        }
        update() {
            const container = this.context.display.widget.getElementsByClassName(Namespace.Css.minuteContainer)[0];
            let innerDate = this.context._viewDate.clone.startOf(Unit.hours);
            let step = this.context._options.stepping === 1 ? 5 : this.context._options.stepping;
            container.querySelectorAll('tbody td span').forEach((containerClone, index) => {
                let classes = [];
                classes.push(Namespace.Css.minute);
                if (!this.context.validation.isValid(innerDate, Unit.minutes)) {
                    classes.push(Namespace.Css.disabled);
                }
                containerClone.classList.remove(...containerClone.classList);
                containerClone.classList.add(...classes);
                containerClone.setAttribute('data-value', `${innerDate.minutes}`);
                containerClone.innerText = innerDate.minutesFormatted;
                innerDate.manipulate(step, Unit.minutes);
            });
        }
    }

    class secondDisplay {
        constructor(context) {
            this.context = context;
        }
        get picker() {
            const container = document.createElement('div');
            container.classList.add(Namespace.Css.secondContainer);
            const table = document.createElement('table');
            //table.classList.add('table', 'table-sm'); //todo bootstrap
            const tableBody = document.createElement('tbody');
            let row = document.createElement('tr');
            for (let i = 0; i <= 12; i++) {
                if (i !== 0 && i % 4 === 0) {
                    tableBody.appendChild(row);
                    row = document.createElement('tr');
                }
                const td = document.createElement('td');
                const span = document.createElement('span');
                span.setAttribute('data-action', ActionTypes.selectSecond);
                td.appendChild(span);
                row.appendChild(td);
            }
            table.appendChild(tableBody);
            container.appendChild(table);
            return container;
        }
        update() {
            const container = this.context.display.widget.getElementsByClassName(Namespace.Css.secondContainer)[0];
            let innerDate = this.context._viewDate.clone.startOf(Unit.minutes);
            container.querySelectorAll('tbody td span').forEach((containerClone, index) => {
                let classes = [];
                classes.push(Namespace.Css.second);
                if (!this.context.validation.isValid(innerDate, Unit.seconds)) {
                    classes.push(Namespace.Css.disabled);
                }
                containerClone.classList.remove(...containerClone.classList);
                containerClone.classList.add(...classes);
                containerClone.setAttribute('data-value', `${innerDate.seconds}`);
                containerClone.innerText = innerDate.secondsFormatted;
                innerDate.manipulate(5, Unit.seconds);
            });
        }
    }

    class Display {
        constructor(context) {
            this.context = context;
            this.dateDisplay = new DateDisplay(context);
            this.monthDisplay = new MonthDisplay(context);
            this.yearDisplay = new YearDisplay(context);
            this.decadeDisplay = new DecadeDisplay(context);
            this.timeDisplay = new TimeDisplay(context);
            this.hourDisplay = new HourDisplay(context);
            this.minuteDisplay = new MinuteDisplay(context);
            this.secondDisplay = new secondDisplay(context);
            this._widget = undefined;
        }
        get widget() {
            return this._widget;
        }
        update(unit) {
            if (!this._widget)
                return;
            //todo do I want some kind of error catching or other guards here?
            switch (unit) {
                case Unit.seconds:
                    this.secondDisplay.update();
                    break;
                case Unit.minutes:
                    this.minuteDisplay.update();
                    break;
                case Unit.hours:
                    this.hourDisplay.update();
                    break;
                case Unit.date:
                    this.dateDisplay.update();
                    break;
                case Unit.month:
                    this.monthDisplay.update();
                    break;
                case Unit.year:
                    this.yearDisplay.update();
                    break;
                case 'clock':
                    this.timeDisplay.update();
                    this.update(Unit.hours);
                    this.update(Unit.minutes);
                    this.update(Unit.seconds);
                    break;
                case 'calendar':
                    this.update(Unit.date);
                    this.update(Unit.year);
                    this.update(Unit.month);
                    this.decadeDisplay.update();
                    break;
                case 'all':
                    if (this._hasTime()) {
                        this.update('clock');
                    }
                    if (this._hasDate()) {
                        this.update('calendar');
                    }
            }
        }
        show() {
            if (this.context._options.useCurrent) {
                //todo in the td4 branch a pr changed this to allow granularity
                this.context.dates._setValue(new DateTime());
            }
            this._buildWidget();
            if (this._hasDate()) {
                this._showMode();
            }
            document.body.appendChild(this.widget);
            if (this.context._options.display.viewMode == 'times') {
                this.context.action.do({ currentTarget: this.widget.querySelector(`.${Namespace.Css.timeContainer}`) }, ActionTypes.showClock);
            }
            this.widget.querySelectorAll('[data-action]')
                .forEach(element => element.addEventListener('click', (e) => {
                this.context.action.do(e);
            }));
            this.popperInstance = core.createPopper(this.context._element, this.widget, {
                modifiers: [
                    {
                        name: 'offset',
                        options: {
                            offset: [0, 8],
                        },
                    },
                ],
                placement: 'top'
            });
            /*window.addEventListener('resize', () => this._place());
            this._place();*/
            this.widget.classList.add(Namespace.Css.show);
            this.popperInstance.setOptions({
                modifiers: [{ name: 'eventListeners', enabled: true }],
            });
            this.popperInstance.update();
            this.context._notifyEvent({
                type: Namespace.Events.SHOW
            });
        }
        _showMode(direction) {
            if (!this.widget) {
                return;
            }
            if (direction) {
                const max = Math.max(this.context.minViewModeNumber, Math.min(3, this.context.currentViewMode + direction));
                if (this.context.currentViewMode == max)
                    return;
                this.context.currentViewMode = max;
            }
            this.widget.querySelectorAll(`.${Namespace.Css.dateContainer} > div, .${Namespace.Css.timeContainer} > div`)
                .forEach((e) => e.style.display = 'none');
            const datePickerMode = DatePickerModes[this.context.currentViewMode];
            let picker = this.widget.querySelector(`.${datePickerMode.CLASS_NAME}`);
            switch (datePickerMode.CLASS_NAME) {
                case Namespace.Css.decadesContainer:
                    this.decadeDisplay.update();
                    break;
                case Namespace.Css.yearsContainer:
                    this.yearDisplay.update();
                    break;
                case Namespace.Css.monthsContainer:
                    this.monthDisplay.update();
                    break;
                case Namespace.Css.daysContainer:
                    this.dateDisplay.update();
                    break;
            }
            picker.style.display = 'block';
        }
        hide() {
            this.widget.classList.remove(Namespace.Css.show);
            this.popperInstance.setOptions({
                modifiers: [{ name: 'eventListeners', enabled: false }],
            });
            document.getElementsByClassName(Namespace.Css.widget)[0].remove();
            this._widget = undefined;
            this.context._notifyEvent({
                type: Namespace.Events.HIDE,
                date: this.context.unset ? null : (this.context.dates.lastPicked ? this.context.dates.lastPicked.clone : void 0)
            });
        }
        toggle() {
            return this.widget ? this.hide() : this.show();
        }
        _place() {
        }
        _buildWidget() {
            const template = document.createElement('div');
            template.classList.add(Namespace.Css.widget);
            //template.classList.add('dropdown-menu'); //todo bootstrap
            if (this.context._options.display.calendarWeeks)
                template.classList.add(Namespace.Css.widgetCalendarWeeks);
            const dateView = document.createElement('div');
            dateView.classList.add(Namespace.Css.dateContainer);
            dateView.appendChild(this.decadeDisplay.picker);
            dateView.appendChild(this.yearDisplay.picker);
            dateView.appendChild(this.monthDisplay.picker);
            dateView.appendChild(this.dateDisplay.picker);
            const timeView = document.createElement('div');
            timeView.classList.add(Namespace.Css.timeContainer);
            timeView.appendChild(this.timeDisplay.picker);
            timeView.appendChild(this.hourDisplay.picker);
            timeView.appendChild(this.minuteDisplay.picker);
            timeView.appendChild(this.secondDisplay.picker);
            const toolbar = document.createElement('div');
            toolbar.classList.add(Namespace.Css.switch);
            toolbar.appendChild(this._toolbar);
            if (this.context._options.display.components.useTwentyfourHour) {
                template.classList.add(Namespace.Css.useTwentyfour);
            }
            if (this.context._options.display.components.seconds && !this.context._options.display.components.useTwentyfourHour) {
                template.classList.add(Namespace.Css.wider);
            }
            if (this.context._options.display.sideBySide && this._hasDate() && this._hasTime()) {
                template.classList.add(Namespace.Css.sideBySide);
                if (this.context._options.display.toolbarPlacement === 'top') {
                    template.appendChild(toolbar);
                }
                const row = document.createElement('div');
                row.classList.add('row'); //todo bootstrap
                dateView.classList.add('col-md-6');
                timeView.classList.add('col-md-6');
                row.appendChild(dateView);
                row.appendChild(timeView);
                if (this.context._options.display.toolbarPlacement === 'bottom' || this.context._options.display.toolbarPlacement === 'default') {
                    template.appendChild(toolbar);
                }
                this._widget = template;
                return;
            }
            //const content = document.createElement('div');
            if (this.context._options.display.toolbarPlacement === 'top') {
                template.appendChild(toolbar);
            }
            if (this._hasDate()) {
                if (this.context._options.display.collapse && this._hasTime()) {
                    dateView.classList.add(Namespace.Css.collapse);
                    if (this.context._options.display.viewMode !== 'times')
                        dateView.classList.add(Namespace.Css.show);
                }
                template.appendChild(dateView);
            }
            if (this.context._options.display.toolbarPlacement === 'default') {
                template.appendChild(toolbar);
            }
            if (this._hasTime()) {
                if (this.context._options.display.collapse && this._hasDate()) {
                    timeView.classList.add(Namespace.Css.collapse);
                    if (this.context._options.display.viewMode === 'times')
                        timeView.classList.add(Namespace.Css.show);
                }
                template.appendChild(timeView);
            }
            if (this.context._options.display.toolbarPlacement === 'bottom') {
                template.appendChild(toolbar);
            }
            //template.appendChild(template);
            //<div class="arrow" data-popper-arrow></div>
            const arrow = document.createElement('div');
            arrow.classList.add('arrow');
            arrow.setAttribute('data-popper-arrow', '');
            template.appendChild(arrow);
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
            if (this.context._options.display.buttons.today) {
                const td = document.createElement('td');
                const span = document.createElement('span');
                span.setAttribute('data-action', ActionTypes.today);
                span.setAttribute('title', this.context._options.localization.today);
                span.appendChild(this.iconTag(this.context._options.display.icons.today));
                td.appendChild(span);
                tbody.appendChild(td);
            }
            if (!this.context._options.display.sideBySide && this.context._options.display.collapse && this._hasDate() && this._hasTime()) {
                let title, icon;
                if (this.context._options.display.viewMode === 'times') {
                    title = this.context._options.localization.selectDate;
                    icon = this.context._options.display.icons.date;
                }
                else {
                    title = this.context._options.localization.selectTime;
                    icon = this.context._options.display.icons.time;
                }
                const td = document.createElement('td');
                const span = document.createElement('span');
                span.setAttribute('data-action', ActionTypes.togglePicker);
                span.setAttribute('title', title);
                span.appendChild(this.iconTag(icon));
                td.appendChild(span);
                tbody.appendChild(td);
            }
            if (this.context._options.display.buttons.clear) {
                const td = document.createElement('td');
                const span = document.createElement('span');
                span.setAttribute('data-action', ActionTypes.clear);
                span.setAttribute('title', this.context._options.localization.clear);
                span.appendChild(this.iconTag(this.context._options.display.icons.clear));
                td.appendChild(span);
                tbody.appendChild(td);
            }
            if (this.context._options.display.buttons.close) {
                const td = document.createElement('td');
                const span = document.createElement('span');
                span.setAttribute('data-action', ActionTypes.close);
                span.setAttribute('title', this.context._options.localization.close);
                span.appendChild(this.iconTag(this.context._options.display.icons.close));
                td.appendChild(span);
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
            let span = document.createElement('span');
            const headTemplate = document.createElement('thead');
            const previous = document.createElement('th');
            previous.classList.add(Namespace.Css.previous);
            previous.setAttribute('data-action', ActionTypes.previous);
            span.appendChild(this.iconTag(this.context._options.display.icons.previous));
            previous.appendChild(span);
            headTemplate.appendChild(previous);
            const switcher = document.createElement('th');
            switcher.classList.add(Namespace.Css.switch);
            switcher.setAttribute('data-action', ActionTypes.pickerSwitch);
            switcher.setAttribute('colspan', this.context._options.display.calendarWeeks ? '6' : '5');
            headTemplate.appendChild(switcher);
            const next = document.createElement('th');
            next.classList.add(Namespace.Css.next);
            next.setAttribute('data-action', ActionTypes.next);
            span = document.createElement('span');
            span.appendChild(this.iconTag(this.context._options.display.icons.next));
            next.appendChild(span);
            headTemplate.appendChild(next);
            return headTemplate.cloneNode(true);
        }
        iconTag(i) {
            if (this.context._options.display.icons.type === 'sprites') {
                const svg = document.createElement('svg');
                svg.innerHTML = `<use xlink:href="${i}"></use>`;
                return svg;
            }
            const icon = document.createElement('i');
            DOMTokenList.prototype.add.apply(icon.classList, i.split(' '));
            return icon;
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
            if (granularity === Unit.date) {
                if (this.context._options.restrictions.disabledDates && this._isInDisabledDates(targetDate)) {
                    return false;
                }
                if (this.context._options.restrictions.enabledDates && !this._isInEnabledDates(targetDate)) {
                    return false;
                }
                if (this.context._options.restrictions.daysOfWeekDisabled && this.context._options.restrictions.daysOfWeekDisabled.indexOf(targetDate.weekDay) !== -1) {
                    return false;
                }
            }
            if (this.context._options.restrictions.minDate && targetDate.isBefore(this.context._options.restrictions.minDate, granularity)) {
                return false;
            }
            if (this.context._options.restrictions.maxDate && targetDate.isAfter(this.context._options.restrictions.maxDate, granularity)) {
                return false;
            }
            if (granularity === Unit.hours || granularity === Unit.minutes || granularity === Unit.seconds) {
                if (this.context._options.restrictions.disabledHours && this._isInDisabledHours(targetDate)) {
                    return false;
                }
                if (this.context._options.restrictions.enabledHours && !this._isInEnabledHours(targetDate)) {
                    return false;
                }
                if (this.context._options.restrictions.disabledTimeIntervals) {
                    for (let i = 0; i < this.context._options.restrictions.disabledTimeIntervals.length; i++) {
                        if (targetDate.isBetween(this.context._options.restrictions.disabledTimeIntervals[i], this.context._options.restrictions.disabledTimeIntervals[i + 1]))
                            return false;
                        i++;
                    }
                }
            }
            return true;
        }
        _isInDisabledDates(testDate) {
            if (!this.context._options.restrictions.disabledDates || this.context._options.restrictions.disabledDates.length === 0)
                return false;
            const formattedDate = testDate.format(Dates.getFormatByUnit(Unit.date));
            return this.context._options.restrictions.disabledDates.map(x => x.format(Dates.getFormatByUnit(Unit.date))).find(x => x === formattedDate);
        }
        _isInEnabledDates(testDate) {
            if (!this.context._options.restrictions.enabledDates || this.context._options.restrictions.enabledDates.length === 0)
                return true;
            const formattedDate = testDate.format(Dates.getFormatByUnit(Unit.date));
            return this.context._options.restrictions.enabledDates.map(x => x.format(Dates.getFormatByUnit(Unit.date))).find(x => x === formattedDate);
        }
        _isInDisabledHours(testDate) {
            if (!this.context._options.restrictions.disabledHours || this.context._options.restrictions.disabledHours.length === 0)
                return false;
            const formattedDate = testDate.hours;
            return this.context._options.restrictions.disabledHours.find(x => x === formattedDate);
        }
        _isInEnabledHours(testDate) {
            if (!this.context._options.restrictions.enabledHours || this.context._options.restrictions.enabledHours.length === 0)
                return true;
            const formattedDate = testDate.hours;
            return this.context._options.restrictions.enabledHours.find(x => x === formattedDate);
        }
    }

    class TempusDominus {
        constructor(element, options) {
            this._options = this.initializeOptions(options, Default);
            this._element = element;
            this._viewDate = new DateTime();
            this.currentViewMode = null;
            this.unset = true;
            this.minViewModeNumber = 0;
            this.display = new Display(this);
            this.validation = new Validation(this);
            this.dates = new Dates(this);
            this.action = new Actions(this);
            this.initializeViewMode();
            this.initializeInput();
            element.addEventListener('click', () => this.display.toggle());
        }
        // noinspection JSUnusedGlobalSymbols
        /**
         *
         * @param options
         * @public
         */
        updateOptions(options) {
            this._options = this.initializeOptions(options, this._options);
        }
        initializeOptions(config, mergeTo) {
            const dateArray = (optionName, value, providedType) => {
                if (!Array.isArray(value)) {
                    throw Namespace.ErrorMessages.typeMismatch(optionName, providedType, 'array of DateTime or Date');
                }
                for (let i = 0; i < value.length; i++) {
                    let d = value[i];
                    const dateTime = dateConversion(d, optionName);
                    if (dateTime !== undefined) {
                        value[i] = dateTime;
                        continue;
                    }
                    throw Namespace.ErrorMessages.typeMismatch(optionName, typeof d, 'DateTime or Date');
                }
            };
            const numberArray = (optionName, value, providedType) => {
                if (!Array.isArray(value)) {
                    throw Namespace.ErrorMessages.typeMismatch(optionName, providedType, 'array of numbers');
                }
                if (value.find(x => typeof x !== typeof 0))
                    console.log('throw an error');
                return;
            };
            const dateConversion = (d, optionName) => {
                if (d.constructor.name === 'DateTime')
                    return d;
                if (d.constructor.name === 'Date') {
                    return DateTime.convert(d);
                }
                if (typeof d === typeof '') {
                    const dateTime = new DateTime(d);
                    if (JSON.stringify(dateTime) === 'null') {
                        throw Namespace.ErrorMessages.failedToParseDate(optionName, d);
                    }
                    console.warn(Namespace.ErrorMessages.dateString);
                    return dateTime;
                }
                return undefined;
            };
            //the spread operator caused sub keys to be missing after merging
            //this is to fix that issue by using spread on the child objects first
            let path = '';
            const spread = (provided, defaultOption) => {
                Object.keys(provided).forEach(key => {
                    let providedType = typeof provided[key];
                    if (providedType === undefined)
                        return;
                    path += `.${key}`;
                    let defaultType = typeof defaultOption[key];
                    let value = provided[key];
                    if (!value)
                        return; //todo not sure if null checking here is right
                    switch (key) {
                        case 'viewDate': {
                            const dateTime = dateConversion(value, 'viewDate');
                            if (dateTime !== undefined) {
                                provided[key] = dateTime;
                                break;
                            }
                            throw Namespace.ErrorMessages.typeMismatch('viewDate', providedType, 'DateTime or Date');
                        }
                        case 'minDate': {
                            const dateTime = dateConversion(value, 'restrictions.minDate');
                            if (dateTime !== undefined) {
                                provided[key] = dateTime;
                                break;
                            }
                            throw Namespace.ErrorMessages.typeMismatch('restrictions.minDate', providedType, 'DateTime or Date');
                        }
                        case 'maxDate': {
                            const dateTime = dateConversion(value, 'restrictions.maxDate');
                            if (dateTime !== undefined) {
                                provided[key] = dateTime;
                                break;
                            }
                            throw Namespace.ErrorMessages.typeMismatch('restrictions.maxDate', providedType, 'DateTime or Date');
                        }
                        case 'disabledHours':
                            numberArray('restrictions.disabledHours', value, providedType);
                            if (value.filter(x => x < 0 || x > 23))
                                throw Namespace.ErrorMessages.numbersOutOfRage('restrictions.disabledHours', 0, 23);
                            break;
                        case 'enabledHours':
                            numberArray('restrictions.enabledHours', value, providedType);
                            if (value.filter(x => x < 0 || x > 23))
                                throw Namespace.ErrorMessages.numbersOutOfRage('restrictions.enabledHours', 0, 23);
                            break;
                        case 'daysOfWeekDisabled':
                            numberArray('restrictions.daysOfWeekDisabled', value, providedType);
                            if (value.filter(x => x < 0 || x > 6))
                                throw Namespace.ErrorMessages.numbersOutOfRage('restrictions.daysOfWeekDisabled', 0, 6);
                            break;
                        case 'enabledDates':
                            dateArray('restrictions.enabledDates', value, providedType);
                            break;
                        case 'disabledDates':
                            dateArray('restrictions.disabledDates', value, providedType);
                            break;
                        case 'disabledTimeIntervals':
                            dateArray('restrictions.disabledTimeIntervals', value, providedType);
                            break;
                        default:
                            if (providedType !== defaultType) {
                                if (defaultType === typeof undefined)
                                    throw Namespace.ErrorMessages.unexpectedOption(path.substring(1));
                                throw Namespace.ErrorMessages.typeMismatch(path.substring(1), providedType, defaultType);
                            }
                            break;
                    }
                    if (typeof defaultOption[key] !== 'object') {
                        path = path.substring(0, path.lastIndexOf(`.${key}`));
                        return;
                    }
                    if (!Array.isArray(provided[key]) && provided[key] != null) {
                        spread(provided[key], defaultOption[key]);
                        path = path.substring(0, path.lastIndexOf(`.${key}`));
                        provided[key] = Object.assign(Object.assign({}, defaultOption[key]), provided[key]);
                    }
                    path = path.substring(0, path.lastIndexOf(`.${key}`));
                });
            };
            spread(config, mergeTo);
            config = Object.assign(Object.assign({}, mergeTo), config);
            return config;
        }
        initializeViewMode() {
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
        initializeInput() {
            if (this._element.tagName == 'INPUT') {
                this._input = this._element;
            }
            else {
                let query = this._element.dataset.targetInput;
                if (query !== undefined) {
                    if (query == 'nearest') {
                        this._input = this._element.querySelector('input');
                    }
                    else {
                        this._input = this._element.querySelector(query);
                    }
                }
            }
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
                type: Namespace.Events.UPDATE,
                change: e,
                viewDate: this._viewDate.clone
            });
        }
    }

    exports.TempusDominus = TempusDominus;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=tempus-dominus.js.map
