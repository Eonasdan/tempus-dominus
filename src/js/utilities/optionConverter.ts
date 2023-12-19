import Namespace from './namespace';
import { DateTime } from '../datetime';
import DefaultOptions from './default-options';
import Options, { FormatLocalization } from './options';
import { processKey } from './optionProcessor';
import {
  convertToDateTime,
  tryConvertToDateTime,
  typeCheckDateArray,
  typeCheckNumberArray,
} from './typeChecker';

export class OptionConverter {
  private static ignoreProperties = [
    'meta',
    'dayViewHeaderFormat',
    'container',
    'dateForms',
    'ordinal',
  ];

  static deepCopy(input): Options {
    const o = {};

    Object.keys(input).forEach((key) => {
      const inputElement = input[key];

      if (inputElement instanceof DateTime) {
        o[key] = inputElement.clone;
        return;
      } else if (inputElement instanceof Date) {
        o[key] = new Date(inputElement.valueOf());
        return;
      }

      o[key] = inputElement;
      if (
        typeof inputElement !== 'object' ||
        inputElement instanceof HTMLElement ||
        inputElement instanceof Element
      )
        return;
      if (!Array.isArray(inputElement)) {
        o[key] = OptionConverter.deepCopy(inputElement);
      }
    });

    return o;
  }

  private static isValue = (a) => a != null; // everything except undefined + null

  /**
   * Finds value out of an object based on a string, period delimited, path
   * @param paths
   * @param obj
   */
  static objectPath(paths: string, obj) {
    if (paths.charAt(0) === '.') paths = paths.slice(1);
    if (!paths) return obj;
    return paths
      .split('.')
      .reduce(
        (value, key) =>
          OptionConverter.isValue(value) || OptionConverter.isValue(value[key])
            ? value[key]
            : undefined,
        obj
      );
  }

  /**
   * The spread operator caused sub keys to be missing after merging.
   * This is to fix that issue by using spread on the child objects first.
   * Also handles complex options like disabledDates
   * @param provided An option from new providedOptions
   * @param copyTo Destination object. This was added to prevent reference copies
   * @param localization
   * @param path
   */
  static spread(provided, copyTo, localization: FormatLocalization, path = '') {
    const defaultOptions = OptionConverter.objectPath(path, DefaultOptions);

    const unsupportedOptions = Object.keys(provided).filter(
      (x) => !Object.keys(defaultOptions).includes(x)
    );

    if (unsupportedOptions.length > 0) {
      const flattenedOptions = OptionConverter.getFlattenDefaultOptions();

      const errors = unsupportedOptions.map((x) => {
        let error = `"${path}.${x}" in not a known option.`;
        const didYouMean = flattenedOptions.find((y) => y.includes(x));
        if (didYouMean) error += ` Did you mean "${didYouMean}"?`;
        return error;
      });
      Namespace.errorMessages.unexpectedOptions(errors);
    }

    Object.keys(provided)
      .filter((key) => key !== '__proto__' && key !== 'constructor')
      .forEach((key) => {
        path += `.${key}`;
        if (path.charAt(0) === '.') path = path.slice(1);

        const defaultOptionValue = defaultOptions[key];
        const providedType = typeof provided[key];
        const defaultType = typeof defaultOptionValue;
        const value = provided[key];

        if (value === undefined || value === null) {
          copyTo[key] = value;
          path = path.substring(0, path.lastIndexOf(`.${key}`));
          return;
        }

        if (
          typeof defaultOptionValue === 'object' &&
          !Array.isArray(provided[key]) &&
          !(
            defaultOptionValue instanceof Date ||
            OptionConverter.ignoreProperties.includes(key)
          )
        ) {
          OptionConverter.spread(
            provided[key],
            copyTo[key],
            localization,
            path
          );
        } else {
          copyTo[key] = OptionConverter.processKey(
            key,
            value,
            providedType,
            defaultType,
            path,
            localization
          );
        }

        path = path.substring(0, path.lastIndexOf(`.${key}`));
      });
  }

  static processKey(
    key: string,
    value: any, //eslint-disable-line @typescript-eslint/no-explicit-any
    providedType: string,
    defaultType: string,
    path: string,
    localization: FormatLocalization
  ) {
    return processKey({
      key,
      value,
      providedType,
      defaultType,
      path,
      localization,
    });
  }

  static _mergeOptions(providedOptions: Options, mergeTo: Options): Options {
    const newConfig = OptionConverter.deepCopy(mergeTo);
    //see if the options specify a locale
    const localization =
      mergeTo.localization?.locale !== 'default'
        ? mergeTo.localization
        : providedOptions?.localization || DefaultOptions.localization;

    OptionConverter.spread(providedOptions, newConfig, localization, '');

    return newConfig;
  }

