import { DateTime, DateTimeFormatOptions } from '../datetime';
import ViewMode from './view-mode';

export default interface Options {
  allowInputToggle?: boolean;
  container?: HTMLElement;
  dateRange?: boolean;
  debug?: boolean;
  defaultDate?: DateTime;
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
    buttons?: { today?: boolean; close?: boolean; clear?: boolean };
    calendarWeeks?: boolean;
    icons?: {
      clear?: string;
      close?: string;
      date?: string;
      down?: string;
      next?: string;
      previous?: string;
      time?: string;
      today?: string;
      type?: 'icons' | 'sprites';
      up?: string;
    };
    viewMode?: keyof ViewMode;
    sideBySide?: boolean;
    inline?: boolean;
    keepOpen?: boolean;
    theme?: 'light' | 'dark' | 'auto';
    placement?: 'top' | 'bottom';
  };
  keepInvalid?: boolean;
  localization?: Localization;
  meta?: Record<string, unknown>;
  multipleDates?: boolean;
  multipleDatesSeparator?: string;
  promptTimeOnDateChange?: boolean;
  promptTimeOnDateChangeTransitionDelay?: number;
  restrictions?: {
    minDate?: DateTime;
    maxDate?: DateTime;
    enabledDates?: DateTime[];
    disabledDates?: DateTime[];
    enabledHours?: number[];
    disabledHours?: number[];
    disabledTimeIntervals?: { from: DateTime; to: DateTime }[];
    daysOfWeekDisabled?: number[];
  };
  stepping?: number;
  useCurrent?: boolean;
  viewDate?: DateTime;
}

export interface FormatLocalization {
  dateFormats?: {
    L?: string;
    LL?: string;
    LLL?: string;
    LLLL?: string;
    LT?: string;
    LTS?: string;
  };
  format?: string;
  hourCycle?: Intl.LocaleHourCycleKey;
  locale?: string;
  ordinal?: (n: number) => any; //eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface Localization extends FormatLocalization {
  clear?: string;
  close?: string;
  dayViewHeaderFormat?: DateTimeFormatOptions;
  decrementHour?: string;
  decrementMinute?: string;
  decrementSecond?: string;
  incrementHour?: string;
  incrementMinute?: string;
  incrementSecond?: string;
  nextCentury?: string;
  nextDecade?: string;
  nextMonth?: string;
  nextYear?: string;
  pickHour?: string;
  pickMinute?: string;
  pickSecond?: string;
  previousCentury?: string;
  previousDecade?: string;
  previousMonth?: string;
  previousYear?: string;
  selectDate?: string;
  selectDecade?: string;
  selectMonth?: string;
  selectTime?: string;
  selectYear?: string;
  startOfTheWeek?: number;
  today?: string;
  toggleMeridiem?: string;
}
