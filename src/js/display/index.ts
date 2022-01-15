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
import Collapse from './collapse';

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
  private _isVisible = false;

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
        if (!this._hasTime) break;
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

  /**
   * Shows the picker and creates a Popper instance if needed.
   * Add document click event to hide when clicking outside the picker.
   * @fires Events#show
   */
  show(): void {
    if (this.widget == undefined) {
      if (
        this._context._options.useCurrent &&
        !this._context._options.defaultDate &&
        !this._context._input?.value
      ) {
        //todo in the td4 branch a pr changed this to allow granularity
        const date = new DateTime().setLocale(
          this._context._options.localization.locale
        );
        if (!this._context._options.keepInvalid) {
          let tries = 0;
          let direction = 1;
          if (this._context._options.restrictions.maxDate?.isBefore(date)) {
            direction = -1;
          }
          while (!this._context._validation.isValid(date)) {
            date.manipulate(direction, Unit.date);
            if (tries > 31) break;
            tries++;
          }
        }
        this._context.dates._setValue(date);
      }

      if (this._context._options.defaultDate) {
        this._context.dates._setValue(this._context._options.defaultDate);
      }

      this._buildWidget();

      // If modeView is only clock
      const onlyClock = this._hasTime && !this._hasDate;

      // reset the view to the clock if there's no date components
      if (onlyClock) {
        this._context._action.do(null, ActionTypes.showClock);
      }

      // otherwise return to the calendar view
      this._context._currentViewMode = this._context._minViewModeNumber;

      if (!onlyClock) {
        if (this._hasTime) {
          Collapse.hide(this._context._display.widget.querySelector(`div.${Namespace.css.timeContainer}`));
        }
        Collapse.show(this._context._display.widget.querySelector(`div.${Namespace.css.dateContainer}`));
      }

      if (this._hasDate) {
        this._showMode();
      }

      if (!this._context._options.display.inline) {
        // If needed to change the parent container
        const container = this._context._options?.container || document.body;
        container.appendChild(this.widget);

        this._popperInstance = createPopper(
          this._context._element,
          this.widget,
          {
            modifiers: [{ name: 'eventListeners', enabled: true }],
            //#2400
            placement:
              document.documentElement.dir === 'rtl'
                ? 'bottom-end'
                : 'bottom-start'
          }
        );
      } else {
        this._context._element.appendChild(this.widget);
      }

      if (this._context._options.display.viewMode == 'clock') {
        this._context._action.do(null, ActionTypes.showClock);
      }

      this.widget
        .querySelectorAll('[data-action]')
        .forEach((element) =>
          element.addEventListener('click', this._actionsClickEvent)
        );

      // show the clock when using sideBySide
      if (this._context._options.display.sideBySide) {
        this._timeDisplay._update();
        (
          this.widget.getElementsByClassName(
            Namespace.css.clockContainer
          )[0] as HTMLElement
        ).style.display = 'grid';
      }
    }

    this.widget.classList.add(Namespace.css.show);
    if (!this._context._options.display.inline) {
      this._popperInstance.update();
      document.addEventListener('click', this._documentClickEvent);
    }
    this._context._triggerEvent({ type: Namespace.events.show });
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
        Math.min(3, this._context._currentViewMode + direction)
      );
      if (this._context._currentViewMode == max) return;
      this._context._currentViewMode = max;
    }

    this.widget
      .querySelectorAll(
        `.${Namespace.css.dateContainer} > div:not(.${Namespace.css.calendarHeader}), .${Namespace.css.timeContainer} > div:not(.${Namespace.css.clockContainer})`
      )
      .forEach((e: HTMLElement) => (e.style.display = 'none'));

    const datePickerMode = DatePickerModes[this._context._currentViewMode];
    let picker: HTMLElement = this.widget.querySelector(
      `.${datePickerMode.className}`
    );

    switch (datePickerMode.className) {
      case Namespace.css.decadesContainer:
        this._decadeDisplay._update();
        break;
      case Namespace.css.yearsContainer:
        this._yearDisplay._update();
        break;
      case Namespace.css.monthsContainer:
        this._monthDisplay._update();
        break;
      case Namespace.css.daysContainer:
        this._dateDisplay._update();
        break;
    }

    picker.style.display = 'grid';
    this._updateCalendarHeader();
  }

  _updateCalendarHeader() {
    const showing = [
      ...this.widget.querySelector(
        `.${Namespace.css.dateContainer} div[style*="display: grid"]`
      ).classList
    ].find((x) => x.startsWith(Namespace.css.dateContainer));

    const [previous, switcher, next] = this._context._display.widget
      .getElementsByClassName(Namespace.css.calendarHeader)[0]
      .getElementsByTagName('div');

    switch (showing) {
      case Namespace.css.decadesContainer:
        previous.setAttribute(
          'title',
          this._context._options.localization.previousCentury
        );
        switcher.setAttribute('title', '');
        next.setAttribute(
          'title',
          this._context._options.localization.nextCentury
        );
        break;
      case Namespace.css.yearsContainer:
        previous.setAttribute(
          'title',
          this._context._options.localization.previousDecade
        );
        switcher.setAttribute(
          'title',
          this._context._options.localization.selectDecade
        );
        next.setAttribute(
          'title',
          this._context._options.localization.nextDecade
        );
        break;
      case Namespace.css.monthsContainer:
        previous.setAttribute(
          'title',
          this._context._options.localization.previousYear
        );
        switcher.setAttribute(
          'title',
          this._context._options.localization.selectYear
        );
        next.setAttribute(
          'title',
          this._context._options.localization.nextYear
        );
        break;
      case Namespace.css.daysContainer:
        previous.setAttribute(
          'title',
          this._context._options.localization.previousMonth
        );
        switcher.setAttribute(
          'title',
          this._context._options.localization.selectMonth
        );
        next.setAttribute(
          'title',
          this._context._options.localization.nextMonth
        );
        switcher.innerText = this._context._viewDate.format(this._context._options.localization.dayViewHeaderFormat);
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
      this._context._triggerEvent({
        type: Namespace.events.hide,
        date: this._context._unset
          ? null
          : this._context.dates.lastPicked
            ? this._context.dates.lastPicked.clone
            : void 0
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
      this._headTemplate,
      this._decadeDisplay._picker,
      this._yearDisplay._picker,
      this._monthDisplay._picker,
      this._dateDisplay._picker
    );

    const timeView = document.createElement('div');
    timeView.classList.add(Namespace.css.timeContainer);
    timeView.appendChild(this._timeDisplay._picker);
    timeView.appendChild(this._hourDisplay._picker);
    timeView.appendChild(this._minuteDisplay._picker);
    timeView.appendChild(this._secondDisplay._picker);

    const toolbar = document.createElement('div');
    toolbar.classList.add(Namespace.css.toolbar);
    toolbar.append(...this._toolbar);

    if (this._context._options.display.inline) {
      template.classList.add(Namespace.css.inline);
    }

    if (this._context._options.display.calendarWeeks) {
      template.classList.add('calendarWeeks');
    }

    if (
      this._context._options.display.sideBySide &&
      this._hasDate &&
      this._hasTime
    ) {
      template.classList.add(Namespace.css.sideBySide);
      if (this._context._options.display.toolbarPlacement === 'top') {
        template.appendChild(toolbar);
      }
      const row = document.createElement('div');
      row.classList.add('td-row');
      dateView.classList.add('td-half');
      timeView.classList.add('td-half');

      row.appendChild(dateView);
      row.appendChild(timeView);
      template.appendChild(row);
      if (this._context._options.display.toolbarPlacement === 'bottom') {
        template.appendChild(toolbar);
      }
      this._widget = template;
      return;
    }

    if (this._context._options.display.toolbarPlacement === 'top') {
      template.appendChild(toolbar);
    }

    if (this._hasDate) {
      if (this._hasTime) {
        dateView.classList.add(Namespace.css.collapse);
        if (this._context._options.display.viewMode !== 'clock')
          dateView.classList.add(Namespace.css.show);
      }
      template.appendChild(dateView);
    }

    if (this._hasTime) {
      if (this._hasDate) {
        timeView.classList.add(Namespace.css.collapse);
        if (this._context._options.display.viewMode === 'clock')
          timeView.classList.add(Namespace.css.show);
      }
      template.appendChild(timeView);
    }

    if (this._context._options.display.toolbarPlacement === 'bottom') {
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
      this._context._options.display.components.clock &&
      (this._context._options.display.components.hours ||
        this._context._options.display.components.minutes ||
        this._context._options.display.components.seconds)
    );
  }

  /**
   * Returns true if the year, month, or date component is turned on
   */
  get _hasDate(): boolean {
    return (
      this._context._options.display.components.calendar &&
      (this._context._options.display.components.year ||
        this._context._options.display.components.month ||
        this._context._options.display.components.date)
    );
  }

  /**
   * Get the toolbar html based on options like buttons.today
   * @private
   */
  get _toolbar(): HTMLElement[] {
    const toolbar = [];

    if (this._context._options.display.buttons.today) {
      const div = document.createElement('div');
      div.setAttribute('data-action', ActionTypes.today);
      div.setAttribute('title', this._context._options.localization.today);

      div.appendChild(
        this._iconTag(this._context._options.display.icons.today)
      );
      toolbar.push(div);
    }
    if (
      !this._context._options.display.sideBySide &&
      this._hasDate &&
      this._hasTime
    ) {
      let title, icon;
      if (this._context._options.display.viewMode === 'clock') {
        title = this._context._options.localization.selectDate;
        icon = this._context._options.display.icons.date;
      } else {
        title = this._context._options.localization.selectTime;
        icon = this._context._options.display.icons.time;
      }

      const div = document.createElement('div');
      div.setAttribute('data-action', ActionTypes.togglePicker);
      div.setAttribute('title', title);

      div.appendChild(this._iconTag(icon));
      toolbar.push(div);
    }
    if (this._context._options.display.buttons.clear) {
      const div = document.createElement('div');
      div.setAttribute('data-action', ActionTypes.clear);
      div.setAttribute('title', this._context._options.localization.clear);

      div.appendChild(
        this._iconTag(this._context._options.display.icons.clear)
      );
      toolbar.push(div);
    }
    if (this._context._options.display.buttons.close) {
      const div = document.createElement('div');
      div.setAttribute('data-action', ActionTypes.close);
      div.setAttribute('title', this._context._options.localization.close);

      div.appendChild(
        this._iconTag(this._context._options.display.icons.close)
      );
      toolbar.push(div);
    }

    return toolbar;
  }

  /***
   * Builds the base header template with next and previous icons
   * @private
   */
  get _headTemplate(): HTMLElement {
    const calendarHeader = document.createElement('div');
    calendarHeader.classList.add(Namespace.css.calendarHeader);

    const previous = document.createElement('div');
    previous.classList.add(Namespace.css.previous);
    previous.setAttribute('data-action', ActionTypes.previous);
    previous.appendChild(
      this._iconTag(this._context._options.display.icons.previous)
    );

    const switcher = document.createElement('div');
    switcher.classList.add(Namespace.css.switch);
    switcher.setAttribute('data-action', ActionTypes.pickerSwitch);

    const next = document.createElement('div');
    next.classList.add(Namespace.css.next);
    next.setAttribute('data-action', ActionTypes.next);
    next.appendChild(this._iconTag(this._context._options.display.icons.next));

    calendarHeader.append(previous, switcher, next);
    return calendarHeader;
  }

  /**
   * Builds an icon tag as either an `<i>`
   * or with icons.type is `sprites` then an svg tag instead
   * @param iconClass
   * @private
   */
  _iconTag(iconClass: string): HTMLElement {
    if (this._context._options.display.icons.type === 'sprites') {
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
    if (this._context._options.debug || (window as any).debug) return;

    if (
      this._isVisible &&
      !e.composedPath().includes(this.widget) && // click inside the widget
      !e.composedPath()?.includes(this._context._element) // click on the element
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
