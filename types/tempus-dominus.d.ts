import Display from './display/index';
import Validation from './validation';
import Dates from './dates';
import Actions from './actions';
import { DefaultOptions } from './conts';
import { DateTime, DateTimeFormatOptions, Unit } from './datetime';
import Namespace from './namespace';
import Options from './options';
import { BaseEvent } from './event-types';
/**
 * A robust and powerful date/time picker component.
 */
declare class TempusDominus {
    dates: Dates;
    _options: Options;
    _currentViewMode: number;
    _subscribers: {
        [key: string]: ((event: any) => {})[];
    };
    _element: HTMLElement;
    _input: HTMLInputElement;
    _unset: boolean;
    _minViewModeNumber: number;
    _display: Display;
    _validation: Validation;
    _action: Actions;
    private _isDisabled;
    private _notifyChangeEventContext;
    private _toggle;
    private _currentPromptTimeTimeout;
    constructor(element: HTMLElement, options?: Options);
    _viewDate: DateTime;
    get viewDate(): DateTime;
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
    toggle(): void;
    /**
     * Shows the picker unless the picker is disabled.
     * @public
     */
    show(): void;
    /**
     * Hides the picker unless the picker is disabled.
     * @public
     */
    hide(): void;
    /**
     * Disables the picker and the target input field.
     * @public
     */
    disable(): void;
    /**
     * Enables the picker and the target input field.
     * @public
     */
    enable(): void;
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
    subscribe(eventTypes: string | string[], callbacks: (event: any) => void | ((event: any) => void)[]): {
        unsubscribe: () => void;
    } | {
        unsubscribe: () => void;
    }[];
    /**
     * Hides the picker and removes event listeners
     */
    dispose(): void;
    /**
     * Triggers an event like ChangeEvent when the picker has updated the value
     * of a selected date.
     * @param event Accepts a BaseEvent object.
     * @private
     */
    _triggerEvent(event: BaseEvent): void;
    /**
     * Fires a ViewUpdate event when, for example, the month view is changed.
     * @param {Unit} unit
     * @private
     */
    _viewUpdate(unit: Unit): void;
    private _unsubscribe;
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
    private _initializeInput;
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
export { TempusDominus, Namespace, DefaultOptions, DateTime, Options, Unit, DateTimeFormatOptions, };
