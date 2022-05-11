import { Unit } from '../../datetime';
import Namespace from '../../utilities/namespace';
import Validation from '../../validation';
import Dates from '../../dates';
import { serviceLocator } from '../../utilities/service-locator';
import ActionTypes from '../../utilities/action-types';
import {OptionsStore} from "../../utilities/optionsStore";

/**
 * Creates the clock display
 */
export default class TimeDisplay {
  private _gridColumns = '';
  private optionsStore: OptionsStore;
  private validation: Validation;
  private dates: Dates;

  constructor() {
    this.optionsStore = serviceLocator.locate(OptionsStore);
    this.dates = serviceLocator.locate(Dates);
    this.validation = serviceLocator.locate(Validation);
  }

  /**
   * Build the container html for the clock display
   * @private
   */
  getPicker(iconTag: (iconClass: string) => HTMLElement): HTMLElement {
    const container = document.createElement('div');
    container.classList.add(Namespace.css.clockContainer);

    container.append(...this._grid(iconTag));

    return container;
  }

  /**
   * Populates the various elements with in the clock display
   * like the current hour and if the manipulation icons are enabled.
   * @private
   */
  _update(widget: HTMLElement): void {
    const timesDiv = <HTMLElement>(
      widget.getElementsByClassName(
        Namespace.css.clockContainer
      )[0]
    );
    const lastPicked = (
      this.dates.lastPicked || this.optionsStore.viewDate
    ).clone;

    timesDiv
      .querySelectorAll('.disabled')
      .forEach((element) => element.classList.remove(Namespace.css.disabled));

    if (this.optionsStore.options.display.components.hours) {
      if (
        !this.validation.isValid(
          this.optionsStore.viewDate.clone.manipulate(1, Unit.hours),
          Unit.hours
        )
      ) {
        timesDiv
          .querySelector(`[data-action=${ActionTypes.incrementHours}]`)
          .classList.add(Namespace.css.disabled);
      }

      if (
        !this.validation.isValid(
          this.optionsStore.viewDate.clone.manipulate(-1, Unit.hours),
          Unit.hours
        )
      ) {
        timesDiv
          .querySelector(`[data-action=${ActionTypes.decrementHours}]`)
          .classList.add(Namespace.css.disabled);
      }
      timesDiv.querySelector<HTMLElement>(
        `[data-time-component=${Unit.hours}]`
      ).innerText = this.optionsStore.options.display.components.useTwentyfourHour
        ? lastPicked.hoursFormatted
        : lastPicked.twelveHoursFormatted;
    }

    if (this.optionsStore.options.display.components.minutes) {
      if (
        !this.validation.isValid(
          this.optionsStore.viewDate.clone.manipulate(1, Unit.minutes),
          Unit.minutes
        )
      ) {
        timesDiv
          .querySelector(`[data-action=${ActionTypes.incrementMinutes}]`)
          .classList.add(Namespace.css.disabled);
      }

      if (
        !this.validation.isValid(
          this.optionsStore.viewDate.clone.manipulate(-1, Unit.minutes),
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

    if (this.optionsStore.options.display.components.seconds) {
      if (
        !this.validation.isValid(
          this.optionsStore.viewDate.clone.manipulate(1, Unit.seconds),
          Unit.seconds
        )
      ) {
        timesDiv
          .querySelector(`[data-action=${ActionTypes.incrementSeconds}]`)
          .classList.add(Namespace.css.disabled);
      }

      if (
        !this.validation.isValid(
          this.optionsStore.viewDate.clone.manipulate(-1, Unit.seconds),
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

    if (!this.optionsStore.options.display.components.useTwentyfourHour) {
      const toggle = timesDiv.querySelector<HTMLElement>(
        `[data-action=${ActionTypes.toggleMeridiem}]`
      );

      toggle.innerText = lastPicked.meridiem();

      if (
        !this.validation.isValid(
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
  private _grid(iconTag: (iconClass: string) => HTMLElement): HTMLElement[] {
    this._gridColumns = '';
    const top = [],
      middle = [],
      bottom = [],
      separator = document.createElement('div'),
      upIcon = iconTag(
        this.optionsStore.options.display.icons.up
      ),
      downIcon = iconTag(
        this.optionsStore.options.display.icons.down
      );

    separator.classList.add(Namespace.css.separator, Namespace.css.noHighlight);
    const separatorColon = <HTMLElement>separator.cloneNode(true);
    separatorColon.innerHTML = ':';

    const getSeparator = (colon = false): HTMLElement => {
      return colon
        ? <HTMLElement>separatorColon.cloneNode(true)
        : <HTMLElement>separator.cloneNode(true);
    };

    if (this.optionsStore.options.display.components.hours) {
      let divElement = document.createElement('div');
      divElement.setAttribute(
        'title',
        this.optionsStore.options.localization.incrementHour
      );
      divElement.setAttribute('data-action', ActionTypes.incrementHours);
      divElement.appendChild(upIcon.cloneNode(true));
      top.push(divElement);

      divElement = document.createElement('div');
      divElement.setAttribute(
        'title',
        this.optionsStore.options.localization.pickHour
      );
      divElement.setAttribute('data-action', ActionTypes.showHours);
      divElement.setAttribute('data-time-component', Unit.hours);
      middle.push(divElement);

      divElement = document.createElement('div');
      divElement.setAttribute(
        'title',
        this.optionsStore.options.localization.decrementHour
      );
      divElement.setAttribute('data-action', ActionTypes.decrementHours);
      divElement.appendChild(downIcon.cloneNode(true));
      bottom.push(divElement);
      this._gridColumns += 'a';
    }

    if (this.optionsStore.options.display.components.minutes) {
      this._gridColumns += ' a';
      if (this.optionsStore.options.display.components.hours) {
        top.push(getSeparator());
        middle.push(getSeparator(true));
        bottom.push(getSeparator());
        this._gridColumns += ' a';
      }
      let divElement = document.createElement('div');
      divElement.setAttribute(
        'title',
        this.optionsStore.options.localization.incrementMinute
      );
      divElement.setAttribute('data-action', ActionTypes.incrementMinutes);
      divElement.appendChild(upIcon.cloneNode(true));
      top.push(divElement);

      divElement = document.createElement('div');
      divElement.setAttribute(
        'title',
        this.optionsStore.options.localization.pickMinute
      );
      divElement.setAttribute('data-action', ActionTypes.showMinutes);
      divElement.setAttribute('data-time-component', Unit.minutes);
      middle.push(divElement);

      divElement = document.createElement('div');
      divElement.setAttribute(
        'title',
        this.optionsStore.options.localization.decrementMinute
      );
      divElement.setAttribute('data-action', ActionTypes.decrementMinutes);
      divElement.appendChild(downIcon.cloneNode(true));
      bottom.push(divElement);
    }

    if (this.optionsStore.options.display.components.seconds) {
      this._gridColumns += ' a';
      if (this.optionsStore.options.display.components.minutes) {
        top.push(getSeparator());
        middle.push(getSeparator(true));
        bottom.push(getSeparator());
        this._gridColumns += ' a';
      }
      let divElement = document.createElement('div');
      divElement.setAttribute(
        'title',
        this.optionsStore.options.localization.incrementSecond
      );
      divElement.setAttribute('data-action', ActionTypes.incrementSeconds);
      divElement.appendChild(upIcon.cloneNode(true));
      top.push(divElement);

      divElement = document.createElement('div');
      divElement.setAttribute(
        'title',
        this.optionsStore.options.localization.pickSecond
      );
      divElement.setAttribute('data-action', ActionTypes.showSeconds);
      divElement.setAttribute('data-time-component', Unit.seconds);
      middle.push(divElement);

      divElement = document.createElement('div');
      divElement.setAttribute(
        'title',
        this.optionsStore.options.localization.decrementSecond
      );
      divElement.setAttribute('data-action', ActionTypes.decrementSeconds);
      divElement.appendChild(downIcon.cloneNode(true));
      bottom.push(divElement);
    }

    if (!this.optionsStore.options.display.components.useTwentyfourHour) {
      this._gridColumns += ' a';
      let divElement = getSeparator();
      top.push(divElement);

      let button = document.createElement('button');
      button.setAttribute(
        'title',
        this.optionsStore.options.localization.toggleMeridiem
      );
      button.setAttribute('data-action', ActionTypes.toggleMeridiem);
      button.setAttribute('tabindex', '-1');
      if (Namespace.css.toggleMeridiem.includes(',')) { //todo move this to paint function?
        button.classList.add(...Namespace.css.toggleMeridiem.split(','));
      }
      else button.classList.add(Namespace.css.toggleMeridiem);

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
