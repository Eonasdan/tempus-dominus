import Display from './display/index';
import Validation from './validation';
import Dates from './dates';
import Actions, { ActionTypes } from './actions';
import { DefaultOptions } from './conts';
import { DateTime, Unit } from './datetime';
import Namespace from './namespace';
import Options from './options';
import {
  BaseEvent,
  ChangeEvent,
  ViewUpdateEvent,
  FailEvent,
} from './event-types';

/**
 * Main date picker entry point
 */
export class TempusDominus {
  options: Options;
  element: HTMLElement;
  viewDate: DateTime;
  input: HTMLInputElement;
  currentViewMode: number;
  unset: boolean;
  minViewModeNumber: number;
  display: Display;
  validation: Validation;
  dates: Dates;
  action: Actions;

  private _notifyChangeEventContext = 0;
  private _toggle: HTMLElement;
  private _currentPromptTimeTimeout: any;

  constructor(element: HTMLElement, options: Options) {
    if (!element) {
      throw Namespace.ErrorMessages.mustProvideElement;
    }
    this.options = this._initializeOptions(options, DefaultOptions);
    this.element = element;
    this.viewDate = new DateTime();
    this.currentViewMode = null;
    this.unset = true;
    this.minViewModeNumber = 0;

    this.display = new Display(this);
    this.validation = new Validation(this);
    this.dates = new Dates(this);
    this.action = new Actions(this);

    this._initializeViewMode();
    this._initializeInput();
    this._initializeToggle();

    if (this.options.display.inline) this.display.show();
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
  }

  /**
   * Triggers an event like ChangeEvent when the picker has updated the value
   * of a selected date.
   * @param event Accepts a BaseEvent object.
   * @private
   */
  _triggerEvent(event: BaseEvent) {
    console.log(`notify: ${event.name}`, JSON.stringify(event, null, 2));
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

    this.element.dispatchEvent(new CustomEvent(event.name, event as any));

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
   * Hides the picker and removes event listeners
   */
  dispose() {
    this.display.hide();
    // this will clear the document click event listener
    this.display._dispose();
    this.input?.removeEventListener('change', this._inputChangeEvent);
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
    /**
     * Type checks that `value` is an array of Date or DateTime
     * @param optionName Provides text to error messages e.g. disabledDates
     * @param value Option value
     * @param providedType Used to provide text to error messages
     */
    const typeCheckDateArray = (
      optionName: string,
      value,
      providedType: string
    ) => {
      if (!Array.isArray(value)) {
        throw Namespace.ErrorMessages.typeMismatch(
          optionName,
          providedType,
          'array of DateTime or Date'
        );
      }
      for (let i = 0; i < value.length; i++) {
        let d = value[i];
        const dateTime = dateConversion(d, optionName);
        if (!dateTime) {
          throw Namespace.ErrorMessages.typeMismatch(
            optionName,
            typeof d,
            'DateTime or Date'
          );
        }
        value[i] = dateTime;
      }
    };

    /**
     * Type checks that `value` is an array of numbers
     * @param optionName Provides text to error messages e.g. disabledDates
     * @param value Option value
     * @param providedType Used to provide text to error messages
     */
    const typeCheckNumberArray = (
      optionName: string,
      value,
      providedType: string
    ) => {
      if (!Array.isArray(value)) {
        throw Namespace.ErrorMessages.typeMismatch(
          optionName,
          providedType,
          'array of numbers'
        );
      }
      if (value.find((x) => typeof x !== typeof 0))
        console.log('throw an error');
      return;
    };

    /**
     * Attempts to convert `d` to a DateTime object
     * @param d value to convert
     * @param optionName Provides text to error messages e.g. disabledDates
     */
    const dateConversion = (d: any, optionName: string) => {
      if (typeof d === typeof '') {
        console.warn(Namespace.ErrorMessages.dateString);
      }

      const converted = TempusDominus._dateTypeCheck(d);

      if (!converted) {
        throw Namespace.ErrorMessages.failedToParseDate(optionName, d);
      }
      return converted;
    };

    let path = '';
    /**
     * The spread operator caused sub keys to be missing after merging.
     * This is to fix that issue by using spread on the child objects first.
     * Also handles complex options like disabledDates
     * @param provided An option from new config
     * @param defaultOption Default option to compare types against
     */
    const spread = (provided, defaultOption) => {
      Object.keys(provided).forEach((key) => {
        let providedType = typeof provided[key];
        if (providedType === undefined) return;
        path += `.${key}`;
        let defaultType = typeof defaultOption[key];
        let value = provided[key];
        if (!value) return; //todo not sure if null checking here is right
        switch (key) {
          case 'viewDate': {
            const dateTime = dateConversion(value, 'viewDate');
            if (dateTime !== undefined) {
              provided[key] = dateTime;
              break;
            }
            throw Namespace.ErrorMessages.typeMismatch(
              'viewDate',
              providedType,
              'DateTime or Date'
            );
          }
          case 'minDate': {
            const dateTime = dateConversion(value, 'restrictions.minDate');
            if (dateTime !== undefined) {
              provided[key] = dateTime;
              break;
            }
            throw Namespace.ErrorMessages.typeMismatch(
              'restrictions.minDate',
              providedType,
              'DateTime or Date'
            );
          }
          case 'maxDate': {
            const dateTime = dateConversion(value, 'restrictions.maxDate');
            if (dateTime !== undefined) {
              provided[key] = dateTime;
              break;
            }
            throw Namespace.ErrorMessages.typeMismatch(
              'restrictions.maxDate',
              providedType,
              'DateTime or Date'
            );
          }
          case 'disabledHours':
            typeCheckNumberArray(
              'restrictions.disabledHours',
              value,
              providedType
            );
            if (value.filter((x) => x < 0 || x > 23))
              throw Namespace.ErrorMessages.numbersOutOfRage(
                'restrictions.disabledHours',
                0,
                23
              );
            break;
          case 'enabledHours':
            typeCheckNumberArray(
              'restrictions.enabledHours',
              value,
              providedType
            );
            if (value.filter((x) => x < 0 || x > 23))
              throw Namespace.ErrorMessages.numbersOutOfRage(
                'restrictions.enabledHours',
                0,
                23
              );
            break;
          case 'daysOfWeekDisabled':
            typeCheckNumberArray(
              'restrictions.daysOfWeekDisabled',
              value,
              providedType
            );
            if (value.filter((x) => x < 0 || x > 6))
              throw Namespace.ErrorMessages.numbersOutOfRage(
                'restrictions.daysOfWeekDisabled',
                0,
                6
              );
            break;
          case 'enabledDates':
            typeCheckDateArray(
              'restrictions.enabledDates',
              value,
              providedType
            );
            break;
          case 'disabledDates':
            typeCheckDateArray(
              'restrictions.disabledDates',
              value,
              providedType
            );
            break;
          case 'disabledTimeIntervals':
            if (!Array.isArray(value)) {
              throw Namespace.ErrorMessages.typeMismatch(
                key,
                providedType,
                'array of { from: DateTime|Date, to: DateTime|Date }'
              );
            }
            const valueObject = value as { from: any; to: any }[];
            for (let i = 0; i < valueObject.length; i++) {
              Object.keys(valueObject[i]).forEach((vk) => {
                const subOptionName = `${key}[${i}].${vk}`;
                let d = valueObject[i][vk];
                const dateTime = dateConversion(d, subOptionName);
                if (!dateTime) {
                  throw Namespace.ErrorMessages.typeMismatch(
                    subOptionName,
                    typeof d,
                    'DateTime or Date'
                  );
                }
                valueObject[i][vk] = dateTime;
              });
            }
            break;
          default:
            if (providedType !== defaultType) {
              if (defaultType === typeof undefined)
                throw Namespace.ErrorMessages.unexpectedOption(
                  path.substring(1)
                );
              throw Namespace.ErrorMessages.typeMismatch(
                path.substring(1),
                providedType,
                defaultType
              );
            }
            break;
        }

        if (typeof defaultOption[key] !== 'object') {
          path = path.substring(0, path.lastIndexOf(`.${key}`));
          return;
        }
        if (!Array.isArray(provided[key]) && provided[key] != null) {
          spread(provided[key], defaultOption[key]);
          path = path.substring(0, path.lastIndexOf(`.${key}`));
          provided[key] = { ...defaultOption[key], ...provided[key] };
        }
        path = path.substring(0, path.lastIndexOf(`.${key}`));
      });
    };
    spread(config, mergeTo);

    config = {
      ...mergeTo,
      ...config,
    };

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
      this.minViewModeNumber = 2;
    }
    if (this.options.display.components.month) {
      this.minViewModeNumber = 1;
    }
    if (this.options.display.components.date) {
      this.minViewModeNumber = 0;
    }

    this.currentViewMode = Math.max(
      this.minViewModeNumber,
      this.currentViewMode
    );
  }

