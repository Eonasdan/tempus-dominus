import { Unit } from '../../datetime';
import Namespace from '../../namespace';
import { OptionsStore } from '../../options';
import Validation from '../../validation';
import { ActionTypes } from '../../actionTypes';
import { ServiceLocator } from '../../service-locator';

/**
 * Creates and updates the grid for `seconds`
 */
export default class secondDisplay {
  private optionsStore: OptionsStore;
  private validation: Validation;

  constructor() {
    this.optionsStore = ServiceLocator.locate(OptionsStore);
    this.validation = ServiceLocator.locate(Validation);
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
  _update(widget: HTMLElement): void {
    const container = widget.getElementsByClassName(
      Namespace.css.secondContainer
    )[0];
    let innerDate = this.optionsStore.viewDate.clone.startOf(Unit.minutes);

    container
      .querySelectorAll(`[data-action="${ActionTypes.selectSecond}"]`)
      .forEach((containerClone: HTMLElement, index) => {
        let classes = [];
        classes.push(Namespace.css.second);

        if (!this.validation.isValid(innerDate, Unit.seconds)) {
          classes.push(Namespace.css.disabled);
        }

        containerClone.classList.remove(...containerClone.classList);
        containerClone.classList.add(...classes);
        containerClone.setAttribute('data-value', `${innerDate.seconds}`);
        containerClone.innerText = innerDate.secondsFormatted;
        innerDate.manipulate(5, Unit.seconds);
      });
  }
}
