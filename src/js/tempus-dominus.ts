import Display from './display/index';
import Validation from './validation';
import Dates from './dates';
import Actions, { ActionTypes } from './actions';
import { DatePickerModes, DefaultOptions } from './conts';
import { DateTime, DateTimeFormatOptions, Unit } from './datetime';
import Namespace from './namespace';
import Options, { OptionConverter } from './options';
import {
  BaseEvent,
  ChangeEvent,
  ViewUpdateEvent,
  FailEvent,
} from './event-types';

/**
 * A robust and powerful date/time picker component.
 */
class TempusDominus {
  dates: Dates;

  _options: Options;
  _currentViewMode = 0;
  _subscribers: { [key: string]: ((event: any) => {})[] } = {};
  _element: HTMLElement;
  _input: HTMLInputElement;
  _unset: boolean;
  _minViewModeNumber = 0;
  _display: Display;
  _validation: Validation;
  _action: Actions;
  private _isDisabled = false;
  private _notifyChangeEventContext = 0;
  private _toggle: HTMLElement;
  private _currentPromptTimeTimeout: any;

  constructor(element: HTMLElement, options: Options = {} as Options) {
    if (!element) {
      Namespace.errorMessages.mustProvideElement();
    }
    this._element = element;
    this._options = this._initializeOptions(options, DefaultOptions, true);
    this._viewDate.setLocale(this._options.localization.locale);
    this._unset = true;

    this._display = new Display(this);
    this._validation = new Validation(this);
    this.dates = new Dates(this);
    this._action = new Actions(this);

    this._initializeInput();
    this._initializeToggle();

    if (this._options.display.inline) this._display.show();
  }

  _viewDate = new DateTime();

