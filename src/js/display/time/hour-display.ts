import { TempusDominus } from '../../tempus-dominus';
import { Unit } from '../../datetime';
import { ActionTypes } from '../../actions';
import Namespace from '../../namespace';

/**
 * Creates and updates the grid for `hours`
 */
export default class HourDisplay {
  private _context: TempusDominus;

  constructor(context: TempusDominus) {
    this._context = context;
  }

  /**
   * Build the container html for the display
   * @private
   */
  get _picker(): HTMLElement {
    const container = document.createElement('div');
    container.classList.add(Namespace.css.hourContainer);

    for (
      let i = 0;
      i <
      (this._context._options.display.components.useTwentyfourHour ? 24 : 12);
      i++
    ) {
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
  _update(): void {
    const container = this._context._display.widget.getElementsByClassName(
      Namespace.css.hourContainer
    )[0];
    let innerDate = this._context._viewDate.clone.startOf(Unit.date);

    container
      .querySelectorAll(`[data-action="${ActionTypes.selectHour}"]`)
      .forEach((containerClone: HTMLElement, index) => {
        let classes = [];
        classes.push(Namespace.css.hour);

        if (!this._context._validation.isValid(innerDate, Unit.hours)) {
          classes.push(Namespace.css.disabled);
        }

        containerClone.classList.remove(...containerClone.classList);
        containerClone.classList.add(...classes);
        containerClone.setAttribute('data-value', `${innerDate.hours}`);
        containerClone.innerText = this._context._options.display.components
          .useTwentyfourHour
          ? innerDate.hoursFormatted
          : innerDate.twelveHoursFormatted;
        innerDate.manipulate(1, Unit.hours);
      });
  }
}
