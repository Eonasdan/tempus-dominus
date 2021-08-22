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

    for (let i = 0; i < 12; i++) {
      const div = document.createElement('div');
      div.setAttribute('data-action', ActionTypes.selectMonth);
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
      Namespace.Css.monthsContainer
    )[0];
    const [previous, switcher, next] = container.parentElement
      .getElementsByClassName(Namespace.Css.calendarHeader)[0]
      .getElementsByTagName('div');

    switcher.innerText = this._context._viewDate.format({ year: 'numeric' });

    this._context._validation.isValid(
      this._context._viewDate.clone.manipulate(-1, Unit.year),
      Unit.year
    )
      ? previous.classList.remove(Namespace.Css.disabled)
      : previous.classList.add(Namespace.Css.disabled);

    this._context._validation.isValid(
      this._context._viewDate.clone.manipulate(1, Unit.year),
      Unit.year
    )
      ? next.classList.remove(Namespace.Css.disabled)
      : next.classList.add(Namespace.Css.disabled);

    let innerDate = this._context._viewDate.clone.startOf(Unit.year);

    container
      .querySelectorAll(`[data-action="${ActionTypes.selectMonth}"]`)
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
        containerClone.innerText = `${innerDate.format({ month: 'short' })}`;
        innerDate.manipulate(1, Unit.month);
      });
  }
}
