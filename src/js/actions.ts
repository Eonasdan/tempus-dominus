import { DateTime, Unit } from './datetime';
import Collapse from './display/collapse';
import Namespace from './utilities/namespace';
import Dates from './dates';
import Validation from './validation';
import Display from './display';
import { EventEmitters } from './utilities/event-emitter';
import { serviceLocator } from './utilities/service-locator.js';
import ActionTypes from './utilities/action-types';
import CalendarModes from './utilities/calendar-modes';
import { OptionsStore } from './utilities/optionsStore';

/**
 * Logic for various click actions
 */
export default class Actions {
  private optionsStore: OptionsStore;
  private validation: Validation;
  private dates: Dates;
  private display: Display;
  private _eventEmitters: EventEmitters;

  constructor() {
    this.optionsStore = serviceLocator.locate(OptionsStore);
    this.dates = serviceLocator.locate(Dates);
    this.validation = serviceLocator.locate(Validation);
    this.display = serviceLocator.locate(Display);
    this._eventEmitters = serviceLocator.locate(EventEmitters);

    this._eventEmitters.action.subscribe((result) => {
      this.do(result.e, result.action);
    });
  }

  /**
   * Performs the selected `action`. See ActionTypes
   * @param e This is normally a click event
   * @param action If not provided, then look for a [data-action]
   */
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  do(e: any, action?: ActionTypes) {
    const currentTarget = e?.currentTarget as HTMLElement;
    if (currentTarget?.classList?.contains(Namespace.css.disabled)) return;
    action = action || (currentTarget?.dataset?.action as ActionTypes);
    const lastPicked = (this.dates.lastPicked || this.optionsStore.viewDate)
      .clone;

    switch (action) {
      case ActionTypes.next:
      case ActionTypes.previous:
        this.handleNextPrevious(action);
        break;
      case ActionTypes.changeCalendarView:
        this.display._showMode(1);
        this.display._updateCalendarHeader();
        break;
      case ActionTypes.selectMonth:
      case ActionTypes.selectYear:
      case ActionTypes.selectDecade:
        this.handleSelectCalendarMode(action, currentTarget);
        break;
      case ActionTypes.selectDay:
        this.handleSelectDay(currentTarget);
        break;
      case ActionTypes.selectHour: {
        let hour = +currentTarget.dataset.value;
        if (lastPicked.hours >= 12 && this.optionsStore.isTwelveHour)
          hour += 12;
        lastPicked.hours = hour;
        this.dates.setValue(lastPicked, this.dates.lastPickedIndex);
        this.hideOrClock(e);
        break;
      }
      case ActionTypes.selectMinute: {
        lastPicked.minutes = +currentTarget.dataset.value;
        this.dates.setValue(lastPicked, this.dates.lastPickedIndex);
        this.hideOrClock(e);
        break;
      }
      case ActionTypes.selectSecond: {
        lastPicked.seconds = +currentTarget.dataset.value;
        this.dates.setValue(lastPicked, this.dates.lastPickedIndex);
        this.hideOrClock(e);
        break;
      }
      case ActionTypes.incrementHours:
        this.manipulateAndSet(lastPicked, Unit.hours);
        break;
      case ActionTypes.incrementMinutes:
        this.manipulateAndSet(
          lastPicked,
          Unit.minutes,
          this.optionsStore.options.stepping
        );
        break;
      case ActionTypes.incrementSeconds:
        this.manipulateAndSet(lastPicked, Unit.seconds);
        break;
      case ActionTypes.decrementHours:
        this.manipulateAndSet(lastPicked, Unit.hours, -1);
        break;
      case ActionTypes.decrementMinutes:
        this.manipulateAndSet(
          lastPicked,
          Unit.minutes,
          this.optionsStore.options.stepping * -1
        );
        break;
      case ActionTypes.decrementSeconds:
        this.manipulateAndSet(lastPicked, Unit.seconds, -1);
        break;
      case ActionTypes.toggleMeridiem:
        this.manipulateAndSet(
          lastPicked,
          Unit.hours,
          this.dates.lastPicked.hours >= 12 ? -12 : 12
        );
        break;
      case ActionTypes.togglePicker:
        this.handleToggle(currentTarget);
        break;
      case ActionTypes.showClock:
      case ActionTypes.showHours:
      case ActionTypes.showMinutes:
      case ActionTypes.showSeconds:
        //make sure the clock is actually displaying
        if (
          !this.optionsStore.options.display.sideBySide &&
          this.optionsStore.currentView !== 'clock'
        ) {
          //hide calendar
          Collapse.hideImmediately(this.display.dateContainer);
          //show clock
          Collapse.showImmediately(this.display.timeContainer);
        }
        this.handleShowClockContainers(action);
        break;
      case ActionTypes.clear:
        this.dates.setValue(null);
        this.display._updateCalendarHeader();
        break;
      case ActionTypes.close:
        this.display.hide();
        break;
      case ActionTypes.today: {
        const today = new DateTime().setLocalization(
          this.optionsStore.options.localization
        );
        this._eventEmitters.updateViewDate.emit(today);

        //todo this this really a good idea?
        if (this.validation.isValid(today, Unit.date))
          this.dates.setValue(today, this.dates.lastPickedIndex);
        break;
      }
    }
  }

