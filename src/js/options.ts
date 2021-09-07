import { DateTime, DateTimeFormatOptions } from './datetime';
import Namespace from './namespace';
import { DefaultOptions } from './conts';

export default interface Options {
  restrictions: {
    minDate: DateTime;
    maxDate: DateTime;
    enabledDates: DateTime[];
    disabledDates: DateTime[];
    enabledHours: number[];
    disabledHours: number[];
    disabledTimeIntervals: { from: DateTime; to: DateTime }[];
    daysOfWeekDisabled: number[];
  };
  display: {
    toolbarPlacement: 'top' | 'bottom';
    components: {
      calendar: boolean;
      date: boolean;
      month: boolean;
      year: boolean;
      decades: boolean;
      clock: boolean;
      hours: boolean;
      minutes: boolean;
      seconds: boolean;
      useTwentyfourHour: boolean;
    };
    buttons: { today: boolean; close: boolean; clear: boolean };
    calendarWeeks: boolean;
    icons: {
      date: string;
      next: string;
      previous: string;
      today: string;
      clear: string;
      time: string;
      up: string;
      type: 'icons' | 'sprites';
      down: string;
      close: string;
    };
    viewMode: 'clock' | 'calendar' | 'months' | 'years' | 'decades';
    sideBySide: boolean;
    inputFormat: DateTimeFormatOptions;
    inline: boolean;
    keepOpen: boolean;
  };
  stepping: number;
  useCurrent: boolean;
  defaultDate: DateTime;
  localization: {
    nextMonth: string;
    pickHour: string;
    incrementSecond: string;
    nextDecade: string;
    selectDecade: string;
    dayViewHeaderFormat: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow';
    decrementHour: string;
    selectDate: string;
    incrementHour: string;
    previousCentury: string;
    decrementSecond: string;
    today: string;
    previousMonth: string;
    selectYear: string;
    pickSecond: string;
    nextCentury: string;
    close: string;
    incrementMinute: string;
    selectTime: string;
    clear: string;
    togglePeriod: string;
    selectMonth: string;
    decrementMinute: string;
    pickMinute: string;
    nextYear: string;
    previousYear: string;
    previousDecade: string;
    locale: string;
  };
  keepInvalid: boolean;
  debug: boolean;
  allowInputToggle: boolean;
  viewDate: DateTime;
  multipleDates: boolean;
  multipleDatesSeparator: string;
  promptTimeOnDateChange: boolean;
  promptTimeOnDateChangeTransitionDelay: number;
}

