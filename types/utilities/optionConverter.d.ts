import { DateTime } from '../datetime';
import Options, { FormatLocalization } from './options';
export declare class OptionConverter {
    private static ignoreProperties;
    static deepCopy(input: any): Options;
    private static isValue;
    /**
     * Finds value out of an object based on a string, period delimited, path
     * @param paths
     * @param obj
     */
    static objectPath(paths: string, obj: any): any;
    /**
     * The spread operator caused sub keys to be missing after merging.
     * This is to fix that issue by using spread on the child objects first.
     * Also handles complex options like disabledDates
     * @param provided An option from new providedOptions
     * @param copyTo Destination object. This was added to prevent reference copies
     * @param path
     * @param localization
     */
    static spread(provided: any, copyTo: any, path: string, localization: FormatLocalization): void;
    static processKey(key: any, value: any, providedType: any, defaultType: any, path: any, localization: FormatLocalization): any;
    static _mergeOptions(providedOptions: Options, mergeTo: Options): Options;
    static _dataToOptions(element: any, options: Options): Options;
    /**
     * Attempts to prove `d` is a DateTime or Date or can be converted into one.
     * @param d If a string will attempt creating a date from it.
     * @param localization object containing locale and format settings. Only used with the custom formats
     * @private
     */
    static _dateTypeCheck(d: any, localization: FormatLocalization): DateTime | null;
    /**
     * Type checks that `value` is an array of Date or DateTime
     * @param optionName Provides text to error messages e.g. disabledDates
     * @param value Option value
     * @param providedType Used to provide text to error messages
     * @param localization
     */
    static _typeCheckDateArray(optionName: string, value: any, providedType: string, localization: FormatLocalization): void;
    /**
     * Type checks that `value` is an array of numbers
     * @param optionName Provides text to error messages e.g. disabledDates
     * @param value Option value
     * @param providedType Used to provide text to error messages
     */
    static _typeCheckNumberArray(optionName: string, value: any, providedType: string): void;
    /**
     * Attempts to convert `d` to a DateTime object
     * @param d value to convert
     * @param optionName Provides text to error messages e.g. disabledDates
     * @param localization object containing locale and format settings. Only used with the custom formats
     */
    static dateConversion(d: any, optionName: string, localization: FormatLocalization): DateTime;
    private static _flattenDefaults;
    private static getFlattenDefaultOptions;
    /**
     * Some options conflict like min/max date. Verify that these kinds of options
     * are set correctly.
     * @param config
     */
    static _validateConflicts(config: Options): void;
}
