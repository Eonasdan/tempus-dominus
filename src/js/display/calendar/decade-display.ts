import Dates from '../../dates';
import { DateTime, Unit } from '../../datetime';
import Namespace from '../../utilities/namespace';
import Validation from '../../validation';
import { Paint } from '../index';
import { serviceLocator } from '../../utilities/service-locator';
import ActionTypes from '../../utilities/action-types';
import { OptionsStore } from '../../utilities/optionsStore';

/**
 * Creates and updates the grid for `seconds`
 */
export default class DecadeDisplay {
  private _startDecade: DateTime;
  private _endDecade: DateTime;
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
  getPicker() {
    const container = document.createElement('div');
    container.classList.add(Namespace.css.decadesContainer);

    for (let i = 0; i < 12; i++) {
      const div = document.createElement('div');
      div.setAttribute('data-action', ActionTypes.selectDecade);
      container.appendChild(div);
    }
    return container;
  }

  /**
   * Populates the grid and updates enabled states
   * @private
   */
  _update(widget: HTMLElement, paint: Paint) {
    const [start, end] = Dates.getStartEndYear(
      100,
      this.optionsStore.viewDate.year
    );
    this._startDecade = this.optionsStore.viewDate.clone.startOf(Unit.year);
    this._startDecade.year = start;
    this._endDecade = this.optionsStore.viewDate.clone.startOf(Unit.year);
    this._endDecade.year = end;

    const container = widget.getElementsByClassName(
      Namespace.css.decadesContainer
    )[0];

    const [previous, switcher, next] = container.parentElement
      .getElementsByClassName(Namespace.css.calendarHeader)[0]
      .getElementsByTagName('div');

    if (this.optionsStore.currentView === 'decades') {
      switcher.setAttribute(
        Namespace.css.decadesContainer,
        `${this._startDecade.format({
          year: 'numeric',
        })}-${this._endDecade.format({ year: 'numeric' })}`
      );

      this.validation.isValid(this._startDecade, Unit.year)
        ? previous.classList.remove(Namespace.css.disabled)
        : previous.classList.add(Namespace.css.disabled);
      this.validation.isValid(this._endDecade, Unit.year)
        ? next.classList.remove(Namespace.css.disabled)
        : next.classList.add(Namespace.css.disabled);
    }

    const pickedYears = this.dates.picked.map((x) => x.year);

    container
      .querySelectorAll(`[data-action="${ActionTypes.selectDecade}"]`)
      .forEach((containerClone: HTMLElement, index) => {
        if (index === 0) {
          containerClone.classList.add(Namespace.css.old);
          if (this._startDecade.year - 10 < 0) {
            containerClone.textContent = ' ';
            previous.classList.add(Namespace.css.disabled);
            containerClone.classList.add(Namespace.css.disabled);
            containerClone.setAttribute('data-value', '');
            return;
          } else {
            containerClone.innerText = this._startDecade.clone
              .manipulate(-10, Unit.year)
              .format({ year: 'numeric' });
            containerClone.setAttribute(
              'data-value',
              `${this._startDecade.year}`
            );
            return;
          }
        }

        const classes = [];
        classes.push(Namespace.css.decade);
        const startDecadeYear = this._startDecade.year;
        const endDecadeYear = this._startDecade.year + 9;

        if (
          !this.optionsStore.unset &&
          pickedYears.filter((x) => x >= startDecadeYear && x <= endDecadeYear)
            .length > 0
        ) {
          classes.push(Namespace.css.active);
        }
        if (
          !this.validation.isValid(this._startDecade, Unit.year) &&
          !this.validation.isValid(
            this._startDecade.clone.manipulate(10, Unit.year),
            Unit.year
          )
        ) {
          classes.push(Namespace.css.disabled);
        }

        paint('decade', this._startDecade, classes, containerClone);

        containerClone.classList.remove(...containerClone.classList);
        containerClone.classList.add(...classes);
        containerClone.setAttribute('data-value', `${this._startDecade.year}`);
        containerClone.innerText = `${this._startDecade.format({
          year: 'numeric',
        })}`;

        this._startDecade.manipulate(10, Unit.year);
      });
  }
}
