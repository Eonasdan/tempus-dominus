export enum Unit {
  seconds = 'seconds',
  minutes = 'minutes',
  hours = 'hours',
  date = 'date',
  month = 'month',
  year = 'year',
}

const twoDigitTemplate = {
  month: '2-digit',
  day: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: true,
}

const twoDigitTwentyFourTemplate = {
  hour: '2-digit',
  hour12: false
}

export interface DateTimeFormatOptions extends Intl.DateTimeFormatOptions {
  timeStyle?: 'short' | 'medium' | 'long';
  dateStyle?: 'short' | 'medium' | 'long' | 'full';
  numberingSystem?: string;
}

export const getFormatByUnit = (unit: Unit): object => {
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
};

/**
 * For the most part this object behaves exactly the same way
 * as the native Date object with a little extra spice.
 */
export class DateTime extends Date {
  /**
   * Used with Intl.DateTimeFormat
   */
  locale = 'default';

  /**
   * Chainable way to set the {@link locale}
   * @param value
   */
  setLocale(value: string): this {
    this.locale = value;
    return this;
  }

  /**
   * Converts a plain JS date object to a DateTime object.
   * Doing this allows access to format, etc.
   * @param  date
   * @param locale
   */
  static convert(date: Date, locale: string = 'default'): DateTime {
    if (!date) throw new Error(`A date is required`);
    return new DateTime(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    ).setLocale(locale);
  }

  /**
   * Native date manipulations are not pure functions. This function creates a duplicate of the DateTime object.
   */
  get clone() {
    return new DateTime(
      this.year,
      this.month,
      this.date,
      this.hours,
      this.minutes,
      this.seconds,
      this.getMilliseconds()
    ).setLocale(this.locale);
  }

