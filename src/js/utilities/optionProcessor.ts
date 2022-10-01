import Namespace from "./namespace";
import type { OptionConverter } from "./optionConverter";
import type { FormatLocalization } from "./options";

interface OptionProcessorFunctionArguments {
    key: string,
    value: any,
    providedType: string,
    defaultType: string,
    path: string,
    localization: FormatLocalization;
}

type OptionProcessorFunction = (
    this: void,
    converter: typeof OptionConverter,
    args: OptionProcessorFunctionArguments
) => any;

function mandatoryDate(key: string): OptionProcessorFunction {
    return (converter, { value, providedType, localization }) => {
        const dateTime = converter.dateConversion(value, key, localization);
        if (dateTime !== undefined) {
            dateTime.setLocale(localization.locale);
            return dateTime;
        }
        Namespace.errorMessages.typeMismatch(
            key,
            providedType,
            'DateTime or Date'
        );
    };
}

function optionalDate(key: string): OptionProcessorFunction {
    const mandatory = mandatoryDate(key);
    return (converter, args) => {
        if (args.value === undefined) {
            return args.value;
        }
        return mandatory(converter, args);
    };
}

function numbersInRange(key: string, lower: number, upper: number): OptionProcessorFunction {
    return (converter, { value, providedType }) => {
        if (value === undefined) {
            return [];
        }
        converter._typeCheckNumberArray(
            key,
            value,
            providedType
        );
        if ((value as number[]).some(x => x < lower || x > upper))
            Namespace.errorMessages.numbersOutOfRange(
                key,
                lower,
                upper
            );
        return value;
    };
}

function validHourRange(key: string): OptionProcessorFunction {
    return numbersInRange(key, 0, 23);
}

function validDateArray(key: string): OptionProcessorFunction {
    return (_, { value, providedType, localization }) => {
        if (value === undefined) {
            return [];
        }
        this._typeCheckDateArray(
            key,
            value,
            providedType,
            localization
        );
        return value;
    };
}

function validKeyOption(keyOptions: string[]): OptionProcessorFunction {
    return (_, { value, path }) => {
        if (!keyOptions.includes(value))
            Namespace.errorMessages.unexpectedOptionValue(
                path.substring(1),
                value,
                keyOptions
            );
        return value;
    };
}

const optionProcessors: { [key: string]: OptionProcessorFunction; } = Object.freeze({
    'defaultDate': mandatoryDate('defaultDate'),
    'viewDate': mandatoryDate('viewDate'),
    'minDate': optionalDate('restrictions.minDate'),
    'maxDate': optionalDate('restrictions.maxDate'),
    'disabledHours': validHourRange('restrictions.disabledHours'),
    'enabledHours': validHourRange('restrictions.enabledHours'),
    'disabledDates': validDateArray('restrictions.disabledDates'),
    'enabledDates': validDateArray('restrictions.enabledDates'),
    'daysOfWeekDisabled': numbersInRange('restrictions.daysOfWeekDisabled', 0, 6),
    'disabledTimeIntervals': (converter, { key, value, providedType, localization }) => {
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
        const valueObject = value as { from: any; to: any; }[];
        for (let i = 0; i < valueObject.length; i++) {
            Object.keys(valueObject[i]).forEach((vk) => {
                const subOptionName = `${key}[${i}].${vk}`;
                const d = valueObject[i][vk];
                const dateTime = converter.dateConversion(d, subOptionName, localization);
                if (!dateTime) {
                    Namespace.errorMessages.typeMismatch(
                        subOptionName,
                        typeof d,
                        'DateTime or Date'
                    );
                }
                dateTime.setLocale(localization.locale);
                valueObject[i][vk] = dateTime;
            });
        }
        return valueObject;
    },
    'toolbarPlacement': validKeyOption(['top', 'bottom', 'default']),
    'type': validKeyOption(['icons', 'sprites']),
    'viewMode': validKeyOption(['clock', 'calendar', 'months', 'years', 'decades']),
    'theme': validKeyOption(['light', 'dark', 'auto']),
    'meta': (_, { value }) => value,
    'dayViewHeaderFormat': (_, { value }) => value,
    'container': (_, { value, path }) => {
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
    'useTwentyfourHour': (_, { value, path, providedType, defaultType }) => {
        if (value === undefined || providedType === 'boolean') return value;
        Namespace.errorMessages.typeMismatch(
            path,
            providedType,
            defaultType
        );
    }
});

const defaultProcessor: OptionProcessorFunction = (_, { value, defaultType, providedType, path }) => {
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
};

export function processKey(converter: typeof OptionConverter, args: OptionProcessorFunctionArguments) {
    return (optionProcessors[args.key] || defaultProcessor)(converter, args);
};