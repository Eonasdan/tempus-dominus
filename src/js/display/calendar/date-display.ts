import { DateTime, Unit } from '../../datetime';
import Namespace from '../../utilities/namespace';
import Validation from '../../validation';
import Dates from '../../dates';
import { Paint } from '../index';
import { serviceLocator } from '../../utilities/service-locator';
import ActionTypes from '../../utilities/action-types';
import { OptionsStore } from '../../utilities/optionsStore';

/**
 * Creates and updates the grid for `date`
 */
export default class DateDisplay {
  private optionsStore: OptionsStore;
  private dates: Dates;
  private validation: Validation;

  constructor() {
    this.optionsStore = serviceLocator.locate(OptionsStore);
    this.dates = serviceLocator.locate(Dates);
    this.validation = serviceLocator.locate(Validation);
  }

  /**
   * Build the container html for the display
   * @private
   */
  getPicker(): HTMLElement {
    const container = document.createElement('div');
    container.classList.add(Namespace.css.daysContainer);

    container.append(...this._daysOfTheWeek());

    if (this.optionsStore.options.display.calendarWeeks) {
      const div = document.createElement('div');
      div.classList.add(Namespace.css.calendarWeeks, Namespace.css.noHighlight);
      container.appendChild(div);
    }

    const { rangeHoverEvent, rangeHoverOutEvent } =
      this.handleMouseEvents(container);

    for (let i = 0; i < 42; i++) {
      if (i !== 0 && i % 7 === 0) {
        if (this.optionsStore.options.display.calendarWeeks) {
          const div = document.createElement('div');
          div.classList.add(
            Namespace.css.calendarWeeks,
            Namespace.css.noHighlight
          );
          container.appendChild(div);
        }
      }

      const div = document.createElement('div');
      div.setAttribute('data-action', ActionTypes.selectDay);
      container.appendChild(div);

      // if hover is supported then add the events
      if (
        matchMedia('(hover: hover)').matches &&
        this.optionsStore.options.dateRange
      ) {
        div.addEventListener('mouseover', rangeHoverEvent);
        div.addEventListener('mouseout', rangeHoverOutEvent);
      }
    }

    return container;
  }

  /**
   * Populates the grid and updates enabled states
   * @private
   */
  _update(widget: HTMLElement, paint: Paint): void {
    const container = widget.getElementsByClassName(
      Namespace.css.daysContainer
    )[0] as HTMLElement;

    this._updateCalendarView(container);

    const innerDate = this.optionsStore.viewDate.clone
      .startOf(Unit.month)
      .startOf('weekDay', this.optionsStore.options.localization.startOfTheWeek)
      .manipulate(12, Unit.hours);

    this._handleCalendarWeeks(container, innerDate.clone);

    container
      .querySelectorAll(`[data-action="${ActionTypes.selectDay}"]`)
      .forEach((element: HTMLElement) => {
        const classes: string[] = [];
        classes.push(Namespace.css.day);

        if (innerDate.isBefore(this.optionsStore.viewDate, Unit.month)) {
          classes.push(Namespace.css.old);
        }
        if (innerDate.isAfter(this.optionsStore.viewDate, Unit.month)) {
          classes.push(Namespace.css.new);
        }

        if (
          !this.optionsStore.unset &&
          !this.optionsStore.options.dateRange &&
          this.dates.isPicked(innerDate, Unit.date)
        ) {
          classes.push(Namespace.css.active);
        }
        if (!this.validation.isValid(innerDate, Unit.date)) {
          classes.push(Namespace.css.disabled);
        }
        if (innerDate.isSame(new DateTime(), Unit.date)) {
          classes.push(Namespace.css.today);
        }
        if (innerDate.weekDay === 0 || innerDate.weekDay === 6) {
          classes.push(Namespace.css.weekend);
        }

        this._handleDateRange(innerDate, classes);

        paint(Unit.date, innerDate, classes, element);

        element.classList.remove(...element.classList);
        element.classList.add(...classes);
        element.setAttribute('data-value', this._dateToDataValue(innerDate));
        element.setAttribute('data-day', `${innerDate.date}`);
        element.innerText = innerDate.parts(undefined, {
          day: 'numeric',
        }).day;
        innerDate.manipulate(1, Unit.date);
      });
  }

