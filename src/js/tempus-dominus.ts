import Display from './display/index';
import Dates from './dates';
import Actions from './actions';
import {
  DateTime,
  DateTimeFormatOptions,
  guessHourCycle,
  Unit,
} from './datetime';
import Namespace from './utilities/namespace';
import Options from './utilities/options';
import {
  BaseEvent,
  ChangeEvent,
  ViewUpdateEvent,
} from './utilities/event-types';
import { EventEmitters } from './utilities/event-emitter';
import {
  serviceLocator,
  setupServiceLocator,
} from './utilities/service-locator';
import CalendarModes from './utilities/calendar-modes';
import DefaultOptions, {
  DefaultEnLocalization,
} from './utilities/default-options';
import ActionTypes from './utilities/action-types';
import { OptionsStore } from './utilities/optionsStore';
import { OptionConverter } from './utilities/optionConverter';

/**
 * A robust and powerful date/time picker component.
 */
class TempusDominus {
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  _subscribers: { [key: string]: ((event: any) => Record<string, unknown>)[] } =
    {};
  private _isDisabled = false;
  private _toggle: HTMLElement;
  private _currentPromptTimeTimeout: NodeJS.Timeout;
  private actions: Actions;
  private optionsStore: OptionsStore;
  private _eventEmitters: EventEmitters;
  display: Display;
  dates: Dates;

  constructor(element: HTMLElement, options: Options = {} as Options) {
    setupServiceLocator();
    this._eventEmitters = serviceLocator.locate(EventEmitters);
    this.optionsStore = serviceLocator.locate(OptionsStore);
    this.display = serviceLocator.locate(Display);
    this.dates = serviceLocator.locate(Dates);
    this.actions = serviceLocator.locate(Actions);

    if (!element) {
      Namespace.errorMessages.mustProvideElement();
    }

    this.optionsStore.element = element;
    this._initializeOptions(options, DefaultOptions, true);
    this.optionsStore.viewDate.setLocalization(
      this.optionsStore.options.localization
    );
    this.optionsStore.unset = true;

    this._initializeInput();
    this._initializeToggle();

    if (this.optionsStore.options.display.inline) this.display.show();

    this._eventEmitters.triggerEvent.subscribe((e) => {
      this._triggerEvent(e);
    });

    this._eventEmitters.viewUpdate.subscribe(() => {
      this._viewUpdate();
    });

    this._eventEmitters.updateViewDate.subscribe((dateTime) => {
      this.viewDate = dateTime;
    });
  }

  get viewDate() {
    return this.optionsStore.viewDate;
  }

