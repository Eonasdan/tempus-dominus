import { FormatLocalization } from './utilities/options';
export declare enum Unit {
  seconds = 'seconds',
  minutes = 'minutes',
  hours = 'hours',
  date = 'date',
  month = 'month',
  year = 'year',
}
export interface DateTimeFormatOptions extends Intl.DateTimeFormatOptions {
  timeStyle?: 'short' | 'medium' | 'long';
  dateStyle?: 'short' | 'medium' | 'long' | 'full';
  numberingSystem?: string;
}
/**
 * Returns an Intl format object based on the provided object
 * @param unit
 */
export declare const getFormatByUnit: (unit: Unit) => object;
/**
 * Attempts to guess the hour cycle of the given local
 * @param locale
 */
export declare const guessHourCycle: (
  locale: string
) => Intl.LocaleHourCycleKey;
/**
 * For the most part this object behaves exactly the same way
 * as the native Date object with a little extra spice.
 */
export declare class DateTime extends Date {
  localization: FormatLocalization;
  /**
   * Chainable way to set the {@link locale}
   * @param value
   * @deprecated use setLocalization with a FormatLocalization object instead
   */
  setLocale(value: string): this;
  /**
   * Chainable way to set the {@link localization}
   * @param value
   */
  setLocalization(value: FormatLocalization): this;
  /**
   * Converts a plain JS date object to a DateTime object.
   * Doing this allows access to format, etc.
   * @param  date
   * @param locale this parameter is deprecated. Use formatLocalization instead.
   * @param formatLocalization
   */
  static convert(
    date: Date,
    locale?: string,
    formatLocalization?: FormatLocalization
  ): DateTime;
  /**
   * Native date manipulations are not pure functions. This function creates a duplicate of the DateTime object.
   */
  get clone(): DateTime;
  static isValid(d: any): boolean;
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
   * Return true if {@link compare} is before this date
   * @param compare The Date/DateTime to compare
   * @param unit If provided, uses {@link startOf} for
   * comparison.
   */
  isBefore(compare: DateTime, unit?: Unit): boolean;
  /**
   * Return true if {@link compare} is after this date
   * @param compare The Date/DateTime to compare
   * @param unit If provided, uses {@link startOf} for
   * comparison.
   */
  isAfter(compare: DateTime, unit?: Unit): boolean;
  /**
   * Return true if {@link compare} is same this date
   * @param compare The Date/DateTime to compare
   * @param unit If provided, uses {@link startOf} for
   * comparison.
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
  isBetween(
    left: DateTime,
    right: DateTime,
    unit?: Unit,
    inclusivity?: '()' | '[]' | '(]' | '[)'
  ): boolean;
  /**
   * Returns flattened object of the date. Does not include literals
   * @param locale
   * @param template
   */
  parts(
    locale?: string,
    template?: Record<string, unknown>
  ): Record<string, string>;
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
   * Returns two digit hour, e.g. 01...10
   * @param hourCycle Providing an hour cycle will change 00 to 24 depending on the given value.
   */
  getHoursFormatted(hourCycle?: Intl.LocaleHourCycleKey): string;
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
  /**
   * Returns the number of weeks in the year
   */
  weeksInWeekYear(): 53 | 52;
  /**
   * Returns true or false depending on if the year is a leap year or not.
   */
  get isLeapYear(): boolean;
  private computeOrdinal;
  private nonLeapLadder;
  private leapLadder;
  private dateTimeRegex;
  private formattingTokens;
  /**
   * Returns a list of month values based on the current locale
   */
  private getAllMonths;
  /**
   * Replaces an expanded token set (e.g. LT/LTS)
   */
  private replaceTokens;
  private match2;
  private match3;
  private match4;
  private match1to2;
  private matchSigned;
  private matchOffset;
  private matchWord;
  private parseTwoDigitYear;
  private offsetFromString;
  /**
   * z = -4, zz = -04, zzz = -0400
   * @param date
   * @param style
   * @private
   */
  private zoneInformation;
  private zoneExpressions;
  private addInput;
  private meridiemMatch;
  private expressions;
  private correctHours;
  private makeParser;
  /**
   * Attempts to create a DateTime from a string.
   * @param input date as string
   * @param localization provides the date template the string is in via the format property
   */
  static fromString(input: string, localization: FormatLocalization): DateTime;
  /**
   * Returns a string format.
   * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
   * for valid templates and locale objects
   * @param template An optional object. If provided, method will use Intl., otherwise the localizations format properties
   * @param locale Can be a string or an array of strings. Uses browser defaults otherwise.
   */
  format(template?: DateTimeFormatOptions | string, locale?: string): string;
}
