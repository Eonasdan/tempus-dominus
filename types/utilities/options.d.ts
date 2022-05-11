import { DateTime, DateTimeFormatOptions } from '../datetime';
import ViewMode from './view-mode';
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
        viewMode?: keyof ViewMode;
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
    meta?: {};
    container?: HTMLElement;
}
