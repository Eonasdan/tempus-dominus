import { DatePickerModes } from './conts.js';
import { DateTime, Unit } from './datetime';
import { TempusDominus } from './tempus-dominus';
import Collapse from './display/collapse';
import Namespace from './namespace';

/**
 *
 */
export default class Actions {
  private _context: TempusDominus;
  private collapse: Collapse;

  constructor(context: TempusDominus) {
    this._context = context;
    this.collapse = new Collapse();
  }

  /**
   * Performs the selected `action`. See ActionTypes
   * @param e This is normally a click event
   * @param action If not provided, then look for a [data-action]
   */
  do(e: any, action?: ActionTypes) {
    const currentTarget = e.currentTarget;
    if (currentTarget.classList.contains(Namespace.Css.disabled)) return false;
    action = action || currentTarget.dataset.action;
    const lastPicked = (
      this._context.dates.lastPicked || this._context.viewDate
    ).clone;

    /**
     * Common function to manipulate {@link lastPicked} by `unit`
     * @param unit
     * @param value Value to change by
     */
    const manipulateAndSet = (unit: Unit, value = 1) => {
      const newDate = lastPicked.manipulate(value, unit);
      if (this._context._validation.isValid(newDate, unit)) {
        /*if (this.context.dates.lastPickedIndex < 0) {
                    this.date(newDate);
                }*/
        this._context.dates._setValue(
          newDate,
          this._context.dates.lastPickedIndex
        );
      }
    };

    switch (action) {
      case ActionTypes.next:
      case ActionTypes.previous:
        const { NAV_FUNCTION, NAV_STEP } = DatePickerModes[
          this._context.currentViewMode
        ];
        if (action === ActionTypes.next)
          this._context.viewDate.manipulate(NAV_STEP, NAV_FUNCTION);
        else this._context.viewDate.manipulate(NAV_STEP * -1, NAV_FUNCTION);
        this._context._display._update('calendar');
        this._context._viewUpdate(NAV_FUNCTION);
        break;
      case ActionTypes.pickerSwitch:
        this._context._display._showMode(1);
        break;
      case ActionTypes.selectMonth:
      case ActionTypes.selectYear:
      case ActionTypes.selectDecade:
        const value = +currentTarget.getAttribute('data-value');
        switch (action) {
          case ActionTypes.selectMonth:
            this._context.viewDate.month = value;
            this._context._viewUpdate(Unit.month);
            break;
          case ActionTypes.selectYear:
            this._context.viewDate.year = value;
            this._context._viewUpdate(Unit.year);
            break;
          case ActionTypes.selectDecade:
            this._context.viewDate.year = value;
            this._context._viewUpdate(Unit.year);
            break;
        }

        if (
          this._context.currentViewMode === this._context._minViewModeNumber
        ) {
          this._context.dates._setValue(
            this._context.viewDate,
            this._context.dates.lastPickedIndex
          );
          if (!this._context.options.display.inline) {
            this._context._display.hide();
          }
        } else {
          this._context._display._showMode(-1);
        }
        break;
      case ActionTypes.selectDay:
        const day = this._context.viewDate.clone;
        if (currentTarget.classList.contains(Namespace.Css.old)) {
          day.manipulate(-1, Unit.month);
        }
        if (currentTarget.classList.contains(Namespace.Css.new)) {
          day.manipulate(1, Unit.month);
        }

        day.date = +currentTarget.innerText;
        let index = 0;
        if (this._context.options.allowMultidate) {
          index = this._context.dates.pickedIndex(day, Unit.date);
          if (index !== -1) {
            this._context.dates._setValue(null, index); //deselect multi-date
          } else {
            this._context.dates._setValue(
              day,
              this._context.dates.lastPickedIndex + 1
            );
          }
        } else {
          this._context.dates._setValue(
            day,
            this._context.dates.lastPickedIndex
          );
        }

        if (
          !this._context._display._hasTime &&
          !this._context.options.keepOpen &&
          !this._context.options.display.inline &&
          !this._context.options.allowMultidate
        ) {
          this._context._display.hide();
        }
        break;
      case ActionTypes.selectHour:
        let hour = +currentTarget.getAttribute('data-value');
        lastPicked.hours = hour;
        this._context.dates._setValue(
          lastPicked,
          this._context.dates.lastPickedIndex
        );
        if (
          this._context.options.display.components.useTwentyfourHour &&
          !this._context.options.display.components.minutes &&
          !this._context.options.keepOpen &&
          !this._context.options.display.inline
        ) {
          this._context._display.hide();
        } else {
          this.do(e, ActionTypes.showClock);
        }
        break;
      case ActionTypes.selectMinute:
        lastPicked.minutes = +currentTarget.innerText;
        this._context.dates._setValue(
          lastPicked,
          this._context.dates.lastPickedIndex
        );
        if (
          this._context.options.display.components.useTwentyfourHour &&
          !this._context.options.display.components.seconds &&
          !this._context.options.keepOpen &&
          !this._context.options.display.inline
        ) {
          this._context._display.hide();
        } else {
          this.do(e, ActionTypes.showClock);
        }
        break;
      case ActionTypes.selectSecond:
        lastPicked.seconds = +currentTarget.innerText;
        this._context.dates._setValue(
          lastPicked,
          this._context.dates.lastPickedIndex
        );
        if (
          this._context.options.display.components.useTwentyfourHour &&
          !this._context.options.keepOpen &&
          !this._context.options.display.inline
        ) {
          this._context._display.hide();
        } else {
          this.do(e, ActionTypes.showClock);
        }
        break;
      case ActionTypes.incrementHours:
        manipulateAndSet(Unit.hours);
        break;
      case ActionTypes.incrementMinutes:
        manipulateAndSet(Unit.minutes, this._context.options.stepping);
        break;
      case ActionTypes.incrementSeconds:
        manipulateAndSet(Unit.seconds);
        break;
      case ActionTypes.decrementHours:
        manipulateAndSet(Unit.hours, -1);
        break;
      case ActionTypes.decrementMinutes:
        manipulateAndSet(Unit.minutes, this._context.options.stepping * -1);
        break;
      case ActionTypes.decrementSeconds:
        manipulateAndSet(Unit.seconds, -1);
        break;
      case ActionTypes.togglePeriod:
        manipulateAndSet(
          Unit.hours,
          this._context.dates.lastPicked.hours >= 12 ? -12 : 12
        );
        break;
      case ActionTypes.togglePicker:
        this._context._display.widget
          .querySelectorAll(
            `.${Namespace.Css.dateContainer}, .${Namespace.Css.timeContainer}`
          )
          .forEach((htmlElement: HTMLElement) =>
            this.collapse.toggle(htmlElement)
          );

        if (
          currentTarget.getAttribute('title') ===
          this._context.options.localization.selectDate
        ) {
          currentTarget.setAttribute(
            'title',
            this._context.options.localization.selectTime
          );
          currentTarget.innerHTML = this._context._display._iconTag(
            this._context.options.display.icons.time
          ).outerHTML;
          this._context._display._update('calendar');
        } else {
          currentTarget.setAttribute(
            'title',
            this._context.options.localization.selectDate
          );
          currentTarget.innerHTML = this._context._display._iconTag(
            this._context.options.display.icons.date
          ).outerHTML;
          this.do(e, ActionTypes.showClock);
          this._context._display._update('clock');
        }
        break;
      case ActionTypes.showClock:
      case ActionTypes.showHours:
      case ActionTypes.showMinutes:
      case ActionTypes.showSeconds:
        this._context._display.widget
          .querySelectorAll(`.${Namespace.Css.timeContainer} > div`)
          .forEach(
            (htmlElement: HTMLElement) => (htmlElement.style.display = 'none')
          );

        let classToUse = '';
        switch (action) {
          case ActionTypes.showClock:
            classToUse = Namespace.Css.clockContainer;
            this._context._display._update('clock');
            break;
          case ActionTypes.showHours:
            classToUse = Namespace.Css.hourContainer;
            this._context._display._update(Unit.hours);
            break;
          case ActionTypes.showMinutes:
            classToUse = Namespace.Css.minuteContainer;
            this._context._display._update(Unit.minutes);
            break;
          case ActionTypes.showSeconds:
            classToUse = Namespace.Css.secondContainer;
            this._context._display._update(Unit.seconds);
            break;
        }

        (<HTMLElement>(
          this._context._display.widget.getElementsByClassName(classToUse)[0]
        )).style.display = 'block';
        break;
      case ActionTypes.clear:
        this._context.dates._setValue(null);
        break;
      case ActionTypes.close:
        this._context._display.hide();
        break;
      case ActionTypes.today:
        const today = new DateTime();
        this._context.viewDate = today;
        if (this._context._validation.isValid(today, Unit.date))
          this._context.dates._setValue(
            today,
            this._context.dates.lastPickedIndex
          );
        break;
    }
  }
}

export enum ActionTypes {
  next = 'next',
  previous = 'previous',
  pickerSwitch = 'pickerSwitch',
  selectMonth = 'selectMonth',
  selectYear = 'selectYear',
  selectDecade = 'selectDecade',
  selectDay = 'selectDay',
  selectHour = 'selectHour',
  selectMinute = 'selectMinute',
  selectSecond = 'selectSecond',
  incrementHours = 'incrementHours',
  incrementMinutes = 'incrementMinutes',
  incrementSeconds = 'incrementSeconds',
  decrementHours = 'decrementHours',
  decrementMinutes = 'decrementMinutes',
  decrementSeconds = 'decrementSeconds',
  togglePeriod = 'togglePeriod',
  togglePicker = 'togglePicker',
  showClock = 'showClock',
  showHours = 'showHours',
  showMinutes = 'showMinutes',
  showSeconds = 'showSeconds',
  clear = 'clear',
  close = 'close',
  today = 'today',
}