  /**
   * Checks if an input field is being used, attempts to locate one and sets an
   * event listener if found.
   * @private
   */
  private _initializeInput() {
    if (this.element.tagName == 'INPUT') {
      this.input = this.element as HTMLInputElement;
    } else {
      let query = this.element.dataset.targetInput;
      if (query == undefined || query == 'nearest') {
        this.input = this.element.querySelector('input');
      } else {
        this.input = this.element.querySelector(query);
      }
    }

    this.input?.addEventListener('change', this._inputChangeEvent);
  }

  /**
   * Attempts to locate a toggle for the picker and sets an event listener
   * @private
   */
  private _initializeToggle() {
    let query = this.element.dataset.targetToggle;
    if (query == 'nearest') {
      query = '[data-toggle="datetimepicker"]';
    }
    this._toggle =
      query == undefined ? this.element : this.element.querySelector(query);
    this._toggle.addEventListener('click', this._toggleClickEvent);
  }

  /**
   * Attempts to prove `d` is a DateTime or Date or can be converted into one.
   * @param d If a string will attempt creating a date from it.
   * @private
   */
  private static _dateTypeCheck(d: any): DateTime | null {
    if (d.constructor.name === 'DateTime') return d;
    if (d.constructor.name === 'Date') {
      return DateTime.convert(d);
    }
    if (typeof d === typeof '') {
      const dateTime = new DateTime(d);
      if (JSON.stringify(dateTime) === 'null') {
        return null;
      }
      return dateTime;
    }
    return null;
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
      !this.display._hasTime ||
      // clock component is already showing
      this.display.widget
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
      if (this.display.widget) {
        this.action.do(
          {
            currentTarget: this.display.widget.querySelector(
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
    let parsedDate = TempusDominus._dateTypeCheck(this.input.value);

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
    this.display.toggle();
  };
}
