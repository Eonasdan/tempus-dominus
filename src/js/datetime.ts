import { FormatLocalization } from './utilities/options';
import Namespace from './utilities/namespace';
import DefaultFormatLocalization from './utilities/default-format-localization';

type parsedTime = {
  afternoon?: boolean;
  year?: number;
  month?: number;
  day?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
  zone?: {
    offset: number;
  };
};

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
};

export interface DateTimeFormatOptions extends Intl.DateTimeFormatOptions {
  timeStyle?: 'short' | 'medium' | 'long';
  dateStyle?: 'short' | 'medium' | 'long' | 'full';
  numberingSystem?: string;
}

/**
 * Returns an Intl format object based on the provided object
 * @param unit
 */
export const getFormatByUnit = (unit: Unit): object => {
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
};

/**
 * Attempts to guess the hour cycle of the given local
 * @param locale
 */
export const guessHourCycle = (locale: string): Intl.LocaleHourCycleKey => {
  if (!locale) return 'h12';

  // noinspection SpellCheckingInspection
  const template = {
    hour: '2-digit',
    minute: '2-digit',
    numberingSystem: 'latn',
  };

  const dt = new DateTime().setLocalization({ locale });
  dt.hours = 0;

  const start = dt.parts(undefined, template).hour;

  //midnight is 12 so en-US style 12 AM
  if (start === '12') return 'h12';
  //midnight is 24 is from 00-24
  if (start === '24') return 'h24';

  dt.hours = 23;
  const end = dt.parts(undefined, template).hour;

  //if midnight is 00 and hour 23 is 11 then
  if (start === '00' && end === '11') return 'h11';

  if (start === '00' && end === '23') return 'h23';

  console.warn(
    `couldn't determine hour cycle for ${locale}. start: ${start}. end: ${end}`
  );

  return undefined;
};

interface FormatMatch {
  parser: (obj: parsedTime, input: number) => void;
  pattern?: RegExp;
}

interface FormatMatchString {
  parser: (obj: parsedTime, input: string) => void;
  pattern?: RegExp;
}

interface FormatExpression {
  t: FormatMatchString;
  T: FormatMatchString;
  fff: FormatMatch;
  s: FormatMatch;
  ss: FormatMatch;
  m: FormatMatch;
  mm: FormatMatch;
  H: FormatMatch;
  h: FormatMatch;
  HH: FormatMatch;
  hh: FormatMatch;
  d: FormatMatch;
  dd: FormatMatch;
  Do: FormatMatchString;
  M: FormatMatch;
  MM: FormatMatch;
  MMM: FormatMatchString;
  MMMM: FormatMatchString;
  y: FormatMatch;
  yy: FormatMatch;
  yyyy: FormatMatch;
}

/**
 * For the most part this object behaves exactly the same way
 * as the native Date object with a little extra spice.
 */
export class DateTime extends Date {
  localization: FormatLocalization = DefaultFormatLocalization;

  /**
   * Chainable way to set the {@link locale}
   * @param value
   * @deprecated use setLocalization with a FormatLocalization object instead
   */
  setLocale(value: string): this {
    if (!this.localization) {
      this.localization = DefaultFormatLocalization;
      this.localization.locale = value;
    }
    return this;
  }

  /**
   * Chainable way to set the {@link localization}
   * @param value
   */
  setLocalization(value: FormatLocalization): this {
    this.localization = value;
    return this;
  }

