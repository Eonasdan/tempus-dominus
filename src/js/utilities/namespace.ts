import { ErrorMessages } from './errors';
// this is not the way I want this to stay but nested classes seemed to blown up once its compiled.
const NAME = 'tempus-dominus',
  dataKey = 'td';

/**
 * Events
 */
class Events {
  key = `.${dataKey}`;

  /**
   * Change event. Fired when the user selects a date.
   * See also EventTypes.ChangeEvent
   */
  change = `change${this.key}`;

  /**
   * Emit when the view changes for example from month view to the year view.
   * See also EventTypes.ViewUpdateEvent
   */
  update = `update${this.key}`;

  /**
   * Emits when a selected date or value from the input field fails to meet the provided validation rules.
   * See also EventTypes.FailEvent
   */
  error = `error${this.key}`;

  /**
   * Show event
   * @event Events#show
   */
  show = `show${this.key}`;

  /**
   * Hide event
   * @event Events#hide
   */
  hide = `hide${this.key}`;

  // blur and focus are used in the jQuery provider but are otherwise unused.
  // keyup/down will be used later for keybinding options

  blur = `blur${this.key}`;
  focus = `focus${this.key}`;
  keyup = `keyup${this.key}`;
  keydown = `keydown${this.key}`;
}

class Css {
  /**
   * The outer element for the widget.
   */
  widget = `${NAME}-widget`;

  /**
   * Hold the previous, next and switcher divs
   */
  calendarHeader = 'calendar-header';

  /**
   * The element for the action to change the calendar view. E.g. month -> year.
   */
  switch = 'picker-switch';

  /**
   * The elements for all the toolbar options
   */
  toolbar = 'toolbar';

  /**
   * Disables the hover and rounding affect.
   */
  noHighlight = 'no-highlight';

  /**
   * Applied to the widget element when the side by side option is in use.
   */
  sideBySide = 'timepicker-sbs';

  /**
   * The element for the action to change the calendar view, e.g. August -> July
   */
  previous = 'previous';

  /**
   * The element for the action to change the calendar view, e.g. August -> September
   */
  next = 'next';

  /**
   * Applied to any action that would violate any restriction options. ALso applied
   * to an input field if the disabled function is called.
   */
  disabled = 'disabled';

  /**
   * Applied to any date that is less than requested view,
   * e.g. the last day of the previous month.
   */
  old = 'old';

  /**
   * Applied to any date that is greater than of requested view,
   * e.g. the last day of the previous month.
   */
  new = 'new';

  /**
   * Applied to any date that is currently selected.
   */
  active = 'active';

  //#region date element

  /**
   * The outer element for the calendar view.
   */
  dateContainer = 'date-container';

  /**
   * The outer element for the decades view.
   */
  decadesContainer = `${this.dateContainer}-decades`;

  /**
   * Applied to elements within the decade container, e.g. 2020, 2030
   */
  decade = 'decade';

  /**
   * The outer element for the years view.
   */
  yearsContainer = `${this.dateContainer}-years`;

  /**
   * Applied to elements within the years container, e.g. 2021, 2021
   */
  year = 'year';

  /**
   * The outer element for the month view.
   */
  monthsContainer = `${this.dateContainer}-months`;

  /**
   * Applied to elements within the month container, e.g. January, February
   */
  month = 'month';

  /**
   * The outer element for the calendar view.
   */
  daysContainer = `${this.dateContainer}-days`;

  /**
   * Applied to elements within the day container, e.g. 1, 2..31
   */
  day = 'day';

  /**
   * If display.calendarWeeks is enabled, a column displaying the week of year
   * is shown. This class is applied to each cell in that column.
   */
  calendarWeeks = 'cw';

  /**
   * Applied to the first row of the calendar view, e.g. Sunday, Monday
   */
  dayOfTheWeek = 'dow';

  /**
   * Applied to the current date on the calendar view.
   */
  today = 'today';

  /**
   * Applied to the locale's weekend dates on the calendar view, e.g. Sunday, Saturday
   */
  weekend = 'weekend';

  rangeIn = 'range-in';
  rangeStart = 'range-start';
  rangeEnd = 'range-end';

  //#endregion

  //#region time element

  /**
   * The outer element for all time related elements.
   */
  timeContainer = 'time-container';

  /**
   * Applied the separator columns between time elements, e.g. hour *:* minute *:* second
   */
  separator = 'separator';

  /**
   * The outer element for the clock view.
   */
  clockContainer = `${this.timeContainer}-clock`;

  /**
   * The outer element for the hours selection view.
   */
  hourContainer = `${this.timeContainer}-hour`;

  /**
   * The outer element for the minutes selection view.
   */
  minuteContainer = `${this.timeContainer}-minute`;

  /**
   * The outer element for the seconds selection view.
   */
  secondContainer = `${this.timeContainer}-second`;

  /**
   * Applied to each element in the hours selection view.
   */
  hour = 'hour';

  /**
   * Applied to each element in the minutes selection view.
   */
  minute = 'minute';

  /**
   * Applied to each element in the seconds selection view.
   */
  second = 'second';

  /**
   * Applied AM/PM toggle button.
   */
  toggleMeridiem = 'toggleMeridiem';

  //#endregion

  //#region collapse

  /**
   * Applied the element of the current view mode, e.g. calendar or clock.
   */
  show = 'show';

  /**
   * Applied to the currently showing view mode during a transition
   * between calendar and clock views
   */
  collapsing = 'td-collapsing';

  /**
   * Applied to the currently hidden view mode.
   */
  collapse = 'td-collapse';

  //#endregion

  /**
   * Applied to the widget when the option display.inline is enabled.
   */
  inline = 'inline';

  /**
   * Applied to the widget when the option display.theme is light.
   */
  lightTheme = 'light';

  /**
   * Applied to the widget when the option display.theme is dark.
   */
  darkTheme = 'dark';

  /**
   * Used for detecting if the system color preference is dark mode
   */
  isDarkPreferredQuery = '(prefers-color-scheme: dark)';
}

export default class Namespace {
  static NAME = NAME;
  // noinspection JSUnusedGlobalSymbols
  static dataKey = dataKey;

  static events = new Events();

  static css = new Css();

  static errorMessages = new ErrorMessages();
}