export class OptionConverter {
  static _mergeOptions(providedOptions: Options, mergeTo: Options): Options {
    const newOptions = {} as Options;
    let path = '';

    const processKey = (key, value, providedType, defaultType) => {
      switch (key) {
        case 'defaultDate': {
          const dateTime = this._dateConversion(value, 'defaultDate');
          if (dateTime !== undefined) {
            return dateTime;
          }
          Namespace.errorMessages.typeMismatch(
            'defaultDate',
            providedType,
            'DateTime or Date'
          );
        }
        case 'viewDate': {
          const dateTime = this._dateConversion(value, 'viewDate');
          if (dateTime !== undefined) {
            return dateTime;
          }
          Namespace.errorMessages.typeMismatch(
            'viewDate',
            providedType,
            'DateTime or Date'
          );
        }
        case 'minDate': {
          if (value === undefined) {
            return value;
          }
          const dateTime = this._dateConversion(value, 'restrictions.minDate');
          if (dateTime !== undefined) {
            return dateTime;
          }
          Namespace.errorMessages.typeMismatch(
            'restrictions.minDate',
            providedType,
            'DateTime or Date'
          );
        }
        case 'maxDate': {
          if (value === undefined) {
            return value;
          }
          const dateTime = this._dateConversion(value, 'restrictions.maxDate');
          if (dateTime !== undefined) {
            return dateTime;
          }
          Namespace.errorMessages.typeMismatch(
            'restrictions.maxDate',
            providedType,
            'DateTime or Date'
          );
        }
        case 'disabledHours':
          if (value === undefined) {
            return [];
          }
          this._typeCheckNumberArray(
            'restrictions.disabledHours',
            value,
            providedType
          );
          if (value.filter((x) => x < 0 || x > 24).length > 0)
            Namespace.errorMessages.numbersOutOfRage(
              'restrictions.disabledHours',
              0,
              23
            );
          return value;
        case 'enabledHours':
          if (value === undefined) {
            return [];
          }
          this._typeCheckNumberArray(
            'restrictions.enabledHours',
            value,
            providedType
          );
          if (value.filter((x) => x < 0 || x > 24).length > 0)
            Namespace.errorMessages.numbersOutOfRage(
              'restrictions.enabledHours',
              0,
              23
            );
          return value;
        case 'daysOfWeekDisabled':
          if (value === undefined) {
            return [];
          }
          this._typeCheckNumberArray(
            'restrictions.daysOfWeekDisabled',
            value,
            providedType
          );
          if (value.filter((x) => x < 0 || x > 6).length > 0)
            Namespace.errorMessages.numbersOutOfRage(
              'restrictions.daysOfWeekDisabled',
              0,
              6
            );
          return value;
        case 'enabledDates':
          if (value === undefined) {
            return [];
          }
          this._typeCheckDateArray(
            'restrictions.enabledDates',
            value,
            providedType
          );
          return value;
        case 'disabledDates':
          if (value === undefined) {
            return [];
          }
          this._typeCheckDateArray(
            'restrictions.disabledDates',
            value,
            providedType
          );
          return value;
        case 'disabledTimeIntervals':
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
          const valueObject = value as { from: any; to: any }[];
          for (let i = 0; i < valueObject.length; i++) {
            Object.keys(valueObject[i]).forEach((vk) => {
              const subOptionName = `${key}[${i}].${vk}`;
              let d = valueObject[i][vk];
              const dateTime = this._dateConversion(d, subOptionName);
              if (!dateTime) {
                Namespace.errorMessages.typeMismatch(
                  subOptionName,
                  typeof d,
                  'DateTime or Date'
                );
              }
              valueObject[i][vk] = dateTime;
            });
          }
          return valueObject;
        case 'toolbarPlacement':
        case 'type':
        case 'viewMode':
        case 'dayViewHeaderFormat':
          const optionValues = {
            toolbarPlacement: ['top', 'bottom', 'default'],
            type: ['icons', 'sprites'],
            viewMode: ['clock', 'calendar', 'months', 'years', 'decades'],
            dayViewHeaderFormat: [
              'numeric',
              '2-digit',
              'long',
              'short',
              'narrow',
            ],
          };
          const keyOptions = optionValues[key];
          if (!keyOptions.includes(value))
            Namespace.errorMessages.unexpectedOptionValue(
              path.substring(1),
              value,
              keyOptions
            );

          return value;
        case 'inputFormat':
          return value;
        default:
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
              Namespace.errorMessages.typeMismatch(
                path.substring(1),
                providedType,
                defaultType
              );
          }
      }
    };

    /**
     * The spread operator caused sub keys to be missing after merging.
     * This is to fix that issue by using spread on the child objects first.
     * Also handles complex options like disabledDates
     * @param provided An option from new providedOptions
     * @param mergeOption Default option to compare types against
     * @param copyTo Destination object. This was add to prevent reference copies
     */
    const spread = (provided, mergeOption, copyTo) => {
      const unsupportedOptions = Object.keys(provided).filter(
        (x) => !Object.keys(mergeOption).includes(x)
      );
      if (unsupportedOptions.length > 0) {
        const flattenedOptions = OptionConverter._flattenDefaultOptions;

        const errors = unsupportedOptions.map((x) => {
          let error = `"${path.substring(1)}.${x}" in not a known option.`;
          let didYouMean = flattenedOptions.find((y) => y.includes(x));
          if (didYouMean) error += `Did you mean "${didYouMean}"?`;
          return error;
        });
        Namespace.errorMessages.unexpectedOptions(errors);
      }
      Object.keys(mergeOption).forEach((key) => {
        const defaultOptionValue = mergeOption[key];
        let providedType = typeof provided[key];
        let defaultType = typeof defaultOptionValue;
        let value = provided[key];
        if (!provided.hasOwnProperty(key)) {
          if (
            defaultType === 'undefined' ||
            (value?.length === 0 && Array.isArray(defaultOptionValue))
          ) {
            copyTo[key] = defaultOptionValue;
            return;
          }
          provided[key] = defaultOptionValue;
          value = provided[key];
        }
        path += `.${key}`;
        copyTo[key] = processKey(key, value, providedType, defaultType);

        if (typeof defaultOptionValue !== 'object' || key === 'inputFormat') {
          path = path.substring(0, path.lastIndexOf(`.${key}`));
          return;
        }
        if (!Array.isArray(provided[key])) {
          spread(provided[key], defaultOptionValue, copyTo[key]);
          path = path.substring(0, path.lastIndexOf(`.${key}`));
        }
        path = path.substring(0, path.lastIndexOf(`.${key}`));
      });
    };
    spread(providedOptions, mergeTo, newOptions);

