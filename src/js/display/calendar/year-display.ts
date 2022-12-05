import { DateTime, Unit } from '../../datetime';
import Namespace from '../../utilities/namespace';
import Dates from '../../dates';
import Validation from '../../validation';
import { Paint } from '../index';
import { serviceLocator } from '../../utilities/service-locator';
import ActionTypes from '../../utilities/action-types';
import { OptionsStore } from '../../utilities/optionsStore';

/**
 * Creates and updates the grid for `year`
 */
export default class YearDisplay {
  private _startYear: DateTime;
  private _endYear: DateTime;
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
    container.classList.add(Namespace.css.yearsContainer);

    for (let i = 0; i < 12; i++) {
      const div = document.createElement('div');
      div.setAttribute('data-action', ActionTypes.selectYear);
      container.appendChild(div);
    }

    return container;
  }

  /**
   * Populates the grid and updates enabled states
   * @private
   */
  _update(widget: HTMLElement, paint: Paint) {
    this._startYear = this.optionsStore.viewDate.clone.manipulate(
      -1,
      Unit.year
    );
    this._endYear = this.optionsStore.viewDate.clone.manipulate(10, Unit.year);

    const container = widget.getElementsByClassName(
      Namespace.css.yearsContainer
    )[0];

    if (this.optionsStore.currentView === 'years') {
      const [previous, switcher, next] = container.parentElement
        .getElementsByClassName(Namespace.css.calendarHeader)[0]
        .getElementsByTagName('div');

      switcher.setAttribute(
        Namespace.css.yearsContainer,
        `${this._startYear.format({ year: 'numeric' })}-${this._endYear.format({
          year: 'numeric',
        })}`
      );

      this.optionsStore.options.display.components.decades
        ? switcher.classList.remove(Namespace.css.disabled)
        : switcher.classList.add(Namespace.css.disabled);

      this.validation.isValid(this._startYear, Unit.year)
        ? previous.classList.remove(Namespace.css.disabled)
        : previous.classList.add(Namespace.css.disabled);
      this.validation.isValid(this._endYear, Unit.year)
        ? next.classList.remove(Namespace.css.disabled)
        : next.classList.add(Namespace.css.disabled);
    }

    const innerDate = this.optionsStore.viewDate.clone
      .startOf(Unit.year)
      .manipulate(-1, Unit.year);

    container
      .querySelectorAll(`[data-action="${ActionTypes.selectYear}"]`)
      .forEach((containerClone: HTMLElement) => {
        const classes = [];
        classes.push(Namespace.css.year);

        if (
          !this.optionsStore.unset &&
          this.dates.isPicked(innerDate, Unit.year)
        ) {
          classes.push(Namespace.css.active);
        }
        if (!this.validation.isValid(innerDate, Unit.year)) {
          classes.push(Namespace.css.disabled);
        }

        paint(Unit.year, innerDate, classes, containerClone);

        containerClone.classList.remove(...containerClone.classList);
        containerClone.classList.add(...classes);
        containerClone.setAttribute('data-value', `${innerDate.year}`);
        containerClone.innerText = innerDate.format({ year: 'numeric' });

        innerDate.manipulate(1, Unit.year);
      });
  }
}