  private _dateToDataValue(date: DateTime): string {
    if (!DateTime.isValid(date)) return '';

    return `${date.year}-${date.month.toString().padStart(2, '0')}-${date.date
      .toString()
      .padStart(2, '0')}`;
  }

  private _handleDateRange(innerDate: DateTime, classes: string[]) {
    const rangeStart = this.dates.picked[0];
    const rangeEnd = this.dates.picked[1];

    if (this.optionsStore.options.dateRange) {
      if (innerDate.isBetween(rangeStart, rangeEnd, Unit.date)) {
        classes.push(Namespace.css.rangeIn);
      }

      if (innerDate.isSame(rangeStart, Unit.date)) {
        classes.push(Namespace.css.rangeStart);
      }

      if (innerDate.isSame(rangeEnd, Unit.date)) {
        classes.push(Namespace.css.rangeEnd);
      }
    }
  }

  private handleMouseEvents(container: HTMLElement) {
    const rangeHoverEvent = (e: MouseEvent) => {
      const currentTarget = e?.currentTarget as HTMLElement;

      // if we have 0 or 2 selected or if the target is disabled then ignore
      if (
        this.dates.picked.length !== 1 ||
        currentTarget.classList.contains(Namespace.css.disabled)
      )
        return;

      // select all the date divs
      const allDays = [...container.querySelectorAll('.day')] as HTMLElement[];

      // get the date value from the element being hovered over
      const attributeValue = currentTarget.getAttribute('data-value');

      // format the string to a date
      const innerDate = DateTime.fromString(attributeValue, {
        format: 'yyyy-MM-dd',
      });

      // find the position of the target in the date container
      const dayIndex = allDays.findIndex(
        (e) => e.getAttribute('data-value') === attributeValue
      );

      // find the first and second selected dates
      const rangeStart = this.dates.picked[0];
      const rangeEnd = this.dates.picked[1];

      //format the start date so that it can be found by the attribute
      const rangeStartFormatted = this._dateToDataValue(rangeStart);
      const rangeStartIndex = allDays.findIndex(
        (e) => e.getAttribute('data-value') === rangeStartFormatted
      );
      const rangeStartElement = allDays[rangeStartIndex];

      //make sure we don't leave start/end classes if we don't need them
      if (!innerDate.isSame(rangeStart, Unit.date)) {
        currentTarget.classList.remove(Namespace.css.rangeStart);
      }

      if (!innerDate.isSame(rangeEnd, Unit.date)) {
        currentTarget.classList.remove(Namespace.css.rangeEnd);
      }

      // the following figures out which direct from start date is selected
      // the selection "cap" classes are applied if needed
      // otherwise all the dates between will get the `rangeIn` class.
      // We make this selection based on the element's index and the rangeStart index

      let lambda: (_, index) => boolean;

      if (innerDate.isBefore(rangeStart)) {
        currentTarget.classList.add(Namespace.css.rangeStart);
        rangeStartElement?.classList.remove(Namespace.css.rangeStart);
        rangeStartElement?.classList.add(Namespace.css.rangeEnd);
        lambda = (_, index) => index > dayIndex && index < rangeStartIndex;
      } else {
        currentTarget.classList.add(Namespace.css.rangeEnd);
        rangeStartElement?.classList.remove(Namespace.css.rangeEnd);
        rangeStartElement?.classList.add(Namespace.css.rangeStart);
        lambda = (_, index) => index < dayIndex && index > rangeStartIndex;
      }

      allDays.filter(lambda).forEach((e) => {
        e.classList.add(Namespace.css.rangeIn);
      });
    };

    const rangeHoverOutEvent = (e: MouseEvent) => {
      // find all the dates in the container
      const allDays = [...container.querySelectorAll('.day')] as HTMLElement[];

      // if only the start is selected, remove all the rangeIn classes
      // we do this because once the user hovers over a new date the range will be recalculated.
      if (this.dates.picked.length === 1)
        allDays.forEach((e) => e.classList.remove(Namespace.css.rangeIn));

      // if we have 0 or 2 dates selected then ignore
      if (this.dates.picked.length !== 1) return;

      const currentTarget = e?.currentTarget as HTMLElement;

      // get the elements date from the attribute value
      const innerDate = new DateTime(currentTarget.getAttribute('data-value'));

      // verify selections and remove invalid classes
      if (!innerDate.isSame(this.dates.picked[0], Unit.date)) {
        currentTarget.classList.remove(Namespace.css.rangeStart);
      }

      if (!innerDate.isSame(this.dates.picked[1], Unit.date)) {
        currentTarget.classList.remove(Namespace.css.rangeEnd);
      }
    };

    return { rangeHoverEvent, rangeHoverOutEvent };
  }

