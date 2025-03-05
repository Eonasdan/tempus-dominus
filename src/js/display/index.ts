import DateDisplay from './calendar/date-display';
import MonthDisplay from './calendar/month-display';
import YearDisplay from './calendar/year-display';
import DecadeDisplay from './calendar/decade-display';
import TimeDisplay from './time/time-display';
import HourDisplay from './time/hour-display';
import MinuteDisplay from './time/minute-display';
import SecondDisplay from './time/second-display';
import { DateTime, Unit } from '../datetime';
import Namespace from '../utilities/namespace';
import { HideEvent } from '../utilities/event-types';
import Collapse from './collapse';
import Validation from '../validation';
import Dates from '../dates';
import { EventEmitters, ViewUpdateValues } from '../utilities/event-emitter';
import { serviceLocator } from '../utilities/service-locator';
import ActionTypes from '../utilities/action-types';
import CalendarModes from '../utilities/calendar-modes';
import { OptionsStore } from '../utilities/optionsStore';

/**
 * Main class for all things display related.
 */
export default class Display {
  private _widget: HTMLElement;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _popperInstance: any;
  private _isVisible = false;
  private optionsStore: OptionsStore;
  private validation: Validation;
  private dates: Dates;
  private _eventEmitters: EventEmitters;
  private _keyboardEventBound = this._keyboardEvent.bind(this);

  dateDisplay: DateDisplay;
  monthDisplay: MonthDisplay;
  yearDisplay: YearDisplay;
  decadeDisplay: DecadeDisplay;
  timeDisplay: TimeDisplay;
  hourDisplay: HourDisplay;
  minuteDisplay: MinuteDisplay;
  secondDisplay: SecondDisplay;

  constructor() {
    this.optionsStore = serviceLocator.locate(OptionsStore);
    this.validation = serviceLocator.locate(Validation);
    this.dates = serviceLocator.locate(Dates);

    this.dateDisplay = serviceLocator.locate(DateDisplay);
    this.monthDisplay = serviceLocator.locate(MonthDisplay);
    this.yearDisplay = serviceLocator.locate(YearDisplay);
    this.decadeDisplay = serviceLocator.locate(DecadeDisplay);
    this.timeDisplay = serviceLocator.locate(TimeDisplay);
    this.hourDisplay = serviceLocator.locate(HourDisplay);
    this.minuteDisplay = serviceLocator.locate(MinuteDisplay);
    this.secondDisplay = serviceLocator.locate(SecondDisplay);
    this._eventEmitters = serviceLocator.locate(EventEmitters);
    this._widget = undefined;

    this._eventEmitters.updateDisplay.subscribe((result: ViewUpdateValues) => {
      this._update(result);
    });
  }

  /**
   * Returns the widget body or undefined
   * @private
   */
  get widget(): HTMLElement | undefined {
    return this._widget;
  }

  get dateContainer(): HTMLElement | undefined {
    return this.widget?.querySelector(`div.${Namespace.css.dateContainer}`);
  }

  get timeContainer(): HTMLElement | undefined {
    return this.widget?.querySelector(`div.${Namespace.css.timeContainer}`);
  }

  /**
   * Returns this visible state of the picker (shown)
   */
  get isVisible() {
    return this._isVisible;
  }

