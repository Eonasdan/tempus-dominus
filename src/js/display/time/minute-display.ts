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
    container.classList.add(Namespace.Css.minuteContainer);

    const table = document.createElement('table');
    const tableBody = document.createElement('tbody');
    let row = document.createElement('tr');
    let step =
      this._context.options.stepping === 1 ? 5 : this._context.options.stepping;
    for (let i = 0; i <= 60 / step; i++) {
      if (i !== 0 && i % 4 === 0) {
        tableBody.appendChild(row);
        row = document.createElement('tr');
      }
      const td = document.createElement('td');
      const div = document.createElement('div');
      div.setAttribute('data-action', ActionTypes.selectMinute);
      td.appendChild(div);
      row.appendChild(td);
    }

    table.appendChild(tableBody);
    container.appendChild(table);

    return container;
  }

  /**
   * Populates the grid and updates enabled states
   * @private
   */
  _update(): void {
    const container = this._context._display.widget.getElementsByClassName(
      Namespace.Css.minuteContainer
    )[0];
    let innerDate = this._context.viewDate.clone.startOf(Unit.hours);
    let step =
      this._context.options.stepping === 1 ? 5 : this._context.options.stepping;

    container
      .querySelectorAll('tbody td div')
      .forEach((containerClone: HTMLElement, index) => {
        let classes = [];
        classes.push(Namespace.Css.minute);

        if (!this._context._validation.isValid(innerDate, Unit.minutes)) {
          classes.push(Namespace.Css.disabled);
        }

        containerClone.classList.remove(...containerClone.classList);
        containerClone.classList.add(...classes);
        containerClone.setAttribute('data-value', `${innerDate.minutes}`);
        containerClone.innerText = innerDate.minutesFormatted;
        innerDate.manipulate(step, Unit.minutes);
      });
  }
}
