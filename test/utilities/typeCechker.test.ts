import {
  newDate,
  newDateMinute,
  vanillaDate,
  secondaryDate,
  defaultLocalization,
} from '../test-utilities';
import { expect, test, vi } from 'vitest';
import {
  convertToDateTime,
  tryConvertToDateTime,
  typeCheckDateArray,
  typeCheckNumberArray,
} from '../../src/js/utilities/typeChecker';
import { DateTime } from '../../src/js/datetime';

test('tryConvertToDateTime', () => {
  const convertSpy = vi.spyOn(DateTime, 'convert');
  convertSpy.mockImplementation(() => newDate());

  const fromStringSpy = vi.spyOn(DateTime, 'fromString');
  fromStringSpy.mockImplementationOnce(() => newDateMinute());

  //null should return null
  expect(tryConvertToDateTime(null, null)).toBe(null);

  //a DateTime object should just return itself
  expect(tryConvertToDateTime(newDate(), null)).toEqual(newDate());

  //a Data object should get converted
  expect(tryConvertToDateTime(vanillaDate(), null)).toEqual(newDate());
  expect(convertSpy).toHaveBeenCalled();

  //converting from string
  expect(
    tryConvertToDateTime('03/14/2023 1:25 PM', defaultLocalization())
  ).toEqual(newDateMinute());
  expect(fromStringSpy).toHaveBeenCalled();

  // converting from an invalid string will produce an invalid date
  fromStringSpy.mockImplementationOnce((a) => new DateTime(a));
  expect(
    tryConvertToDateTime('13/70/2023 1:25 PM', defaultLocalization())
  ).toBe(null);
  expect(fromStringSpy).toHaveBeenCalled();

  // an invalid type should return null
  // @ts-ignore
  expect(tryConvertToDateTime(42, null)).toBe(null);
});

test('convertToDateTime', () => {
  //can't convert empty string
  expect(() => convertToDateTime('', 'maxDate', null)).toThrow();

  //js date should convert
  expect(convertToDateTime(vanillaDate(), null, null)).toEqual(newDate());
});

test('typeCheckDateArray', () => {
  //wrong data type
  expect(() => typeCheckDateArray('disabledDates', 42, '', null)).toThrow();

  //check each excepted type for conversion
  const dateArray = [newDate(), vanillaDate(), secondaryDate().format()];

  typeCheckDateArray('disabledDates', dateArray, null);

  expect(dateArray[0]).toEqual(newDate());
  expect(dateArray[1]).toEqual(vanillaDate());
  expect(dateArray[2]).toEqual(secondaryDate());

  //invalid type should throw
  expect(() => typeCheckDateArray('', [42], null)).toThrow();
});

test('typeCheckNumberArray', () => {
  //invalid type should throw
  expect(() => typeCheckNumberArray('disabledHours', null, null)).toThrow();

  //array of numbers is expected
  expect(() => typeCheckNumberArray('', [42], '')).not.toThrow();
});