  set viewDate(value) {
    this.optionsStore.viewDate = value;
    this.optionsStore.viewDate.setLocalization(
      this.optionsStore.options.localization
    );
    this.display._update(
      this.optionsStore.currentView === 'clock' ? 'clock' : 'calendar'
    );
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Update the picker options. If `reset` is provide `options` will be merged with DefaultOptions instead.
   * @param options
   * @param reset
   * @public
   */
  updateOptions(options, reset = false): void {
    if (reset) this._initializeOptions(options, DefaultOptions);
    else this._initializeOptions(options, this.optionsStore.options);

    this.optionsStore.viewDate.setLocalization(
      this.optionsStore.options.localization
    );
    this.display.refreshCurrentView();
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Toggles the picker open or closed. If the picker is disabled, nothing will happen.
   * @public
   */
  toggle(): void {
    if (this._isDisabled) return;
    this.display.toggle();
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Shows the picker unless the picker is disabled.
   * @public
   */
  show(): void {
    if (this._isDisabled) return;
    this.display.show();
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Hides the picker unless the picker is disabled.
   * @public
   */
  hide(): void {
    this.display.hide();
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
    this.optionsStore.input?.setAttribute('disabled', 'disabled');
    this.display.hide();
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Enables the picker and the target input field.
   * @public
   */
  enable(): void {
    this._isDisabled = false;
    this.optionsStore.input?.removeAttribute('disabled');
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Clears all the selected dates
   * @public
   */
  clear(): void {
    this.optionsStore.input.value = '';
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
    callbacks: (event: any) => void | ((event: any) => void)[] //eslint-disable-line @typescript-eslint/no-explicit-any
  ): { unsubscribe: () => void } | { unsubscribe: () => void }[] {
    if (typeof eventTypes === 'string') {
      eventTypes = [eventTypes];
    }
    let callBackArray: any[]; //eslint-disable-line @typescript-eslint/no-explicit-any
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
    this.display.hide();
    // this will clear the document click event listener
    this.display._dispose();
    this._eventEmitters.destroy();
    this.optionsStore.input?.removeEventListener(
      'change',
      this._inputChangeEvent
    );
    if (this.optionsStore.options.allowInputToggle) {
      this.optionsStore.input?.removeEventListener(
        'click',
        this._openClickEvent
      );
      this.optionsStore.input?.removeEventListener(
        'focus',
        this._openClickEvent
      );
    }
    this._toggle?.removeEventListener('click', this._toggleClickEvent);
    this._subscribers = {};
  }

  /**
   * Updates the options to use the provided language.
   * THe language file must be loaded first.
   * @param language
   */
  locale(language: string) {
    const asked = loadedLocales[language];
    if (!asked) return;
    this.updateOptions({
      localization: asked,
    });
  }

  /**
   * Triggers an event like ChangeEvent when the picker has updated the value
   * of a selected date.
   * @param event Accepts a BaseEvent object.
   * @private
   */
  private _triggerEvent(event: BaseEvent) {
    event.viewMode = this.optionsStore.currentView;

    const isChangeEvent = event.type === Namespace.events.change;
    if (isChangeEvent) {
      const { date, oldDate, isClear } = event as ChangeEvent;
      if (
        (date && oldDate && date.isSame(oldDate)) ||
        (!isClear && !date && !oldDate)
      ) {
        return;
      }
      this._handleAfterChangeEvent(event as ChangeEvent);

      this.optionsStore.input?.dispatchEvent(
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        new CustomEvent('change', { detail: event as any })
      );
    }

    this.optionsStore.element.dispatchEvent(
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      new CustomEvent(event.type, { detail: event as any })
    );

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).jQuery) {
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const $ = (window as any).jQuery;

      if (isChangeEvent && this.optionsStore.input) {
        $(this.optionsStore.input).trigger(event);
      } else {
        $(this.optionsStore.element).trigger(event);
      }
    }

    this._publish(event);
  }

  private _publish(event: BaseEvent) {
    // return if event is not subscribed
    if (!Array.isArray(this._subscribers[event.type])) {
      return;
    }

    // Trigger callback for each subscriber
    this._subscribers[event.type].forEach((callback) => {
      callback(event);
    });
  }

  /**
   * Fires a ViewUpdate event when, for example, the month view is changed.
   * @private
   */
  private _viewUpdate() {
    this._triggerEvent({
      type: Namespace.events.update,
      viewDate: this.optionsStore.viewDate.clone,
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
  ): void {
    let newConfig = OptionConverter.deepCopy(config);
    newConfig = OptionConverter._mergeOptions(newConfig, mergeTo);
    if (includeDataset)
      newConfig = OptionConverter._dataToOptions(
        this.optionsStore.element,
        newConfig
      );

    OptionConverter._validateConflicts(newConfig);

    newConfig.viewDate = newConfig.viewDate.setLocalization(
      newConfig.localization
    );

    if (!this.optionsStore.viewDate.isSame(newConfig.viewDate)) {
      this.optionsStore.viewDate = newConfig.viewDate;
    }

    /**
     * Sets the minimum view allowed by the picker. For example the case of only
     * allowing year and month to be selected but not date.
     */
    if (newConfig.display.components.year) {
      this.optionsStore.minimumCalendarViewMode = 2;
    }
    if (newConfig.display.components.month) {
      this.optionsStore.minimumCalendarViewMode = 1;
    }
    if (newConfig.display.components.date) {
      this.optionsStore.minimumCalendarViewMode = 0;
    }

    this.optionsStore.currentCalendarViewMode = Math.max(
      this.optionsStore.minimumCalendarViewMode,
      this.optionsStore.currentCalendarViewMode
    );

    // Update view mode if needed
    if (
      CalendarModes[this.optionsStore.currentCalendarViewMode].name !==
      newConfig.display.viewMode
    ) {
      this.optionsStore.currentCalendarViewMode = Math.max(
        CalendarModes.findIndex((x) => x.name === newConfig.display.viewMode),
        this.optionsStore.minimumCalendarViewMode
      );
    }

    if (this.display?.isVisible) {
      this.display._update('all');
    }

    if (
      newConfig.display.components.useTwentyfourHour &&
      newConfig.localization.hourCycle === undefined
    )
      newConfig.localization.hourCycle = 'h24';
    else if (newConfig.localization.hourCycle === undefined) {
      newConfig.localization.hourCycle = guessHourCycle(
        newConfig.localization.locale
      );
    }

    this.optionsStore.options = newConfig;

    if (
      newConfig.restrictions.maxDate &&
      this.viewDate.isAfter(newConfig.restrictions.maxDate)
    )
      this.viewDate = newConfig.restrictions.maxDate.clone;

    if (
      newConfig.restrictions.minDate &&
      this.viewDate.isBefore(newConfig.restrictions.minDate)
    )
      this.viewDate = newConfig.restrictions.minDate.clone;
  }

  /**
   * Checks if an input field is being used, attempts to locate one and sets an
   * event listener if found.
   * @private
   */
  private _initializeInput() {
    if (this.optionsStore.element.tagName == 'INPUT') {
      this.optionsStore.input = this.optionsStore.element as HTMLInputElement;
    } else {
      const query = this.optionsStore.element.dataset.tdTargetInput;
      if (query == undefined || query == 'nearest') {
        this.optionsStore.input =
          this.optionsStore.element.querySelector('input');
      } else {
        this.optionsStore.input =
          this.optionsStore.element.querySelector(query);
      }
    }

    if (!this.optionsStore.input) return;

    if (!this.optionsStore.input.value && this.optionsStore.options.defaultDate)
      this.optionsStore.input.value = this.dates.formatInput(
        this.optionsStore.options.defaultDate
      );

    this.optionsStore.input.addEventListener('change', this._inputChangeEvent);
    if (this.optionsStore.options.allowInputToggle) {
      this.optionsStore.input.addEventListener('click', this._openClickEvent);
      this.optionsStore.input.addEventListener('focus', this._openClickEvent);
    }

    if (this.optionsStore.input.value) {
      this._inputChangeEvent();
    }
  }

  /**
   * Attempts to locate a toggle for the picker and sets an event listener
   * @private
   */
  private _initializeToggle() {
    if (this.optionsStore.options.display.inline) return;
    let query = this.optionsStore.element.dataset.tdTargetToggle;
    if (query == 'nearest') {
      query = '[data-td-toggle="datetimepicker"]';
    }
    this._toggle =
      query == undefined
        ? this.optionsStore.element
        : this.optionsStore.element.querySelector(query);
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
      !this.optionsStore.options.promptTimeOnDateChange ||
      this.optionsStore.options.multipleDates ||
      this.optionsStore.options.display.inline ||
      this.optionsStore.options.display.sideBySide ||
      // time is disabled
      !this.display._hasTime ||
      // clock component is already showing
      this.display.widget
        ?.getElementsByClassName(Namespace.css.show)[0]
        .classList.contains(Namespace.css.timeContainer)
    )
      return;

    // First time ever. If useCurrent option is set to true (default), do nothing
    // because the first date is selected automatically.
    // or date didn't change (time did) or date changed because time did.
    if (
      (!e.oldDate && this.optionsStore.options.useCurrent) ||
      (e.oldDate && e.date?.isSame(e.oldDate))
    ) {
      return;
    }

    clearTimeout(this._currentPromptTimeTimeout);
    this._currentPromptTimeTimeout = setTimeout(() => {
      if (this.display.widget) {
        this._eventEmitters.action.emit({
          e: {
            currentTarget: this.display.widget.querySelector(
              '[data-action="togglePicker"]'
            ),
          },
          action: ActionTypes.togglePicker,
        });
      }
    }, this.optionsStore.options.promptTimeOnDateChangeTransitionDelay);
  }

  /**
   * Event for when the input field changes. This is a class level method so there's
   * something for the remove listener function.
   * @private
   */
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _inputChangeEvent = (event?: any) => {
    const internallyTriggered = event?.detail;
    if (internallyTriggered) return;

    const setViewDate = () => {
      if (this.dates.lastPicked)
        this.optionsStore.viewDate = this.dates.lastPicked.clone;
    };

    const value = this.optionsStore.input.value;
    if (
      this.optionsStore.options.multipleDates ||
      this.optionsStore.options.dateRange
    ) {
      try {
        const valueSplit = value.split(
          this.optionsStore.options.multipleDatesSeparator
        );
        for (let i = 0; i < valueSplit.length; i++) {
          this.dates.setFromInput(valueSplit[i], i);
        }
        setViewDate();
      } catch {
        console.warn(
          'TD: Something went wrong trying to set the multipleDates values from the input field.'
        );
      }
    } else {
      this.dates.setFromInput(value, 0);
      setViewDate();
    }
  };

  /**
   * Event for when the toggle is clicked. This is a class level method so there's
   * something for the remove listener function.
   * @private
   */
  private _toggleClickEvent = () => {
    if (
      (this.optionsStore.element as HTMLInputElement)?.disabled ||
      this.optionsStore.input?.disabled ||
      //if we just have the input and allow input toggle is enabled, then don't cause a toggle
      (this._toggle.nodeName === 'INPUT' &&
        (this._toggle as HTMLInputElement)?.type === 'text' &&
        this.optionsStore.options.allowInputToggle)
    )
      return;
    this.toggle();
  };

  /**
   * Event for when the toggle is clicked. This is a class level method so there's
   * something for the remove listener function.
   * @private
   */
  private _openClickEvent = () => {
    if (
      (this.optionsStore.element as HTMLInputElement)?.disabled ||
      this.optionsStore.input?.disabled
    )
      return;
    if (!this.display.isVisible) this.show();
  };
}

/**
 * Whenever a locale is loaded via a plugin then store it here based on the
 * locale name. E.g. loadedLocales['ru']
 */
const loadedLocales = {};

// noinspection JSUnusedGlobalSymbols
/**
 * Called from a locale plugin.
 * @param l locale object for localization options
 */
const loadLocale = (l) => {
  if (loadedLocales[l.name]) return;
  loadedLocales[l.name] = l.localization;
};

/**
 * A sets the global localization options to the provided locale name.
 * `loadLocale` MUST be called first.
 * @param l
 */
const locale = (l: string) => {
  const asked = loadedLocales[l];
  if (!asked) return;
  DefaultOptions.localization = asked;
};

// noinspection JSUnusedGlobalSymbols
/**
 * Called from a plugin to extend or override picker defaults.
 * @param plugin
 * @param option
 */
const extend = function (plugin, option = undefined) {
  if (!plugin) return tempusDominus;
  if (!plugin.installed) {
    // install plugin only once
    plugin(
      option,
      { TempusDominus, Dates, Display, DateTime, Namespace },
      tempusDominus
    );
    plugin.installed = true;
  }
  return tempusDominus;
};

const version = '6.9.4';

const tempusDominus = {
  TempusDominus,
  extend,
  loadLocale,
  locale,
  Namespace,
  DefaultOptions,
  DateTime,
  Unit,
  version,
  DefaultEnLocalization,
};

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
  DefaultEnLocalization,
};
