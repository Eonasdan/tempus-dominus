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
    //todo plugin
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
  },
  readonly: false,
  ignoreReadonly: false,
  keepOpen: false,
  focusOnShow: true,
  keepInvalid: false,
  keyBinds: {
    //todo plugin //todo jquery //todo moment
    up: function () {
      if (!this.widget) {
        return false;
      }
      const d = this._dates[0] || this.getMoment();
      if (this.widget.find('.datepicker').is(':visible')) {
        this.date(d.clone().subtract(7, 'd'));
      } else {
        this.date(d.clone().add(this.stepping(), 'm'));
      }
      return true;
    },
    down: function () {
      if (!this.widget) {
        this.show();
        return false;
      }
      const d = this._dates[0] || this.getMoment();
      if (this.widget.find('.datepicker').is(':visible')) {
        this.date(d.clone().add(7, 'd'));
      } else {
        this.date(d.clone().subtract(this.stepping(), 'm'));
      }
      return true;
    },
    'control up': function () {
      if (!this.widget) {
        return false;
      }
      const d = this._dates[0] || this.getMoment();
      if (this.widget.find('.datepicker').is(':visible')) {
        this.date(d.clone().subtract(1, 'y'));
      } else {
        this.date(d.clone().add(1, 'h'));
      }
      return true;
    },
    'control down': function () {
      if (!this.widget) {
        return false;
      }
      const d = this._dates[0] || this.getMoment();
      if (this.widget.find('.datepicker').is(':visible')) {
        this.date(d.clone().add(1, 'y'));
      } else {
        this.date(d.clone().subtract(1, 'h'));
      }
      return true;
    },
    left: function () {
      if (!this.widget) {
        return false;
      }
      const d = this._dates[0] || this.getMoment();
      if (this.widget.find('.datepicker').is(':visible')) {
        this.date(d.clone().subtract(1, 'd'));
      }
      return true;
    },
    right: function () {
      if (!this.widget) {
        return false;
      }
      const d = this._dates[0] || this.getMoment();
      if (this.widget.find('.datepicker').is(':visible')) {
        this.date(d.clone().add(1, 'd'));
      }
      return true;
    },
    pageUp: function () {
      if (!this.widget) {
        return false;
      }
      const d = this._dates[0] || this.getMoment();
      if (this.widget.find('.datepicker').is(':visible')) {
        this.date(d.clone().subtract(1, 'M'));
      }
      return true;
    },
    pageDown: function () {
      if (!this.widget) {
        return false;
      }
      const d = this._dates[0] || this.getMoment();
      if (this.widget.find('.datepicker').is(':visible')) {
        this.date(d.clone().add(1, 'M'));
      }
      return true;
    },
    enter: function () {
      if (!this.widget) {
        return false;
      }
      this.hide();
      return true;
    },
    escape: function () {
      if (!this.widget) {
        return false;
      }
      this.hide();
      return true;
    },
    'control space': function () {
      if (!this.widget) {
        return false;
      }
      if (this.widget.find('.timepicker').is(':visible')) {
        this.widget.find('.btn[data-action="togglePeriod"]').click();
      }
      return true;
    },
    t: function () {
      if (!this.widget) {
        return false;
      }
      this.date(this.getMoment());
      return true;
    },
    delete: function () {
      if (!this.widget) {
        return false;
      }
      this.clear();
      return true;
    },
  },
  debug: false,
  allowInputToggle: false,
  viewDate: new DateTime(),
  allowMultidate: false,
  multidateSeparator: '; ',
  promptTimeOnDateChange: false,
  promptTimeOnDateChangeTransitionDelay: 200,
};

const DatePickerModes = [
  {
    CLASS_NAME: Namespace.Css.daysContainer,
    NAV_FUNCTION: Unit.month,
    NAV_STEP: 1,
  },
  {
    CLASS_NAME: Namespace.Css.monthsContainer,
    NAV_FUNCTION: Unit.year,
    NAV_STEP: 1,
  },
  {
    CLASS_NAME: Namespace.Css.yearsContainer,
    NAV_FUNCTION: Unit.year,
    NAV_STEP: 10,
  },
  {
    CLASS_NAME: Namespace.Css.decadesContainer,
    NAV_FUNCTION: Unit.year,
    NAV_STEP: 100,
  },
];

export { DefaultOptions, DatePickerModes, Namespace };
