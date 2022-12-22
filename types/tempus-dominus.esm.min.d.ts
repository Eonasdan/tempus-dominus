/**
 * Creates and updates the grid for `date`
 */
declare class DateDisplay {
  private optionsStore;
  private dates;
  private validation;
  constructor();
  /**
   * Build the container html for the display
   * @private
   */
  getPicker(): HTMLElement;
  /**
   * Populates the grid and updates enabled states
   * @private
   */
  _update(widget: HTMLElement, paint: Paint): void;
  /***
   * Generates an html row that contains the days of the week.
   * @private
   */
  private _daysOfTheWeek;
}
/**
 * Creates and updates the grid for `month`
 */
declare class MonthDisplay {
  private optionsStore;
  private dates;
  private validation;
  constructor();
  /**
   * Build the container html for the display
   * @private
   */
  getPicker(): HTMLElement;
  /**
   * Populates the grid and updates enabled states
   * @private
   */
  _update(widget: HTMLElement, paint: Paint): void;
}
/**
 * Creates and updates the grid for `year`
 */
declare class YearDisplay {
  private _startYear;
  private _endYear;
  private optionsStore;
  private dates;
  private validation;
  constructor();
  /**
   * Build the container html for the display
   * @private
   */
  getPicker(): HTMLElement;
  /**
   * Populates the grid and updates enabled states
   * @private
   */
  _update(widget: HTMLElement, paint: Paint): void;
}
/**
 * Creates and updates the grid for `seconds`
 */
declare class DecadeDisplay {
  private _startDecade;
  private _endDecade;
  private optionsStore;
  private dates;
  private validation;
  constructor();
  /**
   * Build the container html for the display
   * @private
   */
  getPicker(): HTMLDivElement;
  /**
   * Populates the grid and updates enabled states
   * @private
   */
  _update(widget: HTMLElement, paint: Paint): void;
}
/**
 * Creates the clock display
 */
declare class TimeDisplay {
  private _gridColumns;
  private optionsStore;
  private validation;
  private dates;
  constructor();
  /**
   * Build the container html for the clock display
   * @private
   */
  getPicker(iconTag: (iconClass: string) => HTMLElement): HTMLElement;
  /**
   * Populates the various elements with in the clock display
   * like the current hour and if the manipulation icons are enabled.
   * @private
   */
  _update(widget: HTMLElement): void;
  /**
   * Creates the table for the clock display depending on what options are selected.
   * @private
   */
  private _grid;
}
/**
 * Creates and updates the grid for `hours`
 */
declare class HourDisplay {
  private optionsStore;
  private validation;
  constructor();
  /**
   * Build the container html for the display
   * @private
   */
  getPicker(): HTMLElement;
  /**
   * Populates the grid and updates enabled states
   * @private
   */
  _update(widget: HTMLElement, paint: Paint): void;
}
/**
 * Creates and updates the grid for `minutes`
 */
declare class MinuteDisplay {
  private optionsStore;
  private validation;
  constructor();
  /**
   * Build the container html for the display
   * @private
   */
  getPicker(): HTMLElement;
  /**
   * Populates the grid and updates enabled states
   * @private
   */
  _update(widget: HTMLElement, paint: Paint): void;
}
/**
 * Creates and updates the grid for `seconds`
 */
