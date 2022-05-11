import { Unit } from '../../datetime';
import Namespace from '../../utilities/namespace';
import Validation from '../../validation';
import { serviceLocator } from '../../utilities/service-locator';
import { Paint } from '../index';
import ActionTypes from '../../utilities/action-types';
import {OptionsStore} from "../../utilities/optionsStore";

/**
 * Creates and updates the grid for `seconds`
 */
export default class secondDisplay {
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
    container.classList.add(Namespace.css.secondContainer);

    for (let i = 0; i < 12; i++) {
      const div = document.createElement('div');
      div.setAttribute('data-action', ActionTypes.selectSecond);
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
      Namespace.css.secondContainer
    )[0];
    let innerDate = this.optionsStore.viewDate.clone.startOf(Unit.minutes);

    container
      .querySelectorAll(`[data-action="${ActionTypes.selectSecond}"]`)
      .forEach((containerClone: HTMLElement) => {
        let classes = [];
        classes.push(Namespace.css.second);

        if (!this.validation.isValid(innerDate, Unit.seconds)) {
          classes.push(Namespace.css.disabled);
        }

        paint(Unit.seconds, innerDate, classes, containerClone);

        containerClone.classList.remove(...containerClone.classList);
        containerClone.classList.add(...classes);
        containerClone.setAttribute('data-value', `${innerDate.seconds}`);
        containerClone.innerText = innerDate.secondsFormatted;
        innerDate.manipulate(5, Unit.seconds);
      });
  }
}
