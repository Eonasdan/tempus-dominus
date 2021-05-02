import DateDisplay from './calendar/date-display';
import MonthDisplay from './calendar/month-display';
import YearDisplay from './calendar/year-display';
import DecadeDisplay from './calendar/decade-display';
import TimeDisplay from './time/time-display';
import HourDisplay from './time/hour-display';
import MinuteDisplay from './time/minute-display';
import SecondDisplay from './time/second-display';
import { DateTime, Unit } from '../datetime';
import { DatePickerModes } from '../conts';
import { TempusDominus } from '../tempus-dominus';
import { ActionTypes } from '../actions';
import { createPopper } from '@popperjs/core';
import Namespace from '../namespace';
import { HideEvent } from '../event-types';

/**
 * Main class for all things display related.
 */
export default class Display {
  private _context: TempusDominus;
  private _dateDisplay: DateDisplay;
  private _monthDisplay: MonthDisplay;
  private _yearDisplay: YearDisplay;
  private _decadeDisplay: DecadeDisplay;
  private _timeDisplay: TimeDisplay;
  private _widget: HTMLElement;
  private _hourDisplay: HourDisplay;
  private _minuteDisplay: MinuteDisplay;
  private _secondDisplay: SecondDisplay;
  private _popperInstance: any;
  private _isVisible: boolean = false;

  constructor(context: TempusDominus) {
    this._context = context;
    this._dateDisplay = new DateDisplay(context);
    this._monthDisplay = new MonthDisplay(context);
    this._yearDisplay = new YearDisplay(context);
    this._decadeDisplay = new DecadeDisplay(context);
    this._timeDisplay = new TimeDisplay(context);
    this._hourDisplay = new HourDisplay(context);
    this._minuteDisplay = new MinuteDisplay(context);
    this._secondDisplay = new SecondDisplay(context);

    this._widget = undefined;
  }

  /**
   * Returns the widget body or undefined
   * @private
   */
  get widget(): HTMLElement | undefined {
    return this._widget;
  }

  /**
   * Updates the table for a particular unit. Used when an option as changed or
   * whenever the class list might need to be refreshed.
   * @param unit
   * @private
   */
  _update(unit: Unit | 'clock' | 'calendar' | 'all'): void {
    if (!this.widget) return;
    //todo do I want some kind of error catching or other guards here?
    switch (unit) {
      case Unit.seconds:
        this._secondDisplay._update();
        break;
      case Unit.minutes:
        this._minuteDisplay._update();
        break;
      case Unit.hours:
        this._hourDisplay._update();
        break;
      case Unit.date:
        this._dateDisplay._update();
        break;
      case Unit.month:
        this._monthDisplay._update();
        break;
      case Unit.year:
        this._yearDisplay._update();
        break;
      case 'clock':
        this._timeDisplay._update();
        this._update(Unit.hours);
        this._update(Unit.minutes);
        this._update(Unit.seconds);
        break;
      case 'calendar':
        this._update(Unit.date);
        this._update(Unit.year);
        this._update(Unit.month);
        this._decadeDisplay._update();
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

  /**
   * Shows the picker and creates a Popper instance if needed.
   * Add document click event to hide when clicking outside the picker.
   * @fires Events#show
   */
  show(): void {
    if (this.widget == undefined) {
      if (this._context.options.useCurrent) {
        //todo in the td4 branch a pr changed this to allow granularity
        this._context.dates._setValue(new DateTime());
      }
      this._buildWidget();
      if (this._hasDate) {
        this._showMode();
      }

      if (!this._context.options.display.inline) {
        document.body.appendChild(this.widget);

        this._popperInstance = createPopper(
          this._context._element,
          this.widget,
          {
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [0, 8],
                },
              },
              { name: 'eventListeners', enabled: true },
            ],
            placement: 'auto',
          }
        );
      } else {
        this._context._element.appendChild(this.widget);
      }

      if (this._context.options.display.viewMode == 'clock') {
        this._context._action.do(
          {
            currentTarget: this.widget.querySelector(
              `.${Namespace.Css.timeContainer}`
            ),
          },
          ActionTypes.showClock
        );
      }

      this.widget
        .querySelectorAll('[data-action]')
        .forEach((element) =>
          element.addEventListener('click', this._actionsClickEvent)
        );

      // show the clock when using sideBySide
      if (this._context.options.display.sideBySide) {
        this._timeDisplay._update();
        (this.widget.getElementsByClassName(
          Namespace.Css.clockContainer
        )[0] as HTMLElement).style.display = 'block';
      }
    }

