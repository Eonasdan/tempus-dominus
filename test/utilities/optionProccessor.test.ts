import {
  newDate,
  newDateMinute,
  secondaryDate,
  defaultLocalization,
} from '../test-utilities';
import { expect, test } from 'vitest';
import { processKey } from '../../src/js/utilities/optionProcessor';

test('defaultProcessor', () => {
  expect(
    processKey({
      key: 'foo',
      value: true,
      defaultType: 'boolean',
      providedType: 'boolean',
      path: '',
      localization: defaultLocalization(),
    })
  ).toBe(true);

  expect(
    processKey({
      key: 'foo',
      value: '42',
      defaultType: 'number',
      providedType: 'number',
      path: '',
      localization: defaultLocalization(),
    })
  ).toBe(42);

  expect(
    processKey({
      key: 'foo',
      value: 'tacos',
      defaultType: 'string',
      providedType: 'string',
      path: '',
      localization: defaultLocalization(),
    })
  ).toBe('tacos');

  expect(
    processKey({
      key: 'foo',
      value: '',
      defaultType: 'object',
      providedType: 'object',
      path: '',
      localization: defaultLocalization(),
    })
  ).toEqual({});

  const func = () => {};

  expect(
    processKey({
      key: 'foo',
      value: func,
      defaultType: 'function',
      providedType: 'function',
      path: '',
      localization: defaultLocalization(),
    })
  ).toBe(func);

  expect(() =>
    processKey({
      key: 'foo',
      value: '',
      defaultType: 'taco',
      providedType: 'taco',
      path: '',
      localization: defaultLocalization(),
    })
  ).toThrow();
});

test('mandatoryDate', () => {
  //invalid date should throw
  expect(() =>
    processKey({
      key: 'defaultDate',
      value: 42,
      defaultType: '',
      providedType: '',
      path: '',
      localization: defaultLocalization(),
    })
  ).toThrow();

  //valid date should return
  expect(
    processKey({
      key: 'defaultDate',
      value: newDateMinute().format(),
      defaultType: '',
      providedType: '',
      path: '',
      localization: defaultLocalization(),
    })
  ).toEqual(newDateMinute());
});

test('optionalDate', () => {
  //invalid date should throw
  expect(() =>
    processKey({
      key: 'minDate',
      value: 42,
      defaultType: '',
      providedType: '',
      path: '',
      localization: defaultLocalization(),
    })
  ).toThrow();

  //valid date should return
  expect(
    processKey({
      key: 'minDate',
      value: newDateMinute().format(),
      defaultType: '',
      providedType: '',
      path: '',
      localization: defaultLocalization(),
    })
  ).toEqual(newDateMinute());

  //valid date should return
  expect(
    processKey({
      key: 'minDate',
      value: undefined,
      defaultType: '',
      providedType: '',
      path: '',
      localization: defaultLocalization(),
    })
  ).toEqual(undefined);
});

test('validHourRange', () => {
  //invalid value should throw
  expect(() =>
    processKey({
      key: 'disabledHours',
      value: 42,
      defaultType: '',
      providedType: '',
      path: '',
      localization: defaultLocalization(),
    })
  ).toThrow();

  //valid should return
  expect(
    processKey({
      key: 'disabledHours',
      value: [6, 5],
      defaultType: '',
      providedType: '',
      path: '',
      localization: defaultLocalization(),
    })
  ).toEqual([6, 5]);

  //valid undefined should return empty
  expect(
    processKey({
      key: 'disabledHours',
      value: undefined,
      defaultType: '',
      providedType: '',
      path: '',
      localization: defaultLocalization(),
    })
  ).toEqual([]);

  //invalid range should throw
  expect(() =>
    processKey({
      key: 'disabledHours',
      value: [42],
      defaultType: '',
      providedType: '',
      path: '',
      localization: defaultLocalization(),
    })
  ).toThrow();
});

test('validDateArray', () => {
  //invalid value should throw
  expect(() =>
    processKey({
      key: 'disabledDates',
      value: 42,
      defaultType: '',
      providedType: '',
      path: '',
      localization: defaultLocalization(),
    })
  ).toThrow();

  //valid should return
  expect(
    processKey({
      key: 'disabledDates',
      value: [newDate()],
      defaultType: '',
      providedType: '',
      path: '',
      localization: defaultLocalization(),
    })
  ).toEqual([newDate()]);

  //valid undefined should return empty
  expect(
    processKey({
      key: 'disabledDates',
      value: undefined,
      defaultType: '',
      providedType: '',
      path: '',
      localization: defaultLocalization(),
    })
  ).toEqual([]);

  //invalid range should throw
  expect(() =>
    processKey({
      key: 'disabledDates',
      value: [42],
      defaultType: '',
      providedType: '',
      path: '',
      localization: defaultLocalization(),
    })
  ).toThrow();
});