declare class secondDisplay {
  private optionsStore;
  private validation;
  constructor();
  /**
   * Build the container html for the display
   * @private
   */
  getPicker(): HTMLElement;
  /**
   * Populates the grid and updates enabled states
   * @private
   */
  _update(widget: HTMLElement, paint: Paint): void;
}
declare module secondDisplayWrapper {
  export { secondDisplay };
}
import SecondDisplay = secondDisplayWrapper.secondDisplay;
type ViewMode = {
  clock: any;
  calendar: any;
  months: any;
  years: any;
  decades: any;
};
interface Options {
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
    theme?: 'light' | 'dark' | 'auto';
  };
  stepping?: number;
  useCurrent?: boolean;
  defaultDate?: DateTime;
  localization?: Localization;
  keepInvalid?: boolean;
  debug?: boolean;
  allowInputToggle?: boolean;
  viewDate?: DateTime;
  multipleDates?: boolean;
  multipleDatesSeparator?: string;
  promptTimeOnDateChange?: boolean;
  promptTimeOnDateChangeTransitionDelay?: number;
  meta?: Record<string, unknown>;
  container?: HTMLElement;
}
interface FormatLocalization {
  locale?: string;
  dateFormats?: {
    LTS?: string;
    LT?: string;
    L?: string;
    LL?: string;
    LLL?: string;
    LLLL?: string;
  };
  ordinal?: (n: number) => any; //eslint-disable-line @typescript-eslint/no-explicit-any
  format?: string;
  hourCycle?: Intl.LocaleHourCycleKey;
}
interface Localization extends FormatLocalization {
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
  startOfTheWeek?: number;
}
declare enum Unit {
  seconds = 'seconds',
  minutes = 'minutes',
  hours = 'hours',
  date = 'date',
  month = 'month',
  year = 'year',
}
interface DateTimeFormatOptions extends Intl.DateTimeFormatOptions {
  timeStyle?: 'short' | 'medium' | 'long';
  dateStyle?: 'short' | 'medium' | 'long' | 'full';
  numberingSystem?: string;
}
/**
 * For the most part this object behaves exactly the same way
 * as the native Date object with a little extra spice.
 */
