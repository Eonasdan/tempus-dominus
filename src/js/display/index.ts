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

export default class Display {
  private context: TempusDominus;
  private dateDisplay: DateDisplay;
  private monthDisplay: MonthDisplay;
  private yearDisplay: YearDisplay;
  private decadeDisplay: DecadeDisplay;
  private timeDisplay: TimeDisplay;
  private _widget: HTMLElement;
  private hourDisplay: HourDisplay;
  private minuteDisplay: MinuteDisplay;
  private secondDisplay: SecondDisplay;
  private popperInstance: any;
  private isVisible: boolean = false;

  constructor(context: TempusDominus) {
    this.context = context;
    this.dateDisplay = new DateDisplay(context);
    this.monthDisplay = new MonthDisplay(context);
    this.yearDisplay = new YearDisplay(context);
    this.decadeDisplay = new DecadeDisplay(context);
    this.timeDisplay = new TimeDisplay(context);
    this.hourDisplay = new HourDisplay(context);
    this.minuteDisplay = new MinuteDisplay(context);
    this.secondDisplay = new SecondDisplay(context);

    this._widget = undefined;
  }

  get widget(): HTMLElement {
    return this._widget;
  }

  update(unit: Unit | 'clock' | 'calendar' | 'all'): void {
    if (!this._widget) return;
    //todo do I want some kind of error catching or other guards here?
    switch (unit) {
      case Unit.seconds:
        this.secondDisplay.update();
        break;
      case Unit.minutes:
        this.minuteDisplay.update();
        break;
      case Unit.hours:
        this.hourDisplay.update();
        break;
      case Unit.date:
        this.dateDisplay.update();
        break;
      case Unit.month:
        this.monthDisplay.update();
        break;
      case Unit.year:
        this.yearDisplay.update();
        break;
      case 'clock':
        this.timeDisplay.update();
        this.update(Unit.hours);
        this.update(Unit.minutes);
        this.update(Unit.seconds);
        break;
      case 'calendar':
        this.update(Unit.date);
        this.update(Unit.year);
        this.update(Unit.month);
        this.decadeDisplay.update();
        break;
      case 'all':
        if (this._hasTime) {
          this.update('clock');
        }
        if (this._hasDate) {
          this.update('calendar');
        }
    }
  }

