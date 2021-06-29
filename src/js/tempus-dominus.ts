import Display from './display/index';
import Validation from './validation';
import Dates from './dates';
import Actions, { ActionTypes } from './actions';
import { DefaultOptions } from './conts';
import { DateTime, Unit } from './datetime';
import Namespace from './namespace';
import Options, { OptionConverter } from './options';
import {
  BaseEvent,
  ChangeEvent,
  ViewUpdateEvent,
  FailEvent,
} from './event-types';

/**
 * Main date picker entry point
 */
class TempusDominus {
  options: Options;
  _element: HTMLElement;
  viewDate: DateTime;
  _input: HTMLInputElement;
  currentViewMode: number;
  _unset: boolean;
  _minViewModeNumber: number;
  _display: Display;
  _validation: Validation;
  dates: Dates;
  _action: Actions;

  private _isDisabled = false;
  private _notifyChangeEventContext = 0;
  private _toggle: HTMLElement;
  private _currentPromptTimeTimeout: any;

  constructor(element: HTMLElement, options: Options) {
    if (!element) {
      throw Namespace.ErrorMessages.mustProvideElement;
    }
    this._element = element;
    this.options = this._initializeOptions(options, DefaultOptions);
    this.viewDate = new DateTime();
    this.currentViewMode = null;
    this._unset = true;
    this._minViewModeNumber = 0;

    this._display = new Display(this);
    this._validation = new Validation(this);
    this.dates = new Dates(this);
    this._action = new Actions(this);

    this._initializeViewMode();
    this._initializeInput();
    this._initializeToggle();

    if (this.options.display.inline) this._display.show();
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Update the picker options. If `reset` is provide `options` will be merged with DefaultOptions instead.
   * @param options
   * @param reset
   * @public
   */
  updateOptions(options, reset = false): void {
    if (reset) this.options = this._initializeOptions(options, DefaultOptions);
    else this.options = this._initializeOptions(options, this.options);
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

  /**
   * Triggers an event like ChangeEvent when the picker has updated the value
   * of a selected date.
   * @param event Accepts a BaseEvent object.
   * @private
   */
  _triggerEvent(event: BaseEvent) {
    if (event as ChangeEvent) {
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
      this._handlePromptTimeIfNeeded(event as ChangeEvent);
    }

    this._element.dispatchEvent(new CustomEvent(event.name, event as any));

    this._notifyChangeEventContext = 0;
  }

  /**
   * Fires a ViewUpdate event when, for example, the month view is changed.
   * @param {Unit} unit
   * @private
   */
  _viewUpdate(unit: Unit) {
    this._triggerEvent({
      name: Namespace.Events.update,
      change: unit,
      viewDate: this.viewDate.clone,
    } as ViewUpdateEvent);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Hides the picker and removes event listenersf
   */
  dispose() {
    this._display.hide();
    // this will clear the document click event listener
    this._display._dispose();
    this._input?.removeEventListener('change', this._inputChangeEvent);
    if (this.options.allowInputToggle) {
      this._input?.removeEventListener('click', this._toggleClickEvent);
    }
    this._toggle.removeEventListener('click', this._toggleClickEvent);
    //clear data-
  }

  /**
   * Merges two Option objects together and validates options type
   * @param config new Options
   * @param mergeTo Options to merge into
   * @private
   */
  private _initializeOptions(config: Options, mergeTo: Options): Options {
    config = OptionConverter._mergeOptions(config, mergeTo);
    config = OptionConverter._dataToOptions(this._element, config);

    //defaults the input format based on the components enabled
    if (config.display.inputFormat === undefined) {
      const components = config.display.components;
      config.display.inputFormat = {
        year: components.year ? 'numeric' : undefined,
        month: components.month ? '2-digit' : undefined,
        day: components.date ? '2-digit' : undefined,
        hour: components.hours
          ? components.useTwentyfourHour
            ? '2-digit'
            : 'numeric'
          : undefined,
        minute: components.minutes ? '2-digit' : undefined,
        second: components.seconds ? '2-digit' : undefined,
        hour12: !components.useTwentyfourHour,
      };
    }

    return config;
  }

  /**
   * Sets the minimum view allowed by the picker. For example the case of only
   * allowing year and month to be selected but not date.
   * @private
   */
  private _initializeViewMode() {
    if (this.options.display.components.year) {
      this._minViewModeNumber = 2;
    }
    if (this.options.display.components.month) {
      this._minViewModeNumber = 1;
    }
    if (this.options.display.components.date) {
      this._minViewModeNumber = 0;
    }

    this.currentViewMode = Math.max(
      this._minViewModeNumber,
      this.currentViewMode
    );
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

    this._input?.addEventListener('change', this._inputChangeEvent);
    if (this.options.allowInputToggle) {
      this._input?.addEventListener('click', this._toggleClickEvent);
    }
  }

  /**
   * Attempts to locate a toggle for the picker and sets an event listener
   * @private
   */
  private _initializeToggle() {
    if (this.options.display.inline) return;
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
  private _handlePromptTimeIfNeeded(e: ChangeEvent) {
    if (
      // options is disabled
      !this.options.promptTimeOnDateChange ||
      this.options.display.inline ||
      this.options.display.sideBySide ||
      // time is disabled
      !this._display._hasTime ||
      // clock component is already showing
      this._display.widget
        ?.getElementsByClassName(Namespace.Css.show)[0]
        .classList.contains(Namespace.Css.timeContainer)
    )
      return;

    // First time ever. If useCurrent option is set to true (default), do nothing
    // because the first date is selected automatically.
    // or date didn't change (time did) or date changed because time did.
    if (
      (!e.oldDate && this.options.useCurrent) ||
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
              `.${Namespace.Css.switch} div`
            ),
          },
          ActionTypes.togglePicker
        );
      }
    }, this.options.promptTimeOnDateChangeTransitionDelay);
  }

  /**
   * Event for when the input field changes. This is a class level method so there's
   * something for the remove listener function.
   * @private
   */
  private _inputChangeEvent = () => {
    let parsedDate = OptionConverter._dateTypeCheck(this._input.value);

    if (parsedDate) {
      this.dates._setValue(parsedDate);
    } else {
      this._triggerEvent({
        name: Namespace.Events.error,
        reason: Namespace.ErrorMessages.failedToParseInput,
        date: parsedDate,
      } as FailEvent);
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

export { TempusDominus, Namespace, DefaultOptions };
