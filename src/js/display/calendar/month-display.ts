import { TempusDominus } from '../../tempus-dominus';
import { Unit } from '../../datetime';
import { ActionTypes } from '../../actions';
import Namespace from '../../namespace';

/**
 * Creates and updates the grid for `month`
 */
export default class MonthDisplay {
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
    container.classList.add(Namespace.Css.monthsContainer);

    const table = document.createElement('table');
    const headTemplate = this._context._display._headTemplate;
    const [previous, switcher, next] = headTemplate.getElementsByTagName('th');

    previous
      .getElementsByTagName('div')[0]
      .setAttribute('title', this._context.options.localization.previousYear);
    switcher.setAttribute(
      'title',
      this._context.options.localization.selectYear
    );
    switcher.setAttribute('colspan', '1');
    next
      .getElementsByTagName('div')[0]
      .setAttribute('title', this._context.options.localization.nextYear);

    table.appendChild(headTemplate);
    const tableBody = document.createElement('tbody');
    let row = document.createElement('tr');
    for (let i = 0; i <= 12; i++) {
      if (i !== 0 && i % 3 === 0) {
        tableBody.appendChild(row);
        row = document.createElement('tr');
      }
      const td = document.createElement('td');
      const div = document.createElement('div');
      div.setAttribute('data-action', ActionTypes.selectMonth);
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
      Namespace.Css.monthsContainer
    )[0];
    const [previous, switcher, next] = container
      .getElementsByTagName('thead')[0]
      .getElementsByTagName('th');

    switcher.innerText = this._context.viewDate.format({ year: 'numeric' });

    this._context._validation.isValid(
      this._context.viewDate.clone.manipulate(-1, Unit.year),
      Unit.year
    )
      ? previous.classList.remove(Namespace.Css.disabled)
      : previous.classList.add(Namespace.Css.disabled);

    this._context._validation.isValid(
      this._context.viewDate.clone.manipulate(1, Unit.year),
      Unit.year
    )
      ? next.classList.remove(Namespace.Css.disabled)
      : next.classList.add(Namespace.Css.disabled);

    let innerDate = this._context.viewDate.clone.startOf(Unit.year);

    container
      .querySelectorAll('tbody td div')
      .forEach((containerClone: HTMLElement, index) => {
        let classes = [];
        classes.push(Namespace.Css.month);

        if (
          !this._context._unset &&
          this._context.dates.isPicked(innerDate, Unit.month)
        ) {
          classes.push(Namespace.Css.active);
        }
        if (!this._context._validation.isValid(innerDate, Unit.month)) {
          classes.push(Namespace.Css.disabled);
        }

        containerClone.classList.remove(...containerClone.classList);
        containerClone.classList.add(...classes);
        containerClone.setAttribute('data-value', `${index}`);
        containerClone.innerText = `${innerDate.format({ month: 'long' })}`;
        innerDate.manipulate(1, Unit.month);
      });
  }
}
