import { TempusDominus } from '../../tempus-dominus';
import { DateTime, Unit } from '../../datetime';
import { ActionTypes } from '../../actions';
import Namespace from '../../namespace';

/**
 * Creates and updates the grid for `date`
 */
export default class DateDisplay {
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
    container.classList.add(Namespace.css.daysContainer);

    container.append(...this._daysOfTheWeek());

    if (this._context._options.display.calendarWeeks) {
      const div = document.createElement('div');
      div.classList.add(Namespace.css.calendarWeeks, Namespace.css.noHighlight);
      container.appendChild(div);
    }

    for (let i = 0; i < 42; i++) {
      if (i !== 0 && i % 7 === 0) {
        if (this._context._options.display.calendarWeeks) {
          const div = document.createElement('div');
          div.classList.add(
            Namespace.css.calendarWeeks,
            Namespace.css.noHighlight
          );
          container.appendChild(div);
        }
      }

      const div = document.createElement('div');
      div.setAttribute('data-action', ActionTypes.selectDay);
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
      Namespace.css.daysContainer
    )[0];
    const [previous, switcher, next] = container.parentElement
      .getElementsByClassName(Namespace.css.calendarHeader)[0]
      .getElementsByTagName('div');

    switcher.setAttribute(
      Namespace.css.daysContainer,
      this._context._viewDate.format(
        this._context._options.localization.dayViewHeaderFormat
      )
    );

    this._context._validation.isValid(
      this._context._viewDate.clone.manipulate(-1, Unit.month),
      Unit.month
    )
      ? previous.classList.remove(Namespace.css.disabled)
      : previous.classList.add(Namespace.css.disabled);

    this._context._validation.isValid(
      this._context._viewDate.clone.manipulate(1, Unit.month),
      Unit.month
    )
      ? next.classList.remove(Namespace.css.disabled)
      : next.classList.add(Namespace.css.disabled);

    let innerDate = this._context._viewDate.clone
      .startOf(Unit.month)
      .startOf('weekDay', this._context._options.localization.startOfTheWeek)
      .manipulate(12, Unit.hours);

    container
      .querySelectorAll(
        `[data-action="${ActionTypes.selectDay}"], .${Namespace.css.calendarWeeks}`
      )
      .forEach((containerClone: HTMLElement, index) => {
        if (
          this._context._options.display.calendarWeeks &&
          containerClone.classList.contains(Namespace.css.calendarWeeks)
        ) {
          if (containerClone.innerText === '#') return;
          containerClone.innerText = `${innerDate.week}`;
          return;
        }

        let classes = [];
        classes.push(Namespace.css.day);

        if (innerDate.isBefore(this._context._viewDate, Unit.month)) {
          classes.push(Namespace.css.old);
        }
        if (innerDate.isAfter(this._context._viewDate, Unit.month)) {
          classes.push(Namespace.css.new);
        }

        if (
          !this._context._unset &&
          this._context.dates.isPicked(innerDate, Unit.date)
        ) {
          classes.push(Namespace.css.active);
        }
        if (!this._context._validation.isValid(innerDate, Unit.date)) {
          classes.push(Namespace.css.disabled);
        }
        if (innerDate.isSame(new DateTime(), Unit.date)) {
          classes.push(Namespace.css.today);
        }
        if (innerDate.weekDay === 0 || innerDate.weekDay === 6) {
          classes.push(Namespace.css.weekend);
        }

        containerClone.classList.remove(...containerClone.classList);
        containerClone.classList.add(...classes);
        containerClone.setAttribute(
          'data-value',
          `${innerDate.year}-${innerDate.monthFormatted}-${innerDate.dateFormatted}`
        );
        containerClone.setAttribute('data-day', `${innerDate.date}`);
        containerClone.innerText = innerDate.format({ day: 'numeric' });
        innerDate.manipulate(1, Unit.date);
      });
  }

  /***
   * Generates an html row that contains the days of the week.
   * @private
   */
  private _daysOfTheWeek(): HTMLElement[] {
    let innerDate = this._context._viewDate.clone
      .startOf('weekDay', this._context._options.localization.startOfTheWeek)
      .startOf(Unit.date);
    const row = [];
    document.createElement('div');

    if (this._context._options.display.calendarWeeks) {
      const htmlDivElement = document.createElement('div');
      htmlDivElement.classList.add(
        Namespace.css.calendarWeeks,
        Namespace.css.noHighlight
      );
      htmlDivElement.innerText = '#';
      row.push(htmlDivElement);
    }

    for (let i = 0; i < 7; i++) {
      const htmlDivElement = document.createElement('div');
      htmlDivElement.classList.add(
        Namespace.css.dayOfTheWeek,
        Namespace.css.noHighlight
      );
      htmlDivElement.innerText = innerDate.format({ weekday: 'short' });
      innerDate.manipulate(1, Unit.date);
      row.push(htmlDivElement);
    }

    return row;
  }
}