test('numbersInRange', () => {
  //invalid value should throw
  expect(() =>
    processKey({
      key: 'daysOfWeekDisabled',
      value: 42,
      defaultType: '',
      providedType: '',
      path: '',
      localization: defaultLocalization(),
    })
  ).toThrow();

  //valid should return
  expect(
    processKey({
      key: 'daysOfWeekDisabled',
      value: [1],
      defaultType: '',
      providedType: '',
      path: '',
      localization: defaultLocalization(),
    })
  ).toEqual([1]);

  //valid undefined should return empty
  expect(
    processKey({
      key: 'daysOfWeekDisabled',
      value: undefined,
      defaultType: '',
      providedType: '',
      path: '',
      localization: defaultLocalization(),
    })
  ).toEqual([]);

  //invalid range should throw
  expect(() =>
    processKey({
      key: 'daysOfWeekDisabled',
      value: [42],
      defaultType: '',
      providedType: '',
      path: '',
      localization: defaultLocalization(),
    })
  ).toThrow();
});

test('disabledTimeIntervals', () => {
  //invalid value should throw
  expect(() =>
    processKey({
      key: 'disabledTimeIntervals',
      value: 42,
      defaultType: '',
      providedType: '',
      path: '',
      localization: defaultLocalization(),
    })
  ).toThrow();

  //valid should return
  expect(
    processKey({
      key: 'disabledTimeIntervals',
      value: [1],
      defaultType: '',
      providedType: '',
      path: '',
      localization: defaultLocalization(),
    })
  ).toEqual([1]);

  //valid undefined should return empty
  expect(
    processKey({
      key: 'disabledTimeIntervals',
      value: undefined,
      defaultType: '',
      providedType: '',
      path: '',
      localization: defaultLocalization(),
    })
  ).toEqual([]);

  //invalid range should throw
  expect(() =>
    processKey({
      key: 'disabledTimeIntervals',
      value: 'taco',
      defaultType: '',
      providedType: '',
      path: '',
      localization: defaultLocalization(),
    })
  ).toThrow();

  //valid undefined should return empty
  const range = [{ from: newDate(), to: secondaryDate() }];
  expect(
    processKey({
      key: 'disabledTimeIntervals',
      value: range,
      defaultType: '',
      providedType: '',
      path: '',
      localization: defaultLocalization(),
    })
  ).toEqual(range);
});

test('validKeyOption', () => {
  //invalid value should throw
  expect(() =>
    processKey({
      key: 'toolbarPlacement',
      value: 42,
      defaultType: '',
      providedType: '',
      path: '',
      localization: defaultLocalization(),
    })
  ).toThrow();

  //otherwise return
  expect(
    processKey({
      key: 'toolbarPlacement',
      value: 'top',
      defaultType: '',
      providedType: '',
      path: '',
      localization: defaultLocalization(),
    })
  ).toBe('top');
});

test('meta', () => {
  expect(
    processKey({
      key: 'meta',
      value: 'top',
      defaultType: '',
      providedType: '',
      path: '',
      localization: defaultLocalization(),
    })
  ).toBe('top');

  const o = { foo: 'bar' };
  expect(
    processKey({
      key: 'meta',
      value: o,
      defaultType: '',
      providedType: '',
      path: '',
      localization: defaultLocalization(),
    })
  ).toEqual(o);
});

test('dayViewHeaderFormat', () => {
  expect(
    processKey({
      key: 'dayViewHeaderFormat',
      value: 'top',
      defaultType: '',
      providedType: '',
      path: '',
      localization: defaultLocalization(),
    })
  ).toBe('top');

  const o = { foo: 'bar' };
  expect(
    processKey({
      key: 'dayViewHeaderFormat',
      value: o,
      defaultType: '',
      providedType: '',
      path: '',
      localization: defaultLocalization(),
    })
  ).toEqual(o);
});

test('container', () => {
  //not an html element
  expect(() =>
    processKey({
      key: 'container',
      value: 'top',
      defaultType: '',
      providedType: '',
      path: '',
      localization: defaultLocalization(),
    })
  ).toThrow();

  const element = document.createElement('div');
  expect(
    processKey({
      key: 'container',
      value: element,
      defaultType: '',
      providedType: '',
      path: '',
      localization: defaultLocalization(),
    })
  ).toEqual(element);
});

test('useTwentyfourHour', () => {
  //not an html element
  expect(() =>
    processKey({
      key: 'useTwentyfourHour',
      value: 'top',
      defaultType: '',
      providedType: '',
      path: '',
      localization: defaultLocalization(),
    })
  ).toThrow();

  expect(
    processKey({
      key: 'useTwentyfourHour',
      value: undefined,
      defaultType: '',
      providedType: 'boolean',
      path: '',
      localization: defaultLocalization(),
    })
  ).toEqual(undefined);
});