  private handleShowClockContainers(action: ActionTypes) {
    if (!this.display._hasTime) {
      Namespace.errorMessages.throwError(
        'Cannot show clock containers when time is disabled.'
      );
      /* ignore coverage: should never happen */
      return;
    }

    this.optionsStore.currentView = 'clock';
    this.display.widget
      .querySelectorAll(`.${Namespace.css.timeContainer} > div`)
      .forEach(
        (htmlElement: HTMLElement) => (htmlElement.style.display = 'none')
      );

    let classToUse = '';
    switch (action) {
      case ActionTypes.showClock:
        classToUse = Namespace.css.clockContainer;
        this.display._update('clock');
        break;
      case ActionTypes.showHours:
        classToUse = Namespace.css.hourContainer;
        this.display._update(Unit.hours);
        break;
      case ActionTypes.showMinutes:
        classToUse = Namespace.css.minuteContainer;
        this.display._update(Unit.minutes);
        break;
      case ActionTypes.showSeconds:
        classToUse = Namespace.css.secondContainer;
        this.display._update(Unit.seconds);
        break;
    }

    (<HTMLElement>(
      this.display.widget.getElementsByClassName(classToUse)[0]
    )).style.display = 'grid';
  }

  private handleNextPrevious(action: ActionTypes) {
    const { unit, step } =
      CalendarModes[this.optionsStore.currentCalendarViewMode];
    if (action === ActionTypes.next)
      this.optionsStore.viewDate.manipulate(step, unit);
    else this.optionsStore.viewDate.manipulate(step * -1, unit);
    this._eventEmitters.viewUpdate.emit();

    this.display._showMode();
  }

  /**
   * After setting the value it will either show the clock or hide the widget.
   * @param e
   */
  private hideOrClock(e) {
    if (
      !this.optionsStore.isTwelveHour &&
      !this.optionsStore.options.display.components.minutes &&
      !this.optionsStore.options.display.keepOpen &&
      !this.optionsStore.options.display.inline
    ) {
      this.display.hide();
    } else {
      this.do(e, ActionTypes.showClock);
    }
  }

  /**
   * Common function to manipulate {@link lastPicked} by `unit`.
   * @param lastPicked
   * @param unit
   * @param value Value to change by
   */
  private manipulateAndSet(lastPicked: DateTime, unit: Unit, value = 1) {
    const newDate = lastPicked.manipulate(value, unit);
    if (this.validation.isValid(newDate, unit)) {
      this.dates.setValue(newDate, this.dates.lastPickedIndex);
    }
  }

