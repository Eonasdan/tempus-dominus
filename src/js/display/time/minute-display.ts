import { Unit } from '../../datetime';
import Namespace from '../../utilities/namespace';
import Validation from '../../validation';
import { serviceLocator } from '../../utilities/service-locator';
import { Paint } from '../index';
import ActionTypes from '../../utilities/action-types';
import {OptionsStore} from "../../utilities/optionsStore";

/**
 * Creates and updates the grid for `minutes`
 */
export default class MinuteDisplay {
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
    container.classList.add(Namespace.css.minuteContainer);

    let step =
      this.optionsStore.options.stepping === 1
        ? 5
        : this.optionsStore.options.stepping;
    for (let i = 0; i < 60 / step; i++) {
      const div = document.createElement('div');
      div.setAttribute('data-action', ActionTypes.selectMinute);
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
      Namespace.css.minuteContainer
    )[0];
    let innerDate = this.optionsStore.viewDate.clone.startOf(Unit.hours);
    let step =
      this.optionsStore.options.stepping === 1
        ? 5
        : this.optionsStore.options.stepping;

    container
      .querySelectorAll(`[data-action="${ActionTypes.selectMinute}"]`)
      .forEach((containerClone: HTMLElement) => {
        let classes = [];
        classes.push(Namespace.css.minute);

        if (!this.validation.isValid(innerDate, Unit.minutes)) {
          classes.push(Namespace.css.disabled);
        }

        paint(Unit.minutes, innerDate, classes, containerClone);

        containerClone.classList.remove(...containerClone.classList);
        containerClone.classList.add(...classes);
        containerClone.setAttribute(
          'data-value',
          `${innerDate.minutesFormatted}`
        );
        containerClone.innerText = innerDate.minutesFormatted;
        innerDate.manipulate(step, Unit.minutes);
      });
  }
}
