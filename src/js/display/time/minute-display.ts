import { TempusDominus } from '../../tempus-dominus';
import { Unit } from '../../datetime';
import { ActionTypes } from '../../actions';
import Namespace from '../../namespace';

/**
 * Creates and updates the grid for `minutes`
 */
export default class MinuteDisplay {
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
    container.classList.add(Namespace.css.minuteContainer);

    let step =
      this._context._options.stepping === 1
        ? 5
        : this._context._options.stepping;
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
  _update(): void {
    const container = this._context._display.widget.getElementsByClassName(
      Namespace.css.minuteContainer
    )[0];
    let innerDate = this._context._viewDate.clone.startOf(Unit.hours);
    let step =
      this._context._options.stepping === 1
        ? 5
        : this._context._options.stepping;

    container
      .querySelectorAll(`[data-action="${ActionTypes.selectMinute}"]`)
      .forEach((containerClone: HTMLElement, index) => {
        let classes = [];
        classes.push(Namespace.css.minute);

        if (!this._context._validation.isValid(innerDate, Unit.minutes)) {
          classes.push(Namespace.css.disabled);
        }

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
