import Display from './display/index';
import Dates from './dates';
import { DateTime, DateTimeFormatOptions, Unit } from './datetime';
import Namespace from './utilities/namespace';
import Options from './utilities/options';
import DefaultOptions from './utilities/default-options';
/**
 * A robust and powerful date/time picker component.
 */
declare class TempusDominus {
    _subscribers: {
        [key: string]: ((event: any) => {})[];
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
    private _triggerEvent;
    private _publish;
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
declare const extend: (plugin: any, option: any) => any;
export { TempusDominus, extend, loadLocale, locale, Namespace, DefaultOptions, DateTime, Options, Unit, DateTimeFormatOptions, };