declare class DateTime extends Date {
  /**
   * Used with Intl.DateTimeFormat
   */
  locale: string;
  /**
   * Chainable way to set the {@link locale}
   * @param value
   */
  setLocale(value: string): this;
  /**
   * Converts a plain JS date object to a DateTime object.
   * Doing this allows access to format, etc.
   * @param  date
   * @param locale
   */
  static convert(date: Date, locale?: string): DateTime;
  /**
   * Attempts to create a DateTime from a string. A customDateFormat is required for non US dates.
   * @param input
   * @param localization
   */
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  static fromString(input: string, localization: FormatLocalization): DateTime;
  /**
   * Native date manipulations are not pure functions. This function creates a duplicate of the DateTime object.
   */
  get clone(): DateTime;
  /**
   * Sets the current date to the start of the {@link unit} provided
   * Example: Consider a date of "April 30, 2021, 11:45:32.984 AM" => new DateTime(2021, 3, 30, 11, 45, 32, 984).startOf('month')
   * would return April 1, 2021, 12:00:00.000 AM (midnight)
   * @param unit
   * @param startOfTheWeek Allows for the changing the start of the week.
   */
  startOf(unit: Unit | 'weekDay', startOfTheWeek?: number): this;
  /**
   * Sets the current date to the end of the {@link unit} provided
   * Example: Consider a date of "April 30, 2021, 11:45:32.984 AM" => new DateTime(2021, 3, 30, 11, 45, 32, 984).endOf('month')
   * would return April 30, 2021, 11:59:59.999 PM
   * @param unit
   * @param startOfTheWeek
   */
  endOf(unit: Unit | 'weekDay', startOfTheWeek?: number): this;
  /**
   * Change a {@link unit} value. Value can be positive or negative
   * Example: Consider a date of "April 30, 2021, 11:45:32.984 AM" => new DateTime(2021, 3, 30, 11, 45, 32, 984).manipulate(1, 'month')
   * would return May 30, 2021, 11:45:32.984 AM
   * @param value A positive or negative number
   * @param unit
   */
  manipulate(value: number, unit: Unit): this;
  /**
   * Returns a string format.
   * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
   * for valid templates and locale objects
   * @param template An object. Uses browser defaults otherwise.
   * @param locale Can be a string or an array of strings. Uses browser defaults otherwise.
   */
  format(template: DateTimeFormatOptions, locale?: string): string;
  /**
   * Return true if {@link compare} is before this date
   * @param compare The Date/DateTime to compare
   * @param unit If provided, uses {@link startOf} for
   * comparision.
   */
  isBefore(compare: DateTime, unit?: Unit): boolean;
  /**
   * Return true if {@link compare} is after this date
   * @param compare The Date/DateTime to compare
   * @param unit If provided, uses {@link startOf} for
   * comparision.
   */
  isAfter(compare: DateTime, unit?: Unit): boolean;
  /**
   * Return true if {@link compare} is same this date
   * @param compare The Date/DateTime to compare
   * @param unit If provided, uses {@link startOf} for
   * comparision.
   */
  isSame(compare: DateTime, unit?: Unit): boolean;
  /**
   * Check if this is between two other DateTimes, optionally looking at unit scale. The match is exclusive.
   * @param left
   * @param right
   * @param unit.
   * @param inclusivity. A [ indicates inclusion of a value. A ( indicates exclusion.
   * If the inclusivity parameter is used, both indicators must be passed.
   */
  isBetween(
    left: DateTime,
    right: DateTime,
    unit?: Unit,
    inclusivity?: '()' | '[]' | '(]' | '[)'
  ): boolean;
  /**
   * Returns flattened object of the date. Does not include literals
   * @param locale
   * @param template
   */
  parts(
    locale?: string,
    template?: Record<string, unknown>
  ): Record<string, string>;
  /**
   * Shortcut to Date.getSeconds()
   */
  get seconds(): number;
  /**
   * Shortcut to Date.setSeconds()
   */
  set seconds(value: number);
  /**
   * Returns two digit hours
   */
  get secondsFormatted(): string;
  /**
   * Shortcut to Date.getMinutes()
   */
  get minutes(): number;
  /**
   * Shortcut to Date.setMinutes()
   */
  set minutes(value: number);
  /**
   * Returns two digit minutes
   */
  get minutesFormatted(): string;
  /**
   * Shortcut to Date.getHours()
   */
  get hours(): number;
  /**
   * Shortcut to Date.setHours()
   */
  set hours(value: number);
  getHoursFormatted(hourCycle?: Intl.LocaleHourCycleKey): string;
  /**
   * Get the meridiem of the date. E.g. AM or PM.
   * If the {@link locale} provides a "dayPeriod" then this will be returned,
   * otherwise it will return AM or PM.
   * @param locale
   */
  meridiem(locale?: string): string;
  /**
   * Shortcut to Date.getDate()
   */
  get date(): number;
  /**
   * Shortcut to Date.setDate()
   */
  set date(value: number);
  /**
   * Return two digit date
   */
  get dateFormatted(): string;
  /**
   * Shortcut to Date.getDay()
   */
  get weekDay(): number;
  /**
   * Shortcut to Date.getMonth()
   */
  get month(): number;
  /**
   * Shortcut to Date.setMonth()
   */
  set month(value: number);
  /**
   * Return two digit, human expected month. E.g. January = 1, December = 12
   */
  get monthFormatted(): string;
  /**
   * Shortcut to Date.getFullYear()
   */
  get year(): number;
  /**
   * Shortcut to Date.setFullYear()
   */
  set year(value: number);
  // borrowed a bunch of stuff from Luxon
  /**
   * Gets the week of the year
   */
  get week(): number;
  weeksInWeekYear(weekYear: any): 53 | 52;
  get isLeapYear(): boolean;
  private computeOrdinal;
  private nonLeapLadder;
  private leapLadder;
}
type ViewUpdateValues = Unit | 'clock' | 'calendar' | 'all';
/**
 * Main class for all things display related.
 */
