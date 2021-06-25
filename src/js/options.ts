import { DateTime } from './datetime';
import DateTimeFormatOptions = Intl.DateTimeFormatOptions;
import Namespace from './namespace';
import { TempusDominus } from './tempus-dominus';

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
    toolbarPlacement: 'top' | 'bottom' | 'default';
    components: {
      date: boolean;
      century: boolean;
      hours: boolean;
      seconds: boolean;
      month: boolean;
      year: boolean;
      minutes: boolean;
      decades: boolean;
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
    viewMode: 'clock' | 'calendar';
    collapse: boolean;
    sideBySide: boolean;
    inputFormat: DateTimeFormatOptions;
    inline: boolean;
  };
  stepping: number;
  useCurrent: boolean;
  defaultDate: boolean;
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
  };
  readonly: boolean;
  ignoreReadonly: boolean;
  keepOpen: boolean;
  focusOnShow: boolean;
  keepInvalid: boolean;
  keyBinds: {
    'control down': () => boolean;
    pageDown: () => boolean;
    'control up': () => boolean;
    right: () => boolean;
    pageUp: () => boolean;
    down: () => boolean;
    delete: () => boolean;
    t: () => boolean;
    left: () => boolean;
    up: () => boolean;
    enter: () => boolean;
    'control space': () => boolean;
    escape: () => boolean;
  };
  debug: boolean;
  allowInputToggle: boolean;
  viewDate: DateTime;
  allowMultidate: boolean;
  multidateSeparator: string;
  promptTimeOnDateChange: boolean;
  promptTimeOnDateChangeTransitionDelay: number;
}

export class OptionConverter {
  static _mergeOptions(config: Options, mergeTo: Options): Options {
    if (!config || Object.keys(config).length === 0) return mergeTo;

    let path = '';
    /**
     * The spread operator caused sub keys to be missing after merging.
     * This is to fix that issue by using spread on the child objects first.
     * Also handles complex options like disabledDates
     * @param provided An option from new config
     * @param defaultOption Default option to compare types against
     */
    const spread = (provided, defaultOption) => {
      Object.keys(provided).forEach((key) => {
        let providedType = typeof provided[key];
        if (providedType === undefined) return;
        path += `.${key}`;
        let defaultType = typeof defaultOption[key];
        let value = provided[key];
        if (!value) return; //todo not sure if null checking here is right
        switch (key) {
          case 'viewDate': {
            const dateTime = this._dateConversion(value, 'viewDate');
            if (dateTime !== undefined) {
              provided[key] = dateTime;
              break;
            }
            throw Namespace.ErrorMessages.typeMismatch(
              'viewDate',
              providedType,
              'DateTime or Date'
            );
          }
          case 'minDate': {
            const dateTime = this._dateConversion(
              value,
              'restrictions.minDate'
            );
            if (dateTime !== undefined) {
              provided[key] = dateTime;
              break;
            }
            throw Namespace.ErrorMessages.typeMismatch(
              'restrictions.minDate',
              providedType,
              'DateTime or Date'
            );
          }
          case 'maxDate': {
            const dateTime = this._dateConversion(
              value,
              'restrictions.maxDate'
            );
            if (dateTime !== undefined) {
              provided[key] = dateTime;
              break;
            }
            throw Namespace.ErrorMessages.typeMismatch(
              'restrictions.maxDate',
              providedType,
              'DateTime or Date'
            );
          }
          case 'disabledHours':
            this._typeCheckNumberArray(
              'restrictions.disabledHours',
              value,
              providedType
            );
            if (value.filter((x) => x < 0 || x > 24))
              throw Namespace.ErrorMessages.numbersOutOfRage(
                'restrictions.disabledHours',
                0,
                23
              );
            break;
          case 'enabledHours':
            this._typeCheckNumberArray(
              'restrictions.enabledHours',
              value,
              providedType
            );
            if (value.filter((x) => x < 0 || x > 24))
              throw Namespace.ErrorMessages.numbersOutOfRage(
                'restrictions.enabledHours',
                0,
                23
              );
            break;
          case 'daysOfWeekDisabled':
            this._typeCheckNumberArray(
              'restrictions.daysOfWeekDisabled',
              value,
              providedType
            );
            if (value.filter((x) => x < 0 || x > 6))
              throw Namespace.ErrorMessages.numbersOutOfRage(
                'restrictions.daysOfWeekDisabled',
                0,
                6
              );
            break;
          case 'enabledDates':
            this._typeCheckDateArray(
              'restrictions.enabledDates',
              value,
              providedType
            );
            break;
          case 'disabledDates':
            this._typeCheckDateArray(
              'restrictions.disabledDates',
              value,
              providedType
            );
            break;
          case 'disabledTimeIntervals':
            if (!Array.isArray(value)) {
              throw Namespace.ErrorMessages.typeMismatch(
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
                  throw Namespace.ErrorMessages.typeMismatch(
                    subOptionName,
                    typeof d,
                    'DateTime or Date'
                  );
                }
                valueObject[i][vk] = dateTime;
              });
            }
            break;
          default:
            if (providedType !== defaultType) {
              if (defaultType === typeof undefined)
                throw Namespace.ErrorMessages.unexpectedOption(
                  path.substring(1)
                );

              switch (defaultType) {
                case 'boolean':
                  provided[key] = value === 'true';
                  break;
                case 'number':
                  provided[key] = +value;
                  break;
                case 'string':
                  provided[key] = value.toString();
                  break;
                default:
                  throw Namespace.ErrorMessages.typeMismatch(
                    path.substring(1),
                    providedType,
                    defaultType
                  );
              }
            }
            break;
        }

        if (typeof defaultOption[key] !== 'object') {
          path = path.substring(0, path.lastIndexOf(`.${key}`));
          return;
        }
        if (!Array.isArray(provided[key]) && provided[key] != null) {
          spread(provided[key], defaultOption[key]);
          path = path.substring(0, path.lastIndexOf(`.${key}`));
          provided[key] = { ...defaultOption[key], ...provided[key] };
        }
        path = path.substring(0, path.lastIndexOf(`.${key}`));
      });
    };
    spread(config, mergeTo);

    return {
      ...mergeTo,
      ...config,
    };
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
      optionSubgroup: { },
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
      .filter((x) => x.startsWith(Namespace.DATA_KEY))
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
        // or key = allowMultidate
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
      throw Namespace.ErrorMessages.typeMismatch(
        optionName,
        providedType,
        'array of DateTime or Date'
      );
    }
    for (let i = 0; i < value.length; i++) {
      let d = value[i];
      const dateTime = this._dateConversion(d, optionName);
      if (!dateTime) {
        throw Namespace.ErrorMessages.typeMismatch(
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
      throw Namespace.ErrorMessages.typeMismatch(
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
      console.warn(Namespace.ErrorMessages.dateString);
    }

    const converted = this._dateTypeCheck(d);

    if (!converted) {
      throw Namespace.ErrorMessages.failedToParseDate(optionName, d);
    }
    return converted;
  }
}