    return newOptions;
  }

  static _dataToOptions(element, options: Options): Options {
    const eData = element.dataset;
    if (
      !eData ||
      Object.keys(eData).length === 0 ||
      eData.constructor !== DOMStringMap
    )
      return options;
    let dataOptions = {} as Options;

    // because dataset returns camelCase including the 'td' key the option
    // key won't align
    const objectToNormalized = (object) => {
      const lowered = {};
      Object.keys(object).forEach((x) => {
        lowered[x.toLowerCase()] = x;
      });

      return lowered;
    };

    const rabbitHole = (
      split: string[],
      index: number,
      optionSubgroup: {},
      value: any
    ) => {
      // first round = display { ... }
      const normalizedOptions = objectToNormalized(optionSubgroup);

      const keyOption = normalizedOptions[split[index].toLowerCase()];
      const internalObject = {};

      if (keyOption === undefined) return internalObject;

      // if this is another object, continue down the rabbit hole
      if (optionSubgroup[keyOption].constructor === Object) {
        index++;
        internalObject[keyOption] = rabbitHole(
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
            dataOptions[keyOption] = rabbitHole(
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

  /**
   * Attempts to prove `d` is a DateTime or Date or can be converted into one.
   * @param d If a string will attempt creating a date from it.
   * @private
   */
  static _dateTypeCheck(d: any): DateTime | null {
    if (d.constructor.name === 'DateTime') return d;
    if (d.constructor.name === 'Date') {
      return DateTime.convert(d);
    }
    if (typeof d === typeof '') {
      const dateTime = new DateTime(d);
      if (JSON.stringify(dateTime) === 'null') {
        return null;
      }
      return dateTime;
    }
    return null;
  }

  /**
   * Type checks that `value` is an array of Date or DateTime
   * @param optionName Provides text to error messages e.g. disabledDates
   * @param value Option value
   * @param providedType Used to provide text to error messages
   */
  static _typeCheckDateArray(optionName: string, value, providedType: string) {
    if (!Array.isArray(value)) {
      Namespace.errorMessages.typeMismatch(
        optionName,
        providedType,
        'array of DateTime or Date'
      );
    }
    for (let i = 0; i < value.length; i++) {
      let d = value[i];
      const dateTime = this._dateConversion(d, optionName);
      if (!dateTime) {
        Namespace.errorMessages.typeMismatch(
          optionName,
          typeof d,
          'DateTime or Date'
        );
      }
      value[i] = dateTime;
    }
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
    if (!Array.isArray(value) || value.find((x) => typeof x !== typeof 0)) {
      Namespace.errorMessages.typeMismatch(
        optionName,
        providedType,
        'array of numbers'
      );
    }
    return;
  }


  /**
   * Attempts to convert `d` to a DateTime object
   * @param d value to convert
   * @param optionName Provides text to error messages e.g. disabledDates
   */
  static _dateConversion(d: any, optionName: string) {
    if (typeof d === typeof '') {
      Namespace.errorMessages.dateString();
    }

    const converted = this._dateTypeCheck(d);

    if (!converted) {
      Namespace.errorMessages.failedToParseDate(optionName, d);
    }
    return converted;
  }

  private static _flatback: string[];

  private static get _flattenDefaultOptions(): string[] {
    if (this._flatback) return this._flatback;
    const deepKeys = (t, pre = []) =>
      Array.isArray(t)
        ? []
        : Object(t) === t
        ? Object.entries(t).flatMap(([k, v]) => deepKeys(v, [...pre, k]))
        : pre.join('.');

    this._flatback = deepKeys(DefaultOptions);

    return this._flatback;
  }

  /**
   * Some options conflict like min/max date. Verify that these kinds of options
   * are set correctly.
   * @param config
   */
  static _validateConflcits(config: Options) {
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
  }
}
