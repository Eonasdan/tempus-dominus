import Namespace from "./namespace";
import {DateTime} from "../datetime";
import DefaultOptions from "./default-options";
import Options from "./options";

export class OptionConverter {

    private static ignoreProperties = ['meta', 'dayViewHeaderFormat', 'container'];

    static deepCopy(input): Options {
        const o = {};

        Object.keys(input).forEach((key) => {
            const inputElement = input[key];
            o[key] = inputElement;
            if (typeof inputElement !== 'object' ||
                inputElement instanceof HTMLElement ||
                inputElement instanceof Element ||
                inputElement instanceof Date) return;
            if (!Array.isArray(inputElement)) {
                o[key] = OptionConverter.deepCopy(inputElement);
            }
        });

        return o;
    }

    private static isValue = a => a != null; // everything except undefined + null

    /**
     * Finds value out of an object based on a string, period delimited, path
     * @param paths
     * @param obj
     */
    static objectPath(paths: string, obj) {
        if (paths.charAt(0) === '.')
            paths = paths.slice(1);
        if (!paths) return obj;
        return paths.split('.')
            .reduce((value, key) => (OptionConverter.isValue(value) || OptionConverter.isValue(value[key]) ?
                value[key] :
                undefined), obj);
    }

    // /**
    //  * The spread operator caused sub keys to be missing after merging.
    //  * This is to fix that issue by using spread on the child objects first.
    //  * Also handles complex options like disabledDates
    //  * @param provided An option from new providedOptions
    //  * @param mergeOption Default option to compare types against
    //  * @param copyTo Destination object. This was added to prevent reference copies
    //  * @param path
    //  * @param locale
    //  */
    // static spread(provided, mergeOption, copyTo, path = '', locale = '') {
    //     const unsupportedOptions = Object.keys(provided).filter(
    //         (x) => !Object.keys(mergeOption).includes(x)
    //     );
    //
    //     if (unsupportedOptions.length > 0) {
    //         const flattenedOptions = OptionConverter.getFlattenDefaultOptions();
    //
    //         const errors = unsupportedOptions.map((x) => {
    //             let error = `"${path}.${x}" in not a known option.`;
    //             let didYouMean = flattenedOptions.find((y) => y.includes(x));
    //             if (didYouMean) error += ` Did you mean "${didYouMean}"?`;
    //             return error;
    //         });
    //         Namespace.errorMessages.unexpectedOptions(errors);
    //     }
    //
    //     Object.keys(mergeOption).forEach((key) => {
    //         path += `.${key}`;
    //         if (path.charAt(0) === '.') path = path.slice(1);
    //
    //         const defaultOptionValue = OptionConverter.objectPath(path, DefaultOptions);
    //         let providedType = typeof provided[key];
    //         let defaultType = typeof defaultOptionValue;
    //         let value = provided[key];
    //
    //         if (!provided.hasOwnProperty(key)) {
    //             if (
    //                 defaultType === 'undefined' ||
    //                 (value?.length === 0 && Array.isArray(defaultOptionValue))
    //             ) {
    //                 copyTo[key] = defaultOptionValue;
    //                 path = path.substring(0, path.lastIndexOf(`.${key}`));
    //                 return;
    //             }
    //             provided[key] = defaultOptionValue;
    //             value = provided[key];
    //         }
    //
    //         copyTo[key] = OptionConverter.processKey(key, value, providedType, defaultType, path, locale);
    //
    //         if (
    //             typeof defaultOptionValue !== 'object' ||
    //             defaultOptionValue instanceof Date ||
    //             OptionConverter.ignoreProperties.includes(key)
    //         ) {
    //             path = path.substring(0, path.lastIndexOf(`.${key}`));
    //             return;
    //         }
    //
    //         if (!Array.isArray(provided[key])) {
    //             OptionConverter.spread(provided[key], mergeOption[key], copyTo[key], path, locale);
    //         }
    //         path = path.substring(0, path.lastIndexOf(`.${key}`));
    //     });
    // }

    /**
     * The spread operator caused sub keys to be missing after merging.
     * This is to fix that issue by using spread on the child objects first.
     * Also handles complex options like disabledDates
     * @param provided An option from new providedOptions
     * @param mergeOption Default option to compare types against
     * @param copyTo Destination object. This was added to prevent reference copies
     * @param path
     * @param locale
     */
    static spread(provided, copyTo, path = '', locale = '') {
        const defaultOptions = OptionConverter.objectPath(path, DefaultOptions);

        const unsupportedOptions = Object.keys(provided).filter(
            (x) => !Object.keys(defaultOptions).includes(x)
        );

        if (unsupportedOptions.length > 0) {
            const flattenedOptions = OptionConverter.getFlattenDefaultOptions();

            const errors = unsupportedOptions.map((x) => {
                let error = `"${path}.${x}" in not a known option.`;
                let didYouMean = flattenedOptions.find((y) => y.includes(x));
                if (didYouMean) error += ` Did you mean "${didYouMean}"?`;
                return error;
            });
            Namespace.errorMessages.unexpectedOptions(errors);
        }

        Object.keys(provided).forEach((key) => {
            path += `.${key}`;
            if (path.charAt(0) === '.') path = path.slice(1);

            const defaultOptionValue = defaultOptions[key];
            let providedType = typeof provided[key];
            let defaultType = typeof defaultOptionValue;
            let value = provided[key];

            if (value === undefined || value === null) {
                copyTo[key] = value;
                path = path.substring(0, path.lastIndexOf(`.${key}`));
                return;
            }

            if (typeof defaultOptionValue === 'object' &&
                !Array.isArray(provided[key]) &&
                !(defaultOptionValue instanceof Date || OptionConverter.ignoreProperties.includes(key)))
            {
                OptionConverter.spread(provided[key], copyTo[key], path, locale);
            }
            else {
                copyTo[key] = OptionConverter.processKey(key, value, providedType, defaultType, path, locale);
            }

            path = path.substring(0, path.lastIndexOf(`.${key}`));
        });
    }

