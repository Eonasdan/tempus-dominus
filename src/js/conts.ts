import { DateTime, Unit } from './datetime';
import Namespace from './namespace';
import Options from './options';

const DefaultOptions: Options = {
  restrictions: {
    minDate: undefined,
    maxDate: undefined,
    disabledDates: [],
    enabledDates: [],
    daysOfWeekDisabled: [],
    disabledTimeIntervals: [],
    disabledHours: [],
    enabledHours: [],
  },
  display: {
    icons: {
      type: 'icons',
      time: 'fas fa-clock',
      date: 'fas fa-calendar',
      up: 'fas fa-arrow-up',
      down: 'fas fa-arrow-down',
      previous: 'fas fa-chevron-left',
      next: 'fas fa-chevron-right',
      today: 'fas fa-calendar-check',
      clear: 'fas fa-trash',
      close: 'fas fa-times',
    },
    collapse: true,
    sideBySide: false,
    calendarWeeks: false,
    viewMode: 'calendar',
    toolbarPlacement: 'default',
    buttons: {
      today: false,
      clear: false,
      close: false,
    },
    components: {
      calendar: true,
      clock: true,
      century: true,
      decades: true,
      year: true,
      month: true,
      date: true,
      hours: true,
      minutes: true,
      seconds: false,
      useTwentyfourHour: false,
    },
    inputFormat: undefined,
    inline: false,
  },
  stepping: 1,
  useCurrent: true,
  defaultDate: false,
  localization: {
    today: 'Go to today',
    clear: 'Clear selection',
    close: 'Close the picker',
    selectMonth: 'Select Month',
    previousMonth: 'Previous Month',
    nextMonth: 'Next Month',
    selectYear: 'Select Year',
    previousYear: 'Previous Year',
    nextYear: 'Next Year',
    selectDecade: 'Select Decade',
    previousDecade: 'Previous Decade',
    nextDecade: 'Next Decade',
    previousCentury: 'Previous Century',
    nextCentury: 'Next Century',
    pickHour: 'Pick Hour',
    incrementHour: 'Increment Hour',
    decrementHour: 'Decrement Hour',
    pickMinute: 'Pick Minute',
    incrementMinute: 'Increment Minute',
    decrementMinute: 'Decrement Minute',
    pickSecond: 'Pick Second',
    incrementSecond: 'Increment Second',
    decrementSecond: 'Decrement Second',
    togglePeriod: 'Toggle Period',
    selectTime: 'Select Time',
    selectDate: 'Select Date',
    dayViewHeaderFormat: 'long',
    locale: 'default',
  },
  readonly: false,
  ignoreReadonly: false,
  keepOpen: false,
  focusOnShow: true,
  keepInvalid: false,
  keyBinds: {
    'control down': () => {
      return false;
    },
    pageDown: () => {
      return false;
    },
    'control up': () => {
      return false;
    },
    right: () => {
      return false;
    },
    pageUp: () => {
      return false;
    },
    down: () => {
      return false;
    },
    delete: () => {
      return false;
    },
    t: () => {
      return false;
    },
    left: () => {
      return false;
    },
    up: () => {
      return false;
    },
    enter: () => {
      return false;
    },
    'control space': () => {
      return false;
    },
    escape: () => {
      return false;
    },
  },
  debug: false,
  allowInputToggle: false,
  viewDate: new DateTime(),
  multipleDates: false,
  multipleDatesSeparator: '; ',
  promptTimeOnDateChange: false,
  promptTimeOnDateChangeTransitionDelay: 200,
};

const DatePickerModes: {
  name: string;
  className: string;
  unit: Unit;
  step: number;
}[] = [
  {
    name: 'calendar',
    className: Namespace.Css.daysContainer,
    unit: Unit.month,
    step: 1,
  },
  {
    name: 'months',
    className: Namespace.Css.monthsContainer,
    unit: Unit.year,
    step: 1,
  },
  {
    name: 'years',
    className: Namespace.Css.yearsContainer,
    unit: Unit.year,
    step: 10,
  },
  {
    name: 'decades',
    className: Namespace.Css.decadesContainer,
    unit: Unit.year,
    step: 100,
  },
];

export { DefaultOptions, DatePickerModes, Namespace };
