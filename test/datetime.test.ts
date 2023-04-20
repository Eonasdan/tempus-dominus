/* eslint-disable  @typescript-eslint/ban-ts-comment */
import {
  defaultLocalization,
  newDate,
  newDateStringMinute,
} from './test-utilities';
import { expect, test } from 'vitest';
import {
  DateTime,
  getFormatByUnit,
  guessHourCycle,
  Unit,
} from '../src/js/datetime';

test('getFormatByUnit', () => {
  expect(getFormatByUnit(Unit.date)).toEqual({ dateStyle: 'short' });
  expect(getFormatByUnit(Unit.month)).toEqual({
    month: 'numeric',
    year: 'numeric',
  });
  expect(getFormatByUnit(Unit.year)).toEqual({ year: 'numeric' });
});

test('Can create with string (ctor)', () => {
  const dt = newDate();
  expect(dt.month).toBe(2); //minus 1 because javascript 🙄
  expect(dt.date).toBe(14);
  expect(dt.year).toBe(2023);
});

test('Localization is stored', () => {
  const dt = newDate();
  expect(dt.localization).toEqual(defaultLocalization());
  const es = {
    locale: 'es',
    dateFormats: {
      LT: 'H:mm',
      LTS: 'H:mm:ss',
      L: 'dd/MM/yyyy',
      LL: 'd [de] MMMM [de] yyyy',
      LLL: 'd [de] MMMM [de] yyyy H:mm',
      LLLL: 'dddd, d [de] MMMM [de] yyyy H:mm',
    },
    ordinal: (n) => `${n}º`,
    format: 'L LT',
  };
  dt.setLocalization(es);
  expect(dt.localization).toEqual(es);

  //check setting just the locale
  dt.localization = null;

  const fr = defaultLocalization();
  fr.locale = 'fr';
  dt.setLocale('fr');
  expect(dt.localization).toEqual(fr);
});

test('Can convert from a Date object', () => {
  const d = new Date(2022, 11, 14);
  const dt = DateTime.convert(d);

  expect(dt.valueOf()).toBe(d.valueOf());
});

test('Convert fails with no parameter', () => {
  expect(() => DateTime.convert(null)).toThrow('A date is required');
});

test('Can create with string', () => {
  expect(() => DateTime.fromString('12/31/2022', null)).toThrow(/TD/);
  const localization = defaultLocalization();
  localization.format = localization.dateFormats.L;
  const dt = DateTime.fromString('12/31/2022', localization);
  expect(dt.month).toBe(12 - 1); //minus 1 because javascript 🙄
  expect(dt.date).toBe(31);
  expect(dt.year).toBe(2022);
});

test('Can create clone', () => {
  const dt = new DateTime(2022, 11, 14);
  const d = dt.clone;

  expect(dt.valueOf()).toBe(d.valueOf());
});
new Date();
test('startOf', () => {
  let dt = new DateTime(2022, 11, 14, 13, 42, 59, 500);

  //12/31/2022 13:42:59:0
  dt = dt.startOf(Unit.seconds);
  expect(dt.getMilliseconds()).toBe(0);

  dt = dt.startOf(Unit.minutes);
  expect(dt.valueOf()).toBe(new Date(2022, 11, 14, 13, 42, 0).valueOf());

  dt = dt.startOf(Unit.hours);
  expect(dt.valueOf()).toBe(new Date(2022, 11, 14, 13, 0, 0).valueOf());

  dt = dt.startOf(Unit.date);
  expect(dt.valueOf()).toBe(new Date(2022, 11, 14, 0, 0, 0).valueOf());

  dt = dt.startOf('weekDay');
  expect(dt.valueOf()).toBe(new Date(2022, 11, 11, 0, 0, 0).valueOf());

  dt = dt.startOf(Unit.month);
  expect(dt.valueOf()).toBe(new Date(2022, 11, 1, 0, 0, 0).valueOf());

  dt = dt.startOf(Unit.year);
  expect(dt.valueOf()).toBe(new DateTime(2022, 0, 1, 0, 0, 0).valueOf());

  // @ts-ignore
  expect(() => dt.startOf('foo')).toThrow("Unit 'foo' is not valid");

  //skip the process of the start of the week is the same weekday
  dt = new DateTime(2022, 11, 25, 0, 0, 0);
  dt = dt.startOf('weekDay');
  expect(dt.valueOf()).toBe(new Date(2022, 11, 25, 0, 0, 0).valueOf());

  //check if weekday works when the week doesn't start on Sunday
  dt = new DateTime(2022, 11, 18, 0, 0, 0);
  dt = dt.startOf('weekDay', 1);
  expect(dt.valueOf()).toBe(new Date(2022, 11, 12, 0, 0, 0).valueOf());
});

