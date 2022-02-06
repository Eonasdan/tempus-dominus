import { ErrorMessages } from './errors';
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
     * The elements for all of the toolbar options
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
    /**
     * The outer most element for the calendar view.
     */
    dateContainer: string;
    /**
     * The outer most element for the decades view.
     */
    decadesContainer: string;
    /**
     * Applied to elements within the decades container, e.g. 2020, 2030
     */
    decade: string;
    /**
     * The outer most element for the years view.
     */
    yearsContainer: string;
    /**
     * Applied to elements within the years container, e.g. 2021, 2021
     */
    year: string;
    /**
     * The outer most element for the month view.
     */
    monthsContainer: string;
    /**
     * Applied to elements within the month container, e.g. January, February
     */
    month: string;
    /**
     * The outer most element for the calendar view.
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
    /**
     * The outer most element for all time related elements.
     */
    timeContainer: string;
    /**
     * Applied the separator columns between time elements, e.g. hour *:* minute *:* second
     */
    separator: string;
    /**
     * The outer most element for the clock view.
     */
    clockContainer: string;
    /**
     * The outer most element for the hours selection view.
     */
    hourContainer: string;
    /**
     * The outer most element for the minutes selection view.
     */
    minuteContainer: string;
    /**
     * The outer most element for the seconds selection view.
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
    /**
     * Applied to the widget when the option display.inline is enabled.
     */
    inline: string;
}
export default class Namespace {
    static NAME: string;
    static version: string;
    static dataKey: string;
    static events: Events;
    static css: Css;
    static errorMessages: ErrorMessages;
}
export {};
