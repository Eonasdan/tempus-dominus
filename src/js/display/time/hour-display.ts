import { Unit } from '../../datetime';
import Namespace from '../../utilities/namespace';
import Validation from '../../validation';
import { serviceLocator } from '../../utilities/service-locator';
import { Paint } from '../index';
import ActionTypes from '../../utilities/action-types';
import { OptionsStore } from '../../utilities/optionsStore';

/**
 * Creates and updates the grid for `hours`
 */
export default class HourDisplay {
  private optionsStore: OptionsStore;
  private validation: Validation;

  constructor() {
    this.optionsStore = serviceLocator.locate(OptionsStore);
    this.validation = serviceLocator.locate(Validation);
  }
  /**
   * Build the container html for the display
   * @private
   */
  getPicker(): HTMLElement {
    const container = document.createElement('div');
    container.classList.add(Namespace.css.hourContainer);

    for (let i = 0; i < (this.optionsStore.isTwelveHour ? 12 : 24); i++) {
      const div = document.createElement('div');
      div.setAttribute('data-action', ActionTypes.selectHour);
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
      Namespace.css.hourContainer
    )[0];
    const innerDate = this.optionsStore.viewDate.clone.startOf(Unit.date);

    container
      .querySelectorAll(`[data-action="${ActionTypes.selectHour}"]`)
      .forEach((containerClone: HTMLElement) => {
        const classes = [];
        classes.push(Namespace.css.hour);

        if (!this.validation.isValid(innerDate, Unit.hours)) {
          classes.push(Namespace.css.disabled);
        }

        paint(Unit.hours, innerDate, classes, containerClone);

        containerClone.classList.remove(...containerClone.classList);
        containerClone.classList.add(...classes);
        containerClone.setAttribute('data-value', `${innerDate.hours}`);
        containerClone.innerText = innerDate.getHoursFormatted(
          this.optionsStore.options.localization.hourCycle
        );
        innerDate.manipulate(1, Unit.hours);
      });
  }
}
