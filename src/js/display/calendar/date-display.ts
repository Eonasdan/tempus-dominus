import { DateTime, Unit } from '../../datetime';
import Namespace from '../../utilities/namespace';
import Validation from '../../validation';
import Dates from '../../dates';
import { Paint } from '../index';
import { serviceLocator } from '../../utilities/service-locator';
import ActionTypes from '../../utilities/action-types';
import {OptionsStore} from "../../utilities/optionsStore";

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
    )[0];
    const [previous, switcher, next] = container.parentElement
      .getElementsByClassName(Namespace.css.calendarHeader)[0]
      .getElementsByTagName('div');

    switcher.setAttribute(
      Namespace.css.daysContainer,
      this.optionsStore.viewDate.format(
        this.optionsStore.options.localization.dayViewHeaderFormat
      )
    );

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

    let innerDate = this.optionsStore.viewDate.clone
      .startOf(Unit.month)
      .startOf('weekDay', this.optionsStore.options.localization.startOfTheWeek)
      .manipulate(12, Unit.hours);

    container
      .querySelectorAll(
        `[data-action="${ActionTypes.selectDay}"], .${Namespace.css.calendarWeeks}`
      )
      .forEach((containerClone: HTMLElement) => {
        if (
          this.optionsStore.options.display.calendarWeeks &&
          containerClone.classList.contains(Namespace.css.calendarWeeks)
        ) {
          if (containerClone.innerText === '#') return;
          containerClone.innerText = `${innerDate.week}`;
          return;
        }

        let classes: string[] = [];
        classes.push(Namespace.css.day);

        if (innerDate.isBefore(this.optionsStore.viewDate, Unit.month)) {
          classes.push(Namespace.css.old);
        }
        if (innerDate.isAfter(this.optionsStore.viewDate, Unit.month)) {
          classes.push(Namespace.css.new);
        }

        if (
          !this.optionsStore.unset &&
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

        paint(Unit.date, innerDate, classes, containerClone);

        containerClone.classList.remove(...containerClone.classList);
        containerClone.classList.add(...classes);
        containerClone.setAttribute(
          'data-value',
          `${innerDate.year}-${innerDate.monthFormatted}-${innerDate.dateFormatted}`
        );
        containerClone.setAttribute('data-day', `${innerDate.date}`);
        containerClone.innerText = innerDate.format({ day: 'numeric' });
        innerDate.manipulate(1, Unit.date);
      });
  }

  /***
   * Generates an html row that contains the days of the week.
   * @private
   */
  private _daysOfTheWeek(): HTMLElement[] {
    let innerDate = this.optionsStore.viewDate.clone
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
      htmlDivElement.innerText = innerDate.format({ weekday: 'short' });
      innerDate.manipulate(1, Unit.date);
      row.push(htmlDivElement);
    }

    return row;
  }
}