test('endOf', () => {
  let dt = new DateTime(2022, 11, 14, 13, 42, 59, 50);

  //12/31/2022 13:42:59:0
  dt = dt.endOf(Unit.seconds);
  expect(dt.getMilliseconds()).toBe(999);

  dt = dt.endOf(Unit.minutes);
  expect(dt.valueOf()).toBe(new Date(2022, 11, 14, 13, 42, 59, 999).valueOf());

  dt = dt.endOf(Unit.hours);
  expect(dt.valueOf()).toBe(new Date(2022, 11, 14, 13, 59, 59, 999).valueOf());

  dt = dt.endOf(Unit.date);
  expect(dt.valueOf()).toBe(new Date(2022, 11, 14, 23, 59, 59, 999).valueOf());

  dt = dt.endOf('weekDay');
  expect(dt.valueOf()).toBe(new Date(2022, 11, 17, 23, 59, 59, 999).valueOf());

  dt = dt.endOf(Unit.month);
  expect(dt.valueOf()).toBe(new Date(2022, 11, 31, 23, 59, 59, 999).valueOf());

  dt = dt.endOf(Unit.year);
  expect(dt.valueOf()).toBe(new Date(2022, 11, 31, 23, 59, 59, 999).valueOf());

  // @ts-ignore
  expect(() => dt.endOf('foo')).toThrow("Unit 'foo' is not valid");

  //skip the process if the end of the week is the same weekday
  dt = new DateTime(2022, 11, 17, 0, 0, 0);
  dt = dt.endOf('weekDay');
  expect(dt.valueOf()).toBe(new Date(2022, 11, 17, 23, 59, 59, 999).valueOf());

  //check if weekday works when the week doesn't start on Sunday
  dt = new DateTime(2022, 11, 14, 0, 0, 0);
  dt = dt.endOf('weekDay', 1);
  expect(dt.valueOf()).toBe(new Date(2022, 11, 18, 23, 59, 59, 999).valueOf());
});

test('manipulate throws an error with invalid part', () => {
  // @ts-ignore
  expect(() => newDate().manipulate(1, 'foo')).toThrow(
    "Unit 'foo' is not valid"
  );
});

test('Format should return formatted date', () => {
  const dt = new DateTime(2022, 11, 17, 0, 0, 0);

  expect(dt.format({ dateStyle: 'full' })).toBe('Saturday, December 17, 2022');
});

test('isBefore', () => {
  const dt1 = new DateTime(2022, 11, 16, 0, 0, 0);
  const dt2 = new DateTime(2022, 11, 17, 0, 0, 0);

  expect(dt1.isBefore(dt2)).toBe(true);

  expect(dt1.isBefore(dt2, Unit.date)).toBe(true);

  // @ts-ignore
  expect(() => dt1.isBefore(dt2, 'foo')).toThrow("Unit 'foo' is not valid");

  //compare date is not valid
  expect(dt1.isBefore(undefined, Unit.date)).toBe(false);
});

test('isAfter', () => {
  const dt1 = new DateTime(2022, 11, 16, 0, 0, 0);
  const dt2 = new DateTime(2022, 11, 17, 0, 0, 0);

  expect(dt2.isAfter(dt1)).toBe(true);

  expect(dt2.isAfter(dt1, Unit.date)).toBe(true);

  // @ts-ignore
  expect(() => dt2.isAfter(dt1, 'foo')).toThrow("Unit 'foo' is not valid");

  //compare date is not valid
  expect(dt1.isAfter(undefined, Unit.date)).toBe(false);
});

