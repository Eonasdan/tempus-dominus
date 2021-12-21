import { TempusDominus } from '../../tempus-dominus';
import { Unit } from '../../datetime';
import { ActionTypes } from '../../actions';
import Namespace from '../../namespace';

/**
 * Creates the clock display
 */
export default class TimeDisplay {
  private _context: TempusDominus;
  private _gridColumns = '';
  constructor(context: TempusDominus) {
    this._context = context;
  }

  /**
   * Build the container html for the clock display
   * @private
   */
  get _picker(): HTMLElement {
    const container = document.createElement('div');
    container.classList.add(Namespace.css.clockContainer);

    container.append(...this._grid());

    return container;
  }

  /**
   * Populates the various elements with in the clock display
   * like the current hour and if the manipulation icons are enabled.
   * @private
   */
  _update(): void {
    if (!this._context._display._hasTime) return;
    const timesDiv = <HTMLElement>(
      this._context._display.widget.getElementsByClassName(
        Namespace.css.clockContainer
      )[0]
    );
    const lastPicked = (
      this._context.dates.lastPicked || this._context._viewDate
    ).clone;

    timesDiv
      .querySelectorAll('.disabled')
      .forEach((element) => element.classList.remove(Namespace.css.disabled));

    if (this._context._options.display.components.hours) {
      if (
        !this._context._validation.isValid(
          this._context._viewDate.clone.manipulate(1, Unit.hours),
          Unit.hours
        )
      ) {
        timesDiv
          .querySelector(`[data-action=${ActionTypes.incrementHours}]`)
          .classList.add(Namespace.css.disabled);
      }

      if (
        !this._context._validation.isValid(
          this._context._viewDate.clone.manipulate(-1, Unit.hours),
          Unit.hours
        )
      ) {
        timesDiv
          .querySelector(`[data-action=${ActionTypes.decrementHours}]`)
          .classList.add(Namespace.css.disabled);
      }
      timesDiv.querySelector<HTMLElement>(
        `[data-time-component=${Unit.hours}]`
      ).innerText = this._context._options.display.components.useTwentyfourHour
        ? lastPicked.hoursFormatted
        : lastPicked.twelveHoursFormatted;
    }

    if (this._context._options.display.components.minutes) {
      if (
        !this._context._validation.isValid(
          this._context._viewDate.clone.manipulate(1, Unit.minutes),
          Unit.minutes
        )
      ) {
        timesDiv
          .querySelector(`[data-action=${ActionTypes.incrementMinutes}]`)
          .classList.add(Namespace.css.disabled);
      }

      if (
        !this._context._validation.isValid(
          this._context._viewDate.clone.manipulate(-1, Unit.minutes),
          Unit.minutes
        )
      ) {
        timesDiv
          .querySelector(`[data-action=${ActionTypes.decrementMinutes}]`)
          .classList.add(Namespace.css.disabled);
      }
      timesDiv.querySelector<HTMLElement>(
        `[data-time-component=${Unit.minutes}]`
      ).innerText = lastPicked.minutesFormatted;
    }

    if (this._context._options.display.components.seconds) {
      if (
        !this._context._validation.isValid(
          this._context._viewDate.clone.manipulate(1, Unit.seconds),
          Unit.seconds
        )
      ) {
        timesDiv
          .querySelector(`[data-action=${ActionTypes.incrementSeconds}]`)
          .classList.add(Namespace.css.disabled);
      }

      if (
        !this._context._validation.isValid(
          this._context._viewDate.clone.manipulate(-1, Unit.seconds),
          Unit.seconds
        )
      ) {
        timesDiv
          .querySelector(`[data-action=${ActionTypes.decrementSeconds}]`)
          .classList.add(Namespace.css.disabled);
      }
      timesDiv.querySelector<HTMLElement>(
        `[data-time-component=${Unit.seconds}]`
      ).innerText = lastPicked.secondsFormatted;
    }

    if (!this._context._options.display.components.useTwentyfourHour) {
      const toggle = timesDiv.querySelector<HTMLElement>(
        `[data-action=${ActionTypes.toggleMeridiem}]`
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
        toggle.classList.add(Namespace.css.disabled);
      } else {
        toggle.classList.remove(Namespace.css.disabled);
      }
    }

    timesDiv.style.gridTemplateAreas = `"${this._gridColumns}"`;
  }

