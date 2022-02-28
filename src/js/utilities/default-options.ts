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
    enabledHours: []
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
      close: 'fa-solid fa-xmark'
    },
    sideBySide: false,
    calendarWeeks: false,
    viewMode: 'calendar',
    toolbarPlacement: 'bottom',
    keepOpen: false,
    buttons: {
      today: false,
      clear: false,
      close: false
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
      useTwentyfourHour: false
    },
    inline: false
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
    startOfTheWeek: 0
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
  container: undefined
};

export default DefaultOptions;