declare class Display {
  private _widget;
  private _popperInstance; // eslint-disable-line  @typescript-eslint/no-explicit-any
  private _isVisible;
  private optionsStore;
  private validation;
  private dates;
  dateDisplay: DateDisplay;
  monthDisplay: MonthDisplay;
  yearDisplay: YearDisplay;
  decadeDisplay: DecadeDisplay;
  timeDisplay: TimeDisplay;
  hourDisplay: HourDisplay;
  minuteDisplay: MinuteDisplay;
  secondDisplay: SecondDisplay;
  private _eventEmitters;
  constructor();
  /**
   * Returns the widget body or undefined
   * @private
   */
  get widget(): HTMLElement | undefined;
  /**
   * Returns this visible state of the picker (shown)
   */
  get isVisible(): boolean;
  /**
   * Updates the table for a particular unit. Used when an option as changed or
   * whenever the class list might need to be refreshed.
   * @param unit
   * @private
   */
  _update(unit: ViewUpdateValues): void;
  // noinspection JSUnusedLocalSymbols
  /**
   * Allows developers to add/remove classes from an element.
   * @param _unit
   * @param _date
   * @param _classes
   * @param _element
   */
  /* eslint-disable @typescript-eslint/no-unused-vars */
  paint(
    _unit: Unit | 'decade',
    _date: DateTime,
    _classes: string[],
    _element: HTMLElement
  ): void;
  /* eslint-enable @typescript-eslint/no-unused-vars */
  /**
   * Shows the picker and creates a Popper instance if needed.
   * Add document click event to hide when clicking outside the picker.
   * fires Events#show
   */
  show(): void;
  createPopup(
    element: HTMLElement,
    widget: HTMLElement,
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    options: any
  ): Promise<void>;
  updatePopup(): void;
  /**
   * Changes the calendar view mode. E.g. month <-> year
   * @param direction -/+ number to move currentViewMode
   * @private
   */
  _showMode(direction?: number): void;
  /**
   * Changes the theme. E.g. light, dark or auto
   * @param theme the theme name
   * @private
   */
  _updateTheme(theme?: 'light' | 'dark' | 'auto'): void;
  _getThemeClass(): string;
  _updateCalendarHeader(): void;
  /**
   * Hides the picker if needed.
   * Remove document click event to hide when clicking outside the picker.
   * fires Events#hide
   */
  hide(): void;
  /**
   * Toggles the picker's open state. Fires a show/hide event depending.
   */
  toggle(): void;
  /**
   * Removes document and data-action click listener and reset the widget
   * @private
   */
  _dispose(): void;
  /**
   * Builds the widgets html template.
   * @private
   */
  private _buildWidget;
  /**
   * Returns true if the hours, minutes, or seconds component is turned on
   */
  get _hasTime(): boolean;
  /**
   * Returns true if the year, month, or date component is turned on
   */
  get _hasDate(): boolean;
  /**
   * Get the toolbar html based on options like buttons.today
   * @private
   */
  getToolbarElements(): HTMLElement[];
  /***
   * Builds the base header template with next and previous icons
   * @private
   */
  getHeadTemplate(): HTMLElement;
  /**
   * Builds an icon tag as either an `<i>`
   * or with icons.type is `sprites` then a svg tag instead
   * @param iconClass
   * @private
   */
  _iconTag(iconClass: string): HTMLElement | SVGElement;
  /**
   * A document click event to hide the widget if click is outside
   * @private
   * @param e MouseEvent
   */
  private _documentClickEvent;
  /**
   * Click event for any action like selecting a date
   * @param e MouseEvent
   * @private
   */
  private _actionsClickEvent;
  /**
   * Causes the widget to get rebuilt on next show. If the picker is already open
   * then hide and reshow it.
   * @private
   */
  _rebuild(): void;
}
type Paint = (
  unit: Unit | 'decade',
  innerDate: DateTime,
  classes: string[],
  element: HTMLElement
) => void;
declare class Dates {
  private _dates;
  private optionsStore;
  private validation;
  private _eventEmitters;
  constructor();
  /**
   * Returns the array of selected dates
   */
  get picked(): DateTime[];
  /**
   * Returns the last picked value.
   */
  get lastPicked(): DateTime;
  /**
   * Returns the length of picked dates -1 or 0 if none are selected.
   */
  get lastPickedIndex(): number;
  /**
   * Formats a DateTime object to a string. Used when setting the input value.
   * @param date
   */
  formatInput(date: DateTime): string;
  /**
   * parse the value into a DateTime object.
   * this can be overwritten to supply your own parsing.
   */
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  parseInput(value: any): DateTime;
  /**
   * Tries to convert the provided value to a DateTime object.
   * If value is null|undefined then clear the value of the provided index (or 0).
   * @param value Value to convert or null|undefined
   * @param index When using multidates this is the index in the array
   */
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  setFromInput(value: any, index?: number): void;
  /**
   * Adds a new DateTime to selected dates array
   * @param date
   */
  add(date: DateTime): void;
  /**
   * Returns true if the `targetDate` is part of the selected dates array.
   * If `unit` is provided then a granularity to that unit will be used.
   * @param targetDate
   * @param unit
   */
  isPicked(targetDate: DateTime, unit?: Unit): boolean;
  /**
   * Returns the index at which `targetDate` is in the array.
   * This is used for updating or removing a date when multi-date is used
   * If `unit` is provided then a granularity to that unit will be used.
   * @param targetDate
   * @param unit
   */
  pickedIndex(targetDate: DateTime, unit?: Unit): number;
  /**
   * Clears all selected dates.
   */
  clear(): void;
  /**
   * Find the "book end" years given a `year` and a `factor`
   * @param factor e.g. 100 for decades
   * @param year e.g. 2021
   */
  static getStartEndYear(
    factor: number,
    year: number
  ): [number, number, number];
  updateInput(target?: DateTime): void;
  /**
   * Attempts to either clear or set the `target` date at `index`.
   * If the `target` is null then the date will be cleared.
   * If multi-date is being used then it will be removed from the array.
   * If `target` is valid and multi-date is used then if `index` is
   * provided the date at that index will be replaced, otherwise it is appended.
   * @param target
   * @param index
   */
  setValue(target?: DateTime, index?: number): void;
}
declare class ErrorMessages {
  private base;
  //#region out to console
  /**
   * Throws an error indicating that a key in the options object is invalid.
   * @param optionName
   */
  unexpectedOption(optionName: string): void;
  /**
   * Throws an error indicating that one more keys in the options object is invalid.
   * @param optionName
   */
  unexpectedOptions(optionName: string[]): void;
  /**
   * Throws an error when an option is provide an unsupported value.
   * For example a value of 'cheese' for toolbarPlacement which only supports
   * 'top', 'bottom', 'default'.
   * @param optionName
   * @param badValue
   * @param validOptions
   */
  unexpectedOptionValue(
    optionName: string,
    badValue: string,
    validOptions: string[]
  ): void;
  /**
   * Throws an error when an option value is the wrong type.
   * For example a string value was provided to multipleDates which only
   * supports true or false.
   * @param optionName
   * @param badType
   * @param expectedType
   */
  typeMismatch(optionName: string, badType: string, expectedType: string): void;
  /**
   * Throws an error when an option value is  outside of the expected range.
   * For example restrictions.daysOfWeekDisabled excepts a value between 0 and 6.
   * @param optionName
   * @param lower
   * @param upper
   */
  numbersOutOfRange(optionName: string, lower: number, upper: number): void;
  /**
   * Throws an error when a value for a date options couldn't be parsed. Either
   * the option was an invalid string or an invalid Date object.
   * @param optionName
   * @param date
   * @param soft If true, logs a warning instead of an error.
   */
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  failedToParseDate(optionName: string, date: any, soft?: boolean): void;
  /**
   * Throws when an element to attach to was not provided in the constructor.
   */
  mustProvideElement(): void;
  /**
   * Throws if providing an array for the events to subscribe method doesn't have
   * the same number of callbacks. E.g., subscribe([1,2], [1])
   */
  subscribeMismatch(): void;
  /**
   * Throws if the configuration has conflicting rules e.g. minDate is after maxDate
   */
  conflictingConfiguration(message?: string): void;
  /**
   * customDateFormat errors
   */
  customDateFormatError(message?: string): void;
  /**
   * Logs a warning if a date option value is provided as a string, instead of
   * a date/datetime object.
   */
  dateString(): void;
  deprecatedWarning(message: string, remediation?: string): void;
  throwError(message: any): void;
  //#endregion
  //#region used with notify.error
  /**
   * Used with an Error Event type if the user selects a date that
   * fails restriction validation.
   */
  failedToSetInvalidDate: string;
  /**
   * Used with an Error Event type when a user changes the value of the
   * input field directly, and does not provide a valid date.
   */
  failedToParseInput: string;
}
/**
 * Events
 */