    static processKey(key, value, providedType, defaultType, path, locale) {
        switch (key) {
            case 'defaultDate': {
                const dateTime = this.dateConversion(value, 'defaultDate');
                if (dateTime !== undefined) {
                    dateTime.setLocale(locale);
                    return dateTime;
                }
                Namespace.errorMessages.typeMismatch(
                    'defaultDate',
                    providedType,
                    'DateTime or Date'
                );
                break;
            }
            case 'viewDate': {
                const dateTime = this.dateConversion(value, 'viewDate');
                if (dateTime !== undefined) {
                    dateTime.setLocale(locale);
                    return dateTime;
                }
                Namespace.errorMessages.typeMismatch(
                    'viewDate',
                    providedType,
                    'DateTime or Date'
                );
                break;
            }
            case 'minDate': {
                if (value === undefined) {
                    return value;
                }
                const dateTime = this.dateConversion(value, 'restrictions.minDate');
                if (dateTime !== undefined) {
                    dateTime.setLocale(locale);
                    return dateTime;
                }
                Namespace.errorMessages.typeMismatch(
                    'restrictions.minDate',
                    providedType,
                    'DateTime or Date'
                );
                break;
            }
            case 'maxDate': {
                if (value === undefined) {
                    return value;
                }
                const dateTime = this.dateConversion(value, 'restrictions.maxDate');
                if (dateTime !== undefined) {
                    dateTime.setLocale(locale);
                    return dateTime;
                }
                Namespace.errorMessages.typeMismatch(
                    'restrictions.maxDate',
                    providedType,
                    'DateTime or Date'
                );
                break;
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
                    providedType,
                    locale
                );
                return value;
            case 'disabledDates':
                if (value === undefined) {
                    return [];
                }
                this._typeCheckDateArray(
                    'restrictions.disabledDates',
                    value,
                    providedType,
                    locale
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
                        const dateTime = this.dateConversion(d, subOptionName);
                        if (!dateTime) {
                            Namespace.errorMessages.typeMismatch(
                                subOptionName,
                                typeof d,
                                'DateTime or Date'
                            );
                        }
                        dateTime.setLocale(locale);
                        valueObject[i][vk] = dateTime;
                    });
                }
                return valueObject;
            case 'toolbarPlacement':
            case 'type':
            case 'viewMode':
                const optionValues = {
                    toolbarPlacement: ['top', 'bottom', 'default'],
                    type: ['icons', 'sprites'],
                    viewMode: ['clock', 'calendar', 'months', 'years', 'decades'],
                };
                const keyOptions = optionValues[key];
                if (!keyOptions.includes(value))
                    Namespace.errorMessages.unexpectedOptionValue(
                        path.substring(1),
                        value,
                        keyOptions
                    );

                return value;
            case 'meta':
            case 'dayViewHeaderFormat':
                return value;
            case 'container':
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
                            path,
                            providedType,
                            defaultType
                        );
                }
        }
    }

    static _mergeOptions(providedOptions: Options, mergeTo: Options): Options {
        const newConfig = OptionConverter.deepCopy(mergeTo);
        //see if the options specify a locale
        const locale =
            mergeTo.localization.locale !== 'default'
                ? mergeTo.localization.locale
                : providedOptions?.localization?.locale || 'default';

        OptionConverter.spread(providedOptions, newConfig, '', locale);

        return newConfig;
    }

    static _dataToOptions(element, options: Options): Options {
        const eData = JSON.parse(JSON.stringify(element.dataset));

        if (eData?.tdTargetInput) delete eData.tdTargetInput;
        if (eData?.tdTargetToggle) delete eData.tdTargetToggle;

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
        if (d.constructor.name === DateTime.name) return d;
        if (d.constructor.name === Date.name) {
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
     * @param locale
     */
    static _typeCheckDateArray(
        optionName: string,
        value,
        providedType: string,
        locale: string = 'default'
    ) {
        if (!Array.isArray(value)) {
            Namespace.errorMessages.typeMismatch(
                optionName,
                providedType,
                'array of DateTime or Date'
            );
        }
        for (let i = 0; i < value.length; i++) {
            let d = value[i];
            const dateTime = this.dateConversion(d, optionName);
            if (!dateTime) {
                Namespace.errorMessages.typeMismatch(
                    optionName,
                    typeof d,
                    'DateTime or Date'
                );
            }
            dateTime.setLocale(locale);
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
    }

    /**
     * Attempts to convert `d` to a DateTime object
     * @param d value to convert
     * @param optionName Provides text to error messages e.g. disabledDates
     */
    static dateConversion(d: any, optionName: string): DateTime {
        if (typeof d === typeof '' && optionName !== 'input') {
            Namespace.errorMessages.dateString();
        }

        const converted = this._dateTypeCheck(d);

        if (!converted) {
            Namespace.errorMessages.failedToParseDate(
                optionName,
                d,
                optionName === 'input'
            );
        }
        return converted;
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
    }
}
