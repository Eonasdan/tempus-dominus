import DateDisplay from './calendar/date-display';
import MonthDisplay from './calendar/month-display';
import YearDisplay from './calendar/year-display';
import DecadeDisplay from './calendar/decade-display';
import TimeDisplay from './time/time-display';
import HourDisplay from './time/hour-display';
import MinuteDisplay from './time/minute-display';
import SecondDisplay from './time/second-display';
import { DateTime, Unit } from '../datetime';
import { createPopper } from '@popperjs/core';
import Namespace from '../utilities/namespace';
import { HideEvent } from '../utilities/event-types';
import Collapse from './collapse';
import Validation from '../validation';
import Dates from '../dates';
import { EventEmitters, ViewUpdateValues } from '../utilities/event-emitter';
import { serviceLocator } from '../utilities/service-locator';
import ActionTypes from '../utilities/action-types';
import CalendarModes from '../utilities/calendar-modes';
import {OptionsStore} from "../utilities/optionsStore";

/**
 * Main class for all things display related.
 */
export default class Display {
  private _widget: HTMLElement;
  private _popperInstance: any;
  private _isVisible = false;
  private optionsStore: OptionsStore;
  private validation: Validation;
  private dates: Dates;

  dateDisplay: DateDisplay;
  monthDisplay: MonthDisplay;
  yearDisplay: YearDisplay;
  decadeDisplay: DecadeDisplay;
  timeDisplay: TimeDisplay;
  hourDisplay: HourDisplay;
  minuteDisplay: MinuteDisplay;
  secondDisplay: SecondDisplay;
  private _eventEmitters: EventEmitters;

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
    //todo do I want some kind of error catching or other guards here?
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
  paint(_unit: Unit | 'decade', _date: DateTime, _classes: string[], _element: HTMLElement) {
    // implemented in plugin
  }