test('isSame', () => {
  const dt1 = new DateTime(2022, 11, 16, 0, 0, 0);
  const dt2 = new DateTime(2022, 11, 16, 0, 0, 0);

  expect(dt1.isSame(dt2)).toBe(true);

  expect(dt1.isSame(dt2, Unit.date)).toBe(true);

  //if the compare date is invalid
  expect(dt1.isSame(undefined, Unit.date)).toBe(false);

  // @ts-ignore
  expect(() => dt1.isSame(dt2, 'foo')).toThrow("Unit 'foo' is not valid");
});

//todo this is missing some conditions: https://github.com/moment/moment/blob/master/src/test/moment/is_between.js
//but it hurts my brain
test('isBetween', () => {
  const dt1 = new DateTime(2022, 11, 16, 0, 0, 0);
  const left = new DateTime(2022, 11, 15, 0, 0, 0);
  const right = new DateTime(2022, 11, 17, 0, 0, 0);

  expect(dt1.isBetween(left, right)).toBe(true);

  expect(dt1.isBetween(left, right, Unit.date)).toBe(true);

  // @ts-ignore
  expect(() => dt1.isBetween(left, right, 'foo')).toThrow(
    "Unit 'foo' is not valid"
  );

  const dateTime = new DateTime('2016-10-30');

  expect(
    dateTime.isBetween(dateTime, new DateTime('2016-12-30'), undefined, '()')
  ).toBe(false);
  expect(dateTime.isBetween(dateTime, dateTime, undefined, '[]')).toBe(true);
  expect(
    dateTime.isBetween(new DateTime('2016-01-01'), dateTime, undefined, '(]')
  ).toBe(true);
  expect(
    dateTime.isBetween(dateTime, new DateTime('2016-12-30'), undefined, '[)')
  ).toBe(true);

  //compare date is not valid
  expect(dt1.isBetween(undefined, undefined, Unit.date)).toBe(false);

  //Unit is not valid
  // @ts-ignore
  expect(() => dt1.isBetween(dateTime, newDate(), 'foo')).toThrow(
    "Unit 'foo' is not valid"
  );
});

test('Getters/Setters', () => {
  const dt = new DateTime(2022, 11, 17, 0, 0, 0);

  dt.seconds = 4;

  expect(dt.seconds).toBe(4);
  expect(dt.secondsFormatted).toBe('04');

  dt.minutes = 4;

  expect(dt.minutes).toBe(4);
  expect(dt.minutesFormatted).toBe('04');

  dt.hours = 4;

  expect(dt.hours).toBe(4);
  expect(dt.getHoursFormatted()).toBe('04');

  dt.hours = 14;

  expect(dt.hours).toBe(14);
  expect(dt.getHoursFormatted('h24')).toBe('14');
  expect(dt.getHoursFormatted()).toBe('02');

  dt.hours = 0;
  expect(dt.getHoursFormatted('h11')).toBe('00');
  expect(dt.getHoursFormatted('h12')).toBe('12');
  expect(dt.getHoursFormatted('h23')).toBe('00');
  expect(dt.getHoursFormatted('h24')).toBe('24');

  dt.hours = 23;
  expect(dt.getHoursFormatted('h11')).toBe('11');
  expect(dt.getHoursFormatted('h12')).toBe('11');
  expect(dt.getHoursFormatted('h23')).toBe('23');
  expect(dt.getHoursFormatted('h24')).toBe('23');

  dt.date = 4;

  expect(dt.date).toBe(4);
  expect(dt.dateFormatted).toBe('04');

  dt.month = 4;

  expect(dt.month).toBe(4);
  expect(dt.monthFormatted).toBe('05');

  //test date bubbling. JS doesn't handle a date of May 31st => June 31st but DateTime does.
  dt.date = 31;
  dt.month = 5;
  expect(dt.monthFormatted).toBe('06');

  dt.year = 2023;

  expect(dt.year).toBe(2023);

  expect(dt.week).toBe(26);

  dt.year = 2004;

  expect(dt.weeksInWeekYear()).toBe(53);

  dt.year = 2017;

  expect(dt.weeksInWeekYear()).toBe(52);

  dt.year = 2020;

  expect(dt.weeksInWeekYear()).toBe(53);

  dt.year = 2000;
  expect(dt.isLeapYear).toBe(true);
  expect(dt.week).toBe(26);

  dt.year = 2024;
  expect(dt.isLeapYear).toBe(true);

  dt.year = 2023;
  expect(dt.isLeapYear).toBe(false);

  dt.year = 2026;
  expect(dt.weeksInWeekYear()).toBe(53);

  expect(dt.meridiem()).toBe('PM');
});