  /**
   * Updates the table for a particular unit. Used when an option as changed or
   * whenever the class list might need to be refreshed.
   * @param unit
   * @private
   */
  _update(unit: ViewUpdateValues): void {
    if (!this.widget) return;
    switch (unit) {
      case Unit.seconds:
        this.secondDisplay._update(this.widget, this.paint);
        break;
      case Unit.minutes:
        this.minuteDisplay._update(this.widget, this.paint);
        break;
      case Unit.hours:
        this.hourDisplay._update(this.widget, this.paint);
        break;
      case Unit.date:
        this.dateDisplay._update(this.widget, this.paint);
        break;
      case Unit.month:
        this.monthDisplay._update(this.widget, this.paint);
        break;
      case Unit.year:
        this.yearDisplay._update(this.widget, this.paint);
        break;
      case 'decade':
        this.decadeDisplay._update(this.widget, this.paint);
        break;
      case 'clock':
        if (!this._hasTime) break;
        this.timeDisplay._update(this.widget);
        this._update(Unit.hours);
        this._update(Unit.minutes);
        this._update(Unit.seconds);
        break;
      case 'calendar':
        this._update(Unit.date);
        this._update(Unit.year);
        this._update(Unit.month);
        this.decadeDisplay._update(this.widget, this.paint);
        this._updateCalendarHeader();
        break;
      case 'all':
        if (this._hasTime) {
          this._update('clock');
        }
        if (this._hasDate) {
          this._update('calendar');
        }
    }
  }

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
  ) {
    // implemented in plugin
  }

  /**
   * Shows the picker and creates a Popper instance if needed.
   * Add document click event to hide when clicking outside the picker.
   * fires Events#show
   */
  show(): void {
    if (this.widget == undefined) {
      this._showSetDefaultIfNeeded();

      this._buildWidget();
      this._updateTheme();

      this._showSetupViewMode();

      if (!this.optionsStore.options.display.inline) {
        // If needed to change the parent container
        const container = this.optionsStore.options?.container || document.body;
        const placement =
          this.optionsStore.options?.display?.placement || 'bottom';

        container.appendChild(this.widget);
        this.createPopup(this.optionsStore.element, this.widget, {
          modifiers: [{ name: 'eventListeners', enabled: true }],
          //#2400
          placement:
            document.documentElement.dir === 'rtl'
              ? `${placement}-end`
              : `${placement}-start`,
        }).then(() => {
          this._handleFocus();
        });
      } else {
        this.optionsStore.element.appendChild(this.widget);
      }

      if (this.optionsStore.options.display.viewMode == 'clock') {
        this._eventEmitters.action.emit({
          e: null,
          action: ActionTypes.showClock,
        });
      }

      this.widget
        .querySelectorAll('[data-action]')
        .forEach((element) =>
          element.addEventListener('click', this._actionsClickEvent)
        );

      // show the clock when using sideBySide
      if (this._hasTime && this.optionsStore.options.display.sideBySide) {
        this.timeDisplay._update(this.widget);
        (
          this.widget.getElementsByClassName(
            Namespace.css.clockContainer
          )[0] as HTMLElement
        ).style.display = 'grid';
      }
    }

    this.widget.classList.add(Namespace.css.show);
    if (!this.optionsStore.options.display.inline) {
      this.updatePopup();
      document.addEventListener('click', this._documentClickEvent);
    }
    this._eventEmitters.triggerEvent.emit({ type: Namespace.events.show });
    this._isVisible = true;

    if (this.optionsStore.options.display.keyboardNavigation) {
      this.widget.addEventListener('keydown', this._keyboardEventBound);
    }
  }

  private _showSetupViewMode() {
    // If modeView is only clock
    const onlyClock = this._hasTime && !this._hasDate;

    // reset the view to the clock if there's no date components
    if (onlyClock) {
      this.optionsStore.currentView = 'clock';
      this._eventEmitters.action.emit({
        e: null,
        action: ActionTypes.showClock,
      });
    }
    // otherwise return to the calendar view
    else if (!this.optionsStore.currentCalendarViewMode) {
      this.optionsStore.currentCalendarViewMode =
        this.optionsStore.minimumCalendarViewMode;
    }

    if (!onlyClock && this.optionsStore.options.display.viewMode !== 'clock') {
      if (this._hasTime) {
        if (!this.optionsStore.options.display.sideBySide) {
          Collapse.hideImmediately(this.timeContainer);
        } else {
          Collapse.show(this.timeContainer);
        }
      }
      Collapse.show(this.dateContainer);
    }

    if (this._hasDate) {
      this._showMode();
    }
  }

  private _showSetDefaultIfNeeded() {
    if (this.dates.picked.length != 0) return;

    if (
      this.optionsStore.options.useCurrent &&
      !this.optionsStore.options.defaultDate
    ) {
      const date = new DateTime().setLocalization(
        this.optionsStore.options.localization
      );
      if (!this.optionsStore.options.keepInvalid) {
        let tries = 0;
        let direction = 1;
        if (this.optionsStore.options.restrictions.maxDate?.isBefore(date)) {
          direction = -1;
        }
        while (!this.validation.isValid(date) && tries > 31) {
          date.manipulate(direction, Unit.date);
          tries++;
        }
      }
      this.dates.setValue(date);
    }

    if (this.optionsStore.options.defaultDate) {
      this.dates.setValue(this.optionsStore.options.defaultDate);
    }
  }

  async createPopup(
    element: HTMLElement,
    widget: HTMLElement,
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    options: any
  ): Promise<void> {
    let createPopperFunction;
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any)?.Popper) {
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      createPopperFunction = (window as any)?.Popper?.createPopper;
    } else {
      const { createPopper } = await import('@popperjs/core');
      createPopperFunction = createPopper;
    }
    if (createPopperFunction) {
      this._popperInstance = createPopperFunction(element, widget, options);
    }
  }

  updatePopup(): void {
    if (!this._popperInstance) return;
    this._popperInstance.update();
    this._handleFocus();
  }

  /**
   * Changes the calendar view mode. E.g. month <-> year
   * @param direction -/+ number to move currentViewMode
   * @private
   */
  _showMode(direction?: number): void {
    if (!this.widget) {
      return;
    }
    if (direction) {
      const max = Math.max(
        this.optionsStore.minimumCalendarViewMode,
        Math.min(3, this.optionsStore.currentCalendarViewMode + direction)
      );
      if (this.optionsStore.currentCalendarViewMode == max) return;
      this.optionsStore.currentCalendarViewMode = max;
    }

    this.widget
      .querySelectorAll(
        `.${Namespace.css.dateContainer} > div:not(.${Namespace.css.calendarHeader}), .${Namespace.css.timeContainer} > div:not(.${Namespace.css.clockContainer})`
      )
      .forEach((e: HTMLElement) => (e.style.display = 'none'));

    const datePickerMode =
      CalendarModes[this.optionsStore.currentCalendarViewMode];
    const picker: HTMLElement = this.widget.querySelector(
      `.${datePickerMode.className}`
    );

    switch (datePickerMode.className) {
      case Namespace.css.decadesContainer:
        this.decadeDisplay._update(this.widget, this.paint);
        break;
      case Namespace.css.yearsContainer:
        this.yearDisplay._update(this.widget, this.paint);
        break;
      case Namespace.css.monthsContainer:
        this.monthDisplay._update(this.widget, this.paint);
        break;
      case Namespace.css.daysContainer:
        this.dateDisplay._update(this.widget, this.paint);
        break;
    }

    picker.style.display = 'grid';

    if (this.optionsStore.options.display.sideBySide)
      (<HTMLElement>(
        this.widget.querySelectorAll(`.${Namespace.css.clockContainer}`)[0]
      )).style.display = 'grid';

    this._updateCalendarHeader();
    this._eventEmitters.viewUpdate.emit();
    this.findViewDateElement()?.focus();
  }

  /**
   * Changes the theme. E.g. light, dark or auto
   * @param theme the theme name
   * @private
   */
  _updateTheme(theme?: 'light' | 'dark' | 'auto'): void {
    if (!this.widget) {
      return;
    }
    if (theme) {
      if (this.optionsStore.options.display.theme === theme) return;
      this.optionsStore.options.display.theme = theme;
    }

    this.widget.classList.remove('light', 'dark');
    this.widget.classList.add(this._getThemeClass());

    if (this.optionsStore.options.display.theme === 'auto') {
      window
        .matchMedia(Namespace.css.isDarkPreferredQuery)
        .addEventListener('change', () => this._updateTheme());
    } else {
      window
        .matchMedia(Namespace.css.isDarkPreferredQuery)
        .removeEventListener('change', () => this._updateTheme());
    }
  }

  _getThemeClass(): string {
    const currentTheme = this.optionsStore.options.display.theme || 'auto';

    const isDarkMode =
      window.matchMedia &&
      window.matchMedia(Namespace.css.isDarkPreferredQuery).matches;

    switch (currentTheme) {
      case 'light':
        return Namespace.css.lightTheme;
      case 'dark':
        return Namespace.css.darkTheme;
      case 'auto':
        return isDarkMode ? Namespace.css.darkTheme : Namespace.css.lightTheme;
    }
  }

  _updateCalendarHeader() {
    if (!this._hasDate) return;
    const showing = [
      ...this.widget.querySelector(
        `.${Namespace.css.dateContainer} div[style*="display: grid"]`
      ).classList,
    ].find((x) => x.startsWith(Namespace.css.dateContainer));

    const [previous, switcher, next] = this.widget
      .getElementsByClassName(Namespace.css.calendarHeader)[0]
      .getElementsByTagName('div');

    switch (showing) {
      case Namespace.css.decadesContainer:
        previous.setAttribute(
          'title',
          this.optionsStore.options.localization.previousCentury
        );
        switcher.setAttribute('title', '');
        next.setAttribute(
          'title',
          this.optionsStore.options.localization.nextCentury
        );
        break;
      case Namespace.css.yearsContainer:
        previous.setAttribute(
          'title',
          this.optionsStore.options.localization.previousDecade
        );
        switcher.setAttribute(
          'title',
          this.optionsStore.options.localization.selectDecade
        );
        next.setAttribute(
          'title',
          this.optionsStore.options.localization.nextDecade
        );
        break;
      case Namespace.css.monthsContainer:
        previous.setAttribute(
          'title',
          this.optionsStore.options.localization.previousYear
        );
        switcher.setAttribute(
          'title',
          this.optionsStore.options.localization.selectYear
        );
        next.setAttribute(
          'title',
          this.optionsStore.options.localization.nextYear
        );
        break;
      case Namespace.css.daysContainer:
        previous.setAttribute(
          'title',
          this.optionsStore.options.localization.previousMonth
        );
        switcher.setAttribute(
          'title',
          this.optionsStore.options.localization.selectMonth
        );
        next.setAttribute(
          'title',
          this.optionsStore.options.localization.nextMonth
        );
        switcher.setAttribute(
          showing,
          this.optionsStore.viewDate.format(
            this.optionsStore.options.localization.dayViewHeaderFormat
          )
        );
        break;
    }
    switcher.innerText = switcher.getAttribute(showing);
  }

  /**
   * Hides the picker if needed.
   * Remove document click event to hide when clicking outside the picker.
   * fires Events#hide
   */
  hide(): void {
    if (!this.widget || !this._isVisible) return;

    this.widget.classList.remove(Namespace.css.show);

    if (this._isVisible) {
      this._eventEmitters.triggerEvent.emit({
        type: Namespace.events.hide,
        date: this.optionsStore.unset ? null : this.dates.lastPicked?.clone,
      } as HideEvent);
      this._isVisible = false;
    }

    document.removeEventListener('click', this._documentClickEvent);
    if (this.optionsStore.options.display.keyboardNavigation) {
      this.widget.removeEventListener('keydown', this._keyboardEventBound);
    }
    this.optionsStore.toggle?.focus();
  }

  /**
   * Toggles the picker's open state. Fires a show/hide event depending.
   */
  toggle() {
    return this._isVisible ? this.hide() : this.show();
  }

  /**
   * Removes document and data-action click listener and reset the widget
   * @private
   */
  _dispose() {
    document.removeEventListener('click', this._documentClickEvent);
    if (!this.widget) return;
    this.widget
      .querySelectorAll('[data-action]')
      .forEach((element) =>
        element.removeEventListener('click', this._actionsClickEvent)
      );
    this.widget.parentNode.removeChild(this.widget);
    this._widget = undefined;
  }

  /**
   * Builds the widgets html template.
   * @private
   */
  private _buildWidget(): HTMLElement {
    const template = document.createElement('div');
    template.tabIndex = -1;
    template.classList.add(Namespace.css.widget);
    template.setAttribute('role', 'widget');

    const dateView = document.createElement('div');
    dateView.tabIndex = -1;
    dateView.classList.add(Namespace.css.dateContainer);
    dateView.append(
      this.getHeadTemplate(),
      this.decadeDisplay.getPicker(),
      this.yearDisplay.getPicker(),
      this.monthDisplay.getPicker(),
      this.dateDisplay.getPicker()
    );

    const timeView = document.createElement('div');
    timeView.tabIndex = -1;
    timeView.classList.add(Namespace.css.timeContainer);
    timeView.appendChild(this.timeDisplay.getPicker(this._iconTag.bind(this)));
    timeView.appendChild(this.hourDisplay.getPicker());
    timeView.appendChild(this.minuteDisplay.getPicker());
    timeView.appendChild(this.secondDisplay.getPicker());

    const toolbar = document.createElement('div');
    toolbar.tabIndex = -1;
    toolbar.classList.add(Namespace.css.toolbar);
    toolbar.append(...this.getToolbarElements());

    if (this.optionsStore.options.display.inline) {
      template.classList.add(Namespace.css.inline);
    }

    if (this.optionsStore.options.display.calendarWeeks) {
      template.classList.add('calendarWeeks');
    }

    if (this.optionsStore.options.display.sideBySide && this._hasDateAndTime) {
      this._buildWidgetSideBySide(template, dateView, timeView, toolbar);
      return;
    }

    if (this.optionsStore.options.display.toolbarPlacement === 'top') {
      template.appendChild(toolbar);
    }

    const setupComponentView = (
      hasFirst: boolean,
      hasSecond: boolean,
      element: HTMLElement,
      shouldShow: boolean
    ) => {
      if (!hasFirst) return;
      if (hasSecond) {
        element.classList.add(Namespace.css.collapse);
        if (shouldShow) element.classList.add(Namespace.css.show);
      }
      template.appendChild(element);
    };

    setupComponentView(
      this._hasDate,
      this._hasTime,
      dateView,
      this.optionsStore.options.display.viewMode !== 'clock'
    );

    setupComponentView(
      this._hasTime,
      this._hasDate,
      timeView,
      this.optionsStore.options.display.viewMode === 'clock'
    );

    if (this.optionsStore.options.display.toolbarPlacement === 'bottom') {
      template.appendChild(toolbar);
    }

    const arrow = document.createElement('div');
    arrow.classList.add('arrow');
    arrow.setAttribute('data-popper-arrow', '');
    template.appendChild(arrow);

    this._widget = template;
  }

  private _buildWidgetSideBySide(
    template: HTMLDivElement,
    dateView: HTMLDivElement,
    timeView: HTMLDivElement,
    toolbar: HTMLDivElement
  ) {
    template.classList.add(Namespace.css.sideBySide);
    if (this.optionsStore.options.display.toolbarPlacement === 'top') {
      template.appendChild(toolbar);
    }
    const row = document.createElement('div');
    row.classList.add('td-row');
    dateView.classList.add('td-half');
    timeView.classList.add('td-half');

    row.appendChild(dateView);
    row.appendChild(timeView);
    template.appendChild(row);
    if (this.optionsStore.options.display.toolbarPlacement === 'bottom') {
      template.appendChild(toolbar);
    }
    this._widget = template;
  }

  /**
   * Returns true if the hours, minutes, or seconds component is turned on
   */
  get _hasTime(): boolean {
    return (
      this.optionsStore.options.display.components.clock &&
      (this.optionsStore.options.display.components.hours ||
        this.optionsStore.options.display.components.minutes ||
        this.optionsStore.options.display.components.seconds)
    );
  }

  /**
   * Returns true if the year, month, or date component is turned on
   */
  get _hasDate(): boolean {
    return (
      this.optionsStore.options.display.components.calendar &&
      (this.optionsStore.options.display.components.year ||
        this.optionsStore.options.display.components.month ||
        this.optionsStore.options.display.components.date)
    );
  }

  get _hasDateAndTime(): boolean {
    return this._hasDate && this._hasTime;
  }

  /**
   * Get the toolbar html based on options like buttons => today
   * @private
   */
  getToolbarElements(): HTMLElement[] {
    const toolbar = [];

    if (this.optionsStore.options.display.buttons.today) {
      const div = document.createElement('div');
      div.tabIndex = -1;
      div.setAttribute('data-action', ActionTypes.today);
      div.setAttribute('title', this.optionsStore.options.localization.today);

      div.appendChild(
        this._iconTag(this.optionsStore.options.display.icons.today)
      );
      toolbar.push(div);
    }
    if (
      !this.optionsStore.options.display.sideBySide &&
      this._hasDate &&
      this._hasTime
    ) {
      let title, icon;
      if (this.optionsStore.options.display.viewMode === 'clock') {
        title = this.optionsStore.options.localization.selectDate;
        icon = this.optionsStore.options.display.icons.date;
      } else {
        title = this.optionsStore.options.localization.selectTime;
        icon = this.optionsStore.options.display.icons.time;
      }

      const div = document.createElement('div');
      div.tabIndex = -1;
      div.setAttribute('data-action', ActionTypes.togglePicker);
      div.setAttribute('title', title);

      div.appendChild(this._iconTag(icon));
      toolbar.push(div);
    }
    if (this.optionsStore.options.display.buttons.clear) {
      const div = document.createElement('div');
      div.tabIndex = -1;
      div.setAttribute('data-action', ActionTypes.clear);
      div.setAttribute('title', this.optionsStore.options.localization.clear);

      div.appendChild(
        this._iconTag(this.optionsStore.options.display.icons.clear)
      );
      toolbar.push(div);
    }
    if (this.optionsStore.options.display.buttons.close) {
      const div = document.createElement('div');
      div.tabIndex = -1;
      div.setAttribute('data-action', ActionTypes.close);
      div.setAttribute('title', this.optionsStore.options.localization.close);

      div.appendChild(
        this._iconTag(this.optionsStore.options.display.icons.close)
      );
      toolbar.push(div);
    }

    return toolbar;
  }

  /***
   * Builds the base header template with next and previous icons
   * @private
   */
  getHeadTemplate(): HTMLElement {
    const calendarHeader = document.createElement('div');
    calendarHeader.classList.add(Namespace.css.calendarHeader);

    const previous = document.createElement('div');
    previous.classList.add(Namespace.css.previous);
    previous.setAttribute('data-action', ActionTypes.previous);
    previous.appendChild(
      this._iconTag(this.optionsStore.options.display.icons.previous)
    );
    previous.tabIndex = -1;

    const switcher = document.createElement('div');
    switcher.classList.add(Namespace.css.switch);
    switcher.setAttribute('data-action', ActionTypes.changeCalendarView);
    switcher.tabIndex = -1;

    const next = document.createElement('div');
    next.classList.add(Namespace.css.next);
    next.setAttribute('data-action', ActionTypes.next);
    next.appendChild(
      this._iconTag(this.optionsStore.options.display.icons.next)
    );
    next.tabIndex = -1;

    calendarHeader.append(previous, switcher, next);
    return calendarHeader;
  }

  /**
   * Builds an icon tag as either an `<i>`
   * or with icons => type is `sprites` then a svg tag instead
   * @param iconClass
   * @private
   */
  _iconTag(iconClass: string): HTMLElement | SVGElement {
    if (this.optionsStore.options.display.icons.type === 'sprites') {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

      const icon = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'use'
      );
      icon.setAttribute('xlink:href', iconClass); // Deprecated. Included for backward compatibility
      icon.setAttribute('href', iconClass);
      svg.appendChild(icon);

      return svg;
    }
    const icon = document.createElement('i');
    icon.classList.add(...iconClass.split(' '));
    return icon;
  }

  /**
   * A document click event to hide the widget if click is outside
   * @private
   * @param e MouseEvent
   */
  private _documentClickEvent = (e: MouseEvent) => {
    if (this.optionsStore.options.debug || (window as any).debug) return; //eslint-disable-line @typescript-eslint/no-explicit-any

    if (
      this._isVisible &&
      !e.composedPath().includes(this.widget) && // click inside the widget
      !e.composedPath()?.includes(this.optionsStore.element) // click on the element
    ) {
      this.hide();
    }
  };

  /**
   * Click event for any action like selecting a date
   * @param e MouseEvent
   * @private
   */
  private _actionsClickEvent = (e: MouseEvent) => {
    this._eventEmitters.action.emit({ e: e });
  };

  /**
   * Causes the widget to get rebuilt on next show. If the picker is already open
   * then hide and reshow it.
   * @private
   */
  _rebuild() {
    const wasVisible = this._isVisible;
    this._dispose();
    if (wasVisible) this.show();
  }

  refreshCurrentView() {
    //if the widget is not showing, just destroy it
    if (!this._isVisible) this._dispose();

    switch (this.optionsStore.currentView) {
      case 'clock':
        this._update('clock');
        break;
      case 'calendar':
        this._update(Unit.date);
        break;
      case 'months':
        this._update(Unit.month);
        break;
      case 'years':
        this._update(Unit.year);
        break;
      case 'decades':
        this._update('decade');
        break;
    }
  }

  private _keyboardEvent(event: KeyboardEvent) {
    if (this.optionsStore.currentView === 'clock') {
      this._handleKeyDownClock(event);
      return;
    }
    this._handleKeyDownDate(event);
    return false;
  }

  public findViewDateElement(): HTMLElement {
    let selector = '';
    let dataValue = '';

    switch (this.optionsStore.currentView) {
      case 'clock':
        break;
      case 'calendar':
        selector = Namespace.css.daysContainer;
        dataValue = this.optionsStore.viewDate.dateToDataValue();
        break;
      case 'months':
        selector = Namespace.css.monthsContainer;
        dataValue = this.optionsStore.viewDate.month.toString();
        break;
      case 'years':
        selector = Namespace.css.yearsContainer;
        dataValue = this.optionsStore.viewDate.year.toString();
        break;
      case 'decades':
        selector = Namespace.css.decadesContainer;
        dataValue = (
          Math.floor(this.optionsStore.viewDate.year / 10) * 10
        ).toString();
        break;
    }

    return this.widget.querySelector(
      `.${selector} > div[data-value="${dataValue}"]`
    );
  }

  private _handleKeyDownDate(event: KeyboardEvent) {
    let flag = false;
    const activeElement = document.activeElement as HTMLElement;

    let unit = null;
    let verticalChange = 7;
    let horizontalChange = 1;
    let change = 1;
    const currentView = this.optionsStore.currentView;
    switch (currentView) {
      case 'calendar':
        unit = Unit.date;
        break;
      case 'months':
        unit = Unit.month;
        verticalChange = 3;
        horizontalChange = 1;
        break;
      case 'years':
        unit = Unit.year;
        verticalChange = 3;
        horizontalChange = 1;
        break;
      case 'decades':
        unit = Unit.year;
        verticalChange = 30;
        horizontalChange = 10;
        break;
    }

    switch (event.key) {
      case 'Esc':
      case 'Escape':
        this._eventEmitters.action.emit({ e: null, action: ActionTypes.close });
        break;

      case ' ':
      case 'Enter':
        activeElement.click();

        event.stopPropagation();
        event.preventDefault();
        return;

      case 'Tab':
        this._handleTab(activeElement, event);
        return;

      case 'Right':
      case 'ArrowRight':
        change = horizontalChange;
        flag = true;
        break;

      case 'Left':
      case 'ArrowLeft':
        flag = true;
        change = -horizontalChange;
        break;

      case 'Down':
      case 'ArrowDown':
        flag = true;
        change = verticalChange;
        break;

      case 'Up':
      case 'ArrowUp':
        flag = true;
        change = -verticalChange;
        break;

      case 'PageDown':
        switch (currentView) {
          case 'calendar':
            unit = event.shiftKey ? Unit.year : Unit.month;
            change = 1;
            break;
          case 'months':
            unit = Unit.year;
            change = event.shiftKey ? 10 : 1;
            break;
          case 'years':
          case 'decades':
            unit = Unit.year;
            change = event.shiftKey ? 100 : 10;
            break;
        }
        flag = true;
        break;

      case 'PageUp':
        switch (currentView) {
          case 'calendar':
            unit = event.shiftKey ? Unit.year : Unit.month;
            change = -1;
            break;
          case 'months':
            unit = Unit.year;
            change = -(event.shiftKey ? 10 : 1);
            break;
          case 'years':
          case 'decades':
            unit = Unit.year;
            change = -(event.shiftKey ? 100 : 10);
            break;
        }
        flag = true;
        break;

      case 'Home':
        this.optionsStore.viewDate = this.optionsStore.viewDate.clone.startOf(
          'weekDay',
          this.optionsStore.options.localization.startOfTheWeek
        );
        flag = true;
        unit = null;
        break;

      case 'End':
        this.optionsStore.viewDate = this.optionsStore.viewDate.clone.endOf(
          'weekDay',
          this.optionsStore.options.localization.startOfTheWeek
        );
        flag = true;
        unit = null;
        break;
    }

    if (!flag) return;

    let newViewDate = this.optionsStore.viewDate;

    if (unit) {
      newViewDate = newViewDate.clone.manipulate(change, unit);
    }

    this._eventEmitters.updateViewDate.emit(newViewDate);

    const divWithValue = this.findViewDateElement();
    if (divWithValue) {
      divWithValue.focus();
    }

    event.stopPropagation();
    event.preventDefault();
  }

  private _handleKeyDownClock(event: KeyboardEvent) {
    let flag = false;
    const activeElement = document.activeElement as HTMLElement;

    // Should find which of hour, minute, or seconds sub-windows is open
    const visibleElement = this.widget.querySelector(
      `.${Namespace.css.timeContainer} > div[style*="display: grid"]`
    );

    let subView = Namespace.css.clockContainer;

    if (visibleElement.classList.contains(Namespace.css.hourContainer)) {
      subView = Namespace.css.hourContainer;
    }
    if (visibleElement.classList.contains(Namespace.css.minuteContainer)) {
      subView = Namespace.css.minuteContainer;
    }
    if (visibleElement.classList.contains(Namespace.css.secondContainer)) {
      subView = Namespace.css.secondContainer;
    }

    switch (event.key) {
      case 'Esc':
      case 'Escape':
        this._eventEmitters.action.emit({ e: null, action: ActionTypes.close });
        break;

      case ' ':
      case 'Enter':
        activeElement.click();

        event.stopPropagation();
        event.preventDefault();
        return;

      case 'Tab':
        this._handleTab(activeElement, event);
        return;
    }

    if (subView === Namespace.css.clockContainer) return;

    const cells = [...visibleElement.querySelectorAll('div')];
    const currentIndex = cells.indexOf(
      document.activeElement as HTMLDivElement
    );
    const columnCount = 4;

    let targetIndex: number;
    switch (event.key) {
      case 'Right':
      case 'ArrowRight':
        targetIndex = currentIndex < cells.length - 1 ? currentIndex + 1 : null;
        flag = true;
        break;

      case 'Left':
      case 'ArrowLeft':
        flag = true;
        targetIndex = currentIndex > 0 ? currentIndex - 1 : null;
        break;

      case 'Down':
      case 'ArrowDown':
        targetIndex =
          currentIndex + columnCount < cells.length
            ? currentIndex + columnCount
            : null;
        flag = true;
        break;

      case 'Up':
      case 'ArrowUp':
        targetIndex =
          currentIndex - columnCount >= 0 ? currentIndex - columnCount : null;
        flag = true;
        break;
    }

    if (!flag) return;

    if (targetIndex !== undefined && targetIndex !== null) {
      cells[targetIndex].focus();
    }

    event.stopPropagation();
    event.preventDefault();
  }

  private _handleTab(activeElement: HTMLElement, event: KeyboardEvent) {
    const shiftKey = event.shiftKey;
    // gather tab targets
    const addCalendarHeaderTargets = () => {
      const calendarHeaderItems = this.widget.querySelectorAll(
        `.${Namespace.css.calendarHeader} > div`
      ) as NodeListOf<HTMLElement>;
      tabTargets.push(...calendarHeaderItems);
    };

    const tabTargets: HTMLElement[] = [];
    switch (this.optionsStore.currentView) {
      case 'clock':
        {
          tabTargets.push(
            ...(this.widget.querySelectorAll(
              `.${Namespace.css.timeContainer} > div[style*="display: grid"] > div[data-action]`
            ) as NodeListOf<HTMLElement>)
          );

          const clock = this.widget.querySelectorAll(
            `.${Namespace.css.clockContainer}`
          )[0] as HTMLElement;

          // add meridiem if it's in view
          if (clock?.style.display === 'grid') {
            tabTargets.push(
              ...(this.widget.querySelectorAll(
                `.${Namespace.css.toggleMeridiem}`
              ) as NodeListOf<HTMLElement>)
            );
          }
        }
        break;
      case 'calendar':
      case 'months':
      case 'years':
      case 'decades':
        addCalendarHeaderTargets();
        tabTargets.push(this.findViewDateElement());
        break;
    }

    const toolbarItems = this.widget.querySelectorAll(
      `.${Namespace.css.toolbar} > div`
    ) as NodeListOf<HTMLElement>;
    tabTargets.push(...toolbarItems);

    const index = tabTargets.indexOf(activeElement);
    if (index === -1) return;

    if (shiftKey) {
      if (index === 0) {
        tabTargets[tabTargets.length - 1].focus();
      } else {
        tabTargets[index - 1].focus();
      }
    } else {
      if (index === tabTargets.length - 1) {
        tabTargets[0].focus();
      } else {
        tabTargets[index + 1].focus();
      }
    }
    event.stopPropagation();
    event.preventDefault();
  }

  private _handleFocus() {
    if (this.optionsStore.currentView === 'clock') this._handleFocusClock();
    else this.findViewDateElement().focus();
  }

  private _handleFocusClock() {
    (
      this.widget.querySelector(
        `.${Namespace.css.timeContainer} > div[style*="display: grid"]`
      ).children[0] as HTMLElement
    ).focus();
  }
}

export type Paint = (
  unit: Unit | 'decade',
  innerDate: DateTime,
  classes: string[],
  element: HTMLElement
) => void;