  /**
   * Shows the picker and creates a Popper instance if needed.
   * Add document click event to hide when clicking outside the picker.
   * @fires Events#show
   */
  show(): void {
    if (this.widget == undefined) {
     if (this.dates.picked.length == 0) {
          if (
            this.optionsStore.options.useCurrent &&
            !this.optionsStore.options.defaultDate
          ) {
            const date = new DateTime().setLocale(
              this.optionsStore.options.localization.locale
            );
            if (!this.optionsStore.options.keepInvalid) {
              let tries = 0;
              let direction = 1;
              if (this.optionsStore.options.restrictions.maxDate?.isBefore(date)) {
                direction = -1;
              }
              while (!this.validation.isValid(date)) {
                date.manipulate(direction, Unit.date);
                if (tries > 31) break;
                tries++;
              }
            }
            this.dates.setValue(date);
          }
    
          if (this.optionsStore.options.defaultDate) {
            this.dates.setValue(this.optionsStore.options.defaultDate);
          }
      }

      this._buildWidget();

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
      if (!this.optionsStore.currentCalendarViewMode) {
        this.optionsStore.currentCalendarViewMode =
          this.optionsStore.minimumCalendarViewMode;
      }

      if (!onlyClock && this.optionsStore.options.display.viewMode !== 'clock') {
        if (this._hasTime) {
          Collapse.hideImmediately(this.widget.querySelector(`div.${Namespace.css.timeContainer}`));
        }
        Collapse.show(this.widget.querySelector(`div.${Namespace.css.dateContainer}`));
      }

      if (this._hasDate) {
        this._showMode();
      }

      if (!this.optionsStore.options.display.inline) {
        // If needed to change the parent container
        const container = this.optionsStore.options?.container || document.body;
        container.appendChild(this.widget);

        this._popperInstance = createPopper(
          this.optionsStore.element,
          this.widget,
          {
            modifiers: [{ name: 'eventListeners', enabled: true }],
            //#2400
            placement:
              document.documentElement.dir === 'rtl'
                ? 'bottom-end'
                : 'bottom-start',
          }
        );
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
      this._popperInstance.update();
      document.addEventListener('click', this._documentClickEvent);
    }
    this._eventEmitters.triggerEvent.emit({ type: Namespace.events.show });
    this._isVisible = true;
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
    let picker: HTMLElement = this.widget.querySelector(
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
    this._updateCalendarHeader();
    this._eventEmitters.viewUpdate.emit();
  }

  _updateCalendarHeader() {
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
        switcher.innerText = this.optionsStore.viewDate.format(
          this.optionsStore.options.localization.dayViewHeaderFormat
        );
        break;
    }
    switcher.innerText = switcher.getAttribute(showing);
  }

  /**
   * Hides the picker if needed.
   * Remove document click event to hide when clicking outside the picker.
   * @fires Events#hide
   */
  hide(): void {
    if (!this.widget || !this._isVisible) return;

    this.widget.classList.remove(Namespace.css.show);

    if (this._isVisible) {
      this._eventEmitters.triggerEvent.emit({
        type: Namespace.events.hide,
        date: this.optionsStore.unset
          ? null
          : this.dates.lastPicked
          ? this.dates.lastPicked.clone
          : void 0,
      } as HideEvent);
      this._isVisible = false;
    }

    document.removeEventListener('click', this._documentClickEvent);
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
    template.classList.add(Namespace.css.widget);

    const dateView = document.createElement('div');
    dateView.classList.add(Namespace.css.dateContainer);
    dateView.append(
      this.getHeadTemplate(),
      this.decadeDisplay.getPicker(),
      this.yearDisplay.getPicker(),
      this.monthDisplay.getPicker(),
      this.dateDisplay.getPicker()
    );

    const timeView = document.createElement('div');
    timeView.classList.add(Namespace.css.timeContainer);
    timeView.appendChild(this.timeDisplay.getPicker(this._iconTag.bind(this)));
    timeView.appendChild(this.hourDisplay.getPicker());
    timeView.appendChild(this.minuteDisplay.getPicker());
    timeView.appendChild(this.secondDisplay.getPicker());

    const toolbar = document.createElement('div');
    toolbar.classList.add(Namespace.css.toolbar);
    toolbar.append(...this.getToolbarElements());

    if (this.optionsStore.options.display.inline) {
      template.classList.add(Namespace.css.inline);
    }

    if (this.optionsStore.options.display.calendarWeeks) {
      template.classList.add('calendarWeeks');
    }

    if (
      this.optionsStore.options.display.sideBySide &&
      this._hasDate &&
      this._hasTime
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
      return;
    }

    if (this.optionsStore.options.display.toolbarPlacement === 'top') {
      template.appendChild(toolbar);
    }

    if (this._hasDate) {
      if (this._hasTime) {
        dateView.classList.add(Namespace.css.collapse);
        if (this.optionsStore.options.display.viewMode !== 'clock')
          dateView.classList.add(Namespace.css.show);
      }
      template.appendChild(dateView);
    }

    if (this._hasTime) {
      if (this._hasDate) {
        timeView.classList.add(Namespace.css.collapse);
        if (this.optionsStore.options.display.viewMode === 'clock')
          timeView.classList.add(Namespace.css.show);
      }
      template.appendChild(timeView);
    }

    if (this.optionsStore.options.display.toolbarPlacement === 'bottom') {
      template.appendChild(toolbar);
    }

    const arrow = document.createElement('div');
    arrow.classList.add('arrow');
    arrow.setAttribute('data-popper-arrow', '');
    template.appendChild(arrow);

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

  /**
   * Get the toolbar html based on options like buttons.today
   * @private
   */
  getToolbarElements(): HTMLElement[] {
    const toolbar = [];

    if (this.optionsStore.options.display.buttons.today) {
      const div = document.createElement('div');
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
      div.setAttribute('data-action', ActionTypes.togglePicker);
      div.setAttribute('title', title);

      div.appendChild(this._iconTag(icon));
      toolbar.push(div);
    }
    if (this.optionsStore.options.display.buttons.clear) {
      const div = document.createElement('div');
      div.setAttribute('data-action', ActionTypes.clear);
      div.setAttribute('title', this.optionsStore.options.localization.clear);

      div.appendChild(
        this._iconTag(this.optionsStore.options.display.icons.clear)
      );
      toolbar.push(div);
    }
    if (this.optionsStore.options.display.buttons.close) {
      const div = document.createElement('div');
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

    const switcher = document.createElement('div');
    switcher.classList.add(Namespace.css.switch);
    switcher.setAttribute('data-action', ActionTypes.changeCalendarView);

    const next = document.createElement('div');
    next.classList.add(Namespace.css.next);
    next.setAttribute('data-action', ActionTypes.next);
    next.appendChild(
      this._iconTag(this.optionsStore.options.display.icons.next)
    );

    calendarHeader.append(previous, switcher, next);
    return calendarHeader;
  }

  /**
   * Builds an icon tag as either an `<i>`
   * or with icons.type is `sprites` then a svg tag instead
   * @param iconClass
   * @private
   */
  _iconTag(iconClass: string): HTMLElement|SVGElement {
    if (this.optionsStore.options.display.icons.type === 'sprites') {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

      const icon = document.createElementNS('http://www.w3.org/2000/svg', 'use');
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
    if (this.optionsStore.options.debug || (window as any).debug) return;

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
    if (wasVisible) this.hide();
    this._dispose();
    if (wasVisible) {
      this.show();
    }
  }
}

export type Paint = (
  unit: Unit | 'decade',
  innerDate: DateTime,
  classes: string[],
  element: HTMLElement
) => void;