declare class Events {
  key: string;
  /**
   * Change event. Fired when the user selects a date.
   * See also EventTypes.ChangeEvent
   */
  change: string;
  /**
   * Emit when the view changes for example from month view to the year view.
   * See also EventTypes.ViewUpdateEvent
   */
  update: string;
  /**
   * Emits when a selected date or value from the input field fails to meet the provided validation rules.
   * See also EventTypes.FailEvent
   */
  error: string;
  /**
   * Show event
   * @event Events#show
   */
  show: string;
  /**
   * Hide event
   * @event Events#hide
   */
  hide: string;
  // blur and focus are used in the jQuery provider but are otherwise unused.
  // keyup/down will be used later for keybinding options
  blur: string;
  focus: string;
  keyup: string;
  keydown: string;
}
declare class Css {
  /**
   * The outer element for the widget.
   */
  widget: string;
  /**
   * Hold the previous, next and switcher divs
   */
  calendarHeader: string;
  /**
   * The element for the action to change the calendar view. E.g. month -> year.
   */
  switch: string;
  /**
   * The elements for all the toolbar options
   */
  toolbar: string;
  /**
   * Disables the hover and rounding affect.
   */
  noHighlight: string;
  /**
   * Applied to the widget element when the side by side option is in use.
   */
  sideBySide: string;
  /**
   * The element for the action to change the calendar view, e.g. August -> July
   */
  previous: string;
  /**
   * The element for the action to change the calendar view, e.g. August -> September
   */
  next: string;
  /**
   * Applied to any action that would violate any restriction options. ALso applied
   * to an input field if the disabled function is called.
   */
  disabled: string;
  /**
   * Applied to any date that is less than requested view,
   * e.g. the last day of the previous month.
   */
  old: string;
  /**
   * Applied to any date that is greater than of requested view,
   * e.g. the last day of the previous month.
   */
  new: string;
  /**
   * Applied to any date that is currently selected.
   */
  active: string;
  //#region date element
  /**
   * The outer element for the calendar view.
   */
  dateContainer: string;
  /**
   * The outer element for the decades view.
   */
  decadesContainer: string;
  /**
   * Applied to elements within the decades container, e.g. 2020, 2030
   */
  decade: string;
  /**
   * The outer element for the years view.
   */
  yearsContainer: string;
  /**
   * Applied to elements within the years container, e.g. 2021, 2021
   */
  year: string;
  /**
   * The outer element for the month view.
   */
  monthsContainer: string;
  /**
   * Applied to elements within the month container, e.g. January, February
   */
  month: string;
  /**
   * The outer element for the calendar view.
   */
  daysContainer: string;
  /**
   * Applied to elements within the day container, e.g. 1, 2..31
   */
  day: string;
  /**
   * If display.calendarWeeks is enabled, a column displaying the week of year
   * is shown. This class is applied to each cell in that column.
   */
  calendarWeeks: string;
  /**
   * Applied to the first row of the calendar view, e.g. Sunday, Monday
   */
  dayOfTheWeek: string;
  /**
   * Applied to the current date on the calendar view.
   */
  today: string;
  /**
   * Applied to the locale's weekend dates on the calendar view, e.g. Sunday, Saturday
   */
  weekend: string;
  //#endregion
  //#region time element
  /**
   * The outer element for all time related elements.
   */
  timeContainer: string;
  /**
   * Applied the separator columns between time elements, e.g. hour *:* minute *:* second
   */
  separator: string;
  /**
   * The outer element for the clock view.
   */
  clockContainer: string;
  /**
   * The outer element for the hours selection view.
   */
  hourContainer: string;
  /**
   * The outer element for the minutes selection view.
   */
  minuteContainer: string;
  /**
   * The outer element for the seconds selection view.
   */
  secondContainer: string;
  /**
   * Applied to each element in the hours selection view.
   */
  hour: string;
  /**
   * Applied to each element in the minutes selection view.
   */
  minute: string;
  /**
   * Applied to each element in the seconds selection view.
   */
  second: string;
  /**
   * Applied AM/PM toggle button.
   */
  toggleMeridiem: string;
  //#endregion
  //#region collapse
  /**
   * Applied the element of the current view mode, e.g. calendar or clock.
   */
  show: string;
  /**
   * Applied to the currently showing view mode during a transition
   * between calendar and clock views
   */
  collapsing: string;
  /**
   * Applied to the currently hidden view mode.
   */
  collapse: string;
  //#endregion
  /**
   * Applied to the widget when the option display.inline is enabled.
   */
  inline: string;
  /**
   * Applied to the widget when the option display.theme is light.
   */
  lightTheme: string;
  /**
   * Applied to the widget when the option display.theme is dark.
   */
  darkTheme: string;
  /**
   * Used for detecting if the system color preference is dark mode
   */
  isDarkPreferredQuery: string;
}
declare class Namespace {
  static NAME: string;
  // noinspection JSUnusedGlobalSymbols
  static dataKey: string;
  static events: Events;
  static css: Css;
  static errorMessages: ErrorMessages;
}
declare const DefaultOptions: Options;
/**
 * A robust and powerful date/time picker component.
 */