test('Guess hour cycle', () => {
  // @ts-ignore
  let guess = guessHourCycle();
  expect(guess).toBe('h12');

  guess = guessHourCycle('en-US');
  expect(guess).toBe('h12');

  guess = guessHourCycle('en-GB');
  expect(guess).toBe('h23');

  guess = guessHourCycle('ar-IQ');
  expect(guess).toBe('h12');

  guess = guessHourCycle('sv-SE');
  expect(guess).toBe('h23');
});

test('Get ALl Months', () => {
  // @ts-ignore
  const months = newDate().getAllMonths();
  expect(months).toEqual([
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]);
});

test('replace tokens', () => {
  const dateTime = newDate();

  // @ts-ignore
  const replaceTokens = dateTime.replaceTokens;

  expect(replaceTokens('hi LTS', 'LTS')).toBe(
    `hi ${defaultLocalization().dateFormats.LTS}`
  );

  expect(replaceTokens('LLLLL', defaultLocalization().dateFormats)).toBe(
    `dddd, MMMM d, yyyy h:mm TMM/dd/yyyy`
  );
});

test('parseTwoDigitYear', () => {
  const dateTime = newDate();
  // @ts-ignore
  let parsed = dateTime.parseTwoDigitYear(70);

  expect(parsed).toBe(1970);

  // @ts-ignore
  parsed = dateTime.parseTwoDigitYear(23);

  expect(parsed).toBe(2023);
});

test('meridiemMatch', () => {
  const dateTime = newDate();
  // @ts-ignore
  let match = dateTime.meridiemMatch('AM');

  expect(match).toBe(false);

  // @ts-ignore
  match = dateTime.meridiemMatch('PM');

  expect(match).toBe(true);
});

test('expressions', () => {
  const dateTime = newDate();
  // @ts-ignore
  const e = { ...dateTime.expressions };
  // @ts-ignore
  const matchWord = dateTime.matchWord;
  // @ts-ignore
  const match2 = dateTime.match2;
  // @ts-ignore
  const match3 = dateTime.match3;
  // @ts-ignore
  const match4 = dateTime.match4;
  // @ts-ignore
  const match1to2 = dateTime.match1to2;
  // @ts-ignore
  const matchSigned = dateTime.matchSigned;

  const o: any = {};

  //#region meridiem
  expect(e.t[0]).toBe(matchWord);

  (e.t[1] as any)(o, 'AM');

  expect(o.afternoon).toBe(false);

  (e.t[1] as any)(o, 'pm');

  expect(o.afternoon).toBe(true);

  (e.T[1] as any)(o, 'AM');

  expect(o.afternoon).toBe(false);

  (e.T[1] as any)(o, 'pm');

  expect(o.afternoon).toBe(true);

  //#endregion

  expect(e.fff[0]).toBe(match3);

  (e.fff[1] as any)(o, 42);

  expect(o.milliseconds).toBe(42);

  expect(e.s[0]).toBe(match1to2);

  (e.s[1] as any)(o, 5);

  expect(o.seconds).toBe(5);

  expect(e.ss[0]).toBe(match1to2);

  (e.ss[1] as any)(o, 6);

  expect(o.seconds).toBe(6);

  expect(e.m[0]).toBe(match1to2);

  (e.m[1] as any)(o, 7);

  expect(o.minutes).toBe(7);

  expect(e.mm[0]).toBe(match1to2);

  (e.mm[1] as any)(o, 10);

  expect(o.minutes).toBe(10);

  expect(e.h[0]).toBe(match1to2);

  (e.h[1] as any)(o, 11);

  expect(o.hours).toBe(11);

  expect(e.hh[0]).toBe(match1to2);

  (e.hh[1] as any)(o, 12);

  expect(o.hours).toBe(12);

  expect(e.HH[0]).toBe(match1to2);

  (e.HH[1] as any)(o, 13);

  expect(o.hours).toBe(13);

  expect(e.HH[0]).toBe(match1to2);

  (e.HH[1] as any)(o, 14);

  expect(o.hours).toBe(14);

  expect(e.d[0]).toBe(match1to2);

  (e.d[1] as any)(o, 15);

  expect(o.day).toBe(15);

  expect(e.dd[0]).toBe(match2);

  (e.dd[1] as any)(o, 16);

  expect(o.day).toBe(16);

  expect(e.Do[0]).toBe(matchWord);

  (e.Do[1] as any)(o, '1st');

  expect(o.day).toBe(1);

  dateTime.localization.ordinal = undefined;

  (e.Do[1] as any)(o, '1st');

  expect(o.day).toBe('1');

  dateTime.localization.ordinal = defaultLocalization().ordinal;

  //#region Months

  expect(e.M[0]).toBe(match1to2);

  (e.M[1] as any)(o, 5);

  expect(o.month).toBe(5);

  expect(e.MM[0]).toBe(match2);

  (e.MM[1] as any)(o, 7);

  expect(o.month).toBe(7);

  expect(e.MMM[0]).toBe(matchWord);

  (e.MMM[1] as any)(o, 'Jan');

  expect(o.month).toBe(1);

  expect(e.MMMM[0]).toBe(matchWord);

  (e.MMMM[1] as any)(o, 'January');

  expect(o.month).toBe(1);

  //#endregion

  //#region Year

  expect(e.y[0]).toBe(matchSigned);

  (e.y[1] as any)(o, 2000);

  expect(o.year).toBe(2000);

  expect(e.yy[0]).toBe(match2);

  (e.yy[1] as any)(o, 20);

  expect(o.year).toBe(2020);

  expect(e.yyyy[0]).toBe(match4);

  (e.yyyy[1] as any)(o, 2023);

  expect(o.year).toBe(2023);

  //#endregion
});