  private handleSelectCalendarMode(
    action:
      | ActionTypes.selectMonth
      | ActionTypes.selectYear
      | ActionTypes.selectDecade,
    currentTarget: HTMLElement
  ) {
    const value = +currentTarget.dataset.value;
    switch (action) {
      case ActionTypes.selectMonth:
        this.optionsStore.viewDate.month = value;
        break;
      case ActionTypes.selectYear:
      case ActionTypes.selectDecade:
        this.optionsStore.viewDate.year = value;
        break;
    }

    if (
      this.optionsStore.currentCalendarViewMode ===
      this.optionsStore.minimumCalendarViewMode
    ) {
      this.dates.setValue(
        this.optionsStore.viewDate,
        this.dates.lastPickedIndex
      );

      if (!this.optionsStore.options.display.inline) {
        this.display.hide();
      }
    } else {
      this.display._showMode(-1);
    }
  }

  private handleToggle(currentTarget: HTMLElement) {
    if (
      currentTarget.getAttribute('title') ===
      this.optionsStore.options.localization.selectDate
    ) {
      currentTarget.setAttribute(
        'title',
        this.optionsStore.options.localization.selectTime
      );
      currentTarget.innerHTML = this.display._iconTag(
        this.optionsStore.options.display.icons.time
      ).outerHTML;

      this.display._updateCalendarHeader();
      this.optionsStore.refreshCurrentView();
    } else {
      currentTarget.setAttribute(
        'title',
        this.optionsStore.options.localization.selectDate
      );
      currentTarget.innerHTML = this.display._iconTag(
        this.optionsStore.options.display.icons.date
      ).outerHTML;
      if (this.display._hasTime) {
        this.handleShowClockContainers(ActionTypes.showClock);
        this.display._update('clock');
      }
    }

    this.display.widget
      .querySelectorAll(
        `.${Namespace.css.dateContainer}, .${Namespace.css.timeContainer}`
      )
      .forEach((htmlElement: HTMLElement) => Collapse.toggle(htmlElement));
    this._eventEmitters.viewUpdate.emit();
  }

  private handleSelectDay(currentTarget: HTMLElement) {
    const day = this.optionsStore.viewDate.clone;
    if (currentTarget.classList.contains(Namespace.css.old)) {
      day.manipulate(-1, Unit.month);
    }
    if (currentTarget.classList.contains(Namespace.css.new)) {
      day.manipulate(1, Unit.month);
    }

    day.date = +currentTarget.dataset.day;
    if (this.optionsStore.options.dateRange) this.handleDateRange(day);
    else if (this.optionsStore.options.multipleDates) {
      this.handleMultiDate(day);
    } else {
      this.dates.setValue(day, this.dates.lastPickedIndex);
    }

    if (
      !this.display._hasTime &&
      !this.optionsStore.options.display.keepOpen &&
      !this.optionsStore.options.display.inline &&
      !this.optionsStore.options.multipleDates &&
      !this.optionsStore.options.dateRange
    ) {
      this.display.hide();
    }
  }

  private handleMultiDate(day: DateTime) {
    let index = this.dates.pickedIndex(day, Unit.date);
    console.log(index);
    if (index !== -1) {
      this.dates.setValue(null, index); //deselect multi-date
    } else {
      index = this.dates.lastPickedIndex + 1;
      if (this.dates.picked.length === 0) index = 0;

      this.dates.setValue(day, index);
    }
  }

  private handleDateRange(day: DateTime) {
    switch (this.dates.picked.length) {
      case 2: {
        this.dates.clear();
        break;
      }
      case 1: {
        const other = this.dates.picked[0];
        if (day.getTime() === other.getTime()) {
          this.dates.clear();
          break;
        }
        if (day.isBefore(other)) {
          this.dates.setValue(day, 0);
          this.dates.setValue(other, 1);
          return;
        } else {
          this.dates.setValue(day, 1);
          return;
        }
      }
    }

    this.dates.setValue(day, 0);
  }
}
