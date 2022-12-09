import Options from './options';
import { DateTime } from '../datetime';

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
      time: 'fa-solid fa-clock',
      date: 'fa-solid fa-calendar',
      up: 'fa-solid fa-arrow-up',
      down: 'fa-solid fa-arrow-down',
      previous: 'fa-solid fa-chevron-left',
      next: 'fa-solid fa-chevron-right',
      today: 'fa-solid fa-calendar-check',
      clear: 'fa-solid fa-trash',
      close: 'fa-solid fa-xmark',
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
      useTwentyfourHour: undefined,
    },
    inline: false,
    theme: 'auto',
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
    hourCycle: undefined,
    startOfTheWeek: 0,
    /**
     * This is only used with the customDateFormat plugin
     */
    dateFormats: {
      LTS: 'h:mm:ss T',
      LT: 'h:mm T',
      L: 'MM/dd/yyyy',
      LL: 'MMMM d, yyyy',
      LLL: 'MMMM d, yyyy h:mm T',
      LLLL: 'dddd, MMMM d, yyyy h:mm T',
    },
    /**
     * This is only used with the customDateFormat plugin
     */
    ordinal: (n) => n,
    /**
     * This is only used with the customDateFormat plugin
     */
    format: 'L LT',
  },
  keepInvalid: false,
  debug: false,
  allowInputToggle: false,
  viewDate: new DateTime(),
  multipleDates: false,
  multipleDatesSeparator: '; ',
  promptTimeOnDateChange: false,
  promptTimeOnDateChangeTransitionDelay: 200,
  meta: {},
  container: undefined,
};

export default DefaultOptions;
