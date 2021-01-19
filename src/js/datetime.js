/**
 * @typedef {'seconds'|'minutes'|'hours'|'date'|'month'|'year'} Unit
 */

/**
 * For the most part this object behaves exactly the same way
 * as the native Date object with a little extra spice.
 */
export default class DateTime extends Date {
    /**
     * Used with Intl.DateTimeFormat
     * @type {string}
     */
    locale = 'default';

    /**
     * Converts a plain JS date object to a DateTime object.
     * Doing this allows access to format, etc.
     * @param {Date|DateTime} date
     * @returns {DateTime}
     */
    static convert(date) {
        if (!date) throw `A date is required`;
        if (typeof date.startOf === 'function') return date;
        if (typeof date.getDate !== 'function') throw `A date is required`;
        return new DateTime(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
    }

    /**
     * Native date manipulations are not pure functions. This function creates a duplicate of the DateTime object.
     * @returns {DateTime}
     */
    get clone() {
        return new DateTime(this.year, this.month, this.date, this.hours, this.minutes, this.seconds, this.getMilliseconds());
    }

    /**
     * Sets the current date to the start of the {@link unit} provided
     * Example: Consider a date of "April 30, 2021, 11:45:32.984 AM" => new DateTime(2021, 3, 30, 11, 45, 32, 984).startOf('month')
     * would return April 1, 2021, 12:00:00.000 AM (midnight)
     * @param {Unit|'weekDay'} unit
     * @returns {DateTime} self
     */
    startOf(unit) {
        if (this[unit] === undefined) throw `Unit '${unit}' is not valid`;
        switch (unit) {
            case "seconds":
                this.setMilliseconds(0);
                break;
            case "minutes":
                this.setSeconds(0, 0);
                break;
            case "hours":
                this.setMinutes(0, 0, 0);
                break;
            case "date":
                this.setHours(0, 0, 0, 0);
                break;
            case "weekDay":
                this.startOf("date");
                this.manipulate(0 - this.weekDay, 'date')
                break;
            case "month":
                this.startOf("date");
                this.setDate(1);
                break;
            case "year":
                this.startOf("date");
                this.setMonth(0, 1);
                break;
        }
        return this;
    }

    /**
     * Sets the current date to the end of the {@link unit} provided
     * Example: Consider a date of "April 30, 2021, 11:45:32.984 AM" => new DateTime(2021, 3, 30, 11, 45, 32, 984).endOf('month')
     * would return April 30, 2021, 11:59:59.999 PM
     * @param {Unit|'weekDay'} unit
     * @returns {DateTime} self
     */
    endOf(unit) {
        if (this[unit] === undefined) throw `Unit '${unit}' is not valid`;
        switch (unit) {
            case "seconds":
                this.setMilliseconds(999);
                break;
            case "minutes":
                this.setSeconds(59, 999);
                break;
            case "hours":
                this.setMinutes(59, 59, 999);
                break;
            case "date":
                this.setHours(23, 59, 59, 999);
                break;
            case "weekDay":
                this.startOf("date");
                this.manipulate(6 - this.weekDay, 'date')
                break;
            case "month":
                this.endOf("date");
                this.manipulate(1, "month");
                this.setDate(0);
                break;
            case "year":
                this.endOf("date");
                this.manipulate(1, "year");
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
     * @param {Unit} unit
     * @returns {DateTime}
     */
    manipulate(value, unit) {
        if (this[unit] === undefined) throw `Unit '${unit}' is not valid`;
        this[unit] += value;
        return this;
    }

    /**
     * Returns a string format.
     * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
     * for valid templates and locale objects
     * @param {Object} template An object. Uses browser defaults otherwise.
     * @param {string} locale Can be a string or an array of strings. Uses browser defaults otherwise.
     * @returns {string}
     */
    format(template, locale = this.locale) {
        return new Intl.DateTimeFormat(locale, template).format(this);
    }

    /**
     * Return true if {@link compare} is before this date
     * @param {Date|DateTime} compare The Date/DateTime to compare
     * @param {Unit?} unit. If provided, uses {@link startOf} for
     * comparision.
     * @returns {boolean}
     */
    isBefore(compare, unit) {
        if (!unit) return this < compare;
        if (this[unit] === undefined) throw `Unit '${unit}' is not valid`;
        compare = DateTime.convert(compare);
        return this.clone.startOf(unit).valueOf() < compare.startOf(unit).valueOf();
    }

    /**
     * Return true if {@link compare} is after this date
     * @param {Date|DateTime} compare The Date/DateTime to compare
     * @param {Unit?} unit. If provided, uses {@link startOf} for
     * comparision.
     * @returns {boolean}
     */
    isAfter(compare, unit) {
        if (!unit) return this > compare;
        if (this[unit] === undefined) throw `Unit '${unit}' is not valid`;
        compare = DateTime.convert(compare);
        return this.clone.startOf(unit).valueOf() > compare.startOf(unit).valueOf();
    }

    /**
     * Return true if {@link compare} is same this date
     * @param {Date|DateTime} compare The Date/DateTime to compare
     * @param {Unit?} unit. If provided, uses {@link startOf} for
     * comparision.
     * @returns {boolean}
     */
    isSame(compare, unit) {
        if (!unit) return this.valueOf() === compare.valueOf();
        if (this[unit] === undefined) throw `Unit '${unit}' is not valid`;
        compare = DateTime.convert(compare);
        return (
            this.clone.startOf(unit).valueOf() === compare.startOf(unit).valueOf()
        );
    }

    /**
     * Check if this is between two other DateTimes, optionally looking at unit scale. The match is exclusive.
     * @param {Date|DateTime} left
     * @param {Date|DateTime} right
     * @param {Unit} unit.
     * @param {string} inclusivity. A [ indicates inclusion of a value. A ( indicates exclusion.
     * If the inclusivity parameter is used, both indicators must be passed.
     * @returns {boolean}
     */
    isBetween(left, right, unit, inclusivity = "()") {
        if (this[unit] === undefined) throw `Unit '${unit}' is not valid`;
        const leftInclusivity = inclusivity[0] === "(";
        const rightInclusivity = inclusivity[1] === ")";
        left = DateTime.convert(left);
        right = DateTime.convert(right);

        return (
            ((leftInclusivity ? this.isAfter(left, unit) : !this.isBefore(left, unit)) &&
                (rightInclusivity ? this.isBefore(right, unit) : !this.isAfter(right, unit))) ||
            ((leftInclusivity ? this.isBefore(left, unit) : !this.isAfter(left, unit)) &&
                (rightInclusivity ? this.isAfter(right, unit) : !this.isBefore(right, unit)))
        );
    }

    /**
     * Returns flattened object of the date. Does not include literals
     * @param {string} locale
     * @param {Object} template
     * @returns {{}}
     */
    parts(locale = this.locale, template = { dateStyle: 'full', timeStyle: 'long' }) {
        const parts = {}
        new Intl.DateTimeFormat(locale, template).formatToParts(this).filter(x => x.type !== 'literal').forEach(x => parts[x.type] = x.value)
        return parts;
    }

    /**
     * Shortcut to Date.getSeconds()
     * @returns {number}
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
     * @returns {string}
     */
    get secondsFormatted() {
        return this.seconds < 10 ? (`0${this.seconds}`) : `${this.seconds}`;
    }

    /**
     * Shortcut to Date.getMinutes()
     * @returns {number}
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
     * @returns {string}
     */
    get minutesFormatted() {
        return this.minutes < 10 ? (`0${this.minutes}`) : `${this.minutes}`;
    }

    /**
     * Shortcut to Date.getHours()
     * @returns {number}
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
     * @returns {string}
     */
    get hoursFormatted() {
        return this.hours < 10 ? (`0${this.hours}`) : `${this.hours}`;
    }

    /**
     * Get the meridiem of the date. E.g. AM or PM.
     * If the {@link locale} provides a "dayPeriod" then this will be returned,
     * otherwise it will return AM or PM.
     * @param locale
     * @returns {string}
     */
    meridiem(locale = this.locale) {
        const dayPeriod = new Intl.DateTimeFormat(locale, {
            hour: "numeric",
            dayPeriod: "narrow"
        })
            .formatToParts(this)
            .find(p => p.type === "dayPeriod")?.value;
        return dayPeriod ? dayPeriod : this.getHours() <= 12 ? "AM" : "PM";
    }

    /**
     * Shortcut to Date.getDate()
     * @returns {number}
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
     * @returns {string}
     */
    get dateFormatted() {
        return this.date < 10 ? (`0${this.date}`) : `${this.date}`;
    }

    // https://github.com/you-dont-need/You-Dont-Need-Momentjs#week-of-year
    /**
     * Gets the week of the year
     * @returns {number}
     */
    week() {
        const day = new Date();
        const MILLISECONDS_IN_WEEK = 604800000;
        const firstDayOfWeek = 1; // monday as the first day (0 = sunday)
        const startOfYear = new Date(day.getFullYear(), 0, 1);
        startOfYear.setDate(
            startOfYear.getDate() + (firstDayOfWeek - (startOfYear.getDay() % 7))
        );
        return Math.round((day - startOfYear) / MILLISECONDS_IN_WEEK) + 1;
    }

    /**
     * Shortcut to Date.getDay()
     * @returns {number}
     */
    get weekDay() {
        return this.getDay();
    }

    /**
     * Shortcut to Date.getMonth()
     * @returns {number}
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
     * @returns {string}
     */
    get monthFormatted() {
        return this.month + 1 < 10 ? (`0${this.month}`) : `${this.month}`;
    }

    /**
     * Shortcut to Date.getFullYear()
     * @returns {number}
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