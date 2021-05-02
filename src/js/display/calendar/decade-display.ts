import { TempusDominus } from '../../tempus-dominus';
import Dates from '../../dates';
import { DateTime, Unit } from '../../datetime';
import { ActionTypes } from '../../actions';
import Namespace from '../../namespace';

/**
 * Creates and updates the grid for `seconds`
 */
export default class DecadeDisplay {
  private _context: TempusDominus;
  private _startDecade: DateTime;
  private _endDecade: DateTime;

  constructor(context: TempusDominus) {
    this._context = context;
  }

  /**
   * Build the container html for the display
   * @private
   */
  get _picker() {
    const container = document.createElement('div');
    container.classList.add(Namespace.Css.decadesContainer);

    const table = document.createElement('table');
    const headTemplate = this._context._display._headTemplate;
    const [previous, switcher, next] = headTemplate.getElementsByTagName('th');

    previous
      .getElementsByTagName('div')[0]
      .setAttribute(
        'title',
        this._context.options.localization.previousCentury
      );
    switcher.setAttribute('title', '');
    switcher.removeAttribute('data-action');
    switcher.setAttribute('colspan', '1');
    next
      .getElementsByTagName('div')[0]
      .setAttribute('title', this._context.options.localization.nextCentury);

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
      div.setAttribute('data-action', ActionTypes.selectDecade);
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
    const [start, end] = Dates.getStartEndYear(
      100,
      this._context.viewDate.year
    );
    this._startDecade = this._context.viewDate.clone.startOf(Unit.year);
    this._startDecade.year = start;
    this._endDecade = this._context.viewDate.clone.startOf(Unit.year);
    this._endDecade.year = end;

    const container = this._context._display.widget.getElementsByClassName(
      Namespace.Css.decadesContainer
    )[0];
    const [previous, switcher, next] = container
      .getElementsByTagName('thead')[0]
      .getElementsByTagName('th');

    switcher.innerText = `${this._startDecade.year}-${this._endDecade.year}`;

    this._context._validation.isValid(this._startDecade, Unit.year)
      ? previous.classList.remove(Namespace.Css.disabled)
      : previous.classList.add(Namespace.Css.disabled);
    this._context._validation.isValid(this._endDecade, Unit.year)
      ? next.classList.remove(Namespace.Css.disabled)
      : next.classList.add(Namespace.Css.disabled);

    const pickedYears = this._context.dates.picked.map((x) => x.year);

    const nodeList = container.querySelectorAll('tbody td div');
    nodeList.forEach((containerClone: HTMLElement, index) => {
      if (index === 0) {
        containerClone.classList.add(Namespace.Css.old);
        if (this._startDecade.year - 10 < 0) {
          containerClone.innerText = '&nbsp;';
          return;
        } else {
          containerClone.innerText = `${this._startDecade.year - 10}`;
          containerClone.setAttribute(
            'data-value',
            `${this._startDecade.year + 6}`
          );
          return;
        }
      }

      let classes = [];
      classes.push(Namespace.Css.decade);
      const startDecadeYear = this._startDecade.year;
      const endDecadeYear = this._startDecade.year + 9;

      if (
        !this._context._unset &&
        pickedYears.filter((x) => x >= startDecadeYear && x <= endDecadeYear)
          .length > 0
      ) {
        classes.push(Namespace.Css.active);
      }

      containerClone.classList.remove(...containerClone.classList);
      containerClone.classList.add(...classes);
      containerClone.setAttribute(
        'data-value',
        `${this._startDecade.year + 6}`
      );
      containerClone.innerText = `${this._startDecade.year}`;

      if (nodeList.length === index + 1) {
        containerClone.classList.add(Namespace.Css.old);
      }

      this._startDecade.manipulate(10, Unit.year);
    });
  }
}
