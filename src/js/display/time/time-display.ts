import { TempusDominus } from '../../tempus-dominus';
import { Unit } from '../../datetime';
import { ActionTypes } from '../../actions';
import Namespace from '../../namespace';

/**
 * Creates the clock display
 */
export default class TimeDisplay {
  private _context: TempusDominus;
  constructor(context: TempusDominus) {
    this._context = context;
  }

  /**
   * Build the container html for the clock display
   * @private
   */
  get _picker(): HTMLElement {
    const container = document.createElement('div');
    container.classList.add(Namespace.Css.clockContainer);

    const table = document.createElement('table');
    const tableBody = document.createElement('tbody');
    this._grid().forEach((row) => tableBody.appendChild(row));
    table.appendChild(tableBody);
    container.appendChild(table);

    return container;
  }

  /**
   * Populates the various elements with in the clock display
   * like the current hour and if the manipulation icons are enabled.
   * @private
   */
  _update(): void {
    const timesDiv = this._context._display.widget.getElementsByClassName(
      Namespace.Css.clockContainer
    )[0];
    const lastPicked = (
      this._context.dates.lastPicked || this._context.viewDate
    ).clone;

    if (!this._context.options.display.components.useTwentyfourHour) {
      const toggle = timesDiv.querySelector<HTMLElement>(
        `[data-action=${ActionTypes.togglePeriod}]`
      );

      toggle.innerText = lastPicked.meridiem();

      if (
        !this._context._validation.isValid(
          lastPicked.clone.manipulate(
            lastPicked.hours >= 12 ? -12 : 12,
            Unit.hours
          )
        )
      ) {
        toggle.classList.add(Namespace.Css.disabled);
      } else {
        toggle.classList.remove(Namespace.Css.disabled);
      }
    }

    timesDiv
      .querySelectorAll('.disabled')
      .forEach((element) => element.classList.remove(Namespace.Css.disabled));

    if (this._context.options.display.components.hours) {
      if (
        !this._context._validation.isValid(
          this._context.viewDate.clone.manipulate(1, Unit.hours),
          Unit.hours
        )
      ) {
        timesDiv
          .querySelector(`[data-action=${ActionTypes.incrementHours}]`)
          .classList.add(Namespace.Css.disabled);
      }

      if (
        !this._context._validation.isValid(
          this._context.viewDate.clone.manipulate(-1, Unit.hours),
          Unit.hours
        )
      ) {
        timesDiv
          .querySelector(`[data-action=${ActionTypes.decrementHours}]`)
          .classList.add(Namespace.Css.disabled);
      }
      timesDiv.querySelector<HTMLElement>(
        `[data-time-component=${Unit.hours}]`
      ).innerText = this._context.options.display.components.useTwentyfourHour
        ? lastPicked.hoursFormatted
        : lastPicked.twelveHoursFormatted;
    }

    if (this._context.options.display.components.minutes) {
      if (
        !this._context._validation.isValid(
          this._context.viewDate.clone.manipulate(1, Unit.minutes),
          Unit.minutes
        )
      ) {
        timesDiv
          .querySelector(`[data-action=${ActionTypes.incrementMinutes}]`)
          .classList.add(Namespace.Css.disabled);
      }

      if (
        !this._context._validation.isValid(
          this._context.viewDate.clone.manipulate(-1, Unit.minutes),
          Unit.minutes
        )
      ) {
        timesDiv
          .querySelector(`[data-action=${ActionTypes.decrementMinutes}]`)
          .classList.add(Namespace.Css.disabled);
      }
      timesDiv.querySelector<HTMLElement>(
        `[data-time-component=${Unit.minutes}]`
      ).innerText = lastPicked.minutesFormatted;
    }

    if (this._context.options.display.components.seconds) {
      if (
        !this._context._validation.isValid(
          this._context.viewDate.clone.manipulate(1, Unit.seconds),
          Unit.seconds
        )
      ) {
        timesDiv
          .querySelector(`[data-action=${ActionTypes.incrementSeconds}]`)
          .classList.add(Namespace.Css.disabled);
      }

      if (
        !this._context._validation.isValid(
          this._context.viewDate.clone.manipulate(-1, Unit.seconds),
          Unit.seconds
        )
      ) {
        timesDiv
          .querySelector(`[data-action=${ActionTypes.decrementSeconds}]`)
          .classList.add(Namespace.Css.disabled);
      }
      timesDiv.querySelector<HTMLElement>(
        `[data-time-component=${Unit.seconds}]`
      ).innerText = lastPicked.secondsFormatted;
    }
  }

