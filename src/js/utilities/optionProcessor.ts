import Namespace from './namespace';
import type { FormatLocalization } from './options';
import {
  convertToDateTime,
  typeCheckNumberArray,
  typeCheckDateArray,
} from './typeChecker';

interface OptionProcessorFunctionArguments {
  key: string;
  value: any; //eslint-disable-line @typescript-eslint/no-explicit-any
  providedType: string;
  defaultType: string;
  path: string;
  localization: FormatLocalization;
}

type OptionProcessorFunction = (
  this: void,
  args: OptionProcessorFunctionArguments
) => any; //eslint-disable-line @typescript-eslint/no-explicit-any

function mandatoryDate(key: string): OptionProcessorFunction {
  return ({ value, providedType, localization }) => {
    const dateTime = convertToDateTime(value, key, localization);
    if (dateTime !== undefined) {
      dateTime.setLocalization(localization);
      return dateTime;
    }
  };
}

function optionalDate(key: string): OptionProcessorFunction {
  const mandatory = mandatoryDate(key);
  return (args) => {
    if (args.value === undefined) {
      return args.value;
    }
    return mandatory(args);
  };
}

function numbersInRange(
  key: string,
  lower: number,
  upper: number
): OptionProcessorFunction {
  return ({ value, providedType }) => {
    if (value === undefined) {
      return [];
    }
    typeCheckNumberArray(key, value, providedType);
    if ((value as number[]).some((x) => x < lower || x > upper))
      Namespace.errorMessages.numbersOutOfRange(key, lower, upper);
    return value;
  };
}

function validHourRange(key: string): OptionProcessorFunction {
  return numbersInRange(key, 0, 23);
}

function validDateArray(key: string): OptionProcessorFunction {
  return ({ value, providedType, localization }) => {
    if (value === undefined) {
      return [];
    }
    typeCheckDateArray(key, value, providedType, localization);
    return value;
  };
}

function validKeyOption(keyOptions: string[]): OptionProcessorFunction {
  return ({ value, path }) => {
    if (!keyOptions.includes(value))
      Namespace.errorMessages.unexpectedOptionValue(
        path.substring(1),
        value,
        keyOptions
      );
    return value;
  };
}

const optionProcessors: { [key: string]: OptionProcessorFunction } =
  Object.freeze({
    defaultDate: mandatoryDate('defaultDate'),
    viewDate: mandatoryDate('viewDate'),
    minDate: optionalDate('restrictions.minDate'),
    maxDate: optionalDate('restrictions.maxDate'),
    disabledHours: validHourRange('restrictions.disabledHours'),
    enabledHours: validHourRange('restrictions.enabledHours'),
    disabledDates: validDateArray('restrictions.disabledDates'),
    enabledDates: validDateArray('restrictions.enabledDates'),
    daysOfWeekDisabled: numbersInRange('restrictions.daysOfWeekDisabled', 0, 6),
    disabledTimeIntervals: ({ key, value, providedType, localization }) => {
      if (value === undefined) {
        return [];
      }
      if (!Array.isArray(value)) {
        Namespace.errorMessages.typeMismatch(
          key,
          providedType,
          'array of { from: DateTime|Date, to: DateTime|Date }'
        );
      }
      const valueObject = value as { from: any; to: any }[]; //eslint-disable-line @typescript-eslint/no-explicit-any
      for (let i = 0; i < valueObject.length; i++) {
        Object.keys(valueObject[i]).forEach((vk) => {
          const subOptionName = `${key}[${i}].${vk}`;
          const d = valueObject[i][vk];
          const dateTime = convertToDateTime(d, subOptionName, localization);
          dateTime.setLocalization(localization);
          valueObject[i][vk] = dateTime;
        });
      }
      return valueObject;
    },
    toolbarPlacement: validKeyOption(['top', 'bottom', 'default']),
    type: validKeyOption(['icons', 'sprites']),
    viewMode: validKeyOption([
      'clock',
      'calendar',
      'months',
      'years',
      'decades',
    ]),
    theme: validKeyOption(['light', 'dark', 'auto']),
    placement: validKeyOption(['top', 'bottom']),
    meta: ({ value }) => value,
    dayViewHeaderFormat: ({ value }) => value,
    container: ({ value, path }) => {
      if (
        value &&
        !(
          value instanceof HTMLElement ||
          value instanceof Element ||
          value?.appendChild
        )
      ) {
        Namespace.errorMessages.typeMismatch(
          path.substring(1),
          typeof value,
          'HTMLElement'
        );
      }
      return value;
    },
    useTwentyfourHour: ({ value, path, providedType, defaultType }) => {
      Namespace.errorMessages.deprecatedWarning(
        'useTwentyfourHour',
        'Please use "options.localization.hourCycle" instead'
      );
      if (value === undefined || providedType === 'boolean') return value;
      Namespace.errorMessages.typeMismatch(path, providedType, defaultType);
    },
    hourCycle: validKeyOption(['h11', 'h12', 'h23', 'h24']),
  });

const defaultProcessor: OptionProcessorFunction = ({
  value,
  defaultType,
  providedType,
  path,
}) => {
  switch (defaultType) {
    case 'boolean':
      return value === 'true' || value === true;
    case 'number':
      return +value;
    case 'string':
      return value.toString();
    case 'object':
      return {};
    case 'function':
      return value;
    default:
      Namespace.errorMessages.typeMismatch(path, providedType, defaultType);
  }
};

export function processKey(this: void, args: OptionProcessorFunctionArguments) {
  return (optionProcessors[args.key] || defaultProcessor)(args);
}
