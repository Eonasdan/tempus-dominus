import DateDisplay from './calendar/date-display';
import MonthDisplay from './calendar/month-display';
import YearDisplay from './calendar/year-display';
import DecadeDisplay from './calendar/decade-display';
import TimeDisplay from './time/time-display';
import HourDisplay from './time/hour-display';
import MinuteDisplay from './time/minute-display';
import SecondDisplay from './time/second-display';
import { DateTime, Unit } from '../datetime';
import { ViewUpdateValues } from '../utilities/event-emitter';
/**
 * Main class for all things display related.
 */
export default class Display {
    private _widget;
    private _popperInstance;
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
    /**
     * Allows developers to add/remove classes from an element.
     * @param _unit
     * @param _date
     * @param _classes
     * @param _element
     */
    paint(_unit: Unit | 'decade', _date: DateTime, _classes: string[], _element: HTMLElement): void;
    /**
     * Shows the picker and creates a Popper instance if needed.
     * Add document click event to hide when clicking outside the picker.
     * @fires Events#show
     */
    show(): void;
    /**
     * Changes the calendar view mode. E.g. month <-> year
     * @param direction -/+ number to move currentViewMode
     * @private
     */
    _showMode(direction?: number): void;
    _updateCalendarHeader(): void;
    /**
     * Hides the picker if needed.
     * Remove document click event to hide when clicking outside the picker.
     * @fires Events#hide
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
export declare type Paint = (unit: Unit | 'decade', innerDate: DateTime, classes: string[], element: HTMLElement) => void;