  /**
   * Creates the table for the clock display depending on what options are selected.
   * @private
   */
  private _grid(): HTMLElement[] {
    const rows = [],
      separator = document.createElement('td'),
      separatorColon = <HTMLElement>separator.cloneNode(true),
      topRow = document.createElement('tr'),
      middleRow = document.createElement('tr'),
      bottomRow = document.createElement('tr'),
      upIcon = this._context._display._iconTag(
        this._context.options.display.icons.up
      ),
      downIcon = this._context._display._iconTag(
        this._context.options.display.icons.down
      ),
      actionDiv = document.createElement('div');

    separator.classList.add(Namespace.Css.separator);
    separatorColon.innerHTML = ':';

    if (this._context.options.display.components.hours) {
      let td = document.createElement('td');
      let actionLinkClone = <HTMLElement>actionDiv.cloneNode(true);
      actionLinkClone.setAttribute(
        'title',
        this._context.options.localization.incrementHour
      );
      actionLinkClone.setAttribute('data-action', ActionTypes.incrementHours);
      actionLinkClone.appendChild(upIcon.cloneNode(true));
      td.appendChild(actionLinkClone);
      topRow.appendChild(td);

      td = document.createElement('td');
      const div = document.createElement('div');
      div.setAttribute('title', this._context.options.localization.pickHour);
      div.setAttribute('data-action', ActionTypes.showHours);
      div.setAttribute('data-time-component', Unit.hours);
      td.appendChild(div);
      middleRow.appendChild(td);

      td = document.createElement('td');
      actionLinkClone = <HTMLElement>actionDiv.cloneNode(true);
      actionLinkClone.setAttribute(
        'title',
        this._context.options.localization.decrementHour
      );
      actionLinkClone.setAttribute('data-action', ActionTypes.decrementHours);
      actionLinkClone.appendChild(downIcon.cloneNode(true));
      td.appendChild(actionLinkClone);
      bottomRow.appendChild(td);
    }

    if (this._context.options.display.components.minutes) {
      if (this._context.options.display.components.hours) {
        topRow.appendChild(separator.cloneNode(true));
        middleRow.appendChild(separatorColon.cloneNode(true));
        bottomRow.appendChild(separator.cloneNode(true));
      }

      let td = document.createElement('td');
      let actionLinkClone = <HTMLElement>actionDiv.cloneNode(true);
      actionLinkClone.setAttribute(
        'title',
        this._context.options.localization.incrementMinute
      );
      actionLinkClone.setAttribute('data-action', ActionTypes.incrementMinutes);
      actionLinkClone.appendChild(upIcon.cloneNode(true));
      td.appendChild(actionLinkClone);
      topRow.appendChild(td);

      td = document.createElement('td');
      const div = document.createElement('div');
      div.setAttribute('title', this._context.options.localization.pickMinute);
      div.setAttribute('data-action', ActionTypes.showMinutes);
      div.setAttribute('data-time-component', Unit.minutes);
      td.appendChild(div);
      middleRow.appendChild(td);

      td = document.createElement('td');
      actionLinkClone = <HTMLElement>actionDiv.cloneNode(true);
      actionLinkClone.setAttribute(
        'title',
        this._context.options.localization.decrementMinute
      );
      actionLinkClone.setAttribute('data-action', ActionTypes.decrementMinutes);
      actionLinkClone.appendChild(downIcon.cloneNode(true));
      td.appendChild(actionLinkClone);
      bottomRow.appendChild(td);
    }

    if (this._context.options.display.components.seconds) {
      if (this._context.options.display.components.minutes) {
        topRow.appendChild(separator.cloneNode(true));
        middleRow.appendChild(separatorColon.cloneNode(true));
        bottomRow.appendChild(separator.cloneNode(true));
      }

      let td = document.createElement('td');
      let actionLinkClone = <HTMLElement>actionDiv.cloneNode(true);
      actionLinkClone.setAttribute(
        'title',
        this._context.options.localization.incrementSecond
      );
      actionLinkClone.setAttribute('data-action', ActionTypes.incrementSeconds);
      actionLinkClone.appendChild(upIcon.cloneNode(true));
      td.appendChild(actionLinkClone);
      topRow.appendChild(td);

      td = document.createElement('td');
      const div = document.createElement('div');
      div.setAttribute('title', this._context.options.localization.pickSecond);
      div.setAttribute('data-action', ActionTypes.showSeconds);
      div.setAttribute('data-time-component', Unit.seconds);
      td.appendChild(div);
      middleRow.appendChild(td);

      td = document.createElement('td');
      actionLinkClone = <HTMLElement>actionDiv.cloneNode(true);
      actionLinkClone.setAttribute(
        'title',
        this._context.options.localization.decrementSecond
      );
      actionLinkClone.setAttribute('data-action', ActionTypes.decrementSeconds);
      actionLinkClone.appendChild(downIcon.cloneNode(true));
      td.appendChild(actionLinkClone);
      bottomRow.appendChild(td);
    }

    if (!this._context.options.display.components.useTwentyfourHour) {
      topRow.appendChild(separator.cloneNode(true));

      let td = document.createElement('td');
      let button = document.createElement('button');
      button.setAttribute(
        'title',
        this._context.options.localization.togglePeriod
      );
      button.setAttribute('data-action', ActionTypes.togglePeriod);
      button.setAttribute('tabindex', '-1');
      td.appendChild(button);
      middleRow.appendChild(td);

      bottomRow.appendChild(separator.cloneNode(true));
    }

    rows.push(topRow, middleRow, bottomRow);

    return rows;
  }
}