    this.widget.classList.add(Namespace.Css.show);
    if (!this._context.options.display.inline) {
      this._popperInstance.update();
      document.addEventListener('click', this._documentClickEvent);
    }
    this._context._triggerEvent({ name: Namespace.Events.show });
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
        this._context._minViewModeNumber,
        Math.min(3, this._context.currentViewMode + direction)
      );
      if (this._context.currentViewMode == max) return;
      this._context.currentViewMode = max;
    }
    this.widget
      .querySelectorAll(
        `.${Namespace.Css.dateContainer} > div, .${Namespace.Css.timeContainer} > div`
      )
      .forEach((e: HTMLElement) => (e.style.display = 'none'));

    const datePickerMode = DatePickerModes[this._context.currentViewMode];
    let picker: HTMLElement = this.widget.querySelector(
      `.${datePickerMode.CLASS_NAME}`
    );

    switch (datePickerMode.CLASS_NAME) {
      case Namespace.Css.decadesContainer:
        this._decadeDisplay._update();
        break;
      case Namespace.Css.yearsContainer:
        this._yearDisplay._update();
        break;
      case Namespace.Css.monthsContainer:
        this._monthDisplay._update();
        break;
      case Namespace.Css.daysContainer:
        this._dateDisplay._update();
        break;
    }

    picker.style.display = 'block';
  }

  /**
   * Hides the picker if needed.
   * Remove document click event to hide when clicking outside the picker.
   * @fires Events#hide
   */
  hide(): void {
    this.widget.classList.remove(Namespace.Css.show);

    if (this._isVisible) {
      this._context._triggerEvent({
        name: Namespace.Events.hide,
        date: this._context._unset
          ? null
          : this._context.dates.lastPicked
          ? this._context.dates.lastPicked.clone
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
    template.classList.add(Namespace.Css.widget);

    const dateView = document.createElement('div');
    dateView.classList.add(Namespace.Css.dateContainer);
    dateView.appendChild(this._decadeDisplay._picker);
    dateView.appendChild(this._yearDisplay._picker);
    dateView.appendChild(this._monthDisplay._picker);
    dateView.appendChild(this._dateDisplay._picker);

    const timeView = document.createElement('div');
    timeView.classList.add(Namespace.Css.timeContainer);
    timeView.appendChild(this._timeDisplay._picker);
    timeView.appendChild(this._hourDisplay._picker);
    timeView.appendChild(this._minuteDisplay._picker);
    timeView.appendChild(this._secondDisplay._picker);

    const toolbar = document.createElement('div');
    toolbar.classList.add(Namespace.Css.switch);
    toolbar.appendChild(this._toolbar);

    if (this._context.options.display.inline) {
      template.classList.add(Namespace.Css.inline);
    }

    if (
      this._context.options.display.sideBySide &&
      this._hasDate &&
      this._hasTime
    ) {
      template.classList.add(Namespace.Css.sideBySide);
      if (this._context.options.display.toolbarPlacement === 'top') {
        template.appendChild(toolbar);
      }
      const row = document.createElement('div');
      row.classList.add('td-row');
      dateView.classList.add('td-half');
      timeView.classList.add('td-half');

      row.appendChild(dateView);
      row.appendChild(timeView);
      template.appendChild(row);
      if (
        this._context.options.display.toolbarPlacement === 'bottom' ||
        this._context.options.display.toolbarPlacement === 'default'
      ) {
        template.appendChild(toolbar);
      }
      this._widget = template;
      return;
    }

    if (this._context.options.display.toolbarPlacement === 'top') {
      template.appendChild(toolbar);
    }

    if (this._hasDate) {
      if (this._context.options.display.collapse && this._hasTime) {
        dateView.classList.add(Namespace.Css.collapse);
        if (this._context.options.display.viewMode !== 'clock')
          dateView.classList.add(Namespace.Css.show);
      }
      template.appendChild(dateView);
    }

    if (this._context.options.display.toolbarPlacement === 'default') {
      template.appendChild(toolbar);
    }

    if (this._hasTime) {
      if (this._context.options.display.collapse && this._hasDate) {
        timeView.classList.add(Namespace.Css.collapse);
        if (this._context.options.display.viewMode === 'clock')
          timeView.classList.add(Namespace.Css.show);
      }
      template.appendChild(timeView);
    }

    if (this._context.options.display.toolbarPlacement === 'bottom') {
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
      this._context.options.display.components.hours ||
      this._context.options.display.components.minutes ||
      this._context.options.display.components.seconds
    );
  }

  /**
   * Returns true if the year, month, or date component is turned on
   */
  get _hasDate(): boolean {
    return (
      this._context.options.display.components.year ||
      this._context.options.display.components.month ||
      this._context.options.display.components.date
    );
  }

  /**
   * Get the toolbar html based on options like buttons.today
   * @private
   */
  get _toolbar(): HTMLTableElement {
    const tbody = document.createElement('tbody');

    if (this._context.options.display.buttons.today) {
      const td = document.createElement('td');
      const div = document.createElement('div');
      div.setAttribute('data-action', ActionTypes.today);
      div.setAttribute('title', this._context.options.localization.today);

      div.appendChild(this._iconTag(this._context.options.display.icons.today));
      td.appendChild(div);
      tbody.appendChild(td);
    }
    if (
      !this._context.options.display.sideBySide &&
      this._context.options.display.collapse &&
      this._hasDate &&
      this._hasTime
    ) {
      let title, icon;
      if (this._context.options.display.viewMode === 'clock') {
        title = this._context.options.localization.selectDate;
        icon = this._context.options.display.icons.date;
      } else {
        title = this._context.options.localization.selectTime;
        icon = this._context.options.display.icons.time;
      }

      const td = document.createElement('td');
      const div = document.createElement('div');
      div.setAttribute('data-action', ActionTypes.togglePicker);
      div.setAttribute('title', title);

      div.appendChild(this._iconTag(icon));
      td.appendChild(div);
      tbody.appendChild(td);
    }
    if (this._context.options.display.buttons.clear) {
      const td = document.createElement('td');
      const div = document.createElement('div');
      div.setAttribute('data-action', ActionTypes.clear);
      div.setAttribute('title', this._context.options.localization.clear);

      div.appendChild(this._iconTag(this._context.options.display.icons.clear));
      td.appendChild(div);
      tbody.appendChild(td);
    }
    if (this._context.options.display.buttons.close) {
      const td = document.createElement('td');
      const div = document.createElement('div');
      div.setAttribute('data-action', ActionTypes.close);
      div.setAttribute('title', this._context.options.localization.close);

      div.appendChild(this._iconTag(this._context.options.display.icons.close));
      td.appendChild(div);
      tbody.appendChild(td);
    }
    const table = document.createElement('table');
    table.appendChild(tbody);

    return table;
  }

  /***
   * Builds the base header template with next and previous icons
   * @private
   */
  get _headTemplate(): HTMLElement {
    let div = document.createElement('div');
    const headTemplate = document.createElement('thead');
    const previous = document.createElement('th');
    previous.classList.add(Namespace.Css.previous);
    previous.setAttribute('data-action', ActionTypes.previous);
    div.appendChild(
      this._iconTag(this._context.options.display.icons.previous)
    );
    previous.appendChild(div);
    headTemplate.appendChild(previous);

    const switcher = document.createElement('th');
    switcher.classList.add(Namespace.Css.switch);
    switcher.setAttribute('data-action', ActionTypes.pickerSwitch);
    switcher.setAttribute(
      'colspan',
      this._context.options.display.calendarWeeks ? '6' : '5'
    );
    headTemplate.appendChild(switcher);

    const next = document.createElement('th');
    next.classList.add(Namespace.Css.next);
    next.setAttribute('data-action', ActionTypes.next);
    div = document.createElement('div');
    div.appendChild(this._iconTag(this._context.options.display.icons.next));
    next.appendChild(div);
    headTemplate.appendChild(next);
    return <HTMLElement>headTemplate.cloneNode(true);
  }

  /**
   * Builds an icon tag as either an `<i>`
   * or with icons.type is `sprites` then an svg tag instead
   * @param iconClass
   * @private
   */
  _iconTag(iconClass: string): HTMLElement {
    if (this._context.options.display.icons.type === 'sprites') {
      const svg = document.createElement('svg');
      svg.innerHTML = `<use xlink:href='${iconClass}'></use>`;
      return svg;
    }
    const icon = document.createElement('i');
    DOMTokenList.prototype.add.apply(icon.classList, iconClass.split(' '));
    return icon;
  }

  /**
   * A document click event to hide the widget if click is outside
   * @private
   * @param e MouseEvent
   */
  private _documentClickEvent = (e: MouseEvent) => {
    if (
      this._isVisible &&
      !e.composedPath().includes(this.widget) && // click inside the widget
      !e.composedPath()?.includes(this._context._element) && // click on the element
      (!this._context.options.keepOpen || !this._context.options.debug)
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
    this._context._action.do(e);
  };

  /**
   * Cases the widget to get rebuilt on next show. If the picker is already open
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
