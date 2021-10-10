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
    container.classList.add(Namespace.css.decadesContainer);

    for (let i = 0; i < 12; i++) {
      const div = document.createElement('div');
      div.setAttribute('data-action', ActionTypes.selectDecade);
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
      100,
      this._context._viewDate.year
    );
    this._startDecade = this._context._viewDate.clone.startOf(Unit.year);
    this._startDecade.year = start;
    this._endDecade = this._context._viewDate.clone.startOf(Unit.year);
    this._endDecade.year = end;

    const container = this._context._display.widget.getElementsByClassName(
      Namespace.css.decadesContainer
    )[0];
    const [previous, switcher, next] = container.parentElement
      .getElementsByClassName(Namespace.css.calendarHeader)[0]
      .getElementsByTagName('div');

    switcher.setAttribute(
      Namespace.css.decadesContainer,
      `${this._startDecade.format({ year: 'numeric' })}-${this._endDecade.format({ year: 'numeric' })}`
    );

    this._context._validation.isValid(this._startDecade, Unit.year)
      ? previous.classList.remove(Namespace.css.disabled)
      : previous.classList.add(Namespace.css.disabled);
    this._context._validation.isValid(this._endDecade, Unit.year)
      ? next.classList.remove(Namespace.css.disabled)
      : next.classList.add(Namespace.css.disabled);

    const pickedYears = this._context.dates.picked.map((x) => x.year);

    container
      .querySelectorAll(`[data-action="${ActionTypes.selectDecade}"]`)
      .forEach((containerClone: HTMLElement, index) => {
        if (index === 0) {
          containerClone.classList.add(Namespace.css.old);
          if (this._startDecade.year - 10 < 0) {
            containerClone.textContent = ' ';
            previous.classList.add(Namespace.css.disabled);
            containerClone.classList.add(Namespace.css.disabled);
            containerClone.setAttribute('data-value', ``);
            return;
          } else {
            containerClone.innerText = this._startDecade.clone.manipulate(-10, Unit.year).format({ year: 'numeric' });
            containerClone.setAttribute(
              'data-value',
              `${this._startDecade.year}`
            );
            return;
          }
        }

        let classes = [];
        classes.push(Namespace.css.decade);
        const startDecadeYear = this._startDecade.year;
        const endDecadeYear = this._startDecade.year + 9;

        if (
          !this._context._unset &&
          pickedYears.filter((x) => x >= startDecadeYear && x <= endDecadeYear)
            .length > 0
        ) {
          classes.push(Namespace.css.active);
        }

        containerClone.classList.remove(...containerClone.classList);
        containerClone.classList.add(...classes);
        containerClone.setAttribute(
          'data-value',
          `${this._startDecade.year}`
        );
        containerClone.innerText = `${this._startDecade.format({ year: 'numeric' })}`;

        this._startDecade.manipulate(10, Unit.year);
      });
  }
}
