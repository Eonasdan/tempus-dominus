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
    sideBySide: false,
    calendarWeeks: false,
    viewMode: 'calendar',
    toolbarPlacement: 'bottom',
    keepOpen: false,
    buttons: {
      today: false,
      clear: false,
      close: false,
    },
    components: {
      calendar: true,
      date: true,
      month: true,
      year: true,
      decades: true,
      clock: true,
      hours: true,
      minutes: true,
      seconds: false,
      useTwentyfourHour: false,
    },
    inline: false,
  },
  stepping: 1,
  useCurrent: true,
  defaultDate: undefined,
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
    toggleMeridiem: 'Toggle Meridiem',
    selectTime: 'Select Time',
    selectDate: 'Select Date',
    dayViewHeaderFormat: { month: 'long', year: '2-digit' },
    locale: 'default',
    startOfTheWeek: 0,
  },
  keepInvalid: false,
  debug: false,
  allowInputToggle: false,
  viewDate: new DateTime(),
  multipleDates: false,
  multipleDatesSeparator: '; ',
  promptTimeOnDateChange: false,
  promptTimeOnDateChangeTransitionDelay: 200,
  hooks: {
    inputParse: undefined,
    inputFormat: undefined,
  },
  meta: {},
  container: undefined
};

const DatePickerModes: {
  name: string;
  className: string;
  unit: Unit;
  step: number;
}[] = [
  {
    name: 'calendar',
    className: Namespace.css.daysContainer,
    unit: Unit.month,
    step: 1,
  },
  {
    name: 'months',
    className: Namespace.css.monthsContainer,
    unit: Unit.year,
    step: 1,
  },
  {
    name: 'years',
    className: Namespace.css.yearsContainer,
    unit: Unit.year,
    step: 10,
  },
  {
    name: 'decades',
    className: Namespace.css.decadesContainer,
    unit: Unit.year,
    step: 100,
  },
];

export { DefaultOptions, DatePickerModes, Namespace };
