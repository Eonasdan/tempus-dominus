export declare enum Unit {
    seconds = "seconds",
    minutes = "minutes",
    hours = "hours",
    date = "date",
    month = "month",
    year = "year"
}
export interface DateTimeFormatOptions extends Intl.DateTimeFormatOptions {
    timeStyle?: 'short' | 'medium' | 'long';
    dateStyle?: 'short' | 'medium' | 'long' | 'full';
    numberingSystem?: string;
}
export declare const getFormatByUnit: (unit: Unit) => object;
/**
 * For the most part this object behaves exactly the same way
 * as the native Date object with a little extra spice.
 */
export declare class DateTime extends Date {
    /**
     * Used with Intl.DateTimeFormat
     */
    locale: string;
    /**
     * Chainable way to set the {@link locale}
     * @param value
     */
    setLocale(value: string): this;
    /**
     * Converts a plain JS date object to a DateTime object.
     * Doing this allows access to format, etc.
     * @param  date
     * @param locale
     */
    static convert(date: Date, locale?: string): DateTime;
    /**
     * Native date manipulations are not pure functions. This function creates a duplicate of the DateTime object.
     */
    get clone(): DateTime;
    /**
     * Sets the current date to the start of the {@link unit} provided
     * Example: Consider a date of "April 30, 2021, 11:45:32.984 AM" => new DateTime(2021, 3, 30, 11, 45, 32, 984).startOf('month')
     * would return April 1, 2021, 12:00:00.000 AM (midnight)
     * @param unit
     * @param startOfTheWeek Allows for the changing the start of the week.
     */
    startOf(unit: Unit | 'weekDay', startOfTheWeek?: number): this;
    /**
     * Sets the current date to the end of the {@link unit} provided
     * Example: Consider a date of "April 30, 2021, 11:45:32.984 AM" => new DateTime(2021, 3, 30, 11, 45, 32, 984).endOf('month')
     * would return April 30, 2021, 11:59:59.999 PM
     * @param unit
     * @param startOfTheWeek
     */
    endOf(unit: Unit | 'weekDay', startOfTheWeek?: number): this;
    /**
     * Change a {@link unit} value. Value can be positive or negative
     * Example: Consider a date of "April 30, 2021, 11:45:32.984 AM" => new DateTime(2021, 3, 30, 11, 45, 32, 984).manipulate(1, 'month')
     * would return May 30, 2021, 11:45:32.984 AM
     * @param value A positive or negative number
     * @param unit
     */
    manipulate(value: number, unit: Unit): this;
    /**
     * Returns a string format.
     * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
     * for valid templates and locale objects
     * @param template An object. Uses browser defaults otherwise.
     * @param locale Can be a string or an array of strings. Uses browser defaults otherwise.
     */
    format(template: DateTimeFormatOptions, locale?: string): string;
    /**
     * Return true if {@link compare} is before this date
     * @param compare The Date/DateTime to compare
     * @param unit If provided, uses {@link startOf} for
     * comparision.
     */
    isBefore(compare: DateTime, unit?: Unit): boolean;
    /**
     * Return true if {@link compare} is after this date
     * @param compare The Date/DateTime to compare
     * @param unit If provided, uses {@link startOf} for
     * comparision.
     */
    isAfter(compare: DateTime, unit?: Unit): boolean;
    /**
     * Return true if {@link compare} is same this date
     * @param compare The Date/DateTime to compare
     * @param unit If provided, uses {@link startOf} for
     * comparision.
     */
    isSame(compare: DateTime, unit?: Unit): boolean;
    /**
     * Check if this is between two other DateTimes, optionally looking at unit scale. The match is exclusive.
     * @param left
     * @param right
     * @param unit.
     * @param inclusivity. A [ indicates inclusion of a value. A ( indicates exclusion.
     * If the inclusivity parameter is used, both indicators must be passed.
     */
    isBetween(left: DateTime, right: DateTime, unit?: Unit, inclusivity?: '()' | '[]' | '(]' | '[)'): boolean;
    /**
     * Returns flattened object of the date. Does not include literals
     * @param locale
     * @param template
     */
    parts(locale?: string, template?: any): any;
    /**
     * Shortcut to Date.getSeconds()
     */
    get seconds(): number;
    /**
     * Shortcut to Date.setSeconds()
     */
    set seconds(value: number);
    /**
     * Returns two digit hours
     */
    get secondsFormatted(): string;
    /**
     * Shortcut to Date.getMinutes()
     */
    get minutes(): number;
    /**
     * Shortcut to Date.setMinutes()
     */
    set minutes(value: number);
    /**
     * Returns two digit minutes
     */
    get minutesFormatted(): string;
    /**
     * Shortcut to Date.getHours()
     */
    get hours(): number;
    /**
     * Shortcut to Date.setHours()
     */
    set hours(value: number);
    /**
     * Returns two digit hours
     */
    get hoursFormatted(): string;
    /**
     * Returns two digit hours but in twelve hour mode e.g. 13 -> 1
     */
    get twelveHoursFormatted(): string;
    /**
     * Get the meridiem of the date. E.g. AM or PM.
     * If the {@link locale} provides a "dayPeriod" then this will be returned,
     * otherwise it will return AM or PM.
     * @param locale
     */
    meridiem(locale?: string): string;
    /**
     * Shortcut to Date.getDate()
     */
    get date(): number;
    /**
     * Shortcut to Date.setDate()
     */
    set date(value: number);
    /**
     * Return two digit date
     */
    get dateFormatted(): string;
    /**
     * Shortcut to Date.getDay()
     */
    get weekDay(): number;
    /**
     * Shortcut to Date.getMonth()
     */
    get month(): number;
    /**
     * Shortcut to Date.setMonth()
     */
    set month(value: number);
    /**
     * Return two digit, human expected month. E.g. January = 1, December = 12
     */
    get monthFormatted(): string;
    /**
     * Shortcut to Date.getFullYear()
     */
    get year(): number;
    /**
     * Shortcut to Date.setFullYear()
     */
    set year(value: number);
    /**
     * Gets the week of the year
     */
    get week(): number;
    weeksInWeekYear(weekYear: any): 53 | 52;
    get isLeapYear(): boolean;
    private computeOrdinal;
    private nonLeapLadder;
    private leapLadder;
}
