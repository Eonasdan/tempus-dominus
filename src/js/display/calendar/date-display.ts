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
    container.classList.add(Namespace.Css.daysContainer);

    const table = document.createElement('table');
    const headTemplate = this._context._display._headTemplate;
    const [previous, switcher, next] = headTemplate.getElementsByTagName('th');

    previous
      .getElementsByTagName('div')[0]
      .setAttribute('title', this._context.options.localization.previousMonth);
    switcher.setAttribute(
      'title',
      this._context.options.localization.selectMonth
    );
    next
      .getElementsByTagName('div')[0]
      .setAttribute('title', this._context.options.localization.nextMonth);

    table.appendChild(headTemplate);
    const tableBody = document.createElement('tbody');
    tableBody.appendChild(this._daysOfTheWeek());

    let row = document.createElement('tr');

    if (this._context.options.display.calendarWeeks) {
      const td = document.createElement('td');
      const div = document.createElement('div');
      div.classList.add(Namespace.Css.calendarWeeks);
      td.appendChild(div);
      row.appendChild(td);
    }

    for (let i = 0; i <= 42; i++) {
      if (i !== 0 && i % 7 === 0) {
        tableBody.appendChild(row);
        row = document.createElement('tr');

        if (this._context.options.display.calendarWeeks) {
          const td = document.createElement('td');
          const div = document.createElement('div');
          div.classList.add(Namespace.Css.calendarWeeks);
          td.appendChild(div);
          row.appendChild(td);
        }
      }

      const td = document.createElement('td');
      const div = document.createElement('div');
      div.setAttribute('data-action', ActionTypes.selectDay);
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
      Namespace.Css.daysContainer
    )[0];
    const [previous, switcher, next] = container
      .getElementsByTagName('thead')[0]
      .getElementsByTagName('th');

    switcher.innerText = this._context.viewDate.format({
      month: this._context.options.localization.dayViewHeaderFormat,
    });

    this._context._validation.isValid(
      this._context.viewDate.clone.manipulate(-1, Unit.month),
      Unit.month
    )
      ? previous.classList.remove(Namespace.Css.disabled)
      : previous.classList.add(Namespace.Css.disabled);

    this._context._validation.isValid(
      this._context.viewDate.clone.manipulate(1, Unit.month),
      Unit.month
    )
      ? next.classList.remove(Namespace.Css.disabled)
      : next.classList.add(Namespace.Css.disabled);

    let innerDate = this._context.viewDate.clone
      .startOf(Unit.month)
      .startOf('weekDay')
      .manipulate(12, Unit.hours);

    container
      .querySelectorAll('tbody td div')
      .forEach((containerClone: HTMLElement, index) => {
        if (
          this._context.options.display.calendarWeeks &&
          containerClone.classList.contains(Namespace.Css.calendarWeeks)
        ) {
          containerClone.innerText = `${innerDate.week}`;
          return;
        }

        let classes = [];
        classes.push(Namespace.Css.day);

        if (innerDate.isBefore(this._context.viewDate, Unit.month)) {
          classes.push(Namespace.Css.old);
        }
        if (innerDate.isAfter(this._context.viewDate, Unit.month)) {
          classes.push(Namespace.Css.new);
        }

        if (
          !this._context._unset &&
          this._context.dates.isPicked(innerDate, Unit.date)
        ) {
          classes.push(Namespace.Css.active);
        }
        if (!this._context._validation.isValid(innerDate, Unit.date)) {
          classes.push(Namespace.Css.disabled);
        }
        if (innerDate.isSame(new DateTime(), Unit.date)) {
          classes.push(Namespace.Css.today);
        }
        if (innerDate.weekDay === 0 || innerDate.weekDay === 6) {
          classes.push(Namespace.Css.weekend);
        }

        containerClone.classList.remove(...containerClone.classList);
        containerClone.classList.add(...classes);
        containerClone.setAttribute(
          'data-value',
          `${innerDate.year}-${innerDate.monthFormatted}-${innerDate.dateFormatted}`
        );
        containerClone.innerText = `${innerDate.date}`;
        innerDate.manipulate(1, Unit.date);
      });
  }

  /***
   * Generates an html row that contains the days of the week.
   * @private
   */
  private _daysOfTheWeek(): HTMLTableRowElement {
    let innerDate = this._context.viewDate.clone
      .startOf('weekDay')
      .startOf(Unit.date);
    const row = document.createElement('tr');

    if (this._context.options.display.calendarWeeks) {
      const th = document.createElement('th');
      th.classList.add(Namespace.Css.calendarWeeks);
      th.innerText = '#';
      row.appendChild(th);
    }

    let i = 0;
    while (i < 7) {
      const th = document.createElement('th');
      th.classList.add(Namespace.Css.dayOfTheWeek);
      th.innerText = innerDate.format({ weekday: 'short' });
      innerDate.manipulate(1, Unit.date);
      row.appendChild(th);
      i++;
    }

    return row;
  }
}
