import Namespace from './namespace';
import { DateTime } from '../datetime';
import { FormatLocalization } from './options';
import DefaultFormatLocalization from './default-format-localization';

/**
 * Attempts to prove `d` is a DateTime or Date or can be converted into one.
 * @param d If a string will attempt creating a date from it.
 * @param localization object containing locale and format settings. Only used with the custom formats
 * @private
 */
export function tryConvertToDateTime(
  this: void,
  d: DateTime | Date | string,
  localization: FormatLocalization
): DateTime | null {
  if (!d) return null;
  if (d.constructor.name === DateTime.name) return d as DateTime;
  if (d.constructor.name === Date.name) {
    return DateTime.convert(d as Date);
  }
  if (typeof d === typeof '') {
    const dateTime = DateTime.fromString(d as unknown as string, localization);
    if (JSON.stringify(dateTime) === 'null') {
      return null;
    }
    return dateTime;
  }
  return null;
}

/**
 * Attempts to convert `d` to a DateTime object
 * @param d value to convert
 * @param optionName Provides text to error messages e.g. disabledDates
 * @param localization object containing locale and format settings. Only used with the custom formats
 */
export function convertToDateTime(
  this: void,
  d: DateTime | Date | string,
  optionName: string,
  localization: FormatLocalization
): DateTime {
  if (typeof d === typeof '' && optionName !== 'input') {
    Namespace.errorMessages.dateString();
  }

  const converted = tryConvertToDateTime(d, localization);

  if (!converted) {
    Namespace.errorMessages.failedToParseDate(
      optionName,
      d,
      optionName === 'input'
    );
  }
  return converted;
}

/**
 * Type checks that `value` is an array of Date or DateTime
 * @param optionName Provides text to error messages e.g. disabledDates
 * @param value Option value
 * @param providedType Used to provide text to error messages
 * @param localization
 */
export function typeCheckDateArray(
  this: void,
  optionName: string,
  value: any, //eslint-disable-line @typescript-eslint/no-explicit-any
  providedType: string,
  localization: FormatLocalization = DefaultFormatLocalization
) {
  if (!Array.isArray(value)) {
    Namespace.errorMessages.typeMismatch(
      optionName,
      providedType,
      'array of DateTime or Date'
    );
  }
  for (let i = 0; i < value.length; i++) {
    const d = value[i];
    const dateTime = convertToDateTime(d, optionName, localization);
    dateTime.setLocalization(localization);
    value[i] = dateTime;
  }
}

/**
 * Type checks that `value` is an array of numbers
 * @param optionName Provides text to error messages e.g. disabledDates
 * @param value Option value
 * @param providedType Used to provide text to error messages
 */
export function typeCheckNumberArray(
  this: void,
  optionName: string,
  value: any, //eslint-disable-line @typescript-eslint/no-explicit-any
  providedType: string
) {
  if (!Array.isArray(value) || value.some((x) => typeof x !== typeof 0)) {
    Namespace.errorMessages.typeMismatch(
      optionName,
      providedType,
      'array of numbers'
    );
  }
}
