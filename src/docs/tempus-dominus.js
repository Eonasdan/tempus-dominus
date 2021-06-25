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
            return (this.clone.startOf(unit).valueOf() < compare.clone.startOf(unit).valueOf());
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
            return (this.clone.startOf(unit).valueOf() > compare.clone.startOf(unit).valueOf());
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
            if (unit && this[unit] === undefined)
                throw `Unit '${unit}' is not valid`;
            const leftInclusivity = inclusivity[0] === '(';
            const rightInclusivity = inclusivity[1] === ')';
            return (((leftInclusivity
                ? this.isAfter(left, unit)
                : !this.isBefore(left, unit)) &&
                (rightInclusivity
                    ? this.isBefore(right, unit)
                    : !this.isAfter(right, unit))) ||
                ((leftInclusivity
                    ? this.isBefore(left, unit)
                    : !this.isAfter(left, unit)) &&
                    (rightInclusivity
                        ? this.isAfter(right, unit)
                        : !this.isBefore(right, unit))));
        }
        /**
         * Returns flattened object of the date. Does not include literals
         * @param locale
         * @param template
         */
        parts(locale = this.locale, template = { dateStyle: 'full', timeStyle: 'long' }) {
            const parts = {};
            new Intl.DateTimeFormat(locale, template)
                .formatToParts(this)
                .filter((x) => x.type !== 'literal')
                .forEach((x) => (parts[x.type] = x.value));
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
            return this.seconds < 10 ? `0${this.seconds}` : `${this.seconds}`;
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
            return this.minutes < 10 ? `0${this.minutes}` : `${this.minutes}`;
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
            return this.hours < 10 ? `0${this.hours}` : `${this.hours}`;
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
            return hour < 10 ? `0${hour}` : `${hour}`;
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
                dayPeriod: 'narrow',
            })
                .formatToParts(this)
                .find((p) => p.type === 'dayPeriod')) === null || _a === void 0 ? void 0 : _a.value;
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
            return this.date < 10 ? `0${this.date}` : `${this.date}`;
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
            return (Math.round((this.valueOf() - startOfYear.valueOf()) / MILLISECONDS_IN_WEEK) + 1);
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
            return this.month + 1 < 10 ? `0${this.month}` : `${this.month}`;
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

    class ErrorMessages {
        constructor() {
            this.base = 'TD:';
            this.dateString = `${this.base} Using a string for date options is not recommended unless you specify an ISO string.`;
            this.mustProvideElement = `${this.base} No element was provided.`;
            //#endregion
            //#region used with notify.error
            this.failedToSetInvalidDate = 'Failed to set invalid date';
            this.failedToParseInput = 'Failed parse input field';
            //#endregion
        }
        //#region out to console
        unexpectedOption(optionName) {
            return `${this.base} Unexpected option: ${optionName} does not match a known option.`;
        }
        typeMismatch(optionName, badType, expectedType) {
            return `${this.base} Mismatch types: ${optionName} has a type of ${badType} instead of the required ${expectedType}`;
        }
        numbersOutOfRage(optionName, lower, upper) {
            return `${this.base} ${optionName} expected an array of number between ${lower} and ${upper}.`;
        }
        failedToParseDate(optionName, date) {
            return `${this.base} Could not correctly parse "${date}" to a date for option ${optionName}.`;
        }
    }

    //this is not the way I want this to stay but nested classes seemed to blown up once its compiled.
    const NAME = 'tempus-dominus';
    const VERSION = '6.0.0-alpha1';
    const DATA_KEY = 'td';
    /**
     * Events
     */
    class Events {
        constructor() {
            this.key = `.${DATA_KEY}`;
            this.change = `change${this.key}`;
            this.update = `update${this.key}`;
            this.error = `error${this.key}`;
            /**
             * Show event
             * @event Events#show
             */
            this.show = `show${this.key}`;
            /**
             * Hide event
             * @event Events#hide
             */
            this.hide = `hide${this.key}`;
            this.blur = `blur${this.key}`;
            this.keyup = `keyup${this.key}`;
            this.keydown = `keydown${this.key}`;
            this.focus = `focus${this.key}`;
        }
    }
    class Css {
        constructor() {
            this.widget = `${NAME}-widget`;
            this.switch = 'picker-switch';
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
            this.inline = 'inline';
        }
    }
    class Namespace {
    }
    Namespace.NAME = NAME;
    Namespace.VERSION = VERSION;
    Namespace.DATA_KEY = DATA_KEY;
    Namespace.Events = new Events();
    Namespace.Css = new Css();
    Namespace.ErrorMessages = new ErrorMessages();

    const DefaultOptions = {
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
            viewMode: 'calendar',
            toolbarPlacement: 'default',
            buttons: {
                today: false,
                clear: false,
                close: false,
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
            inputFormat: undefined,
            inline: false,
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
        readonly: false,
        ignoreReadonly: false,
        keepOpen: false,
        focusOnShow: true,
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
        multidateSeparator: '; ',
        promptTimeOnDateChange: false,
        promptTimeOnDateChangeTransitionDelay: 200,
    };
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

    /**
     * Provides a collapse functionality to the view changes
     */
    class Collapse {
        constructor() {
            /**
             * Gets the transition duration from the `element` by getting css properties
             * `transition-duration` and `transition-delay`
             * @param element HTML Element
             */
            this.getTransitionDurationFromElement = (element) => {
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
        /**
         * Flips the show/hide state of `target`
         * @param target html element to affect.
         */
        toggle(target) {
            if (target.classList.contains(Namespace.Css.show)) {
                this.hide(target);
            }
            else {
                this.show(target);
            }
        }
        /**
         * If `target` is not already showing, then show after the animation.
         * @param target
         */
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
        /**
         * If `target` is not already hidden, then hide after the animation.
         * @param target HTML Element
         */
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
            const reflow = (element) => element.offsetHeight;
            reflow(target);
            target.classList.remove(Namespace.Css.collapse, Namespace.Css.show);
            target.classList.add(Namespace.Css.collapsing);
            target.style.height = '';
            this.timeOut = setTimeout(complete, this.getTransitionDurationFromElement(target));
        }
    }

    /**
     *
     */
    class Actions {
        constructor(context) {
            this._context = context;
            this.collapse = new Collapse();
        }
        /**
         * Performs the selected `action`. See ActionTypes
         * @param e This is normally a click event
         * @param action If not provided, then look for a [data-action]
         */
        do(e, action) {
            const currentTarget = e.currentTarget;
            if (currentTarget.classList.contains(Namespace.Css.disabled))
                return false;
            action = action || currentTarget.dataset.action;
            const lastPicked = (this._context.dates.lastPicked || this._context.viewDate).clone;
            /**
             * Common function to manipulate {@link lastPicked} by `unit`
             * @param unit
             * @param value Value to change by
             */
            const manipulateAndSet = (unit, value = 1) => {
                const newDate = lastPicked.manipulate(value, unit);
                if (this._context._validation.isValid(newDate, unit)) {
                    /*if (this.context.dates.lastPickedIndex < 0) {
                                this.date(newDate);
                            }*/
                    this._context.dates._setValue(newDate, this._context.dates.lastPickedIndex);
                }
            };
            switch (action) {
                case ActionTypes.next:
                case ActionTypes.previous:
                    const { NAV_FUNCTION, NAV_STEP } = DatePickerModes[this._context.currentViewMode];
                    if (action === ActionTypes.next)
                        this._context.viewDate.manipulate(NAV_STEP, NAV_FUNCTION);
                    else
                        this._context.viewDate.manipulate(NAV_STEP * -1, NAV_FUNCTION);
                    this._context._display._update('calendar');
                    this._context._viewUpdate(NAV_FUNCTION);
                    break;
                case ActionTypes.pickerSwitch:
                    this._context._display._showMode(1);
                    break;
                case ActionTypes.selectMonth:
                case ActionTypes.selectYear:
                case ActionTypes.selectDecade:
                    const value = +currentTarget.getAttribute('data-value');
                    switch (action) {
                        case ActionTypes.selectMonth:
                            this._context.viewDate.month = value;
                            this._context._viewUpdate(Unit.month);
                            break;
                        case ActionTypes.selectYear:
                            this._context.viewDate.year = value;
                            this._context._viewUpdate(Unit.year);
                            break;
                        case ActionTypes.selectDecade:
                            this._context.viewDate.year = value;
                            this._context._viewUpdate(Unit.year);
                            break;
                    }
                    if (this._context.currentViewMode === this._context._minViewModeNumber) {
                        this._context.dates._setValue(this._context.viewDate, this._context.dates.lastPickedIndex);
                        if (!this._context.options.display.inline) {
                            this._context._display.hide();
                        }
                    }
                    else {
                        this._context._display._showMode(-1);
                    }
                    break;
                case ActionTypes.selectDay:
                    const day = this._context.viewDate.clone;
                    if (currentTarget.classList.contains(Namespace.Css.old)) {
                        day.manipulate(-1, Unit.month);
                    }
                    if (currentTarget.classList.contains(Namespace.Css.new)) {
                        day.manipulate(1, Unit.month);
                    }
                    day.date = +currentTarget.innerText;
                    let index = 0;
                    if (this._context.options.allowMultidate) {
                        index = this._context.dates.pickedIndex(day, Unit.date);
                        if (index !== -1) {
                            this._context.dates._setValue(null, index); //deselect multi-date
                        }
                        else {
                            this._context.dates._setValue(day, this._context.dates.lastPickedIndex + 1);
                        }
                    }
                    else {
                        this._context.dates._setValue(day, this._context.dates.lastPickedIndex);
                    }
                    if (!this._context._display._hasTime &&
                        !this._context.options.keepOpen &&
                        !this._context.options.display.inline &&
                        !this._context.options.allowMultidate) {
                        this._context._display.hide();
                    }
                    break;
                case ActionTypes.selectHour:
                    let hour = +currentTarget.getAttribute('data-value');
                    lastPicked.hours = hour;
                    this._context.dates._setValue(lastPicked, this._context.dates.lastPickedIndex);
                    if (this._context.options.display.components.useTwentyfourHour &&
                        !this._context.options.display.components.minutes &&
                        !this._context.options.keepOpen &&
                        !this._context.options.display.inline) {
                        this._context._display.hide();
                    }
                    else {
                        this.do(e, ActionTypes.showClock);
                    }
                    break;
                case ActionTypes.selectMinute:
                    lastPicked.minutes = +currentTarget.innerText;
                    this._context.dates._setValue(lastPicked, this._context.dates.lastPickedIndex);
                    if (this._context.options.display.components.useTwentyfourHour &&
                        !this._context.options.display.components.seconds &&
                        !this._context.options.keepOpen &&
                        !this._context.options.display.inline) {
                        this._context._display.hide();
                    }
                    else {
                        this.do(e, ActionTypes.showClock);
                    }
                    break;
                case ActionTypes.selectSecond:
                    lastPicked.seconds = +currentTarget.innerText;
                    this._context.dates._setValue(lastPicked, this._context.dates.lastPickedIndex);
                    if (this._context.options.display.components.useTwentyfourHour &&
                        !this._context.options.keepOpen &&
                        !this._context.options.display.inline) {
                        this._context._display.hide();
                    }
                    else {
                        this.do(e, ActionTypes.showClock);
                    }
                    break;
                case ActionTypes.incrementHours:
                    manipulateAndSet(Unit.hours);
                    break;
                case ActionTypes.incrementMinutes:
                    manipulateAndSet(Unit.minutes, this._context.options.stepping);
                    break;
                case ActionTypes.incrementSeconds:
                    manipulateAndSet(Unit.seconds);
                    break;
                case ActionTypes.decrementHours:
                    manipulateAndSet(Unit.hours, -1);
                    break;
                case ActionTypes.decrementMinutes:
                    manipulateAndSet(Unit.minutes, this._context.options.stepping * -1);
                    break;
                case ActionTypes.decrementSeconds:
                    manipulateAndSet(Unit.seconds, -1);
                    break;
                case ActionTypes.togglePeriod:
                    manipulateAndSet(Unit.hours, this._context.dates.lastPicked.hours >= 12 ? -12 : 12);
                    break;
                case ActionTypes.togglePicker:
                    this._context._display.widget
                        .querySelectorAll(`.${Namespace.Css.dateContainer}, .${Namespace.Css.timeContainer}`)
                        .forEach((htmlElement) => this.collapse.toggle(htmlElement));
                    if (currentTarget.getAttribute('title') ===
                        this._context.options.localization.selectDate) {
                        currentTarget.setAttribute('title', this._context.options.localization.selectTime);
                        currentTarget.innerHTML = this._context._display._iconTag(this._context.options.display.icons.time).outerHTML;
                        this._context._display._update('calendar');
                    }
                    else {
                        currentTarget.setAttribute('title', this._context.options.localization.selectDate);
                        currentTarget.innerHTML = this._context._display._iconTag(this._context.options.display.icons.date).outerHTML;
                        this.do(e, ActionTypes.showClock);
                        this._context._display._update('clock');
                    }
                    break;
                case ActionTypes.showClock:
                case ActionTypes.showHours:
                case ActionTypes.showMinutes:
                case ActionTypes.showSeconds:
                    this._context._display.widget
                        .querySelectorAll(`.${Namespace.Css.timeContainer} > div`)
                        .forEach((htmlElement) => (htmlElement.style.display = 'none'));
                    let classToUse = '';
                    switch (action) {
                        case ActionTypes.showClock:
                            classToUse = Namespace.Css.clockContainer;
                            this._context._display._update('clock');
                            break;
                        case ActionTypes.showHours:
                            classToUse = Namespace.Css.hourContainer;
                            this._context._display._update(Unit.hours);
                            break;
                        case ActionTypes.showMinutes:
                            classToUse = Namespace.Css.minuteContainer;
                            this._context._display._update(Unit.minutes);
                            break;
                        case ActionTypes.showSeconds:
                            classToUse = Namespace.Css.secondContainer;
                            this._context._display._update(Unit.seconds);
                            break;
                    }
                    (this._context._display.widget.getElementsByClassName(classToUse)[0]).style.display = 'block';
                    break;
                case ActionTypes.clear:
                    this._context.dates._setValue(null);
                    break;
                case ActionTypes.close:
                    this._context._display.hide();
                    break;
                case ActionTypes.today:
                    const today = new DateTime();
                    this._context.viewDate = today;
                    if (this._context._validation.isValid(today, Unit.date))
                        this._context.dates._setValue(today, this._context.dates.lastPickedIndex);
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

    /**
     * Creates and updates the grid for `date`
     */
    class DateDisplay {
        constructor(context) {
            this._context = context;
        }
        /**
         * Build the container html for the display
         * @private
         */
        get _picker() {
            const container = document.createElement('div');
            container.classList.add(Namespace.Css.daysContainer);
            const table = document.createElement('table');
            const headTemplate = this._context._display._headTemplate;
            const [previous, switcher, next] = headTemplate.getElementsByTagName('th');
            previous
                .getElementsByTagName('div')[0]
                .setAttribute('title', this._context.options.localization.previousMonth);
            switcher.setAttribute('title', this._context.options.localization.selectMonth);
            next
                .getElementsByTagName('div')[0]
                .setAttribute('title', this._context.options.localization.nextMonth);
            table.appendChild(headTemplate);
            const tableBody = document.createElement('tbody');
            tableBody.appendChild(this._daysOfTheWeek());
            let row = document.createElement('tr');
            if (this._context.options.display.calendarWeeks) {
                const td = document.createElement('td');
                const div = document.createElement('div');
                div.classList.add(Namespace.Css.calendarWeeks);
                td.appendChild(div);
                row.appendChild(td);
            }
            for (let i = 0; i <= 42; i++) {
                if (i !== 0 && i % 7 === 0) {
                    tableBody.appendChild(row);
                    row = document.createElement('tr');
                    if (this._context.options.display.calendarWeeks) {
                        const td = document.createElement('td');
                        const div = document.createElement('div');
                        div.classList.add(Namespace.Css.calendarWeeks);
                        td.appendChild(div);
                        row.appendChild(td);
                    }
                }
                const td = document.createElement('td');
                const div = document.createElement('div');
                div.setAttribute('data-action', ActionTypes.selectDay);
                td.appendChild(div);
                row.appendChild(td);
            }
            table.appendChild(tableBody);
            container.appendChild(table);
            return container;
        }
        /**
         * Populates the grid and updates enabled states
         * @private
         */
        _update() {
            const container = this._context._display.widget.getElementsByClassName(Namespace.Css.daysContainer)[0];
            const [previous, switcher, next] = container
                .getElementsByTagName('thead')[0]
                .getElementsByTagName('th');
            switcher.innerText = this._context.viewDate.format({
                month: this._context.options.localization.dayViewHeaderFormat,
            });
            this._context._validation.isValid(this._context.viewDate.clone.manipulate(-1, Unit.month), Unit.month)
                ? previous.classList.remove(Namespace.Css.disabled)
                : previous.classList.add(Namespace.Css.disabled);
            this._context._validation.isValid(this._context.viewDate.clone.manipulate(1, Unit.month), Unit.month)
                ? next.classList.remove(Namespace.Css.disabled)
                : next.classList.add(Namespace.Css.disabled);
            let innerDate = this._context.viewDate.clone
                .startOf(Unit.month)
                .startOf('weekDay')
                .manipulate(12, Unit.hours);
            container
                .querySelectorAll('tbody td div')
                .forEach((containerClone, index) => {
                if (this._context.options.display.calendarWeeks &&
                    containerClone.classList.contains(Namespace.Css.calendarWeeks)) {
                    containerClone.innerText = `${innerDate.week}`;
                    return;
                }
                let classes = [];
                classes.push(Namespace.Css.day);
                if (innerDate.isBefore(this._context.viewDate, Unit.month)) {
                    classes.push(Namespace.Css.old);
                }
                if (innerDate.isAfter(this._context.viewDate, Unit.month)) {
                    classes.push(Namespace.Css.new);
                }
                if (!this._context._unset &&
                    this._context.dates.isPicked(innerDate, Unit.date)) {
                    classes.push(Namespace.Css.active);
                }
                if (!this._context._validation.isValid(innerDate, Unit.date)) {
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
         * @private
         */
        _daysOfTheWeek() {
            let innerDate = this._context.viewDate.clone
                .startOf('weekDay')
                .startOf(Unit.date);
            const row = document.createElement('tr');
            if (this._context.options.display.calendarWeeks) {
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

    /**
     * Creates and updates the grid for `month`
     */
    class MonthDisplay {
        constructor(context) {
            this._context = context;
        }
        /**
         * Build the container html for the display
         * @private
         */
        get _picker() {
            const container = document.createElement('div');
            container.classList.add(Namespace.Css.monthsContainer);
            const table = document.createElement('table');
            const headTemplate = this._context._display._headTemplate;
            const [previous, switcher, next] = headTemplate.getElementsByTagName('th');
            previous
                .getElementsByTagName('div')[0]
                .setAttribute('title', this._context.options.localization.previousYear);
            switcher.setAttribute('title', this._context.options.localization.selectYear);
            switcher.setAttribute('colspan', '1');
            next
                .getElementsByTagName('div')[0]
                .setAttribute('title', this._context.options.localization.nextYear);
            table.appendChild(headTemplate);
            const tableBody = document.createElement('tbody');
            let row = document.createElement('tr');
            for (let i = 0; i <= 12; i++) {
                if (i !== 0 && i % 3 === 0) {
                    tableBody.appendChild(row);
                    row = document.createElement('tr');
                }
                const td = document.createElement('td');
                const div = document.createElement('div');
                div.setAttribute('data-action', ActionTypes.selectMonth);
                td.appendChild(div);
                row.appendChild(td);
            }
            table.appendChild(tableBody);
            container.appendChild(table);
            return container;
        }
        /**
         * Populates the grid and updates enabled states
         * @private
         */
        _update() {
            const container = this._context._display.widget.getElementsByClassName(Namespace.Css.monthsContainer)[0];
            const [previous, switcher, next] = container
                .getElementsByTagName('thead')[0]
                .getElementsByTagName('th');
            switcher.innerText = this._context.viewDate.format({ year: 'numeric' });
            this._context._validation.isValid(this._context.viewDate.clone.manipulate(-1, Unit.year), Unit.year)
                ? previous.classList.remove(Namespace.Css.disabled)
                : previous.classList.add(Namespace.Css.disabled);
            this._context._validation.isValid(this._context.viewDate.clone.manipulate(1, Unit.year), Unit.year)
                ? next.classList.remove(Namespace.Css.disabled)
                : next.classList.add(Namespace.Css.disabled);
            let innerDate = this._context.viewDate.clone.startOf(Unit.year);
            container
                .querySelectorAll('tbody td div')
                .forEach((containerClone, index) => {
                let classes = [];
                classes.push(Namespace.Css.month);
                if (!this._context._unset &&
                    this._context.dates.isPicked(innerDate, Unit.month)) {
                    classes.push(Namespace.Css.active);
                }
                if (!this._context._validation.isValid(innerDate, Unit.month)) {
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

    /**
     * Creates and updates the grid for `year`
     */
    class YearDisplay {
        constructor(context) {
            this._context = context;
            this._startYear = this._context.viewDate.clone.manipulate(-1, Unit.year);
            this._endYear = this._context.viewDate.clone.manipulate(10, Unit.year);
        }
        /**
         * Build the container html for the display
         * @private
         */
        get _picker() {
            const container = document.createElement('div');
            container.classList.add(Namespace.Css.yearsContainer);
            const table = document.createElement('table');
            const headTemplate = this._context._display._headTemplate;
            const [previous, switcher, next] = headTemplate.getElementsByTagName('th');
            previous
                .getElementsByTagName('div')[0]
                .setAttribute('title', this._context.options.localization.previousDecade);
            switcher.setAttribute('title', this._context.options.localization.selectDecade);
            switcher.setAttribute('colspan', '1');
            next
                .getElementsByTagName('div')[0]
                .setAttribute('title', this._context.options.localization.nextDecade);
            table.appendChild(headTemplate);
            const tableBody = document.createElement('tbody');
            let row = document.createElement('tr');
            for (let i = 0; i <= 12; i++) {
                if (i !== 0 && i % 3 === 0) {
                    tableBody.appendChild(row);
                    row = document.createElement('tr');
                }
                const td = document.createElement('td');
                const div = document.createElement('div');
                div.setAttribute('data-action', ActionTypes.selectYear);
                td.appendChild(div);
                row.appendChild(td);
            }
            table.appendChild(tableBody);
            container.appendChild(table);
            return container;
        }
        /**
         * Populates the grid and updates enabled states
         * @private
         */
        _update() {
            const container = this._context._display.widget.getElementsByClassName(Namespace.Css.yearsContainer)[0];
            const [previous, switcher, next] = container
                .getElementsByTagName('thead')[0]
                .getElementsByTagName('th');
            switcher.innerText = `${this._startYear.year}-${this._endYear.year}`;
            this._context._validation.isValid(this._startYear, Unit.year)
                ? previous.classList.remove(Namespace.Css.disabled)
                : previous.classList.add(Namespace.Css.disabled);
            this._context._validation.isValid(this._endYear, Unit.year)
                ? next.classList.remove(Namespace.Css.disabled)
                : next.classList.add(Namespace.Css.disabled);
            let innerDate = this._context.viewDate.clone
                .startOf(Unit.year)
                .manipulate(-1, Unit.year);
            container
                .querySelectorAll('tbody td div')
                .forEach((containerClone, index) => {
                let classes = [];
                classes.push(Namespace.Css.year);
                if (!this._context._unset &&
                    this._context.dates.isPicked(innerDate, Unit.year)) {
                    classes.push(Namespace.Css.active);
                }
                if (!this._context._validation.isValid(innerDate, Unit.year)) {
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
        /**
         * Returns the array of selected dates
         */
        get picked() {
            return this._dates;
        }
        /**
         * Returns the last picked value.
         */
        get lastPicked() {
            return this._dates[this.lastPickedIndex];
        }
        /**
         * Returns the length of picked dates -1 or 0 if none are selected.
         */
        get lastPickedIndex() {
            if (this._dates.length === 0)
                return 0;
            return this._dates.length - 1;
        }
        /**
         * Adds a new DateTime to selected dates array
         * @param date
         */
        add(date) {
            this._dates.push(date);
        }
        /**
         * Returns true if the `targetDate` is part of the selected dates array.
         * If `unit` is provided then a granularity to that unit will be used.
         * @param targetDate
         * @param unit
         */
        isPicked(targetDate, unit) {
            if (!unit)
                return this._dates.find((x) => x === targetDate) !== undefined;
            const format = Dates.getFormatByUnit(unit);
            let innerDateFormatted = targetDate.format(format);
            return (this._dates
                .map((x) => x.format(format))
                .find((x) => x === innerDateFormatted) !== undefined);
        }
        /**
         * Returns the index at which `targetDate` is in the array.
         * This is used for updating or removing a date when multi-date is used
         * If `unit` is provided then a granularity to that unit will be used.
         * @param targetDate
         * @param unit
         */
        pickedIndex(targetDate, unit) {
            if (!unit)
                return this._dates.indexOf(targetDate);
            const format = Dates.getFormatByUnit(unit);
            let innerDateFormatted = targetDate.format(format);
            return this._dates.map((x) => x.format(format)).indexOf(innerDateFormatted);
        }
        /**
         * Find the "book end" years given a `year` and a `factor`
         * @param factor e.g. 100 for decades
         * @param year e.g. 2021
         */
        static getStartEndYear(factor, year) {
            const step = factor / 10, startYear = Math.floor(year / factor) * factor, endYear = startYear + step * 9, focusValue = Math.floor(year / step) * step;
            return [startYear, endYear, focusValue];
        }
        /**
         * Attempts to either clear or set the `target` date at `index`.
         * If the `target` is null then the date will be cleared.
         * If multi-date is being used then it will be removed from the array.
         * If `target` is valid and multi-date is used then if `index` is
         * provided the date at that index will be replaced, otherwise it is appended.
         * @param target
         * @param index
         */
        _setValue(target, index) {
            const noIndex = typeof index === 'undefined', isClear = !target && noIndex;
            let oldDate = this.context._unset ? null : this._dates[index];
            if (!oldDate && !this.context._unset && noIndex && isClear) {
                oldDate = this.lastPicked;
            }
            // case of calling setValue(null)
            if (!target) {
                if (!this.context.options.allowMultidate ||
                    this._dates.length === 1 ||
                    isClear) {
                    this.context._unset = true;
                    this._dates = [];
                }
                else {
                    this._dates.splice(index, 1);
                }
                this.context._triggerEvent({
                    name: Namespace.Events.change,
                    date: undefined,
                    oldDate,
                    isClear,
                    isValid: true,
                });
                this.context._display._update('all');
                return;
            }
            index = 0;
            target = target.clone;
            // minute stepping is being used, force the minute to the closest value
            if (this.context.options.stepping !== 1) {
                target.minutes =
                    Math.round(target.minutes / this.context.options.stepping) *
                        this.context.options.stepping;
                target.seconds = 0;
            }
            if (this.context._validation.isValid(target)) {
                this._dates[index] = target;
                this.context.viewDate = target.clone;
                if (this.context._input) {
                    let newValue = target.format(this.context.options.display.inputFormat);
                    if (this.context.options.allowMultidate) {
                        newValue = this._dates
                            .map((d) => d.format(this.context.options.display.inputFormat))
                            .join(this.context.options.multidateSeparator);
                    }
                    if (this.context._input.value != newValue)
                        this.context._input.value = newValue;
                }
                this.context._unset = false;
                this.context._display._update('all');
                this.context._triggerEvent({
                    name: Namespace.Events.change,
                    date: target,
                    oldDate,
                    isClear,
                    isValid: true,
                });
                return;
            }
            if (this.context.options.keepInvalid) {
                this._dates[index] = target;
                this.context.viewDate = target.clone;
                this.context._triggerEvent({
                    name: Namespace.Events.change,
                    date: target,
                    oldDate,
                    isClear,
                    isValid: false,
                });
            }
            this.context._triggerEvent({
                name: Namespace.Events.error,
                reason: Namespace.ErrorMessages.failedToSetInvalidDate,
                date: target,
                oldDate,
            });
        }
        /**
         * Returns a format object based on the granularity of `unit`
         * @param unit
         */
        static getFormatByUnit(unit) {
            switch (unit) {
                case 'date':
                    return { dateStyle: 'short' };
                case 'month':
                    return {
                        month: 'numeric',
                        year: 'numeric',
                    };
                case 'year':
                    return { year: 'numeric' };
            }
        }
    }

    /**
     * Creates and updates the grid for `seconds`
     */
    class DecadeDisplay {
        constructor(context) {
            this._context = context;
        }
        /**
         * Build the container html for the display
         * @private
         */
        get _picker() {
            const container = document.createElement('div');
            container.classList.add(Namespace.Css.decadesContainer);
            const table = document.createElement('table');
            const headTemplate = this._context._display._headTemplate;
            const [previous, switcher, next] = headTemplate.getElementsByTagName('th');
            previous
                .getElementsByTagName('div')[0]
                .setAttribute('title', this._context.options.localization.previousCentury);
            switcher.setAttribute('title', '');
            switcher.removeAttribute('data-action');
            switcher.setAttribute('colspan', '1');
            next
                .getElementsByTagName('div')[0]
                .setAttribute('title', this._context.options.localization.nextCentury);
            table.appendChild(headTemplate);
            const tableBody = document.createElement('tbody');
            let row = document.createElement('tr');
            for (let i = 0; i <= 12; i++) {
                if (i !== 0 && i % 3 === 0) {
                    tableBody.appendChild(row);
                    row = document.createElement('tr');
                }
                const td = document.createElement('td');
                const div = document.createElement('div');
                div.setAttribute('data-action', ActionTypes.selectDecade);
                td.appendChild(div);
                row.appendChild(td);
            }
            table.appendChild(tableBody);
            container.appendChild(table);
            return container;
        }
        /**
         * Populates the grid and updates enabled states
         * @private
         */
        _update() {
            const [start, end] = Dates.getStartEndYear(100, this._context.viewDate.year);
            this._startDecade = this._context.viewDate.clone.startOf(Unit.year);
            this._startDecade.year = start;
            this._endDecade = this._context.viewDate.clone.startOf(Unit.year);
            this._endDecade.year = end;
            const container = this._context._display.widget.getElementsByClassName(Namespace.Css.decadesContainer)[0];
            const [previous, switcher, next] = container
                .getElementsByTagName('thead')[0]
                .getElementsByTagName('th');
            switcher.innerText = `${this._startDecade.year}-${this._endDecade.year}`;
            this._context._validation.isValid(this._startDecade, Unit.year)
                ? previous.classList.remove(Namespace.Css.disabled)
                : previous.classList.add(Namespace.Css.disabled);
            this._context._validation.isValid(this._endDecade, Unit.year)
                ? next.classList.remove(Namespace.Css.disabled)
                : next.classList.add(Namespace.Css.disabled);
            const pickedYears = this._context.dates.picked.map((x) => x.year);
            const nodeList = container.querySelectorAll('tbody td div');
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
                if (!this._context._unset &&
                    pickedYears.filter((x) => x >= startDecadeYear && x <= endDecadeYear)
                        .length > 0) {
                    classes.push(Namespace.Css.active);
                }
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

    /**
     * Creates the clock display
     */
    class TimeDisplay {
        constructor(context) {
            this._context = context;
        }
        /**
         * Build the container html for the clock display
         * @private
         */
        get _picker() {
            const container = document.createElement('div');
            container.classList.add(Namespace.Css.clockContainer);
            const table = document.createElement('table');
            const tableBody = document.createElement('tbody');
            this._grid().forEach((row) => tableBody.appendChild(row));
            table.appendChild(tableBody);
            container.appendChild(table);
            return container;
        }
        /**
         * Populates the various elements with in the clock display
         * like the current hour and if the manipulation icons are enabled.
         * @private
         */
        _update() {
            const timesDiv = this._context._display.widget.getElementsByClassName(Namespace.Css.clockContainer)[0];
            const lastPicked = (this._context.dates.lastPicked || this._context.viewDate).clone;
            if (!this._context.options.display.components.useTwentyfourHour) {
                const toggle = timesDiv.querySelector(`[data-action=${ActionTypes.togglePeriod}]`);
                toggle.innerText = lastPicked.meridiem();
                if (!this._context._validation.isValid(lastPicked.clone.manipulate(lastPicked.hours >= 12 ? -12 : 12, Unit.hours))) {
                    toggle.classList.add(Namespace.Css.disabled);
                }
                else {
                    toggle.classList.remove(Namespace.Css.disabled);
                }
            }
            timesDiv
                .querySelectorAll('.disabled')
                .forEach((element) => element.classList.remove(Namespace.Css.disabled));
            if (this._context.options.display.components.hours) {
                if (!this._context._validation.isValid(this._context.viewDate.clone.manipulate(1, Unit.hours), Unit.hours)) {
                    timesDiv
                        .querySelector(`[data-action=${ActionTypes.incrementHours}]`)
                        .classList.add(Namespace.Css.disabled);
                }
                if (!this._context._validation.isValid(this._context.viewDate.clone.manipulate(-1, Unit.hours), Unit.hours)) {
                    timesDiv
                        .querySelector(`[data-action=${ActionTypes.decrementHours}]`)
                        .classList.add(Namespace.Css.disabled);
                }
                timesDiv.querySelector(`[data-time-component=${Unit.hours}]`).innerText = this._context.options.display.components.useTwentyfourHour
                    ? lastPicked.hoursFormatted
                    : lastPicked.twelveHoursFormatted;
            }
            if (this._context.options.display.components.minutes) {
                if (!this._context._validation.isValid(this._context.viewDate.clone.manipulate(1, Unit.minutes), Unit.minutes)) {
                    timesDiv
                        .querySelector(`[data-action=${ActionTypes.incrementMinutes}]`)
                        .classList.add(Namespace.Css.disabled);
                }
                if (!this._context._validation.isValid(this._context.viewDate.clone.manipulate(-1, Unit.minutes), Unit.minutes)) {
                    timesDiv
                        .querySelector(`[data-action=${ActionTypes.decrementMinutes}]`)
                        .classList.add(Namespace.Css.disabled);
                }
                timesDiv.querySelector(`[data-time-component=${Unit.minutes}]`).innerText = lastPicked.minutesFormatted;
            }
            if (this._context.options.display.components.seconds) {
                if (!this._context._validation.isValid(this._context.viewDate.clone.manipulate(1, Unit.seconds), Unit.seconds)) {
                    timesDiv
                        .querySelector(`[data-action=${ActionTypes.incrementSeconds}]`)
                        .classList.add(Namespace.Css.disabled);
                }
                if (!this._context._validation.isValid(this._context.viewDate.clone.manipulate(-1, Unit.seconds), Unit.seconds)) {
                    timesDiv
                        .querySelector(`[data-action=${ActionTypes.decrementSeconds}]`)
                        .classList.add(Namespace.Css.disabled);
                }
                timesDiv.querySelector(`[data-time-component=${Unit.seconds}]`).innerText = lastPicked.secondsFormatted;
            }
        }
        /**
         * Creates the table for the clock display depending on what options are selected.
         * @private
         */
        _grid() {
            const rows = [], separator = document.createElement('td'), separatorColon = separator.cloneNode(true), topRow = document.createElement('tr'), middleRow = document.createElement('tr'), bottomRow = document.createElement('tr'), upIcon = this._context._display._iconTag(this._context.options.display.icons.up), downIcon = this._context._display._iconTag(this._context.options.display.icons.down), actionDiv = document.createElement('div');
            separator.classList.add(Namespace.Css.separator);
            separatorColon.innerHTML = ':';
            if (this._context.options.display.components.hours) {
                let td = document.createElement('td');
                let actionLinkClone = actionDiv.cloneNode(true);
                actionLinkClone.setAttribute('title', this._context.options.localization.incrementHour);
                actionLinkClone.setAttribute('data-action', ActionTypes.incrementHours);
                actionLinkClone.appendChild(upIcon.cloneNode(true));
                td.appendChild(actionLinkClone);
                topRow.appendChild(td);
                td = document.createElement('td');
                const div = document.createElement('div');
                div.setAttribute('title', this._context.options.localization.pickHour);
                div.setAttribute('data-action', ActionTypes.showHours);
                div.setAttribute('data-time-component', Unit.hours);
                td.appendChild(div);
                middleRow.appendChild(td);
                td = document.createElement('td');
                actionLinkClone = actionDiv.cloneNode(true);
                actionLinkClone.setAttribute('title', this._context.options.localization.decrementHour);
                actionLinkClone.setAttribute('data-action', ActionTypes.decrementHours);
                actionLinkClone.appendChild(downIcon.cloneNode(true));
                td.appendChild(actionLinkClone);
                bottomRow.appendChild(td);
            }
            if (this._context.options.display.components.minutes) {
                if (this._context.options.display.components.hours) {
                    topRow.appendChild(separator.cloneNode(true));
                    middleRow.appendChild(separatorColon.cloneNode(true));
                    bottomRow.appendChild(separator.cloneNode(true));
                }
                let td = document.createElement('td');
                let actionLinkClone = actionDiv.cloneNode(true);
                actionLinkClone.setAttribute('title', this._context.options.localization.incrementMinute);
                actionLinkClone.setAttribute('data-action', ActionTypes.incrementMinutes);
                actionLinkClone.appendChild(upIcon.cloneNode(true));
                td.appendChild(actionLinkClone);
                topRow.appendChild(td);
                td = document.createElement('td');
                const div = document.createElement('div');
                div.setAttribute('title', this._context.options.localization.pickMinute);
                div.setAttribute('data-action', ActionTypes.showMinutes);
                div.setAttribute('data-time-component', Unit.minutes);
                td.appendChild(div);
                middleRow.appendChild(td);
                td = document.createElement('td');
                actionLinkClone = actionDiv.cloneNode(true);
                actionLinkClone.setAttribute('title', this._context.options.localization.decrementMinute);
                actionLinkClone.setAttribute('data-action', ActionTypes.decrementMinutes);
                actionLinkClone.appendChild(downIcon.cloneNode(true));
                td.appendChild(actionLinkClone);
                bottomRow.appendChild(td);
            }
            if (this._context.options.display.components.seconds) {
                if (this._context.options.display.components.minutes) {
                    topRow.appendChild(separator.cloneNode(true));
                    middleRow.appendChild(separatorColon.cloneNode(true));
                    bottomRow.appendChild(separator.cloneNode(true));
                }
                let td = document.createElement('td');
                let actionLinkClone = actionDiv.cloneNode(true);
                actionLinkClone.setAttribute('title', this._context.options.localization.incrementSecond);
                actionLinkClone.setAttribute('data-action', ActionTypes.incrementSeconds);
                actionLinkClone.appendChild(upIcon.cloneNode(true));
                td.appendChild(actionLinkClone);
                topRow.appendChild(td);
                td = document.createElement('td');
                const div = document.createElement('div');
                div.setAttribute('title', this._context.options.localization.pickSecond);
                div.setAttribute('data-action', ActionTypes.showSeconds);
                div.setAttribute('data-time-component', Unit.seconds);
                td.appendChild(div);
                middleRow.appendChild(td);
                td = document.createElement('td');
                actionLinkClone = actionDiv.cloneNode(true);
                actionLinkClone.setAttribute('title', this._context.options.localization.decrementSecond);
                actionLinkClone.setAttribute('data-action', ActionTypes.decrementSeconds);
                actionLinkClone.appendChild(downIcon.cloneNode(true));
                td.appendChild(actionLinkClone);
                bottomRow.appendChild(td);
            }
            if (!this._context.options.display.components.useTwentyfourHour) {
                topRow.appendChild(separator.cloneNode(true));
                let td = document.createElement('td');
                let button = document.createElement('button');
                button.setAttribute('title', this._context.options.localization.togglePeriod);
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

    /**
     * Creates and updates the grid for `hours`
     */
    class HourDisplay {
        constructor(context) {
            this._context = context;
        }
        /**
         * Build the container html for the display
         * @private
         */
        get _picker() {
            const container = document.createElement('div');
            container.classList.add(Namespace.Css.hourContainer);
            const table = document.createElement('table');
            const tableBody = document.createElement('tbody');
            let row = document.createElement('tr');
            for (let i = 0; i <=
                (this._context.options.display.components.useTwentyfourHour ? 24 : 12); i++) {
                if (i !== 0 && i % 4 === 0) {
                    tableBody.appendChild(row);
                    row = document.createElement('tr');
                }
                const td = document.createElement('td');
                const div = document.createElement('div');
                div.setAttribute('data-action', ActionTypes.selectHour);
                td.appendChild(div);
                row.appendChild(td);
            }
            table.appendChild(tableBody);
            container.appendChild(table);
            return container;
        }
        /**
         * Populates the grid and updates enabled states
         * @private
         */
        _update() {
            const container = this._context._display.widget.getElementsByClassName(Namespace.Css.hourContainer)[0];
            let innerDate = this._context.viewDate.clone.startOf(Unit.date);
            container
                .querySelectorAll('tbody td div')
                .forEach((containerClone, index) => {
                let classes = [];
                classes.push(Namespace.Css.hour);
                if (!this._context._validation.isValid(innerDate, Unit.hours)) {
                    classes.push(Namespace.Css.disabled);
                }
                containerClone.classList.remove(...containerClone.classList);
                containerClone.classList.add(...classes);
                containerClone.setAttribute('data-value', `${innerDate.hours}`);
                containerClone.innerText = this._context.options.display.components
                    .useTwentyfourHour
                    ? innerDate.hoursFormatted
                    : innerDate.twelveHoursFormatted;
                innerDate.manipulate(1, Unit.hours);
            });
        }
    }

    /**
     * Creates and updates the grid for `minutes`
     */
    class MinuteDisplay {
        constructor(context) {
            this._context = context;
        }
        /**
         * Build the container html for the display
         * @private
         */
        get _picker() {
            const container = document.createElement('div');
            container.classList.add(Namespace.Css.minuteContainer);
            const table = document.createElement('table');
            const tableBody = document.createElement('tbody');
            let row = document.createElement('tr');
            let step = this._context.options.stepping === 1 ? 5 : this._context.options.stepping;
            for (let i = 0; i <= 60 / step; i++) {
                if (i !== 0 && i % 4 === 0) {
                    tableBody.appendChild(row);
                    row = document.createElement('tr');
                }
                const td = document.createElement('td');
                const div = document.createElement('div');
                div.setAttribute('data-action', ActionTypes.selectMinute);
                td.appendChild(div);
                row.appendChild(td);
            }
            table.appendChild(tableBody);
            container.appendChild(table);
            return container;
        }
        /**
         * Populates the grid and updates enabled states
         * @private
         */
        _update() {
            const container = this._context._display.widget.getElementsByClassName(Namespace.Css.minuteContainer)[0];
            let innerDate = this._context.viewDate.clone.startOf(Unit.hours);
            let step = this._context.options.stepping === 1 ? 5 : this._context.options.stepping;
            container
                .querySelectorAll('tbody td div')
                .forEach((containerClone, index) => {
                let classes = [];
                classes.push(Namespace.Css.minute);
                if (!this._context._validation.isValid(innerDate, Unit.minutes)) {
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

    /**
     * Creates and updates the grid for `seconds`
     */
    class secondDisplay {
        constructor(context) {
            this._context = context;
        }
        /**
         * Build the container html for the display
         * @private
         */
        get _picker() {
            const container = document.createElement('div');
            container.classList.add(Namespace.Css.secondContainer);
            const table = document.createElement('table');
            const tableBody = document.createElement('tbody');
            let row = document.createElement('tr');
            for (let i = 0; i <= 12; i++) {
                if (i !== 0 && i % 4 === 0) {
                    tableBody.appendChild(row);
                    row = document.createElement('tr');
                }
                const td = document.createElement('td');
                const div = document.createElement('div');
                div.setAttribute('data-action', ActionTypes.selectSecond);
                td.appendChild(div);
                row.appendChild(td);
            }
            table.appendChild(tableBody);
            container.appendChild(table);
            return container;
        }
        /**
         * Populates the grid and updates enabled states
         * @private
         */
        _update() {
            const container = this._context._display.widget.getElementsByClassName(Namespace.Css.secondContainer)[0];
            let innerDate = this._context.viewDate.clone.startOf(Unit.minutes);
            container
                .querySelectorAll('tbody td div')
                .forEach((containerClone, index) => {
                let classes = [];
                classes.push(Namespace.Css.second);
                if (!this._context._validation.isValid(innerDate, Unit.seconds)) {
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

    /**
     * Main class for all things display related.
     */
    class Display {
        constructor(context) {
            this._isVisible = false;
            /**
             * A document click event to hide the widget if click is outside
             * @private
             * @param e MouseEvent
             */
            this._documentClickEvent = (e) => {
                var _a;
                if (this._isVisible &&
                    !e.composedPath().includes(this.widget) && // click inside the widget
                    !((_a = e.composedPath()) === null || _a === void 0 ? void 0 : _a.includes(this._context._element)) && // click on the element
                    (!this._context.options.keepOpen || !this._context.options.debug)) {
                    this.hide();
                }
            };
            /**
             * Click event for any action like selecting a date
             * @param e MouseEvent
             * @private
             */
            this._actionsClickEvent = (e) => {
                this._context._action.do(e);
            };
            this._context = context;
            this._dateDisplay = new DateDisplay(context);
            this._monthDisplay = new MonthDisplay(context);
            this._yearDisplay = new YearDisplay(context);
            this._decadeDisplay = new DecadeDisplay(context);
            this._timeDisplay = new TimeDisplay(context);
            this._hourDisplay = new HourDisplay(context);
            this._minuteDisplay = new MinuteDisplay(context);
            this._secondDisplay = new secondDisplay(context);
            this._widget = undefined;
        }
        /**
         * Returns the widget body or undefined
         * @private
         */
        get widget() {
            return this._widget;
        }
        /**
         * Updates the table for a particular unit. Used when an option as changed or
         * whenever the class list might need to be refreshed.
         * @param unit
         * @private
         */
        _update(unit) {
            if (!this.widget)
                return;
            //todo do I want some kind of error catching or other guards here?
            switch (unit) {
                case Unit.seconds:
                    this._secondDisplay._update();
                    break;
                case Unit.minutes:
                    this._minuteDisplay._update();
                    break;
                case Unit.hours:
                    this._hourDisplay._update();
                    break;
                case Unit.date:
                    this._dateDisplay._update();
                    break;
                case Unit.month:
                    this._monthDisplay._update();
                    break;
                case Unit.year:
                    this._yearDisplay._update();
                    break;
                case 'clock':
                    this._timeDisplay._update();
                    this._update(Unit.hours);
                    this._update(Unit.minutes);
                    this._update(Unit.seconds);
                    break;
                case 'calendar':
                    this._update(Unit.date);
                    this._update(Unit.year);
                    this._update(Unit.month);
                    this._decadeDisplay._update();
                    break;
                case 'all':
                    if (this._hasTime) {
                        this._update('clock');
                    }
                    if (this._hasDate) {
                        this._update('calendar');
                    }
            }
        }
        /**
         * Shows the picker and creates a Popper instance if needed.
         * Add document click event to hide when clicking outside the picker.
         * @fires Events#show
         */
        show() {
            if (this.widget == undefined) {
                if (this._context.options.useCurrent) {
                    //todo in the td4 branch a pr changed this to allow granularity
                    this._context.dates._setValue(new DateTime());
                }
                this._buildWidget();
                if (this._hasDate) {
                    this._showMode();
                }
                if (!this._context.options.display.inline) {
                    document.body.appendChild(this.widget);
                    this._popperInstance = core.createPopper(this._context._element, this.widget, {
                        modifiers: [
                            {
                                name: 'offset',
                                options: {
                                    offset: [0, 8],
                                },
                            },
                            { name: 'eventListeners', enabled: true },
                        ],
                        placement: 'auto',
                    });
                }
                else {
                    this._context._element.appendChild(this.widget);
                }
                if (this._context.options.display.viewMode == 'clock') {
                    this._context._action.do({
                        currentTarget: this.widget.querySelector(`.${Namespace.Css.timeContainer}`),
                    }, ActionTypes.showClock);
                }
                this.widget
                    .querySelectorAll('[data-action]')
                    .forEach((element) => element.addEventListener('click', this._actionsClickEvent));
                // show the clock when using sideBySide
                if (this._context.options.display.sideBySide) {
                    this._timeDisplay._update();
                    this.widget.getElementsByClassName(Namespace.Css.clockContainer)[0].style.display = 'block';
                }
            }
            this.widget.classList.add(Namespace.Css.show);
            if (!this._context.options.display.inline) {
                this._popperInstance.update();
                document.addEventListener('click', this._documentClickEvent);
            }
            this._context._triggerEvent({ name: Namespace.Events.show });
            this._isVisible = true;
        }
        /**
         * Changes the calendar view mode. E.g. month <-> year
         * @param direction -/+ number to move currentViewMode
         * @private
         */
        _showMode(direction) {
            if (!this.widget) {
                return;
            }
            if (direction) {
                const max = Math.max(this._context._minViewModeNumber, Math.min(3, this._context.currentViewMode + direction));
                if (this._context.currentViewMode == max)
                    return;
                this._context.currentViewMode = max;
            }
            this.widget
                .querySelectorAll(`.${Namespace.Css.dateContainer} > div, .${Namespace.Css.timeContainer} > div`)
                .forEach((e) => (e.style.display = 'none'));
            const datePickerMode = DatePickerModes[this._context.currentViewMode];
            let picker = this.widget.querySelector(`.${datePickerMode.CLASS_NAME}`);
            switch (datePickerMode.CLASS_NAME) {
                case Namespace.Css.decadesContainer:
                    this._decadeDisplay._update();
                    break;
                case Namespace.Css.yearsContainer:
                    this._yearDisplay._update();
                    break;
                case Namespace.Css.monthsContainer:
                    this._monthDisplay._update();
                    break;
                case Namespace.Css.daysContainer:
                    this._dateDisplay._update();
                    break;
            }
            picker.style.display = 'block';
        }
        /**
         * Hides the picker if needed.
         * Remove document click event to hide when clicking outside the picker.
         * @fires Events#hide
         */
        hide() {
            this.widget.classList.remove(Namespace.Css.show);
            if (this._isVisible) {
                this._context._triggerEvent({
                    name: Namespace.Events.hide,
                    date: this._context._unset
                        ? null
                        : this._context.dates.lastPicked
                            ? this._context.dates.lastPicked.clone
                            : void 0,
                });
                this._isVisible = false;
            }
            document.removeEventListener('click', this._documentClickEvent);
        }
        /**
         * Toggles the picker's open state. Fires a show/hide event depending.
         */
        toggle() {
            return this._isVisible ? this.hide() : this.show();
        }
        /**
         * Removes document and data-action click listener and reset the widget
         * @private
         */
        _dispose() {
            document.removeEventListener('click', this._documentClickEvent);
            if (!this.widget)
                return;
            this.widget
                .querySelectorAll('[data-action]')
                .forEach((element) => element.removeEventListener('click', this._actionsClickEvent));
            this.widget.parentNode.removeChild(this.widget);
            this._widget = undefined;
        }
        /**
         * Builds the widgets html template.
         * @private
         */
        _buildWidget() {
            const template = document.createElement('div');
            template.classList.add(Namespace.Css.widget);
            const dateView = document.createElement('div');
            dateView.classList.add(Namespace.Css.dateContainer);
            dateView.appendChild(this._decadeDisplay._picker);
            dateView.appendChild(this._yearDisplay._picker);
            dateView.appendChild(this._monthDisplay._picker);
            dateView.appendChild(this._dateDisplay._picker);
            const timeView = document.createElement('div');
            timeView.classList.add(Namespace.Css.timeContainer);
            timeView.appendChild(this._timeDisplay._picker);
            timeView.appendChild(this._hourDisplay._picker);
            timeView.appendChild(this._minuteDisplay._picker);
            timeView.appendChild(this._secondDisplay._picker);
            const toolbar = document.createElement('div');
            toolbar.classList.add(Namespace.Css.switch);
            toolbar.appendChild(this._toolbar);
            if (this._context.options.display.inline) {
                template.classList.add(Namespace.Css.inline);
            }
            if (this._context.options.display.sideBySide &&
                this._hasDate &&
                this._hasTime) {
                template.classList.add(Namespace.Css.sideBySide);
                if (this._context.options.display.toolbarPlacement === 'top') {
                    template.appendChild(toolbar);
                }
                const row = document.createElement('div');
                row.classList.add('td-row');
                dateView.classList.add('td-half');
                timeView.classList.add('td-half');
                row.appendChild(dateView);
                row.appendChild(timeView);
                template.appendChild(row);
                if (this._context.options.display.toolbarPlacement === 'bottom' ||
                    this._context.options.display.toolbarPlacement === 'default') {
                    template.appendChild(toolbar);
                }
                this._widget = template;
                return;
            }
            if (this._context.options.display.toolbarPlacement === 'top') {
                template.appendChild(toolbar);
            }
            if (this._hasDate) {
                if (this._context.options.display.collapse && this._hasTime) {
                    dateView.classList.add(Namespace.Css.collapse);
                    if (this._context.options.display.viewMode !== 'clock')
                        dateView.classList.add(Namespace.Css.show);
                }
                template.appendChild(dateView);
            }
            if (this._context.options.display.toolbarPlacement === 'default') {
                template.appendChild(toolbar);
            }
            if (this._hasTime) {
                if (this._context.options.display.collapse && this._hasDate) {
                    timeView.classList.add(Namespace.Css.collapse);
                    if (this._context.options.display.viewMode === 'clock')
                        timeView.classList.add(Namespace.Css.show);
                }
                template.appendChild(timeView);
            }
            if (this._context.options.display.toolbarPlacement === 'bottom') {
                template.appendChild(toolbar);
            }
            const arrow = document.createElement('div');
            arrow.classList.add('arrow');
            arrow.setAttribute('data-popper-arrow', '');
            template.appendChild(arrow);
            this._widget = template;
        }
        /**
         * Returns true if the hours, minutes, or seconds component is turned on
         */
        get _hasTime() {
            return (this._context.options.display.components.hours ||
                this._context.options.display.components.minutes ||
                this._context.options.display.components.seconds);
        }
        /**
         * Returns true if the year, month, or date component is turned on
         */
        get _hasDate() {
            return (this._context.options.display.components.year ||
                this._context.options.display.components.month ||
                this._context.options.display.components.date);
        }
        /**
         * Get the toolbar html based on options like buttons.today
         * @private
         */
        get _toolbar() {
            const tbody = document.createElement('tbody');
            if (this._context.options.display.buttons.today) {
                const td = document.createElement('td');
                const div = document.createElement('div');
                div.setAttribute('data-action', ActionTypes.today);
                div.setAttribute('title', this._context.options.localization.today);
                div.appendChild(this._iconTag(this._context.options.display.icons.today));
                td.appendChild(div);
                tbody.appendChild(td);
            }
            if (!this._context.options.display.sideBySide &&
                this._context.options.display.collapse &&
                this._hasDate &&
                this._hasTime) {
                let title, icon;
                if (this._context.options.display.viewMode === 'clock') {
                    title = this._context.options.localization.selectDate;
                    icon = this._context.options.display.icons.date;
                }
                else {
                    title = this._context.options.localization.selectTime;
                    icon = this._context.options.display.icons.time;
                }
                const td = document.createElement('td');
                const div = document.createElement('div');
                div.setAttribute('data-action', ActionTypes.togglePicker);
                div.setAttribute('title', title);
                div.appendChild(this._iconTag(icon));
                td.appendChild(div);
                tbody.appendChild(td);
            }
            if (this._context.options.display.buttons.clear) {
                const td = document.createElement('td');
                const div = document.createElement('div');
                div.setAttribute('data-action', ActionTypes.clear);
                div.setAttribute('title', this._context.options.localization.clear);
                div.appendChild(this._iconTag(this._context.options.display.icons.clear));
                td.appendChild(div);
                tbody.appendChild(td);
            }
            if (this._context.options.display.buttons.close) {
                const td = document.createElement('td');
                const div = document.createElement('div');
                div.setAttribute('data-action', ActionTypes.close);
                div.setAttribute('title', this._context.options.localization.close);
                div.appendChild(this._iconTag(this._context.options.display.icons.close));
                td.appendChild(div);
                tbody.appendChild(td);
            }
            const table = document.createElement('table');
            table.appendChild(tbody);
            return table;
        }
        /***
         * Builds the base header template with next and previous icons
         * @private
         */
        get _headTemplate() {
            let div = document.createElement('div');
            const headTemplate = document.createElement('thead');
            const previous = document.createElement('th');
            previous.classList.add(Namespace.Css.previous);
            previous.setAttribute('data-action', ActionTypes.previous);
            div.appendChild(this._iconTag(this._context.options.display.icons.previous));
            previous.appendChild(div);
            headTemplate.appendChild(previous);
            const switcher = document.createElement('th');
            switcher.classList.add(Namespace.Css.switch);
            switcher.setAttribute('data-action', ActionTypes.pickerSwitch);
            switcher.setAttribute('colspan', this._context.options.display.calendarWeeks ? '6' : '5');
            headTemplate.appendChild(switcher);
            const next = document.createElement('th');
            next.classList.add(Namespace.Css.next);
            next.setAttribute('data-action', ActionTypes.next);
            div = document.createElement('div');
            div.appendChild(this._iconTag(this._context.options.display.icons.next));
            next.appendChild(div);
            headTemplate.appendChild(next);
            return headTemplate.cloneNode(true);
        }
        /**
         * Builds an icon tag as either an `<i>`
         * or with icons.type is `sprites` then an svg tag instead
         * @param iconClass
         * @private
         */
        _iconTag(iconClass) {
            if (this._context.options.display.icons.type === 'sprites') {
                const svg = document.createElement('svg');
                svg.innerHTML = `<use xlink:href='${iconClass}'></use>`;
                return svg;
            }
            const icon = document.createElement('i');
            DOMTokenList.prototype.add.apply(icon.classList, iconClass.split(' '));
            return icon;
        }
        /**
         * Cases the widget to get rebuilt on next show. If the picker is already open
         * then hide and reshow it.
         * @private
         */
        _rebuild() {
            const wasVisible = this._isVisible;
            if (wasVisible)
                this.hide();
            this._dispose();
            if (wasVisible) {
                this.show();
            }
        }
    }

    /**
     * Main class for date validation rules based on the options provided.
     */
    class Validation {
        constructor(context) {
            this._context = context;
        }
        /**
         * Checks to see if the target date is valid based on the rules provided in the options.
         * Granularity can be provide to chek portions of the date instead of the whole.
         * @param targetDate
         * @param granularity
         */
        isValid(targetDate, granularity) {
            if (granularity === Unit.date) {
                if (this._context.options.restrictions.disabledDates &&
                    this._isInDisabledDates(targetDate)) {
                    return false;
                }
                if (this._context.options.restrictions.enabledDates &&
                    !this._isInEnabledDates(targetDate)) {
                    return false;
                }
                if (this._context.options.restrictions.daysOfWeekDisabled &&
                    this._context.options.restrictions.daysOfWeekDisabled.indexOf(targetDate.weekDay) !== -1) {
                    return false;
                }
            }
            if (this._context.options.restrictions.minDate &&
                targetDate.isBefore(this._context.options.restrictions.minDate, granularity)) {
                return false;
            }
            if (this._context.options.restrictions.maxDate &&
                targetDate.isAfter(this._context.options.restrictions.maxDate, granularity)) {
                return false;
            }
            if (granularity === Unit.hours ||
                granularity === Unit.minutes ||
                granularity === Unit.seconds) {
                if (this._context.options.restrictions.disabledHours &&
                    this._isInDisabledHours(targetDate)) {
                    return false;
                }
                if (this._context.options.restrictions.enabledHours &&
                    !this._isInEnabledHours(targetDate)) {
                    return false;
                }
                if (this._context.options.restrictions.disabledTimeIntervals) {
                    for (let i = 0; i < this._context.options.restrictions.disabledTimeIntervals.length; i++) {
                        if (targetDate.isBetween(this._context.options.restrictions.disabledTimeIntervals[i].from, this._context.options.restrictions.disabledTimeIntervals[i].to))
                            return false;
                    }
                }
            }
            return true;
        }
        /**
         * Checks to see if the disabledDates option is in use and returns true (meaning invalid)
         * if the `testDate` is with in the array. Granularity is by date.
         * @param testDate
         * @private
         */
        _isInDisabledDates(testDate) {
            if (!this._context.options.restrictions.disabledDates ||
                this._context.options.restrictions.disabledDates.length === 0)
                return false;
            const formattedDate = testDate.format(Dates.getFormatByUnit(Unit.date));
            return this._context.options.restrictions.disabledDates
                .map((x) => x.format(Dates.getFormatByUnit(Unit.date)))
                .find((x) => x === formattedDate);
        }
        /**
         * Checks to see if the enabledDates option is in use and returns true (meaning valid)
         * if the `testDate` is with in the array. Granularity is by date.
         * @param testDate
         * @private
         */
        _isInEnabledDates(testDate) {
            if (!this._context.options.restrictions.enabledDates ||
                this._context.options.restrictions.enabledDates.length === 0)
                return true;
            const formattedDate = testDate.format(Dates.getFormatByUnit(Unit.date));
            return this._context.options.restrictions.enabledDates
                .map((x) => x.format(Dates.getFormatByUnit(Unit.date)))
                .find((x) => x === formattedDate);
        }
        /**
         * Checks to see if the disabledHours option is in use and returns true (meaning invalid)
         * if the `testDate` is with in the array. Granularity is by hours.
         * @param testDate
         * @private
         */
        _isInDisabledHours(testDate) {
            if (!this._context.options.restrictions.disabledHours ||
                this._context.options.restrictions.disabledHours.length === 0)
                return false;
            const formattedDate = testDate.hours;
            return this._context.options.restrictions.disabledHours.find((x) => x === formattedDate);
        }
        /**
         * Checks to see if the enabledHours option is in use and returns true (meaning valid)
         * if the `testDate` is with in the array. Granularity is by hours.
         * @param testDate
         * @private
         */
        _isInEnabledHours(testDate) {
            if (!this._context.options.restrictions.enabledHours ||
                this._context.options.restrictions.enabledHours.length === 0)
                return true;
            const formattedDate = testDate.hours;
            return this._context.options.restrictions.enabledHours.find((x) => x === formattedDate);
        }
    }

    class OptionConverter {
        static _mergeOptions(config, mergeTo) {
            if (!config || Object.keys(config).length === 0)
                return mergeTo;
            let path = '';
            /**
             * The spread operator caused sub keys to be missing after merging.
             * This is to fix that issue by using spread on the child objects first.
             * Also handles complex options like disabledDates
             * @param provided An option from new config
             * @param defaultOption Default option to compare types against
             */
            const spread = (provided, defaultOption) => {
                Object.keys(provided).forEach((key) => {
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
                            const dateTime = this._dateConversion(value, 'viewDate');
                            if (dateTime !== undefined) {
                                provided[key] = dateTime;
                                break;
                            }
                            throw Namespace.ErrorMessages.typeMismatch('viewDate', providedType, 'DateTime or Date');
                        }
                        case 'minDate': {
                            const dateTime = this._dateConversion(value, 'restrictions.minDate');
                            if (dateTime !== undefined) {
                                provided[key] = dateTime;
                                break;
                            }
                            throw Namespace.ErrorMessages.typeMismatch('restrictions.minDate', providedType, 'DateTime or Date');
                        }
                        case 'maxDate': {
                            const dateTime = this._dateConversion(value, 'restrictions.maxDate');
                            if (dateTime !== undefined) {
                                provided[key] = dateTime;
                                break;
                            }
                            throw Namespace.ErrorMessages.typeMismatch('restrictions.maxDate', providedType, 'DateTime or Date');
                        }
                        case 'disabledHours':
                            this._typeCheckNumberArray('restrictions.disabledHours', value, providedType);
                            if (value.filter((x) => x < 0 || x > 24))
                                throw Namespace.ErrorMessages.numbersOutOfRage('restrictions.disabledHours', 0, 23);
                            break;
                        case 'enabledHours':
                            this._typeCheckNumberArray('restrictions.enabledHours', value, providedType);
                            if (value.filter((x) => x < 0 || x > 24))
                                throw Namespace.ErrorMessages.numbersOutOfRage('restrictions.enabledHours', 0, 23);
                            break;
                        case 'daysOfWeekDisabled':
                            this._typeCheckNumberArray('restrictions.daysOfWeekDisabled', value, providedType);
                            if (value.filter((x) => x < 0 || x > 6))
                                throw Namespace.ErrorMessages.numbersOutOfRage('restrictions.daysOfWeekDisabled', 0, 6);
                            break;
                        case 'enabledDates':
                            this._typeCheckDateArray('restrictions.enabledDates', value, providedType);
                            break;
                        case 'disabledDates':
                            this._typeCheckDateArray('restrictions.disabledDates', value, providedType);
                            break;
                        case 'disabledTimeIntervals':
                            if (!Array.isArray(value)) {
                                throw Namespace.ErrorMessages.typeMismatch(key, providedType, 'array of { from: DateTime|Date, to: DateTime|Date }');
                            }
                            const valueObject = value;
                            for (let i = 0; i < valueObject.length; i++) {
                                Object.keys(valueObject[i]).forEach((vk) => {
                                    const subOptionName = `${key}[${i}].${vk}`;
                                    let d = valueObject[i][vk];
                                    const dateTime = this._dateConversion(d, subOptionName);
                                    if (!dateTime) {
                                        throw Namespace.ErrorMessages.typeMismatch(subOptionName, typeof d, 'DateTime or Date');
                                    }
                                    valueObject[i][vk] = dateTime;
                                });
                            }
                            break;
                        default:
                            if (providedType !== defaultType) {
                                if (defaultType === typeof undefined)
                                    throw Namespace.ErrorMessages.unexpectedOption(path.substring(1));
                                switch (defaultType) {
                                    case 'boolean':
                                        provided[key] = value === 'true';
                                        break;
                                    case 'number':
                                        provided[key] = +value;
                                        break;
                                    case 'string':
                                        provided[key] = value.toString();
                                        break;
                                    default:
                                        throw Namespace.ErrorMessages.typeMismatch(path.substring(1), providedType, defaultType);
                                }
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
            return Object.assign(Object.assign({}, mergeTo), config);
        }
        static _dataToOptions(element, options) {
            const eData = element.dataset;
            if (!eData ||
                Object.keys(eData).length === 0 ||
                eData.constructor !== DOMStringMap)
                return options;
            let dataOptions = {};
            // because dataset returns camelCase including the 'td' key the option
            // key won't align
            const objectToNormalized = (object) => {
                const lowered = {};
                Object.keys(object).forEach((x) => {
                    lowered[x.toLowerCase()] = x;
                });
                return lowered;
            };
            const rabbitHole = (split, index, optionSubgroup, value) => {
                // first round = display { ... }
                const normalizedOptions = objectToNormalized(optionSubgroup);
                const keyOption = normalizedOptions[split[index].toLowerCase()];
                const internalObject = {};
                if (keyOption === undefined)
                    return internalObject;
                // if this is another object, continue down the rabbit hole
                if (optionSubgroup[keyOption].constructor === Object) {
                    index++;
                    internalObject[keyOption] = rabbitHole(split, index, optionSubgroup[keyOption], value);
                }
                else {
                    internalObject[keyOption] = value;
                }
                return internalObject;
            };
            const optionsLower = objectToNormalized(options);
            Object.keys(eData)
                .filter((x) => x.startsWith(Namespace.DATA_KEY))
                .map((x) => x.substring(2))
                .forEach((key) => {
                let keyOption = optionsLower[key.toLowerCase()];
                // dataset merges dashes to camelCase... yay
                // i.e. key = display_components_seconds
                if (key.includes('_')) {
                    // [display, components, seconds]
                    const split = key.split('_');
                    // display
                    keyOption = optionsLower[split[0].toLowerCase()];
                    if (keyOption !== undefined &&
                        options[keyOption].constructor === Object) {
                        dataOptions[keyOption] = rabbitHole(split, 1, options[keyOption], eData[`td${key}`]);
                    }
                }
                // or key = allowMultidate
                else if (keyOption !== undefined) {
                    dataOptions[keyOption] = eData[`td${key}`];
                }
            });
            return this._mergeOptions(dataOptions, options);
        }
        /**
         * Attempts to prove `d` is a DateTime or Date or can be converted into one.
         * @param d If a string will attempt creating a date from it.
         * @private
         */
        static _dateTypeCheck(d) {
            if (d.constructor.name === 'DateTime')
                return d;
            if (d.constructor.name === 'Date') {
                return DateTime.convert(d);
            }
            if (typeof d === typeof '') {
                const dateTime = new DateTime(d);
                if (JSON.stringify(dateTime) === 'null') {
                    return null;
                }
                return dateTime;
            }
            return null;
        }
        /**
         * Type checks that `value` is an array of Date or DateTime
         * @param optionName Provides text to error messages e.g. disabledDates
         * @param value Option value
         * @param providedType Used to provide text to error messages
         */
        static _typeCheckDateArray(optionName, value, providedType) {
            if (!Array.isArray(value)) {
                throw Namespace.ErrorMessages.typeMismatch(optionName, providedType, 'array of DateTime or Date');
            }
            for (let i = 0; i < value.length; i++) {
                let d = value[i];
                const dateTime = this._dateConversion(d, optionName);
                if (!dateTime) {
                    throw Namespace.ErrorMessages.typeMismatch(optionName, typeof d, 'DateTime or Date');
                }
                value[i] = dateTime;
            }
        }
        /**
         * Type checks that `value` is an array of numbers
         * @param optionName Provides text to error messages e.g. disabledDates
         * @param value Option value
         * @param providedType Used to provide text to error messages
         */
        static _typeCheckNumberArray(optionName, value, providedType) {
            if (!Array.isArray(value) || value.find((x) => typeof x !== typeof 0)) {
                throw Namespace.ErrorMessages.typeMismatch(optionName, providedType, 'array of numbers');
            }
            return;
        }
        /**
         * Attempts to convert `d` to a DateTime object
         * @param d value to convert
         * @param optionName Provides text to error messages e.g. disabledDates
         */
        static _dateConversion(d, optionName) {
            if (typeof d === typeof '') {
                console.warn(Namespace.ErrorMessages.dateString);
            }
            const converted = this._dateTypeCheck(d);
            if (!converted) {
                throw Namespace.ErrorMessages.failedToParseDate(optionName, d);
            }
            return converted;
        }
    }

    /**
     * Main date picker entry point
     */
    class TempusDominus {
        constructor(element, options) {
            this._notifyChangeEventContext = 0;
            /**
             * Event for when the input field changes. This is a class level method so there's
             * something for the remove listener function.
             * @private
             */
            this._inputChangeEvent = () => {
                let parsedDate = OptionConverter._dateTypeCheck(this._input.value);
                if (parsedDate) {
                    this.dates._setValue(parsedDate);
                }
                else {
                    this._triggerEvent({
                        name: Namespace.Events.error,
                        reason: Namespace.ErrorMessages.failedToParseInput,
                        date: parsedDate,
                    });
                }
            };
            /**
             * Event for when the toggle is clicked. This is a class level method so there's
             * something for the remove listener function.
             * @private
             */
            this._toggleClickEvent = () => {
                this._display.toggle();
            };
            if (!element) {
                throw Namespace.ErrorMessages.mustProvideElement;
            }
            this._element = element;
            this.options = this._initializeOptions(options, DefaultOptions);
            this.viewDate = new DateTime();
            this.currentViewMode = null;
            this._unset = true;
            this._minViewModeNumber = 0;
            this._display = new Display(this);
            this._validation = new Validation(this);
            this.dates = new Dates(this);
            this._action = new Actions(this);
            this._initializeViewMode();
            this._initializeInput();
            this._initializeToggle();
            if (this.options.display.inline)
                this._display.show();
        }
        // noinspection JSUnusedGlobalSymbols
        /**
         * Update the picker options. If `reset` is provide `options` will be merged with DefaultOptions instead.
         * @param options
         * @param reset
         * @public
         */
        updateOptions(options, reset = false) {
            if (reset)
                this.options = this._initializeOptions(options, DefaultOptions);
            else
                this.options = this._initializeOptions(options, this.options);
            this._display._rebuild();
        }
        /**
         * Triggers an event like ChangeEvent when the picker has updated the value
         * of a selected date.
         * @param event Accepts a BaseEvent object.
         * @private
         */
        _triggerEvent(event) {
            if (event) {
                const { date, oldDate, isClear } = event;
                // this was to prevent a max call stack error
                // https://github.com/tempusdominus/core/commit/15a280507f5277b31b0b3319ab1edc7c19a000fb
                // todo see if this is still needed or if there's a cleaner way
                this._notifyChangeEventContext++;
                if ((date && oldDate && date.isSame(oldDate)) ||
                    (!isClear && !date && !oldDate) ||
                    this._notifyChangeEventContext > 1) {
                    this._notifyChangeEventContext = 0;
                    return;
                }
                this._handlePromptTimeIfNeeded(event);
            }
            this._element.dispatchEvent(new CustomEvent(event.name, event));
            this._notifyChangeEventContext = 0;
        }
        /**
         * Fires a ViewUpdate event when, for example, the month view is changed.
         * @param {Unit} unit
         * @private
         */
        _viewUpdate(unit) {
            this._triggerEvent({
                name: Namespace.Events.update,
                change: unit,
                viewDate: this.viewDate.clone,
            });
        }
        // noinspection JSUnusedGlobalSymbols
        /**
         * Hides the picker and removes event listeners
         */
        dispose() {
            var _a;
            this._display.hide();
            // this will clear the document click event listener
            this._display._dispose();
            (_a = this._input) === null || _a === void 0 ? void 0 : _a.removeEventListener('change', this._inputChangeEvent);
            this._toggle.removeEventListener('click', this._toggleClickEvent);
            //clear data-
        }
        /**
         * Merges two Option objects together and validates options type
         * @param config new Options
         * @param mergeTo Options to merge into
         * @private
         */
        _initializeOptions(config, mergeTo) {
            config = OptionConverter._mergeOptions(config, mergeTo);
            config = OptionConverter._dataToOptions(this._element, config);
            //defaults the input format based on the components enabled
            if (config.display.inputFormat === undefined) {
                const components = config.display.components;
                config.display.inputFormat = {
                    year: components.year ? 'numeric' : undefined,
                    month: components.month ? '2-digit' : undefined,
                    day: components.date ? '2-digit' : undefined,
                    hour: components.hours
                        ? components.useTwentyfourHour
                            ? '2-digit'
                            : 'numeric'
                        : undefined,
                    minute: components.minutes ? '2-digit' : undefined,
                    second: components.seconds ? '2-digit' : undefined,
                    hour12: !components.useTwentyfourHour,
                };
            }
            return config;
        }
        /**
         * Sets the minimum view allowed by the picker. For example the case of only
         * allowing year and month to be selected but not date.
         * @private
         */
        _initializeViewMode() {
            if (this.options.display.components.year) {
                this._minViewModeNumber = 2;
            }
            if (this.options.display.components.month) {
                this._minViewModeNumber = 1;
            }
            if (this.options.display.components.date) {
                this._minViewModeNumber = 0;
            }
            this.currentViewMode = Math.max(this._minViewModeNumber, this.currentViewMode);
        }
        /**
         * Checks if an input field is being used, attempts to locate one and sets an
         * event listener if found.
         * @private
         */
        _initializeInput() {
            var _a;
            if (this._element.tagName == 'INPUT') {
                this._input = this._element;
            }
            else {
                let query = this._element.dataset.tdTargetInput;
                if (query == undefined || query == 'nearest') {
                    this._input = this._element.querySelector('input');
                }
                else {
                    this._input = this._element.querySelector(query);
                }
            }
            (_a = this._input) === null || _a === void 0 ? void 0 : _a.addEventListener('change', this._inputChangeEvent);
        }
        /**
         * Attempts to locate a toggle for the picker and sets an event listener
         * @private
         */
        _initializeToggle() {
            if (this.options.display.inline)
                return;
            let query = this._element.dataset.tdtargetToggle;
            if (query == 'nearest') {
                query = '[data-toggle="datetimepicker"]';
            }
            this._toggle =
                query == undefined ? this._element : this._element.querySelector(query);
            this._toggle.addEventListener('click', this._toggleClickEvent);
        }
        /**
         * If the option is enabled this will render the clock view after a date pick.
         * @param e change event
         * @private
         */
        _handlePromptTimeIfNeeded(e) {
            var _a, _b;
            if (
            // options is disabled
            !this.options.promptTimeOnDateChange ||
                this.options.display.inline ||
                this.options.display.sideBySide ||
                // time is disabled
                !this._display._hasTime || ((_a = 
            // clock component is already showing
            this._display.widget) === null || _a === void 0 ? void 0 : _a.getElementsByClassName(Namespace.Css.show)[0].classList.contains(Namespace.Css.timeContainer)))
                return;
            // First time ever. If useCurrent option is set to true (default), do nothing
            // because the first date is selected automatically.
            // or date didn't change (time did) or date changed because time did.
            if ((!e.oldDate && this.options.useCurrent) ||
                (e.oldDate && ((_b = e.date) === null || _b === void 0 ? void 0 : _b.isSame(e.oldDate)))) {
                return;
            }
            clearTimeout(this._currentPromptTimeTimeout);
            this._currentPromptTimeTimeout = setTimeout(() => {
                if (this._display.widget) {
                    this._action.do({
                        currentTarget: this._display.widget.querySelector(`.${Namespace.Css.switch} div`),
                    }, ActionTypes.togglePicker);
                }
            }, this.options.promptTimeOnDateChangeTransitionDelay);
        }
    }

    exports.TempusDominus = TempusDominus;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=tempus-dominus.js.map