  private _updateCalendarView(container: Element) {
    if (this.optionsStore.currentView !== 'calendar') return;
    const [previous, switcher, next] = container.parentElement
      .getElementsByClassName(Namespace.css.calendarHeader)[0]
      .getElementsByTagName('div');
    switcher.setAttribute(
      Namespace.css.daysContainer,
      this.optionsStore.viewDate.format(
        this.optionsStore.options.localization.dayViewHeaderFormat
      )
    );
    this.optionsStore.options.display.components.month
      ? switcher.classList.remove(Namespace.css.disabled)
      : switcher.classList.add(Namespace.css.disabled);
    this.validation.isValid(
      this.optionsStore.viewDate.clone.manipulate(-1, Unit.month),
      Unit.month
    )
      ? previous.classList.remove(Namespace.css.disabled)
      : previous.classList.add(Namespace.css.disabled);
    this.validation.isValid(
      this.optionsStore.viewDate.clone.manipulate(1, Unit.month),
      Unit.month
    )
      ? next.classList.remove(Namespace.css.disabled)
      : next.classList.add(Namespace.css.disabled);
  }

  /***
   * Generates a html row that contains the days of the week.
   * @private
   */
  private _daysOfTheWeek(): HTMLElement[] {
    const innerDate = this.optionsStore.viewDate.clone
      .startOf('weekDay', this.optionsStore.options.localization.startOfTheWeek)
      .startOf(Unit.date);
    const row = [];
    document.createElement('div');

    if (this.optionsStore.options.display.calendarWeeks) {
      const htmlDivElement = document.createElement('div');
      htmlDivElement.classList.add(
        Namespace.css.calendarWeeks,
        Namespace.css.noHighlight
      );
      htmlDivElement.innerText = '#';
      row.push(htmlDivElement);
    }

    for (let i = 0; i < 7; i++) {
      const htmlDivElement = document.createElement('div');
      htmlDivElement.classList.add(
        Namespace.css.dayOfTheWeek,
        Namespace.css.noHighlight
      );
      let weekDay = innerDate.format({ weekday: 'short' });
      if (this.optionsStore.options.localization.maxWeekdayLength > 0)
        weekDay = weekDay.substring(
          0,
          this.optionsStore.options.localization.maxWeekdayLength
        );
      htmlDivElement.innerText = weekDay;
      innerDate.manipulate(1, Unit.date);
      row.push(htmlDivElement);
    }

    return row;
  }

  private _handleCalendarWeeks(container: HTMLElement, innerDate: DateTime) {
    [...container.querySelectorAll(`.${Namespace.css.calendarWeeks}`)]
      .filter((e: HTMLElement) => e.innerText !== '#')
      .forEach((element: HTMLElement) => {
        element.innerText = `${innerDate.week}`;
        innerDate.manipulate(7, Unit.date);
      });
  }
}
