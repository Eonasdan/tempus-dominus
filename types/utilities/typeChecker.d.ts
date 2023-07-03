import { DateTime } from '../datetime';
import { FormatLocalization } from './options';
/**
 * Attempts to prove `d` is a DateTime or Date or can be converted into one.
 * @param d If a string will attempt creating a date from it.
 * @param localization object containing locale and format settings. Only used with the custom formats
 * @private
 */
export declare function tryConvertToDateTime(
  this: void,
  d: DateTime | Date | string,
  localization: FormatLocalization
): DateTime | null;
/**
 * Attempts to convert `d` to a DateTime object
 * @param d value to convert
 * @param optionName Provides text to error messages e.g. disabledDates
 * @param localization object containing locale and format settings. Only used with the custom formats
 */
export declare function convertToDateTime(
  this: void,
  d: DateTime | Date | string,
  optionName: string,
  localization: FormatLocalization
): DateTime;
/**
 * Type checks that `value` is an array of Date or DateTime
 * @param optionName Provides text to error messages e.g. disabledDates
 * @param value Option value
 * @param providedType Used to provide text to error messages
 * @param localization
 */
export declare function typeCheckDateArray(
  this: void,
  optionName: string,
  value: any, //eslint-disable-line @typescript-eslint/no-explicit-any
  providedType: string,
  localization?: FormatLocalization
): void;
/**
 * Type checks that `value` is an array of numbers
 * @param optionName Provides text to error messages e.g. disabledDates
 * @param value Option value
 * @param providedType Used to provide text to error messages
 */
export declare function typeCheckNumberArray(
  this: void,
  optionName: string,
  value: any, //eslint-disable-line @typescript-eslint/no-explicit-any
  providedType: string
): void;