  static _dataToOptions(element, options: Options): Options {
    const eData = JSON.parse(JSON.stringify(element.dataset));

    if (eData?.tdTargetInput) delete eData.tdTargetInput;
    if (eData?.tdTargetToggle) delete eData.tdTargetToggle;

    if (!eData || Object.keys(eData).length === 0) return options;
    const dataOptions = {} as Options;

    // because dataset returns camelCase including the 'td' key the option
    // key won't align
    const objectToNormalized = (object) => {
      const lowered = {};
      Object.keys(object).forEach((x) => {
        lowered[x.toLowerCase()] = x;
      });

      return lowered;
    };

    const normalizeObject = this.normalizeObject(objectToNormalized);
    const optionsLower = objectToNormalized(options);

    Object.keys(eData)
      .filter((x) => x.startsWith(Namespace.dataKey))
      .map((x) => x.substring(2))
      .forEach((key) => {
        let keyOption = optionsLower[key.toLowerCase()];

        // dataset merges dashes to camelCase... yay
        // i.e. key = display_components_seconds
        if (key.includes('_')) {
          // [display, components, seconds]
          const split = key.split('_');
          // display
          keyOption = optionsLower[split[0].toLowerCase()];
          if (
            keyOption !== undefined &&
            options[keyOption].constructor === Object
          ) {
            dataOptions[keyOption] = normalizeObject(
              split,
              1,
              options[keyOption],
              eData[`td${key}`]
            );
          }
        }
        // or key = multipleDate
        else if (keyOption !== undefined) {
          dataOptions[keyOption] = eData[`td${key}`];
        }
      });

    return this._mergeOptions(dataOptions, options);
  }

  //todo clean this up
  private static normalizeObject(objectToNormalized: (object) => object) {
    const normalizeObject = (
      split: string[],
      index: number,
      optionSubgroup: unknown,
      value: unknown
    ) => {
      // first round = display { ... }
      const normalizedOptions = objectToNormalized(optionSubgroup);

      const keyOption = normalizedOptions[split[index].toLowerCase()];
      const internalObject = {};

      if (keyOption === undefined) return internalObject;

      // if this is another object, continue down the rabbit hole
      if (optionSubgroup[keyOption]?.constructor === Object) {
        index++;
        internalObject[keyOption] = normalizeObject(
          split,
          index,
          optionSubgroup[keyOption],
          value
        );
      } else {
        internalObject[keyOption] = value;
      }
      return internalObject;
    };
    return normalizeObject;
  }

  /**
   * Attempts to prove `d` is a DateTime or Date or can be converted into one.
   * @param d If a string will attempt creating a date from it.
   * @param localization object containing locale and format settings. Only used with the custom formats
   * @private
   */
  static _dateTypeCheck(
    d: any, //eslint-disable-line @typescript-eslint/no-explicit-any
    localization: FormatLocalization
  ): DateTime | null {
    return tryConvertToDateTime(d, localization);
  }

  /**
   * Type checks that `value` is an array of Date or DateTime
   * @param optionName Provides text to error messages e.g. disabledDates
   * @param value Option value
   * @param providedType Used to provide text to error messages
   * @param localization
   */
  static _typeCheckDateArray(
    optionName: string,
    value,
    providedType: string,
    localization: FormatLocalization
  ) {
    return typeCheckDateArray(optionName, value, providedType, localization);
  }

  /**
   * Type checks that `value` is an array of numbers
   * @param optionName Provides text to error messages e.g. disabledDates
   * @param value Option value
   * @param providedType Used to provide text to error messages
   */
  static _typeCheckNumberArray(
    optionName: string,
    value,
    providedType: string
  ) {
    return typeCheckNumberArray(optionName, value, providedType);
  }

  /**
   * Attempts to convert `d` to a DateTime object
   * @param d value to convert
   * @param optionName Provides text to error messages e.g. disabledDates
   * @param localization object containing locale and format settings. Only used with the custom formats
   */
  static dateConversion(
    d: any, //eslint-disable-line @typescript-eslint/no-explicit-any
    optionName: string,
    localization: FormatLocalization
  ): DateTime {
    return convertToDateTime(d, optionName, localization);
  }

  private static _flattenDefaults: string[];

  private static getFlattenDefaultOptions(): string[] {
    if (this._flattenDefaults) return this._flattenDefaults;
    const deepKeys = (t, pre = []) => {
      if (Array.isArray(t)) return [];
      if (Object(t) === t) {
        return Object.entries(t).flatMap(([k, v]) => deepKeys(v, [...pre, k]));
      } else {
        return pre.join('.');
      }
    };

    this._flattenDefaults = deepKeys(DefaultOptions);

    return this._flattenDefaults;
  }

  /**
   * Some options conflict like min/max date. Verify that these kinds of options
   * are set correctly.
   * @param config
   */
  static _validateConflicts(config: Options) {
    if (
      config.display.sideBySide &&
      (!config.display.components.clock ||
        !(
          config.display.components.hours ||
          config.display.components.minutes ||
          config.display.components.seconds
        ))
    ) {
      Namespace.errorMessages.conflictingConfiguration(
        'Cannot use side by side mode without the clock components'
      );
    }

    if (config.restrictions.minDate && config.restrictions.maxDate) {
      if (config.restrictions.minDate.isAfter(config.restrictions.maxDate)) {
        Namespace.errorMessages.conflictingConfiguration(
          'minDate is after maxDate'
        );
      }

      if (config.restrictions.maxDate.isBefore(config.restrictions.minDate)) {
        Namespace.errorMessages.conflictingConfiguration(
          'maxDate is before minDate'
        );
      }
    }

    if (config.multipleDates && config.dateRange) {
      Namespace.errorMessages.conflictingConfiguration(
        'Cannot uss option "multipleDates" with "dateRange"'
      );
    }
  }
}