  get viewDate() {
    return this._viewDate;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Update the picker options. If `reset` is provide `options` will be merged with DefaultOptions instead.
   * @param options
   * @param reset
   * @public
   */
  updateOptions(options, reset = false): void {
    if (reset) this._options = this._initializeOptions(options, DefaultOptions);
    else this._options = this._initializeOptions(options, this._options);
    this._display._rebuild();
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Toggles the picker open or closed. If the picker is disabled, nothing will happen.
   * @public
   */
  toggle(): void {
    if (this._isDisabled) return;
    this._display.toggle();
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Shows the picker unless the picker is disabled.
   * @public
   */
  show(): void {
    if (this._isDisabled) return;
    this._display.show();
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Hides the picker unless the picker is disabled.
   * @public
   */
  hide(): void {
    this._display.hide();
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Disables the picker and the target input field.
   * @public
   */
  disable(): void {
    this._isDisabled = true;
    // todo this might be undesired. If a dev disables the input field to
    // only allow using the picker, this will break that.
    this._input?.setAttribute('disabled', 'disabled');
    this._display.hide();
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Enables the picker and the target input field.
   * @public
   */
  enable(): void {
    this._isDisabled = false;
    this._input?.removeAttribute('disabled');
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Clears all the selected dates
   * @public
   */
  clear(): void {
    this.dates.clear();
  }

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
  ): { unsubscribe: () => void } | { unsubscribe: () => void }[] {
    if (typeof eventTypes === 'string') {
      eventTypes = [eventTypes];
    }
    let callBackArray = [];
    if (!Array.isArray(callbacks)) {
      callBackArray = [callbacks];
    } else {
      callBackArray = callbacks;
    }

    if (eventTypes.length !== callBackArray.length) {
      Namespace.errorMessages.subscribeMismatch();
    }

    const returnArray = [];

    for (let i = 0; i < eventTypes.length; i++) {
      const eventType = eventTypes[i];
      if (!Array.isArray(this._subscribers[eventType])) {
        this._subscribers[eventType] = [];
      }

      this._subscribers[eventType].push(callBackArray[i]);

      returnArray.push({
        unsubscribe: this._unsubscribe.bind(
          this,
          eventType,
          this._subscribers[eventType].length - 1
        ),
      });

      if (eventTypes.length === 1) {
        return returnArray[0];
      }
    }

    return returnArray;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Hides the picker and removes event listeners
   */
  dispose() {
    this._display.hide();
    // this will clear the document click event listener
    this._display._dispose();
    this._input?.removeEventListener('change', this._inputChangeEvent);
    if (this._options.allowInputToggle) {
      this._input?.removeEventListener('click', this._toggleClickEvent);
    }
    this._toggle.removeEventListener('click', this._toggleClickEvent);
    this._subscribers = {};
  }

  /**
   * Triggers an event like ChangeEvent when the picker has updated the value
   * of a selected date.
   * @param event Accepts a BaseEvent object.
   * @private
   */
  _triggerEvent(event: BaseEvent) {
    // checking hasOwnProperty because the BasicEvent also falls through here otherwise
    if ((event as ChangeEvent) && event.hasOwnProperty('date')) {
      const { date, oldDate, isClear } = event as ChangeEvent;
      // this was to prevent a max call stack error
      // https://github.com/tempusdominus/core/commit/15a280507f5277b31b0b3319ab1edc7c19a000fb
      // todo see if this is still needed or if there's a cleaner way
      this._notifyChangeEventContext++;
      if (
        (date && oldDate && date.isSame(oldDate)) ||
        (!isClear && !date && !oldDate) ||
        this._notifyChangeEventContext > 1
      ) {
        this._notifyChangeEventContext = 0;
        return;
      }
      this._handleAfterChangeEvent(event as ChangeEvent);
    }

    this._element.dispatchEvent(
      new CustomEvent(event.type, { detail: event as any })
    );

    if ((window as any).jQuery) {
      const $ = (window as any).jQuery;
      $(this._element).trigger(event);
    }

    const publish = () => {
      // return if event is not subscribed
      if (!Array.isArray(this._subscribers[event.type])) {
        return;
      }

      // Trigger callback for each subscriber
      this._subscribers[event.type].forEach((callback) => {
        callback(event);
      });
    };

    publish();

    this._notifyChangeEventContext = 0;
  }

  /**
   * Fires a ViewUpdate event when, for example, the month view is changed.
   * @param {Unit} unit
   * @private
   */
  _viewUpdate(unit: Unit) {
    this._triggerEvent({
      type: Namespace.events.update,
      change: unit,
      viewDate: this._viewDate.clone,
    } as ViewUpdateEvent);
  }

  private _unsubscribe(eventName, index) {
    this._subscribers[eventName].splice(index, 1);
  }

  /**
   * Merges two Option objects together and validates options type
   * @param config new Options
   * @param mergeTo Options to merge into
   * @param includeDataset When true, the elements data-td attributes will be included in the
   * @private
   */
  private _initializeOptions(
    config: Options,
    mergeTo: Options,
    includeDataset = false
  ): Options {
    config = OptionConverter._mergeOptions(config, mergeTo);
    if (includeDataset)
      config = OptionConverter._dataToOptions(this._element, config);

    OptionConverter._validateConflcits(config);

    config.viewDate = config.viewDate.setLocale(config.localization.locale);

    if (!this._viewDate.isSame(config.viewDate)) {
      this._viewDate = config.viewDate;
    }

    /**
     * Sets the minimum view allowed by the picker. For example the case of only
     * allowing year and month to be selected but not date.
     */
    if (config.display.components.year) {
      this._minViewModeNumber = 2;
    }
    if (config.display.components.month) {
      this._minViewModeNumber = 1;
    }
    if (config.display.components.date) {
      this._minViewModeNumber = 0;
    }

    this._currentViewMode = Math.max(
      this._minViewModeNumber,
      this._currentViewMode
    );

    // Update view mode if needed
    if (
      DatePickerModes[this._currentViewMode].name !== config.display.viewMode
    ) {
      this._currentViewMode = Math.max(
        DatePickerModes.findIndex((x) => x.name === config.display.viewMode),
        this._minViewModeNumber
      );
    }

    // defaults the input format based on the components enabled
    if (config.hooks.inputFormat === undefined) {
      const components = config.display.components;
      config.hooks.inputFormat = (_, date: DateTime) => {
        if (!date) return '';
        return date.format({
          year: components.calendar && components.year ? 'numeric' : undefined,
          month:
            components.calendar && components.month ? '2-digit' : undefined,
          day: components.calendar && components.date ? '2-digit' : undefined,
          hour:
            components.clock && components.hours
              ? components.useTwentyfourHour
                ? '2-digit'
                : 'numeric'
              : undefined,
          minute:
            components.clock && components.minutes ? '2-digit' : undefined,
          second:
            components.clock && components.seconds ? '2-digit' : undefined,
          hour12: !components.useTwentyfourHour,
        });
      };
    }

    if (this._display?.isVisible) {
      this._display._update('all');
    }

    return config;
  }

  /**
   * Checks if an input field is being used, attempts to locate one and sets an
   * event listener if found.
   * @private
   */
  private _initializeInput() {
    if (this._element.tagName == 'INPUT') {
      this._input = this._element as HTMLInputElement;
    } else {
      let query = this._element.dataset.tdTargetInput;
      if (query == undefined || query == 'nearest') {
        this._input = this._element.querySelector('input');
      } else {
        this._input = this._element.querySelector(query);
      }
    }

    if (!this._input) return;

    this._input.addEventListener('change', this._inputChangeEvent);
    if (this._options.allowInputToggle) {
      this._input.addEventListener('click', this._toggleClickEvent);
    }

    if (this._input.value) {
      this._inputChangeEvent();
    }
  }

  /**
   * Attempts to locate a toggle for the picker and sets an event listener
   * @private
   */
  private _initializeToggle() {
    if (this._options.display.inline) return;
    let query = this._element.dataset.tdTargetToggle;
    if (query == 'nearest') {
      query = '[data-td-toggle="datetimepicker"]';
    }
    this._toggle =
      query == undefined ? this._element : this._element.querySelector(query);
    this._toggle.addEventListener('click', this._toggleClickEvent);
  }

  /**
   * If the option is enabled this will render the clock view after a date pick.
   * @param e change event
   * @private
   */
  private _handleAfterChangeEvent(e: ChangeEvent) {
    if (
      // options is disabled
      !this._options.promptTimeOnDateChange ||
      this._options.display.inline ||
      this._options.display.sideBySide ||
      // time is disabled
      !this._display._hasTime ||
      // clock component is already showing
      this._display.widget
        ?.getElementsByClassName(Namespace.css.show)[0]
        .classList.contains(Namespace.css.timeContainer)
    )
      return;

    // First time ever. If useCurrent option is set to true (default), do nothing
    // because the first date is selected automatically.
    // or date didn't change (time did) or date changed because time did.
    if (
      (!e.oldDate && this._options.useCurrent) ||
      (e.oldDate && e.date?.isSame(e.oldDate))
    ) {
      return;
    }

    clearTimeout(this._currentPromptTimeTimeout);
    this._currentPromptTimeTimeout = setTimeout(() => {
      if (this._display.widget) {
        this._action.do(
          {
            currentTarget: this._display.widget.querySelector(
              `.${Namespace.css.switch} div`
            ),
          },
          ActionTypes.togglePicker
        );
      }
    }, this._options.promptTimeOnDateChangeTransitionDelay);
  }

  /**
   * Event for when the input field changes. This is a class level method so there's
   * something for the remove listener function.
   * @private
   */
  private _inputChangeEvent = () => {
    const setViewDate = () => {
      if (this.dates.lastPicked) this._viewDate = this.dates.lastPicked;
    };

    const value = this._input.value;
    if (this._options.multipleDates) {
      try {
        const valueSplit = value.split(this._options.multipleDatesSeparator);
        for (let i = 0; i < valueSplit.length; i++) {
          if (this._options.hooks.inputParse) {
            this.dates.set(
              this._options.hooks.inputParse(this, valueSplit[i]),
              i,
              'input'
            );
          } else {
            this.dates.set(valueSplit[i], i, 'input');
          }
        }
        setViewDate();
      } catch {
        console.warn(
          'TD: Something went wrong trying to set the multidate values from the input field.'
        );
      }
    } else {
      if (this._options.hooks.inputParse) {
        this.dates.set(this._options.hooks.inputParse(this, value), 0, 'input');
      } else {
        this.dates.set(value, 0, 'input');
      }
      setViewDate();
    }
  };

  /**
   * Event for when the toggle is clicked. This is a class level method so there's
   * something for the remove listener function.
   * @private
   */
  private _toggleClickEvent = () => {
    this.toggle();
  };
}

export {
  TempusDominus,
  Namespace,
  DefaultOptions,
  DateTime,
  Options,
  Unit,
  DateTimeFormatOptions,
};
