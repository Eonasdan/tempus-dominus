import { expect, test } from 'vitest';
import { DateTime, getFormatByUnit, Unit } from '../src/js/datetime';

test('getFormatByUnit', () => {
  expect(getFormatByUnit(Unit.date)).toEqual({ dateStyle: 'short' });
  expect(getFormatByUnit(Unit.month)).toEqual({
    month: 'numeric',
    year: 'numeric'
  });
  expect(getFormatByUnit(Unit.year)).toEqual({ year: 'numeric' });
});

test('Can create with string (ctor)', () => {
  const dt = new DateTime('12/31/2022');
  expect(dt.month).toBe(12 - 1); //minus 1 because javascript 🙄
  expect(dt.date).toBe(31);
  expect(dt.year).toBe(2022);
});

test('Locale is stored', () => {
  const dt = new DateTime();
  expect(dt.locale).toBe('default');
  dt.setLocale('en-US');
  expect(dt.locale).toBe('en-US');
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
  //Presently, this is just a function for the custom date format plugin to overwrite
  const dt = DateTime.fromString('12/31/2022', null);
  expect(dt.month).toBe(12 - 1); //minus 1 because javascript 🙄
  expect(dt.date).toBe(31);
  expect(dt.year).toBe(2022);
});

test('Can create clone', () => {
  const dt = new DateTime(2022, 11, 14);
  const d = dt.clone;

  expect(dt.valueOf()).toBe(d.valueOf());
});
new Date()
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
  expect(() => dt.startOf('foo')).toThrow(`Unit 'foo' is not valid`);

  //check if skip the process of the start of the week is the same weekday
  dt = new DateTime(2022, 11, 25, 0, 0, 0);
  dt = dt.startOf('weekDay');
  expect(dt.valueOf()).toBe(new Date(2022, 11, 25, 0, 0, 0).valueOf());

  //check if weekday works if the week doesn't start on Sunday
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
  expect(() => dt.endOf('foo')).toThrow(`Unit 'foo' is not valid`);

  //check if skip the process of the end of the week is the same weekday
  dt = new DateTime(2022, 11, 17, 0, 0, 0);
  dt = dt.endOf('weekDay');
  expect(dt.valueOf()).toBe(new Date(2022, 11, 17, 23, 59, 59, 999).valueOf());

  //check if weekday works if the week doesn't start on Sunday
  dt = new DateTime(2022, 11, 14, 0, 0, 0);
  dt = dt.endOf('weekDay', 1);
  expect(dt.valueOf()).toBe(new Date(2022, 11, 18, 23, 59, 59, 999).valueOf());
});

test('manipulate throws an error with invalid part', () => {
  // @ts-ignore
  expect(() => new DateTime().manipulate(1, 'foo')).toThrow(`Unit 'foo' is not valid`);
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
  expect(() => dt1.isBefore(dt2, 'foo')).toThrow(`Unit 'foo' is not valid`);
});

test('isAfter', () => {
  const dt1 = new DateTime(2022, 11, 16, 0, 0, 0);
  const dt2 = new DateTime(2022, 11, 17, 0, 0, 0);

  expect(dt2.isAfter(dt1)).toBe(true);

  expect(dt2.isAfter(dt1, Unit.date)).toBe(true);

  // @ts-ignore
  expect(() => dt2.isAfter(dt1, 'foo')).toThrow(`Unit 'foo' is not valid`);
});

test('isSame', () => {
  const dt1 = new DateTime(2022, 11, 16, 0, 0, 0);
  const dt2 = new DateTime(2022, 11, 16, 0, 0, 0);

  expect(dt1.isSame(dt2)).toBe(true);

  expect(dt1.isSame(dt2, Unit.date)).toBe(true);

  // @ts-ignore
  expect(() => dt1.isSame(dt2, 'foo')).toThrow(`Unit 'foo' is not valid`);
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
  expect(() => dt1.isBetween(left, right, 'foo')).toThrow(`Unit 'foo' is not valid`);

  const dateTime = new DateTime('2016-10-30');

  expect(dateTime.isBetween(dateTime, new DateTime('2016-12-30'), undefined, '()')).toBe(false);
  expect(dateTime.isBetween(dateTime, dateTime, undefined, '[]')).toBe(true);
  expect(dateTime.isBetween(new DateTime('2016-01-01'), dateTime, undefined, '(]')).toBe(true);
  expect(dateTime.isBetween(dateTime, new DateTime('2016-12-30'), undefined, '[)')).toBe(true);
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
  expect(dt.hoursFormatted).toBe('04');

  dt.hours = 14;

  expect(dt.hours).toBe(14);
  expect(dt.hoursFormatted).toBe('14');
  expect(dt.twelveHoursFormatted).toBe('02');

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

  expect(dt.weeksInWeekYear(dt.year)).toBe(52);

  dt.year = 2024
  expect(dt.isLeapYear).toBe(true);

  dt.year = 2026;
  expect(dt.weeksInWeekYear(dt.year)).toBe(53);

  expect(dt.meridiem()).toBe('PM');
});