test('correctHours', () => {
  const dateTime = newDate();

  // @ts-ignore
  const correctHours = dateTime.correctHours;

  const o = {
    afternoon: true,
    hours: 8,
  };

  correctHours(o);

  expect(o.hours).toBe(20);
  expect(o.afternoon).toBe(undefined);

  o.hours = 12;
  o.afternoon = false;

  correctHours(o);

  expect(o.hours).toBe(0);
  expect(o.afternoon).toBe(undefined);
});

test('format', () => {
  const dateTime = newDate();

  dateTime.localization.hourCycle = 'h11';

  expect(dateTime.format()).toBe(newDateStringMinute);

  expect(dateTime.format('L LT')).toBe(newDateStringMinute);

  dateTime.hours = 10;

  expect(dateTime.format('dddd, MMMM, dd yy h:mm:ss:fff')).toBe(
    'Tuesday, March, 14 23 10:25:42:500'
  );

  expect(dateTime.format('dd-MMM-yyyy')).toBe('14-Mar-2023');

  //test failure if no format
  expect(() => DateTime.fromString('', undefined)).toThrow(
    'TD: Custom Date Format: No format was provided'
  );

  expect(DateTime.fromString('01-Mar-2023', { format: 'dd-MMM-yyyy' })).toEqual(
    new DateTime(2023, 3 - 1, 1, 0, 0, 0, 0)
  );

  //test epoch seconds
  expect(DateTime.fromString('1678814742', { format: 'X' }).getTime()).toBe(
    1678814742000
  );

  //test epoch millisecond
  expect(DateTime.fromString('1678814742500', { format: 'x' }).getTime()).toBe(
    1678814742500
  );

  //test invalid input
  expect(() => DateTime.fromString('--', { format: 'hjik' })).toThrow(
    'TD: Custom Date Format: Unable to parse provided input: --, format: hjik'
  );

  //test no format for defaults
  const dt2 = newDate();
  dt2.localization.format = undefined;
  dt2.localization.hourCycle = undefined;
  expect(dt2.format()).toBe('03/14/2023, 1:25 PM');

  //test hour cycles
  const dt3 = newDate();
  dt3.localization.hourCycle = 'h23';
  expect(dt3.format('HH')).toBe('13');
  dt3.localization.hourCycle = 'h11';
  expect(dt3.format('hh')).toBe('01');
});

test('isValid', () => {
  expect(DateTime.isValid('asdf')).toBe(false);
  expect(DateTime.isValid(undefined)).toBe(false);
  expect(DateTime.isValid(newDate())).toBe(true);
});
