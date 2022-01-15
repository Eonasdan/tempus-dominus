import { DateTime, DateTimeFormatOptions } from './datetime';
import { TempusDominus } from './tempus-dominus';
export default interface Options {
    restrictions?: {
        minDate?: DateTime;
        maxDate?: DateTime;
        enabledDates?: DateTime[];
        disabledDates?: DateTime[];
        enabledHours?: number[];
        disabledHours?: number[];
        disabledTimeIntervals?: {
            from: DateTime;
            to: DateTime;
        }[];
        daysOfWeekDisabled?: number[];
    };
    display?: {
        toolbarPlacement?: 'top' | 'bottom';
        components?: {
            calendar?: boolean;
            date?: boolean;
            month?: boolean;
            year?: boolean;
            decades?: boolean;
            clock?: boolean;
            hours?: boolean;
            minutes?: boolean;
            seconds?: boolean;
            useTwentyfourHour?: boolean;
        };
        buttons?: {
            today?: boolean;
            close?: boolean;
            clear?: boolean;
        };
        calendarWeeks?: boolean;
        icons?: {
            date?: string;
            next?: string;
            previous?: string;
            today?: string;
            clear?: string;
            time?: string;
            up?: string;
            type?: 'icons' | 'sprites';
            down?: string;
            close?: string;
        };
        viewMode?: 'clock' | 'calendar' | 'months' | 'years' | 'decades';
        sideBySide?: boolean;
        inline?: boolean;
        keepOpen?: boolean;
    };
    stepping?: number;
    useCurrent?: boolean;
    defaultDate?: DateTime;
    localization?: {
        nextMonth?: string;
        pickHour?: string;
        incrementSecond?: string;
        nextDecade?: string;
        selectDecade?: string;
        dayViewHeaderFormat?: DateTimeFormatOptions;
        decrementHour?: string;
        selectDate?: string;
        incrementHour?: string;
        previousCentury?: string;
        decrementSecond?: string;
        today?: string;
        previousMonth?: string;
        selectYear?: string;
        pickSecond?: string;
        nextCentury?: string;
        close?: string;
        incrementMinute?: string;
        selectTime?: string;
        clear?: string;
        toggleMeridiem?: string;
        selectMonth?: string;
        decrementMinute?: string;
        pickMinute?: string;
        nextYear?: string;
        previousYear?: string;
        previousDecade?: string;
        locale?: string;
        startOfTheWeek?: number;
    };
    keepInvalid?: boolean;
    debug?: boolean;
    allowInputToggle?: boolean;
    viewDate?: DateTime;
    multipleDates?: boolean;
    multipleDatesSeparator?: string;
    promptTimeOnDateChange?: boolean;
    promptTimeOnDateChangeTransitionDelay?: number;
    hooks?: {
        inputParse?: (context: TempusDominus, value: any) => DateTime;
        inputFormat?: (context: TempusDominus, date: DateTime) => string;
    };
    meta?: {};
    container?: HTMLElement;
}
export declare class OptionConverter {
    static _mergeOptions(providedOptions: Options, mergeTo: Options): Options;
    static _dataToOptions(element: any, options: Options): Options;
    /**
     * Attempts to prove `d` is a DateTime or Date or can be converted into one.
     * @param d If a string will attempt creating a date from it.
     * @private
     */
    static _dateTypeCheck(d: any): DateTime | null;
    /**
     * Type checks that `value` is an array of Date or DateTime
     * @param optionName Provides text to error messages e.g. disabledDates
     * @param value Option value
     * @param providedType Used to provide text to error messages
     */
    static _typeCheckDateArray(optionName: string, value: any, providedType: string, locale?: string): void;
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
     */
    static _dateConversion(d: any, optionName: string): DateTime;
    private static _flatback;
    private static get _flattenDefaultOptions();
    /**
     * Some options conflict like min/max date. Verify that these kinds of options
     * are set correctly.
     * @param config
     */
    static _validateConflcits(config: Options): void;
}