  show(): void {
    if (this.widget == undefined) {
      if (this.context.options.useCurrent) {
        //todo in the td4 branch a pr changed this to allow granularity
        this.context.dates._setValue(new DateTime());
      }
      this._buildWidget();
      if (this._hasDate) {
        this._showMode();
      }

      document.body.appendChild(this.widget);

      if (this.context.options.display.viewMode == 'times') {
        this.context.action.do(
          {
            currentTarget: this.widget.querySelector(
              `.${Namespace.Css.timeContainer}`
            ),
          },
          ActionTypes.showClock
        );
      }

      this.widget.querySelectorAll('[data-action]').forEach((element) =>
        element.addEventListener('click', (e) => {
          this.context.action.do(e);
        })
      );

      this.popperInstance = createPopper(this.context.element, this.widget, {
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 8],
            },
          },
          { name: 'eventListeners', enabled: true },
        ],
        placement: 'top',
      });
    }

    this.widget.classList.add(Namespace.Css.show);
    this.popperInstance.update();
    this.context._notifyEvent({ name: Namespace.Events.SHOW });
    this.isVisible = true;
    document.addEventListener('click', this.documentClickEvent);
  }

  _showMode(direction?: number): void {
    if (!this.widget) {
      return;
    }
    if (direction) {
      const max = Math.max(
        this.context.minViewModeNumber,
        Math.min(3, this.context.currentViewMode + direction)
      );
      if (this.context.currentViewMode == max) return;
      this.context.currentViewMode = max;
    }
    this.widget
      .querySelectorAll(
        `.${Namespace.Css.dateContainer} > div, .${Namespace.Css.timeContainer} > div`
      )
      .forEach((e: HTMLElement) => (e.style.display = 'none'));

    const datePickerMode = DatePickerModes[this.context.currentViewMode];
    let picker: HTMLElement = this.widget.querySelector(
      `.${datePickerMode.CLASS_NAME}`
    );

    switch (datePickerMode.CLASS_NAME) {
      case Namespace.Css.decadesContainer:
        this.decadeDisplay.update();
        break;
      case Namespace.Css.yearsContainer:
        this.yearDisplay.update();
        break;
      case Namespace.Css.monthsContainer:
        this.monthDisplay.update();
        break;
      case Namespace.Css.daysContainer:
        this.dateDisplay.update();
        break;
    }

    picker.style.display = 'block';
  }

  hide(): void {
    this.widget.classList.remove(Namespace.Css.show);

    this.context._notifyEvent({
      name: Namespace.Events.HIDE,
      date: this.context.unset
        ? null
        : this.context.dates.lastPicked
        ? this.context.dates.lastPicked.clone
        : void 0,
    } as HideEvent);
    this.isVisible = false;

    document.removeEventListener('click', this.documentClickEvent);
  }

  toggle() {
    return this.isVisible ? this.hide() : this.show();
  }

  _buildWidget(): HTMLElement {
    const template = document.createElement('div');
    template.classList.add(Namespace.Css.widget);
    if (this.context.options.display.calendarWeeks)
      template.classList.add(Namespace.Css.widgetCalendarWeeks);

    const dateView = document.createElement('div');
    dateView.classList.add(Namespace.Css.dateContainer);
    dateView.appendChild(this.decadeDisplay.picker);
    dateView.appendChild(this.yearDisplay.picker);
    dateView.appendChild(this.monthDisplay.picker);
    dateView.appendChild(this.dateDisplay.picker);

    const timeView = document.createElement('div');
    timeView.classList.add(Namespace.Css.timeContainer);
    timeView.appendChild(this.timeDisplay.picker);
    timeView.appendChild(this.hourDisplay.picker);
    timeView.appendChild(this.minuteDisplay.picker);
    timeView.appendChild(this.secondDisplay.picker);

    const toolbar = document.createElement('div');
    toolbar.classList.add(Namespace.Css.switch);
    toolbar.appendChild(this._toolbar);

    if (this.context.options.display.components.useTwentyfourHour) {
      template.classList.add(Namespace.Css.useTwentyfour);
    }

    if (
      this.context.options.display.components.seconds &&
      !this.context.options.display.components.useTwentyfourHour
    ) {
      template.classList.add(Namespace.Css.wider);
    }

    if (
      this.context.options.display.sideBySide &&
      this._hasDate &&
      this._hasTime
    ) {
      template.classList.add(Namespace.Css.sideBySide);
      if (this.context.options.display.toolbarPlacement === 'top') {
        template.appendChild(toolbar);
      }
      const row = document.createElement('div');
      row.classList.add('row'); //todo bootstrap
      dateView.classList.add('col-md-6');
      timeView.classList.add('col-md-6');

      row.appendChild(dateView);
      row.appendChild(timeView);

      if (
        this.context.options.display.toolbarPlacement === 'bottom' ||
        this.context.options.display.toolbarPlacement === 'default'
      ) {
        template.appendChild(toolbar);
      }
      this._widget = template;
      return;
    }

    if (this.context.options.display.toolbarPlacement === 'top') {
      template.appendChild(toolbar);
    }

    if (this._hasDate) {
      if (this.context.options.display.collapse && this._hasTime) {
        dateView.classList.add(Namespace.Css.collapse);
        if (this.context.options.display.viewMode !== 'times')
          dateView.classList.add(Namespace.Css.show);
      }
      template.appendChild(dateView);
    }

    if (this.context.options.display.toolbarPlacement === 'default') {
      template.appendChild(toolbar);
    }

    if (this._hasTime) {
      if (this.context.options.display.collapse && this._hasDate) {
        timeView.classList.add(Namespace.Css.collapse);
        if (this.context.options.display.viewMode === 'times')
          timeView.classList.add(Namespace.Css.show);
      }
      template.appendChild(timeView);
    }

    if (this.context.options.display.toolbarPlacement === 'bottom') {
      template.appendChild(toolbar);
    }

    const arrow = document.createElement('div');
    arrow.classList.add('arrow');
    arrow.setAttribute('data-popper-arrow', '');
    template.appendChild(arrow);

    this._widget = template;
  }

  get _hasTime(): boolean {
    return (
      this.context.options.display.components.hours ||
      this.context.options.display.components.minutes ||
      this.context.options.display.components.seconds
    );
  }

  get _hasDate(): boolean {
    return (
      this.context.options.display.components.year ||
      this.context.options.display.components.month ||
      this.context.options.display.components.date
    );
  }

  get _toolbar(): HTMLTableElement {
    const tbody = document.createElement('tbody');

    if (this.context.options.display.buttons.today) {
      const td = document.createElement('td');
      const div = document.createElement('div');
      div.setAttribute('data-action', ActionTypes.today);
      div.setAttribute('title', this.context.options.localization.today);

      div.appendChild(this.iconTag(this.context.options.display.icons.today));
      td.appendChild(div);
      tbody.appendChild(td);
    }
    if (
      !this.context.options.display.sideBySide &&
      this.context.options.display.collapse &&
      this._hasDate &&
      this._hasTime
    ) {
      let title, icon;
      if (this.context.options.display.viewMode === 'times') {
        title = this.context.options.localization.selectDate;
        icon = this.context.options.display.icons.date;
      } else {
        title = this.context.options.localization.selectTime;
        icon = this.context.options.display.icons.time;
      }

      const td = document.createElement('td');
      const div = document.createElement('div');
      div.setAttribute('data-action', ActionTypes.togglePicker);
      div.setAttribute('title', title);

      div.appendChild(this.iconTag(icon));
      td.appendChild(div);
      tbody.appendChild(td);
    }
    if (this.context.options.display.buttons.clear) {
      const td = document.createElement('td');
      const div = document.createElement('div');
      div.setAttribute('data-action', ActionTypes.clear);
      div.setAttribute('title', this.context.options.localization.clear);

      div.appendChild(this.iconTag(this.context.options.display.icons.clear));
      td.appendChild(div);
      tbody.appendChild(td);
    }
    if (this.context.options.display.buttons.close) {
      const td = document.createElement('td');
      const div = document.createElement('div');
      div.setAttribute('data-action', ActionTypes.close);
      div.setAttribute('title', this.context.options.localization.close);

      div.appendChild(this.iconTag(this.context.options.display.icons.close));
      td.appendChild(div);
      tbody.appendChild(td);
    }
    const table = document.createElement('table');
    table.appendChild(tbody);

    return table;
  }

  /***
   *
   */
  get headTemplate(): HTMLElement {
    let div = document.createElement('div');
    const headTemplate = document.createElement('thead');
    const previous = document.createElement('th');
    previous.classList.add(Namespace.Css.previous);
    previous.setAttribute('data-action', ActionTypes.previous);
    div.appendChild(this.iconTag(this.context.options.display.icons.previous));
    previous.appendChild(div);
    headTemplate.appendChild(previous);

    const switcher = document.createElement('th');
    switcher.classList.add(Namespace.Css.switch);
    switcher.setAttribute('data-action', ActionTypes.pickerSwitch);
    switcher.setAttribute(
      'colspan',
      this.context.options.display.calendarWeeks ? '6' : '5'
    );
    headTemplate.appendChild(switcher);

    const next = document.createElement('th');
    next.classList.add(Namespace.Css.next);
    next.setAttribute('data-action', ActionTypes.next);
    div = document.createElement('div');
    div.appendChild(this.iconTag(this.context.options.display.icons.next));
    next.appendChild(div);
    headTemplate.appendChild(next);
    return <HTMLElement>headTemplate.cloneNode(true);
  }

  iconTag(i: string): HTMLElement {
    if (this.context.options.display.icons.type === 'sprites') {
      const svg = document.createElement('svg');
      svg.innerHTML = `<use xlink:href="${i}"></use>`;
      return svg;
    }
    const icon = document.createElement('i');
    DOMTokenList.prototype.add.apply(icon.classList, i.split(' '));
    return icon;
  }

  private documentClickEvent = (e) => {
    if (
      this.isVisible &&
      !e.composedPath().includes(this.widget) && // click inside the widget
      !e.composedPath()?.includes(this.context.element) && // click on the element
      (!this.context.options.keepOpen || !this.context.options.debug)
    ) {
      this.hide();
    }
  };
}
