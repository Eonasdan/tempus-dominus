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

  constructor(context: TempusDominus) {
    this._context = context;
  }

  /**
   * Performs the selected `action`. See ActionTypes
   * @param e This is normally a click event
   * @param action If not provided, then look for a [data-action]
   */
  do(e: any, action?: ActionTypes) {
    const currentTarget = e?.currentTarget;
    if (currentTarget?.classList?.contains(Namespace.css.disabled))
      return false;
    action = action || currentTarget?.dataset?.action;
    const lastPicked = (
      this._context.dates.lastPicked || this._context._viewDate
    ).clone;

    /**
     * Common function to manipulate {@link lastPicked} by `unit`.
     * @param unit
     * @param value Value to change by
     */
    const manipulateAndSet = (unit: Unit, value = 1) => {
      const newDate = lastPicked.manipulate(value, unit);
      if (this._context._validation.isValid(newDate, unit)) {
        this._context.dates._setValue(
          newDate,
          this._context.dates.lastPickedIndex
        );
      }
    };

    /**
     * Common function to manipulate {@link lastPicked} by `unit`.
     * After setting the value it will either show the clock or hide the widget.
     * @param unit
     * @param value Value to change by
     */
    const hideOrClock = () => {
      if (
        this._context._options.display.components.useTwentyfourHour &&
        !this._context._options.display.components.minutes &&
        !this._context._options.display.keepOpen &&
        !this._context._options.display.inline
      ) {
        this._context._display.hide();
      } else {
        this.do(e, ActionTypes.showClock);
      }
    };

    switch (action) {
      case ActionTypes.next:
      case ActionTypes.previous:
        const { unit, step } = DatePickerModes[this._context._currentViewMode];
        if (action === ActionTypes.next)
          this._context._viewDate.manipulate(step, unit);
        else this._context._viewDate.manipulate(step * -1, unit);
        this._context._viewUpdate(unit);

        this._context._display._showMode();
        break;
      case ActionTypes.pickerSwitch:
        this._context._display._showMode(1);
        this._context._viewUpdate(
          DatePickerModes[this._context._currentViewMode].unit
        );
        this._context._display._updateCalendarHeader();
        break;
      case ActionTypes.selectMonth:
      case ActionTypes.selectYear:
      case ActionTypes.selectDecade:
        const value = +currentTarget.dataset.value;
        switch (action) {
          case ActionTypes.selectMonth:
            this._context._viewDate.month = value;
            this._context._viewUpdate(Unit.month);
            break;
          case ActionTypes.selectYear:
            this._context._viewDate.year = value;
            this._context._viewUpdate(Unit.year);
            break;
          case ActionTypes.selectDecade:
            this._context._viewDate.year = value;
            this._context._viewUpdate(Unit.year);
            break;
        }

        if (
          this._context._currentViewMode === this._context._minViewModeNumber
        ) {
          this._context.dates._setValue(
            this._context._viewDate,
            this._context.dates.lastPickedIndex
          );
          if (!this._context._options.display.inline) {
            this._context._display.hide();
          }
        } else {
          this._context._display._showMode(-1);
        }
        break;
      case ActionTypes.selectDay:
        const day = this._context._viewDate.clone;
        if (currentTarget.classList.contains(Namespace.css.old)) {
          day.manipulate(-1, Unit.month);
        }
        if (currentTarget.classList.contains(Namespace.css.new)) {
          day.manipulate(1, Unit.month);
        }

        day.date = +currentTarget.dataset.day;
        let index = 0;
        if (this._context._options.multipleDates) {
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
          !this._context._options.display.keepOpen &&
          !this._context._options.display.inline &&
          !this._context._options.multipleDates
        ) {
          this._context._display.hide();
        }
        break;
      case ActionTypes.selectHour:
        let hour = +currentTarget.dataset.value;
        if (
          lastPicked.hours >= 12 &&
          !this._context._options.display.components.useTwentyfourHour
        )
          hour += 12;
        lastPicked.hours = hour;
        this._context.dates._setValue(
          lastPicked,
          this._context.dates.lastPickedIndex
        );
        hideOrClock();
        break;
      case ActionTypes.selectMinute:
        lastPicked.minutes = +currentTarget.dataset.value;
        this._context.dates._setValue(
          lastPicked,
          this._context.dates.lastPickedIndex
        );
        hideOrClock();
        break;
      case ActionTypes.selectSecond:
        lastPicked.seconds = +currentTarget.dataset.value;
        this._context.dates._setValue(
          lastPicked,
          this._context.dates.lastPickedIndex
        );
        hideOrClock();
        break;
      case ActionTypes.incrementHours:
        manipulateAndSet(Unit.hours);
        break;
      case ActionTypes.incrementMinutes:
        manipulateAndSet(Unit.minutes, this._context._options.stepping);
        break;
      case ActionTypes.incrementSeconds:
        manipulateAndSet(Unit.seconds);
        break;
      case ActionTypes.decrementHours:
        manipulateAndSet(Unit.hours, -1);
        break;
      case ActionTypes.decrementMinutes:
        manipulateAndSet(Unit.minutes, this._context._options.stepping * -1);
        break;
      case ActionTypes.decrementSeconds:
        manipulateAndSet(Unit.seconds, -1);
        break;
      case ActionTypes.toggleMeridiem:
        manipulateAndSet(
          Unit.hours,
          this._context.dates.lastPicked.hours >= 12 ? -12 : 12
        );
        break;
      case ActionTypes.togglePicker:
        if (
          currentTarget.getAttribute('title') ===
          this._context._options.localization.selectDate
        ) {
          currentTarget.setAttribute(
            'title',
            this._context._options.localization.selectTime
          );
          currentTarget.innerHTML = this._context._display._iconTag(
            this._context._options.display.icons.time
          ).outerHTML;

          this._context._display._updateCalendarHeader();
        } else {
          currentTarget.setAttribute(
            'title',
            this._context._options.localization.selectDate
          );
          currentTarget.innerHTML = this._context._display._iconTag(
            this._context._options.display.icons.date
          ).outerHTML;
          if (this._context._display._hasTime) {
            this.do(e, ActionTypes.showClock);
            this._context._display._update('clock');
          }
        }
        this._context._display.widget
          .querySelectorAll(
            `.${Namespace.css.dateContainer}, .${Namespace.css.timeContainer}`
          )
          .forEach((htmlElement: HTMLElement) => Collapse.toggle(htmlElement));
        break;
      case ActionTypes.showClock:
      case ActionTypes.showHours:
      case ActionTypes.showMinutes:
      case ActionTypes.showSeconds:
        this._context._display.widget
          .querySelectorAll(`.${Namespace.css.timeContainer} > div`)
          .forEach(
            (htmlElement: HTMLElement) => (htmlElement.style.display = 'none')
          );

        let classToUse = '';
        switch (action) {
          case ActionTypes.showClock:
            classToUse = Namespace.css.clockContainer;
            this._context._display._update('clock');
            break;
          case ActionTypes.showHours:
            classToUse = Namespace.css.hourContainer;
            this._context._display._update(Unit.hours);
            break;
          case ActionTypes.showMinutes:
            classToUse = Namespace.css.minuteContainer;
            this._context._display._update(Unit.minutes);
            break;
          case ActionTypes.showSeconds:
            classToUse = Namespace.css.secondContainer;
            this._context._display._update(Unit.seconds);
            break;
        }

        (<HTMLElement>(
          this._context._display.widget.getElementsByClassName(classToUse)[0]
        )).style.display = 'grid';
        break;
      case ActionTypes.clear:
        this._context.dates._setValue(null);
        this._context._display._updateCalendarHeader();
        break;
      case ActionTypes.close:
        this._context._display.hide();
        break;
      case ActionTypes.today:
        const today = new DateTime().setLocale(
          this._context._options.localization.locale
        );
        this._context._viewDate = today;
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
  toggleMeridiem = 'toggleMeridiem',
  togglePicker = 'togglePicker',
  showClock = 'showClock',
  showHours = 'showHours',
  showMinutes = 'showMinutes',
  showSeconds = 'showSeconds',
  clear = 'clear',
  close = 'close',
  today = 'today',
}
