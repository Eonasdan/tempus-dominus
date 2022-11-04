import { expect, test } from 'vitest';
import { DateTime, Unit } from '../src/js/datetime';

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
  const d = new Date('12/31/2022');
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
  const dt = new DateTime('12/31/2022');
  const d = dt.clone;

  expect(dt.valueOf()).toBe(d.valueOf());
});

test('startOf', () => {
  let dt = new DateTime('12/31/2022 13:42:59:500');

  //12/31/2022 13:42:59:0
  dt = dt.startOf(Unit.seconds);
  expect(dt.getMilliseconds()).toBe(0);

  //12/31/2022 13:42:00
  dt = dt.startOf(Unit.minutes);
  expect(dt.valueOf()).toBe(1672512120000);

  //12/31/2022 13:00:00
  dt = dt.startOf(Unit.hours);
  expect(dt.valueOf()).toBe(1672509600000);

  //12/31/2022 00:00:00
  dt = dt.startOf(Unit.date);
  expect(dt.valueOf()).toBe(1672462800000);

  //12/25/2022 00:00:00
  dt = dt.startOf('weekDay');
  expect(dt.valueOf()).toBe(1671944400000);

  //12/1/2022 00:00:00
  dt = dt.startOf(Unit.month);
  expect(dt.valueOf()).toBe(1669870800000);

  //1/1/2022 00:00:00
  dt = dt.startOf(Unit.year);
  expect(dt.valueOf()).toBe(1641013200000);

  // @ts-ignore
  expect(() => dt.startOf('foo')).toThrow(`Unit 'foo' is not valid`);
});