declare class TempusDominus {
  _subscribers: {
    [key: string]: ((event: any) => Record<string, unknown>)[];
  };
  private _isDisabled;
  private _toggle;
  private _currentPromptTimeTimeout;
  private actions;
  private optionsStore;
  private _eventEmitters;
  display: Display;
  dates: Dates;
  constructor(element: HTMLElement, options?: Options);
  get viewDate(): DateTime;
  set viewDate(value: DateTime);
  /**
   * Update the picker options. If `reset` is provide `options` will be merged with DefaultOptions instead.
   * @param options
   * @param reset
   * @public
   */
  // noinspection JSUnusedGlobalSymbols
  /**
   * Update the picker options. If `reset` is provide `options` will be merged with DefaultOptions instead.
   * @param options
   * @param reset
   * @public
   */
  updateOptions(options: any, reset?: boolean): void;
  /**
   * Toggles the picker open or closed. If the picker is disabled, nothing will happen.
   * @public
   */
  // noinspection JSUnusedGlobalSymbols
  /**
   * Toggles the picker open or closed. If the picker is disabled, nothing will happen.
   * @public
   */
  toggle(): void;
  /**
   * Shows the picker unless the picker is disabled.
   * @public
   */
  // noinspection JSUnusedGlobalSymbols
  /**
   * Shows the picker unless the picker is disabled.
   * @public
   */
  show(): void;
  /**
   * Hides the picker unless the picker is disabled.
   * @public
   */
  // noinspection JSUnusedGlobalSymbols
  /**
   * Hides the picker unless the picker is disabled.
   * @public
   */
  hide(): void;
  /**
   * Disables the picker and the target input field.
   * @public
   */
  // noinspection JSUnusedGlobalSymbols
  /**
   * Disables the picker and the target input field.
   * @public
   */
  disable(): void;
  /**
   * Enables the picker and the target input field.
   * @public
   */
  // noinspection JSUnusedGlobalSymbols
  /**
   * Enables the picker and the target input field.
   * @public
   */
  enable(): void;
  /**
   * Clears all the selected dates
   * @public
   */
  // noinspection JSUnusedGlobalSymbols
  /**
   * Clears all the selected dates
   * @public
   */
  clear(): void;
  /**
   * Allows for a direct subscription to picker events, without having to use addEventListener on the element.
   * @param eventTypes See Namespace.Events
   * @param callbacks Function to call when event is triggered
   * @public
   */
  // noinspection JSUnusedGlobalSymbols
  /**
   * Allows for a direct subscription to picker events, without having to use addEventListener on the element.
   * @param eventTypes See Namespace.Events
   * @param callbacks Function to call when event is triggered
   * @public
   */
  subscribe(
    eventTypes: string | string[],
    callbacks: (event: any) => void | ((event: any) => void)[]
  ):
    | {
        unsubscribe: () => void;
      }
    | {
        unsubscribe: () => void;
      }[];
  /**
   * Hides the picker and removes event listeners
   */
  // noinspection JSUnusedGlobalSymbols
  /**
   * Hides the picker and removes event listeners
   */
  dispose(): void;
  /**
   * Updates the options to use the provided language.
   * THe language file must be loaded first.
   * @param language
   */
  /**
   * Updates the options to use the provided language.
   * THe language file must be loaded first.
   * @param language
   */
  locale(language: string): void;
  /**
   * Triggers an event like ChangeEvent when the picker has updated the value
   * of a selected date.
   * @param event Accepts a BaseEvent object.
   * @private
   */
  /**
   * Triggers an event like ChangeEvent when the picker has updated the value
   * of a selected date.
   * @param event Accepts a BaseEvent object.
   * @private
   */
  private _triggerEvent;
  private _publish;
  /**
   * Fires a ViewUpdate event when, for example, the month view is changed.
   * @private
   */
  /**
   * Fires a ViewUpdate event when, for example, the month view is changed.
   * @private
   */
  private _viewUpdate;
  private _unsubscribe;
  /**
   * Merges two Option objects together and validates options type
   * @param config new Options
   * @param mergeTo Options to merge into
   * @param includeDataset When true, the elements data-td attributes will be included in the
   * @private
   */
  /**
   * Merges two Option objects together and validates options type
   * @param config new Options
   * @param mergeTo Options to merge into
   * @param includeDataset When true, the elements data-td attributes will be included in the
   * @private
   */
  private _initializeOptions;
  /**
   * Checks if an input field is being used, attempts to locate one and sets an
   * event listener if found.
   * @private
   */
  /**
   * Checks if an input field is being used, attempts to locate one and sets an
   * event listener if found.
   * @private
   */
  private _initializeInput;
  /**
   * Attempts to locate a toggle for the picker and sets an event listener
   * @private
   */
  /**
   * Attempts to locate a toggle for the picker and sets an event listener
   * @private
   */
  private _initializeToggle;
  /**
   * If the option is enabled this will render the clock view after a date pick.
   * @param e change event
   * @private
   */
  /**
   * If the option is enabled this will render the clock view after a date pick.
   * @param e change event
   * @private
   */
  private _handleAfterChangeEvent;
  /**
   * Event for when the input field changes. This is a class level method so there's
   * something for the remove listener function.
   * @private
   */
  private _inputChangeEvent;
  /**
   * Event for when the toggle is clicked. This is a class level method so there's
   * something for the remove listener function.
   * @private
   */
  private _toggleClickEvent;
}
/**
 * Called from a locale plugin.
 * @param l locale object for localization options
 */
declare const loadLocale: (l: any) => void;
/**
 * A sets the global localization options to the provided locale name.
 * `loadLocale` MUST be called first.
 * @param l
 */
declare const locale: (l: string) => void;
/**
 * Called from a plugin to extend or override picker defaults.
 * @param plugin
 * @param option
 */
declare const extend: (
  plugin: any,
  option?: any
) => {
  TempusDominus: typeof TempusDominus;
  extend: any;
  loadLocale: (l: any) => void;
  locale: (l: string) => void;
  Namespace: typeof Namespace;
  DefaultOptions: Options;
  DateTime: typeof DateTime;
  Unit: typeof Unit;
  version: string;
};
declare const version = '6.2.10';
export {
  TempusDominus,
  extend,
  loadLocale,
  locale,
  Namespace,
  DefaultOptions,
  DateTime,
  Unit,
  version,
  DateTimeFormatOptions,
  Options,
};