  /**
   * Converts a plain JS date object to a DateTime object.
   * Doing this allows access to format, etc.
   * @param  date
   * @param locale this parameter is deprecated. Use formatLocalization instead.
   * @param formatLocalization
   */
  static convert(
    date: Date,
    locale = 'default',
    formatLocalization: FormatLocalization = undefined
  ): DateTime {
    if (!date) throw new Error(`A date is required`);

    if (!formatLocalization) {
      formatLocalization = DefaultFormatLocalization;
      formatLocalization.locale = locale;
    }

    return new DateTime(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    ).setLocalization(formatLocalization);
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
    ).setLocalization(this.localization);
  }

  static isValid(d): boolean {
    if (d === undefined || JSON.stringify(d) === 'null') return false;
    if (d.constructor.name === DateTime.name) return true;
    return false;
  }

  /**
   * Sets the current date to the start of the {@link unit} provided
   * Example: Consider a date of "April 30, 2021, 11:45:32.984 AM" => new DateTime(2021, 3, 30, 11, 45, 32, 984).startOf('month')
   * would return April 1, 2021, 12:00:00.000 AM (midnight)
   * @param unit
   * @param startOfTheWeek Allows for the changing the start of the week.
   */
  startOf(unit: Unit | 'weekDay', startOfTheWeek = 0): this {
    if (this[unit] === undefined)
      throw new Error(`Unit '${unit}' is not valid`);
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
      case 'weekDay': {
        this.startOf(Unit.date);
        if (this.weekDay === startOfTheWeek) break;
        const goBack = (this.weekDay - startOfTheWeek + 7) % 7;
        this.manipulate(goBack * -1, Unit.date);
        break;
      }
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
    if (this[unit] === undefined)
      throw new Error(`Unit '${unit}' is not valid`);
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
      case 'weekDay': {
        this.endOf(Unit.date);
        const endOfWeek = 6 + startOfTheWeek;
        if (this.weekDay === endOfWeek) break;
        this.manipulate(endOfWeek - this.weekDay, Unit.date);
        break;
      }
      case 'month':
        this.endOf(Unit.date);
        this.manipulate(1, Unit.month);
        this.setDate(0);
        break;
      case 'year':
        this.endOf(Unit.date);
        this.setMonth(11, 31);
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
    if (this[unit] === undefined)
      throw new Error(`Unit '${unit}' is not valid`);
    this[unit] += value;
    return this;
  }

  /**
   * Return true if {@link compare} is before this date
   * @param compare The Date/DateTime to compare
   * @param unit If provided, uses {@link startOf} for
   * comparison.
   */
  isBefore(compare: DateTime, unit?: Unit): boolean {
    // If the comparisons is undefined, return false
    if (!DateTime.isValid(compare)) return false;

    if (!unit) return this.valueOf() < compare.valueOf();
    if (this[unit] === undefined)
      throw new Error(`Unit '${unit}' is not valid`);
    return (
      this.clone.startOf(unit).valueOf() < compare.clone.startOf(unit).valueOf()
    );
  }

  /**
   * Return true if {@link compare} is after this date
   * @param compare The Date/DateTime to compare
   * @param unit If provided, uses {@link startOf} for
   * comparison.
   */
  isAfter(compare: DateTime, unit?: Unit): boolean {
    // If the comparisons is undefined, return false
    if (!DateTime.isValid(compare)) return false;

    if (!unit) return this.valueOf() > compare.valueOf();
    if (this[unit] === undefined)
      throw new Error(`Unit '${unit}' is not valid`);
    return (
      this.clone.startOf(unit).valueOf() > compare.clone.startOf(unit).valueOf()
    );
  }

  /**
   * Return true if {@link compare} is same this date
   * @param compare The Date/DateTime to compare
   * @param unit If provided, uses {@link startOf} for
   * comparison.
   */
  isSame(compare: DateTime, unit?: Unit): boolean {
    // If the comparisons is undefined, return false
    if (!DateTime.isValid(compare)) return false;

    if (!unit) return this.valueOf() === compare.valueOf();
    if (this[unit] === undefined)
      throw new Error(`Unit '${unit}' is not valid`);
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
    // If one of the comparisons is undefined, return false
    if (!DateTime.isValid(left) || !DateTime.isValid(right)) return false;
    // If a unit is provided and is not a valid property of the DateTime object, throw an error
    if (unit && this[unit] === undefined) {
      throw new Error(`Unit '${unit}' is not valid`);
    }

    const leftInclusivity = inclusivity[0] === '(';
    const rightInclusivity = inclusivity[1] === ')';

    const isLeftInRange = leftInclusivity
      ? this.isAfter(left, unit)
      : !this.isBefore(left, unit);
    const isRightInRange = rightInclusivity
      ? this.isBefore(right, unit)
      : !this.isAfter(right, unit);

    return isLeftInRange && isRightInRange;
  }

  /**
   * Returns flattened object of the date. Does not include literals
   * @param locale
   * @param template
   */
  parts(
    locale = this.localization.locale,
    template: Record<string, unknown> = { dateStyle: 'full', timeStyle: 'long' }
  ): Record<string, string> {
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
   * Returns two digit hour, e.g. 01...10
   * @param hourCycle Providing an hour cycle will change 00 to 24 depending on the given value.
   */
  getHoursFormatted(hourCycle: Intl.LocaleHourCycleKey = 'h12') {
    return this.parts(undefined, { ...twoDigitTemplate, hourCycle: hourCycle })
      .hour;
  }

  /**
   * Get the meridiem of the date. E.g. AM or PM.
   * If the {@link locale} provides a "dayPeriod" then this will be returned,
   * otherwise it will return AM or PM.
   * @param locale
   */
  meridiem(locale: string = this.localization.locale): string {
    return new Intl.DateTimeFormat(locale, {
      hour: 'numeric',
      hour12: true,
    })
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
      weekNumber = this.weeksInWeekYear();
    } else if (weekNumber > this.weeksInWeekYear()) {
      weekNumber = 1;
    }

    return weekNumber;
  }

  /**
   * Returns the number of weeks in the year
   */
  weeksInWeekYear() {
    const p1 =
        (this.year +
          Math.floor(this.year / 4) -
          Math.floor(this.year / 100) +
          Math.floor(this.year / 400)) %
        7,
      last = this.year - 1,
      p2 =
        (last +
          Math.floor(last / 4) -
          Math.floor(last / 100) +
          Math.floor(last / 400)) %
        7;
    return p1 === 4 || p2 === 3 ? 53 : 52;
  }

  /**
   * Returns true or false depending on if the year is a leap year or not.
   */
  get isLeapYear() {
    return (
      this.year % 4 === 0 && (this.year % 100 !== 0 || this.year % 400 === 0)
    );
  }

  private computeOrdinal() {
    return (
      this.date +
      (this.isLeapYear ? this.leapLadder : this.nonLeapLadder)[this.month]
    );
  }

  private nonLeapLadder = [
    0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334,
  ];
  private leapLadder = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];

  //#region CDF stuff

  private dateTimeRegex =
    //is regex cannot be simplified beyond what it already is
    /(\[[^[\]]*])|y{1,4}|M{1,4}|d{1,4}|H{1,2}|h{1,2}|t|T|m{1,2}|s{1,2}|f{3}/g; //NOSONAR

  private formattingTokens =
    /(\[[^[\]]*])|([-_:/.,()\s]+)|(T|t|yyyy|yy?|MM?M?M?|Do|dd?d?d?|hh?|HH?|mm?|ss?)/g; //NOSONAR is regex cannot be simplified beyond what it already is

  /**
   * Returns a list of month values based on the current locale
   */
  private getAllMonths(
    format: '2-digit' | 'numeric' | 'long' | 'short' | 'narrow' = 'long'
  ) {
    const applyFormat = new Intl.DateTimeFormat(this.localization.locale, {
      month: format,
    }).format;
    return [...Array(12).keys()].map((m) => applyFormat(new Date(2021, m)));
  }

  /**
   * Replaces an expanded token set (e.g. LT/LTS)
   */
  private replaceTokens(formatStr, formats) {
    /***
     * _ => match
     * a => first capture group. Anything between [ and ]
     * b => second capture group
     */
    return formatStr.replace(
      /(\[[^[\]]*])|(LTS?|l{1,4}|L{1,4})/g,
      (_, a, b) => {
        const B = b && b.toUpperCase();
        return a || formats[B] || DefaultFormatLocalization.dateFormats[B];
      }
    );
  }

  private match2 = /\d\d/; // 00 - 99
  private match3 = /\d{3}/; // 000 - 999
  private match4 = /\d{4}/; // 0000 - 9999
  private match1to2 = /\d\d?/; // 0 - 99
  private matchSigned = /[+-]?\d+/; // -inf - inf
  private matchOffset = /[+-]\d\d:?(\d\d)?|Z/; // +00:00 -00:00 +0000 or -0000 +00 or Z
  private matchWord = /[^\d_:/,\-()\s]+/; // Word

  private parseTwoDigitYear(input: number) {
    return input + (input > 68 ? 1900 : 2000);
  }

  private offsetFromString(input: string) {
    if (!input) return 0;
    if (input === 'Z') return 0;
    const [first, second, third] = input.match(/([+-]|\d\d)/g);
    const minutes = +second * 60 + (+third || 0);
    const signed = first === '+' ? -minutes : minutes;
    return minutes === 0 ? 0 : signed; // eslint-disable-line no-nested-ternary
  }

  /**
   * z = -4, zz = -04, zzz = -0400
   * @param date
   * @param style
   * @private
   */
  private zoneInformation(date: DateTime, style: 'z' | 'zz' | 'zzz') {
    let name = date
      .parts(this.localization.locale, { timeZoneName: 'longOffset' })
      .timeZoneName.replace('GMT', '')
      .replace(':', '');

    const negative = name.includes('-');

    name = name.replace('-', '');

    if (style === 'z') name = name.substring(1, 2);
    else if (style === 'zz') name = name.substring(0, 2);

    return `${negative ? '-' : ''}${name}`;
  }

  private zoneExpressions = [
    this.matchOffset,
    (obj, input) => {
      obj.offset = this.offsetFromString(input);
    },
  ];

  private addInput(property) {
    return (obj, input) => {
      obj[property] = +input;
    };
  }

  private getLocaleAfternoon(): string {
    return new Intl.DateTimeFormat(this.localization.locale, {
      hour: 'numeric',
      hour12: true,
    })
      .formatToParts(new Date(2022, 3, 4, 13))
      .find((p) => p.type === 'dayPeriod')
      ?.value?.replace(/\s+/g, ' ');
  }

  private meridiemMatch(input: string) {
    return input.toLowerCase() === this.getLocaleAfternoon().toLowerCase();
  }

  private expressions: FormatExpression = {
    t: {
      pattern: undefined, //this.matchWord,
      parser: (obj, input) => {
        obj.afternoon = this.meridiemMatch(input);
      },
    },
    T: {
      pattern: undefined, //this.matchWord,
      parser: (obj, input) => {
        obj.afternoon = this.meridiemMatch(input);
      },
    },
    fff: {
      pattern: this.match3,
      parser: (obj, input) => {
        obj.milliseconds = +input;
      },
    },
    s: {
      pattern: this.match1to2,
      parser: this.addInput('seconds'),
    },
    ss: {
      pattern: this.match1to2,
      parser: this.addInput('seconds'),
    },
    m: {
      pattern: this.match1to2,
      parser: this.addInput('minutes'),
    },
    mm: {
      pattern: this.match1to2,
      parser: this.addInput('minutes'),
    },
    H: {
      pattern: this.match1to2,
      parser: this.addInput('hours'),
    },
    h: {
      pattern: this.match1to2,
      parser: this.addInput('hours'),
    },
    HH: {
      pattern: this.match1to2,
      parser: this.addInput('hours'),
    },
    hh: {
      pattern: this.match1to2,
      parser: this.addInput('hours'),
    },
    d: {
      pattern: this.match1to2,
      parser: this.addInput('day'),
    },
    dd: {
      pattern: this.match2,
      parser: this.addInput('day'),
    },
    Do: {
      pattern: this.matchWord,
      parser: (obj, input) => {
        obj.day = +(input.match(/\d+/)[0] || 1);
        if (!this.localization.ordinal) return;
        for (let i = 1; i <= 31; i += 1) {
          if (this.localization.ordinal(i).replace(/[[\]]/g, '') === input) {
            obj.day = i;
          }
        }
      },
    },
    M: {
      pattern: this.match1to2,
      parser: this.addInput('month'),
    },
    MM: {
      pattern: this.match2,
      parser: this.addInput('month'),
    },
    MMM: {
      pattern: this.matchWord,
      parser: (obj, input) => {
        const months = this.getAllMonths();
        const monthsShort = this.getAllMonths('short');
        const matchIndex =
          (monthsShort || months.map((_) => _.slice(0, 3))).indexOf(input) + 1;
        if (matchIndex < 1) {
          throw new Error();
        }
        obj.month = matchIndex % 12 || matchIndex;
      },
    },
    MMMM: {
      pattern: this.matchWord,
      parser: (obj, input) => {
        const months = this.getAllMonths();
        const matchIndex = months.indexOf(input) + 1;
        if (matchIndex < 1) {
          throw new Error();
        }
        obj.month = matchIndex % 12 || matchIndex;
      },
    },
    y: {
      pattern: this.matchSigned,
      parser: this.addInput('year'),
    },
    yy: {
      pattern: this.match2,
      parser: (obj, input) => {
        obj.year = this.parseTwoDigitYear(+input);
      },
    },
    yyyy: {
      pattern: this.match4,
      parser: this.addInput('year'),
    },
    // z: this.zoneExpressions,
    // zz: this.zoneExpressions,
    // zzz: this.zoneExpressions
  };

  private correctHours(time) {
    const { afternoon } = time;
    if (afternoon !== undefined) {
      const { hours } = time;
      if (afternoon) {
        if (hours < 12) {
          time.hours += 12;
        }
      } else if (hours === 12) {
        time.hours = 0;
      }
      delete time.afternoon;
    }
  }

  private makeParser(format: string) {
    format = this.replaceTokens(format, this.localization.dateFormats);
    const matchArray = format.match(this.formattingTokens);
    const { length } = matchArray;
    const expressionArray: (FormatMatch | string)[] = [];
    for (let i = 0; i < length; i += 1) {
      const token = matchArray[i];
      const expression = this.expressions[token] as FormatMatch;
      if (expression?.parser) {
        expressionArray[i] = expression;
      } else {
        expressionArray[i] = (token as string).replace(/^\[[^[\]]*]$/g, '');
      }
    }

    return (input: string): parsedTime => {
      const time = {
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      };
      for (let i = 0, start = 0; i < length; i += 1) {
        const token = expressionArray[i];
        if (typeof token === 'string') {
          start += token.length;
        } else {
          const part = input.slice(start);
          let value = part;

          if (token.pattern) {
            const match = token.pattern.exec(part);
            value = match[0];
          }
          token.parser.call(this, time, value);
          input = input.replace(value, '');
        }
      }
      this.correctHours(time);
      return time;
    };
  }

  /**
   * Attempts to create a DateTime from a string.
   * @param input date as string
   * @param localization provides the date template the string is in via the format property
   */
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  static fromString(input: string, localization: FormatLocalization): DateTime {
    if (!localization?.format) {
      Namespace.errorMessages.customDateFormatError('No format was provided');
    }
    try {
      const dt = new DateTime();
      dt.setLocalization(localization);
      if (['x', 'X'].indexOf(localization.format) > -1)
        return new DateTime((localization.format === 'X' ? 1000 : 1) * +input);

      input = input.replace(/\s+/g, ' ');
      const parser = dt.makeParser(localization.format);
      const { year, month, day, hours, minutes, seconds, milliseconds, zone } =
        parser(input);
      const d = day || (!year && !month ? dt.getDate() : 1);
      const y = year || dt.getFullYear();
      let M = 0;
      if (!(year && !month)) {
        M = month > 0 ? month - 1 : dt.getMonth();
      }
      if (zone) {
        return new DateTime(
          Date.UTC(
            y,
            M,
            d,
            hours,
            minutes,
            seconds,
            milliseconds + zone.offset * 60 * 1000
          )
        );
      }
      return new DateTime(y, M, d, hours, minutes, seconds, milliseconds);
    } catch (e) {
      Namespace.errorMessages.customDateFormatError(
        `Unable to parse provided input: ${input}, format: ${localization.format}`
      );
    }
  }

  /**
   * Returns a string format.
   * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
   * for valid templates and locale objects
   * @param template An optional object. If provided, method will use Intl., otherwise the localizations format properties
   * @param locale Can be a string or an array of strings. Uses browser defaults otherwise.
   */
  format(
    template?: DateTimeFormatOptions | string,
    locale = this.localization.locale
  ): string {
    if (template && typeof template === 'object')
      return new Intl.DateTimeFormat(locale, template).format(this);

    const formatString = this.replaceTokens(
      //try template first
      template ||
        //otherwise try localization format
        this.localization.format ||
        //otherwise try date + time
        `${DefaultFormatLocalization.dateFormats.L}, ${DefaultFormatLocalization.dateFormats.LT}`,
      this.localization.dateFormats
    );

    const formatter = (template) =>
      new Intl.DateTimeFormat(this.localization.locale, template).format(this);

    if (!this.localization.hourCycle)
      this.localization.hourCycle = guessHourCycle(this.localization.locale);

    //if the format asks for a twenty-four-hour string but the hour cycle is not, then make a base guess
    const HHCycle = this.localization.hourCycle.startsWith('h1')
      ? 'h24'
      : this.localization.hourCycle;
    const hhCycle = this.localization.hourCycle.startsWith('h2')
      ? 'h12'
      : this.localization.hourCycle;

    const matches = {
      y: this.year,
      yy: formatter({ year: '2-digit' }),
      yyyy: this.year,
      M: formatter({ month: 'numeric' }),
      MM: this.monthFormatted,
      MMM: this.getAllMonths('short')[this.getMonth()],
      MMMM: this.getAllMonths()[this.getMonth()],
      d: this.date,
      dd: this.dateFormatted,
      ddd: formatter({ weekday: 'short' }),
      dddd: formatter({ weekday: 'long' }),
      H: this.getHours(),
      HH: this.getHoursFormatted(HHCycle),
      h: this.hours > 12 ? this.hours - 12 : this.hours,
      hh: this.getHoursFormatted(hhCycle),
      t: this.meridiem(),
      T: this.meridiem().toUpperCase(),
      m: this.minutes,
      mm: this.minutesFormatted,
      s: this.seconds,
      ss: this.secondsFormatted,
      fff: this.getMilliseconds(),
      // z: this.zoneInformation(dateTime, 'z'), //-4
      // zz: this.zoneInformation(dateTime, 'zz'), //-04
      // zzz: this.zoneInformation(dateTime, 'zzz') //-0400
    };

    return formatString
      .replace(this.dateTimeRegex, (match, $1) => {
        return $1 || matches[match];
      })
      .replace(/\[/g, '')
      .replace(/]/g, '');
  }

  //#endregion CDF stuff
}