  /**
   * Creates the table for the clock display depending on what options are selected.
   * @private
   */
  private _grid(): HTMLElement[] {
    this._gridColumns = '';
    const top = [],
      middle = [],
      bottom = [],
      separator = document.createElement('div'),
      upIcon = this._context._display._iconTag(
        this._context._options.display.icons.up
      ),
      downIcon = this._context._display._iconTag(
        this._context._options.display.icons.down
      );

    separator.classList.add(Namespace.css.separator, Namespace.css.noHighlight);
    const separatorColon = <HTMLElement>separator.cloneNode(true);
    separatorColon.innerHTML = ':';

    const getSeparator = (colon = false): HTMLElement => {
      return colon
        ? <HTMLElement>separatorColon.cloneNode(true)
        : <HTMLElement>separator.cloneNode(true);
    };

    if (this._context._options.display.components.hours) {
      let divElement = document.createElement('div');
      divElement.setAttribute(
        'title',
        this._context._options.localization.incrementHour
      );
      divElement.setAttribute('data-action', ActionTypes.incrementHours);
      divElement.appendChild(upIcon.cloneNode(true));
      top.push(divElement);

      divElement = document.createElement('div');
      divElement.setAttribute(
        'title',
        this._context._options.localization.pickHour
      );
      divElement.setAttribute('data-action', ActionTypes.showHours);
      divElement.setAttribute('data-time-component', Unit.hours);
      middle.push(divElement);

      divElement = document.createElement('div');
      divElement.setAttribute(
        'title',
        this._context._options.localization.decrementHour
      );
      divElement.setAttribute('data-action', ActionTypes.decrementHours);
      divElement.appendChild(downIcon.cloneNode(true));
      bottom.push(divElement);
      this._gridColumns += 'a';
    }

    if (this._context._options.display.components.minutes) {
      this._gridColumns += ' a';
      if (this._context._options.display.components.hours) {
        top.push(getSeparator());
        middle.push(getSeparator(true));
        bottom.push(getSeparator());
        this._gridColumns += ' a';
      }
      let divElement = document.createElement('div');
      divElement.setAttribute(
        'title',
        this._context._options.localization.incrementMinute
      );
      divElement.setAttribute('data-action', ActionTypes.incrementMinutes);
      divElement.appendChild(upIcon.cloneNode(true));
      top.push(divElement);

      divElement = document.createElement('div');
      divElement.setAttribute(
        'title',
        this._context._options.localization.pickMinute
      );
      divElement.setAttribute('data-action', ActionTypes.showMinutes);
      divElement.setAttribute('data-time-component', Unit.minutes);
      middle.push(divElement);

      divElement = document.createElement('div');
      divElement.setAttribute(
        'title',
        this._context._options.localization.decrementMinute
      );
      divElement.setAttribute('data-action', ActionTypes.decrementMinutes);
      divElement.appendChild(downIcon.cloneNode(true));
      bottom.push(divElement);
    }

    if (this._context._options.display.components.seconds) {
      this._gridColumns += ' a';
      if (this._context._options.display.components.minutes) {
        top.push(getSeparator());
        middle.push(getSeparator(true));
        bottom.push(getSeparator());
        this._gridColumns += ' a';
      }
      let divElement = document.createElement('div');
      divElement.setAttribute(
        'title',
        this._context._options.localization.incrementSecond
      );
      divElement.setAttribute('data-action', ActionTypes.incrementSeconds);
      divElement.appendChild(upIcon.cloneNode(true));
      top.push(divElement);

      divElement = document.createElement('div');
      divElement.setAttribute(
        'title',
        this._context._options.localization.pickSecond
      );
      divElement.setAttribute('data-action', ActionTypes.showSeconds);
      divElement.setAttribute('data-time-component', Unit.seconds);
      middle.push(divElement);

      divElement = document.createElement('div');
      divElement.setAttribute(
        'title',
        this._context._options.localization.decrementSecond
      );
      divElement.setAttribute('data-action', ActionTypes.decrementSeconds);
      divElement.appendChild(downIcon.cloneNode(true));
      bottom.push(divElement);
    }

    if (!this._context._options.display.components.useTwentyfourHour) {
      this._gridColumns += ' a';
      let divElement = getSeparator();
      top.push(divElement);

      let button = document.createElement('button');
      button.setAttribute(
        'title',
        this._context._options.localization.toggleMeridiem
      );
      button.setAttribute('data-action', ActionTypes.toggleMeridiem);
      button.setAttribute('tabindex', '-1');
      button.classList.add(Namespace.css.toggleMeridiem);

      divElement = document.createElement('div');
      divElement.classList.add(Namespace.css.noHighlight);
      divElement.appendChild(button);
      middle.push(divElement);

      divElement = getSeparator();
      bottom.push(divElement);
    }

    this._gridColumns = this._gridColumns.trim();

    return [...top, ...middle, ...bottom];
  }
}
