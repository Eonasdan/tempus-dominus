import { TempusDominus } from '../../tempus-dominus';
import { DateTime, Unit } from '../../datetime';
import { ActionTypes } from '../../actions';
import Namespace from '../../namespace';

/**
 * Creates and updates the grid for `year`
 */
export default class YearDisplay {
  private _context: TempusDominus;
  private readonly _startYear: DateTime;
  private readonly _endYear: DateTime;

  constructor(context: TempusDominus) {
    this._context = context;
    this._startYear = this._context.viewDate.clone.manipulate(-1, Unit.year);
    this._endYear = this._context.viewDate.clone.manipulate(10, Unit.year);
  }

  /**
   * Build the container html for the display
   * @private
   */
  get _picker(): HTMLElement {
    const container = document.createElement('div');
    container.classList.add(Namespace.Css.yearsContainer);

    const table = document.createElement('table');
    const headTemplate = this._context._display._headTemplate;
    const [previous, switcher, next] = headTemplate.getElementsByTagName('th');

    previous
      .getElementsByTagName('div')[0]
      .setAttribute('title', this._context.options.localization.previousDecade);
    switcher.setAttribute(
      'title',
      this._context.options.localization.selectDecade
    );
    switcher.setAttribute('colspan', '1');
    next
      .getElementsByTagName('div')[0]
      .setAttribute('title', this._context.options.localization.nextDecade);

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
      div.setAttribute('data-action', ActionTypes.selectYear);
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
  _update() {
    const container = this._context._display.widget.getElementsByClassName(
      Namespace.Css.yearsContainer
    )[0];
    const [previous, switcher, next] = container
      .getElementsByTagName('thead')[0]
      .getElementsByTagName('th');

    switcher.innerText = `${this._startYear.year}-${this._endYear.year}`;

    this._context._validation.isValid(this._startYear, Unit.year)
      ? previous.classList.remove(Namespace.Css.disabled)
      : previous.classList.add(Namespace.Css.disabled);
    this._context._validation.isValid(this._endYear, Unit.year)
      ? next.classList.remove(Namespace.Css.disabled)
      : next.classList.add(Namespace.Css.disabled);

    let innerDate = this._context.viewDate.clone
      .startOf(Unit.year)
      .manipulate(-1, Unit.year);

    container
      .querySelectorAll('tbody td div')
      .forEach((containerClone: HTMLElement, index) => {
        let classes = [];
        classes.push(Namespace.Css.year);

        if (
          !this._context._unset &&
          this._context.dates.isPicked(innerDate, Unit.year)
        ) {
          classes.push(Namespace.Css.active);
        }
        if (!this._context._validation.isValid(innerDate, Unit.year)) {
          classes.push(Namespace.Css.disabled);
        }

        containerClone.classList.remove(...containerClone.classList);
        containerClone.classList.add(...classes);
        containerClone.innerText = `${innerDate.year}`;

        innerDate.manipulate(1, Unit.year);
      });
  }
}
