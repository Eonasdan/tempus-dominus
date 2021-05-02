import { TempusDominus } from '../../tempus-dominus';
import { Unit } from '../../datetime';
import { ActionTypes } from '../../actions';
import Namespace from '../../namespace';

/**
 * Creates and updates the grid for `seconds`
 */
export default class secondDisplay {
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
    container.classList.add(Namespace.Css.secondContainer);

    const table = document.createElement('table');
    const tableBody = document.createElement('tbody');
    let row = document.createElement('tr');
    for (let i = 0; i <= 12; i++) {
      if (i !== 0 && i % 4 === 0) {
        tableBody.appendChild(row);
        row = document.createElement('tr');
      }
      const td = document.createElement('td');
      const div = document.createElement('div');
      div.setAttribute('data-action', ActionTypes.selectSecond);
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
      Namespace.Css.secondContainer
    )[0];
    let innerDate = this._context.viewDate.clone.startOf(Unit.minutes);

    container
      .querySelectorAll('tbody td div')
      .forEach((containerClone: HTMLElement, index) => {
        let classes = [];
        classes.push(Namespace.Css.second);

        if (!this._context._validation.isValid(innerDate, Unit.seconds)) {
          classes.push(Namespace.Css.disabled);
        }

        containerClone.classList.remove(...containerClone.classList);
        containerClone.classList.add(...classes);
        containerClone.setAttribute('data-value', `${innerDate.seconds}`);
        containerClone.innerText = innerDate.secondsFormatted;
        innerDate.manipulate(5, Unit.seconds);
      });
  }
}
