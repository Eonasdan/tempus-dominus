import { TempusDominus } from '../../tempus-dominus';
import { DateTime, Unit } from '../../datetime';
import { ActionTypes } from '../../actions';
import Namespace from '../../namespace';
import Dates from '../../dates';

/**
 * Creates and updates the grid for `year`
 */
export default class YearDisplay {
  private _context: TempusDominus;
  private _startYear: DateTime;
  private _endYear: DateTime;

  constructor(context: TempusDominus) {
    this._context = context;
  }

  /**
   * Build the container html for the display
   * @private
   */
  get _picker(): HTMLElement {
    const container = document.createElement('div');
    container.classList.add(Namespace.css.yearsContainer);

    for (let i = 0; i < 12; i++) {
      const div = document.createElement('div');
      div.setAttribute('data-action', ActionTypes.selectYear);
      container.appendChild(div);
    }

    return container;
  }

  /**
   * Populates the grid and updates enabled states
   * @private
   */
  _update() {
    const [start, end] = Dates.getStartEndYear(
      10,
      this._context._viewDate.year
    );
    this._startYear = this._context._viewDate.clone.manipulate(-1, Unit.year);
    this._endYear = this._context._viewDate.clone.manipulate(10, Unit.year);

    const container = this._context._display.widget.getElementsByClassName(
      Namespace.css.yearsContainer
    )[0];
    const [previous, switcher, next] = container.parentElement
      .getElementsByClassName(Namespace.css.calendarHeader)[0]
      .getElementsByTagName('div');

    switcher.setAttribute(
      Namespace.css.yearsContainer,
      `${this._startYear.format({ year: 'numeric' })}-${this._endYear.format({ year: 'numeric' })}`
    );

    this._context._validation.isValid(this._startYear, Unit.year)
      ? previous.classList.remove(Namespace.css.disabled)
      : previous.classList.add(Namespace.css.disabled);
    this._context._validation.isValid(this._endYear, Unit.year)
      ? next.classList.remove(Namespace.css.disabled)
      : next.classList.add(Namespace.css.disabled);

    let innerDate = this._context._viewDate.clone
      .startOf(Unit.year)
      .manipulate(-1, Unit.year);

    container
      .querySelectorAll(`[data-action="${ActionTypes.selectYear}"]`)
      .forEach((containerClone: HTMLElement, index) => {
        let classes = [];
        classes.push(Namespace.css.year);

        if (
          !this._context._unset &&
          this._context.dates.isPicked(innerDate, Unit.year)
        ) {
          classes.push(Namespace.css.active);
        }
        if (!this._context._validation.isValid(innerDate, Unit.year)) {
          classes.push(Namespace.css.disabled);
        }

        containerClone.classList.remove(...containerClone.classList);
        containerClone.classList.add(...classes);
        containerClone.setAttribute('data-value', `${innerDate.year}`);
        containerClone.innerText = innerDate.format({ year: "numeric" });

        innerDate.manipulate(1, Unit.year);
      });
  }
}
