import { Unit } from '../../datetime';
import Namespace from '../../utilities/namespace';
import Validation from '../../validation';
import Dates from '../../dates';
import { Paint } from '../index';
import { serviceLocator } from '../../utilities/service-locator';
import ActionTypes from '../../utilities/action-types';
import { OptionsStore } from '../../utilities/optionsStore';

/**
 * Creates and updates the grid for `month`
 */
export default class MonthDisplay {
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
    container.classList.add(Namespace.css.monthsContainer);

    for (let i = 0; i < 12; i++) {
      const div = document.createElement('div');
      div.setAttribute('data-action', ActionTypes.selectMonth);
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
      Namespace.css.monthsContainer
    )[0];

    if (this.optionsStore.currentView === 'months') {
      const [previous, switcher, next] = container.parentElement
        .getElementsByClassName(Namespace.css.calendarHeader)[0]
        .getElementsByTagName('div');

      switcher.setAttribute(
        Namespace.css.monthsContainer,
        this.optionsStore.viewDate.format({ year: 'numeric' })
      );

      this.optionsStore.options.display.components.year
        ? switcher.classList.remove(Namespace.css.disabled)
        : switcher.classList.add(Namespace.css.disabled);

      this.validation.isValid(
        this.optionsStore.viewDate.clone.manipulate(-1, Unit.year),
        Unit.year
      )
        ? previous.classList.remove(Namespace.css.disabled)
        : previous.classList.add(Namespace.css.disabled);

      this.validation.isValid(
        this.optionsStore.viewDate.clone.manipulate(1, Unit.year),
        Unit.year
      )
        ? next.classList.remove(Namespace.css.disabled)
        : next.classList.add(Namespace.css.disabled);
    }

    const innerDate = this.optionsStore.viewDate.clone.startOf(Unit.year);

    container
      .querySelectorAll(`[data-action="${ActionTypes.selectMonth}"]`)
      .forEach((containerClone: HTMLElement, index) => {
        const classes = [];
        classes.push(Namespace.css.month);

        if (
          !this.optionsStore.unset &&
          this.dates.isPicked(innerDate, Unit.month)
        ) {
          classes.push(Namespace.css.active);
        }
        if (!this.validation.isValid(innerDate, Unit.month)) {
          classes.push(Namespace.css.disabled);
        }

        paint(Unit.month, innerDate, classes, containerClone);

        containerClone.classList.remove(...containerClone.classList);
        containerClone.classList.add(...classes);
        containerClone.setAttribute('data-value', `${index}`);
        containerClone.innerText = `${innerDate.format({ month: 'short' })}`;
        innerDate.manipulate(1, Unit.month);
      });
  }
}