  /**
   * Sets the current date to the start of the {@link unit} provided
   * Example: Consider a date of "April 30, 2021, 11:45:32.984 AM" => new DateTime(2021, 3, 30, 11, 45, 32, 984).startOf('month')
   * would return April 1, 2021, 12:00:00.000 AM (midnight)
   * @param unit
   * @param startOfTheWeek Allows for the changing the start of the week.
   */
  startOf(unit: Unit | 'weekDay', startOfTheWeek = 0): this {
    if (this[unit] === undefined) throw new Error(`Unit '${unit}' is not valid`);
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
        if (this.weekDay === startOfTheWeek) break;
        let goBack = this.weekDay;
        if (startOfTheWeek !== 0 && this.weekDay === 0) goBack = 8 - startOfTheWeek;
        this.manipulate(startOfTheWeek - goBack, Unit.date);
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
   * @param startOfTheWeek
   */
  endOf(unit: Unit | 'weekDay', startOfTheWeek = 0): this {
    if (this[unit] === undefined) throw new Error(`Unit '${unit}' is not valid`);
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
        this.endOf(Unit.date);
        this.manipulate((6 + startOfTheWeek) - this.weekDay, Unit.date);
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
  manipulate(value: number, unit: Unit): this {
    if (this[unit] === undefined) throw new Error(`Unit '${unit}' is not valid`);
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
  format(template: DateTimeFormatOptions, locale = this.locale): string {
    return new Intl.DateTimeFormat(locale, template).format(this);
  }

  /**
   * Return true if {@link compare} is before this date
   * @param compare The Date/DateTime to compare
   * @param unit If provided, uses {@link startOf} for
   * comparision.
   */
  isBefore(compare: DateTime, unit?: Unit): boolean {
    if (!unit) return this.valueOf() < compare.valueOf();
    if (this[unit] === undefined) throw new Error(`Unit '${unit}' is not valid`);
    return (
      this.clone.startOf(unit).valueOf() < compare.clone.startOf(unit).valueOf()
    );
  }

  /**
   * Return true if {@link compare} is after this date
   * @param compare The Date/DateTime to compare
   * @param unit If provided, uses {@link startOf} for
   * comparision.
   */
  isAfter(compare: DateTime, unit?: Unit): boolean {
    if (!unit) return this.valueOf() > compare.valueOf();
    if (this[unit] === undefined) throw new Error(`Unit '${unit}' is not valid`);
    return (
      this.clone.startOf(unit).valueOf() > compare.clone.startOf(unit).valueOf()
    );
  }

  /**
   * Return true if {@link compare} is same this date
   * @param compare The Date/DateTime to compare
   * @param unit If provided, uses {@link startOf} for
   * comparision.
   */
  isSame(compare: DateTime, unit?: Unit): boolean {
    if (!unit) return this.valueOf() === compare.valueOf();
    if (this[unit] === undefined) throw new Error(`Unit '${unit}' is not valid`);
    compare = DateTime.convert(compare);
    return (
      this.clone.startOf(unit).valueOf() === compare.startOf(unit).valueOf()
    );
  }

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
    inclusivity: '()' | '[]' | '(]' | '[)' = '()'
  ): boolean {
    if (unit && this[unit] === undefined) throw new Error(`Unit '${unit}' is not valid`);
    const leftInclusivity = inclusivity[0] === '(';
    const rightInclusivity = inclusivity[1] === ')';

    return (
      ((leftInclusivity
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
          : !this.isBefore(right, unit)))
    );
  }

  /**
   * Returns flattened object of the date. Does not include literals
   * @param locale
   * @param template
   */
  parts(
    locale = this.locale,
    template: any = { dateStyle: 'full', timeStyle: 'long' }
  ): any {
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
  get seconds(): number {
    return this.getSeconds();
  }

  /**
   * Shortcut to Date.setSeconds()
   */
  set seconds(value: number) {
    this.setSeconds(value);
  }

  /**
   * Returns two digit hours
   */
  get secondsFormatted(): string {
    return this.parts(undefined, twoDigitTemplate).second;
  }

  /**
   * Shortcut to Date.getMinutes()
   */
  get minutes(): number {
    return this.getMinutes();
  }

  /**
   * Shortcut to Date.setMinutes()
   */
  set minutes(value: number) {
    this.setMinutes(value);
  }

  /**
   * Returns two digit minutes
   */
  get minutesFormatted(): string {
    return this.parts(undefined, twoDigitTemplate).minute;
  }

  /**
   * Shortcut to Date.getHours()
   */
  get hours(): number {
    return this.getHours();
  }

  /**
   * Shortcut to Date.setHours()
   */
  set hours(value: number) {
    this.setHours(value);
  }

  /**
   * Returns two digit hours
   */
  get hoursFormatted(): string {
    let formatted =this.parts(undefined, twoDigitTwentyFourTemplate).hour;
    if (formatted === '24') formatted = '00';
    return formatted;
  }

  /**
   * Returns two digit hours but in twelve hour mode e.g. 13 -> 1
   */
  get twelveHoursFormatted(): string {
    return this.parts(undefined, twoDigitTemplate).hour;
  }

  /**
   * Get the meridiem of the date. E.g. AM or PM.
   * If the {@link locale} provides a "dayPeriod" then this will be returned,
   * otherwise it will return AM or PM.
   * @param locale
   */
  meridiem(locale: string = this.locale): string {
    return new Intl.DateTimeFormat(locale, {
      hour: 'numeric',
      hour12: true
    } as any)
      .formatToParts(this)
      .find((p) => p.type === 'dayPeriod')?.value;
  }

  /**
   * Shortcut to Date.getDate()
   */
  get date(): number {
    return this.getDate();
  }

  /**
   * Shortcut to Date.setDate()
   */
  set date(value: number) {
    this.setDate(value);
  }

  /**
   * Return two digit date
   */
  get dateFormatted(): string {
    return this.parts(undefined, twoDigitTemplate).day;
  }

  /**
   * Shortcut to Date.getDay()
   */
  get weekDay(): number {
    return this.getDay();
  }

  /**
   * Shortcut to Date.getMonth()
   */
  get month(): number {
    return this.getMonth();
  }

  /**
   * Shortcut to Date.setMonth()
   */
  set month(value: number) {
    const targetMonth = new Date(this.year, value + 1);
    targetMonth.setDate(0);
    const endOfMonth = targetMonth.getDate();
    if (this.date > endOfMonth) {
      this.date = endOfMonth;
    }
    this.setMonth(value);
  }

  /**
   * Return two digit, human expected month. E.g. January = 1, December = 12
   */
  get monthFormatted(): string {
    return this.parts(undefined, twoDigitTemplate).month;
  }

  /**
   * Shortcut to Date.getFullYear()
   */
  get year(): number {
    return this.getFullYear();
  }

  /**
   * Shortcut to Date.setFullYear()
   */
  set year(value: number) {
    this.setFullYear(value);
  }

  // borrowed a bunch of stuff from Luxon
  /**
   * Gets the week of the year
   */
  get week(): number {
    const ordinal = this.computeOrdinal(),
      weekday = this.getUTCDay();

    let weekNumber = Math.floor((ordinal - weekday + 10) / 7);

    if (weekNumber < 1) {
      weekNumber = this.weeksInWeekYear(this.year - 1);
    } else if (weekNumber > this.weeksInWeekYear(this.year)) {
      weekNumber = 1;
    }

    return weekNumber;
  }

  weeksInWeekYear(weekYear) {
    const p1 =
        (weekYear +
          Math.floor(weekYear / 4) -
          Math.floor(weekYear / 100) +
          Math.floor(weekYear / 400)) %
        7,
      last = weekYear - 1,
      p2 =
        (last +
          Math.floor(last / 4) -
          Math.floor(last / 100) +
          Math.floor(last / 400)) %
        7;
    return p1 === 4 || p2 === 3 ? 53 : 52;
  }

  get isLeapYear() {
    return this.year % 4 === 0 && (this.year % 100 !== 0 || this.year % 400 === 0);
  }

  private computeOrdinal() {
    return this.date + (this.isLeapYear ? this.leapLadder : this.nonLeapLadder)[this.month];
  }

  private nonLeapLadder = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  private leapLadder = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];
}
