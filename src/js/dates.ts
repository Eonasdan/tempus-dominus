import { DateTime, getFormatByUnit, Unit } from './datetime';
import Namespace from './utilities/namespace';
import { ChangeEvent, FailEvent } from './utilities/event-types';
import Validation from './validation';
import { serviceLocator } from './utilities/service-locator';
import { EventEmitters } from './utilities/event-emitter';
import {OptionsStore} from "./utilities/optionsStore";
import {OptionConverter} from "./utilities/optionConverter";

export default class Dates {
  private _dates: DateTime[] = [];
  private optionsStore: OptionsStore;
  private validation: Validation;
  private _eventEmitters: EventEmitters;

  constructor() {
    this.optionsStore = serviceLocator.locate(OptionsStore);
    this.validation = serviceLocator.locate(Validation);
    this._eventEmitters = serviceLocator.locate(EventEmitters);
  }

  /**
   * Returns the array of selected dates
   */
  get picked(): DateTime[] {
    return this._dates;
  }

  /**
   * Returns the last picked value.
   */
  get lastPicked(): DateTime {
    return this._dates[this.lastPickedIndex];
  }

  /**
   * Returns the length of picked dates -1 or 0 if none are selected.
   */
  get lastPickedIndex(): number {
    if (this._dates.length === 0) return 0;
    return this._dates.length - 1;
  }

  /**
   * Formats a DateTime object to a string. Used when setting the input value.
   * @param date
   */
  formatInput(date: DateTime): string {
    const components = this.optionsStore.options.display.components;
    if (!date) return '';
    return date.format({
      year: components.calendar && components.year ? 'numeric' : undefined,
      month: components.calendar && components.month ? '2-digit' : undefined,
      day: components.calendar && components.date ? '2-digit' : undefined,
      hour:
        components.clock && components.hours
          ? components.useTwentyfourHour
            ? '2-digit'
            : 'numeric'
          : undefined,
      minute: components.clock && components.minutes ? '2-digit' : undefined,
      second: components.clock && components.seconds ? '2-digit' : undefined,
      hour12: !components.useTwentyfourHour,
    });
  }
  
  /**
   * parse the value into a DateTime object.
   * this can be overwritten to supply your own parsing.
   */
  parseInput(value:any): DateTime {
        return OptionConverter.dateConversion(value, 'input');
  }

  /**
   * Tries to convert the provided value to a DateTime object.
   * If value is null|undefined then clear the value of the provided index (or 0).
   * @param value Value to convert or null|undefined
   * @param index When using multidates this is the index in the array
   */
  setFromInput(value: any, index?: number) {
    if (!value) {
      this.setValue(undefined, index);
      return;
    }
    const converted = this.parseInput(value);
    if (converted) {
      converted.setLocale(this.optionsStore.options.localization.locale);
      this.setValue(converted, index);
    }
  }

  /**
   * Adds a new DateTime to selected dates array
   * @param date
   */
  add(date: DateTime): void {
    this._dates.push(date);
  }

  /**
   * Returns true if the `targetDate` is part of the selected dates array.
   * If `unit` is provided then a granularity to that unit will be used.
   * @param targetDate
   * @param unit
   */
  isPicked(targetDate: DateTime, unit?: Unit): boolean {
    if (!unit) return this._dates.find((x) => x === targetDate) !== undefined;

    const format = getFormatByUnit(unit);

    let innerDateFormatted = targetDate.format(format);

    return (
      this._dates
        .map((x) => x.format(format))
        .find((x) => x === innerDateFormatted) !== undefined
    );
  }

  /**
   * Returns the index at which `targetDate` is in the array.
   * This is used for updating or removing a date when multi-date is used
   * If `unit` is provided then a granularity to that unit will be used.
   * @param targetDate
   * @param unit
   */
  pickedIndex(targetDate: DateTime, unit?: Unit): number {
    if (!unit) return this._dates.indexOf(targetDate);

    const format = getFormatByUnit(unit);

    let innerDateFormatted = targetDate.format(format);

    return this._dates.map((x) => x.format(format)).indexOf(innerDateFormatted);
  }

  /**
   * Clears all selected dates.
   */
  clear() {
    this.optionsStore.unset = true;
    this._eventEmitters.triggerEvent.emit({
      type: Namespace.events.change,
      date: undefined,
      oldDate: this.lastPicked,
      isClear: true,
      isValid: true,
    } as ChangeEvent);
    this._dates = [];
  }

  /**
   * Find the "book end" years given a `year` and a `factor`
   * @param factor e.g. 100 for decades
   * @param year e.g. 2021
   */
  static getStartEndYear(
    factor: number,
    year: number
  ): [number, number, number] {
    const step = factor / 10,
      startYear = Math.floor(year / factor) * factor,
      endYear = startYear + step * 9,
      focusValue = Math.floor(year / step) * step;
    return [startYear, endYear, focusValue];
  }

  /**
   * Attempts to either clear or set the `target` date at `index`.
   * If the `target` is null then the date will be cleared.
   * If multi-date is being used then it will be removed from the array.
   * If `target` is valid and multi-date is used then if `index` is
   * provided the date at that index will be replaced, otherwise it is appended.
   * @param target
   * @param index
   */
  setValue(target?: DateTime, index?: number): void {
    const noIndex = typeof index === 'undefined',
      isClear = !target && noIndex;
    let oldDate = this.optionsStore.unset ? null : this._dates[index];
    if (!oldDate && !this.optionsStore.unset && noIndex && isClear) {
      oldDate = this.lastPicked;
    }

    const updateInput = () => {
      if (!this.optionsStore.input) return;

      let newValue = this.formatInput(target);
      if (this.optionsStore.options.multipleDates) {
        newValue = this._dates
          .map((d) => this.formatInput(d))
          .join(this.optionsStore.options.multipleDatesSeparator);
      }
      if (this.optionsStore.input.value != newValue)
        this.optionsStore.input.value = newValue;
    };

    if (target && oldDate?.isSame(target)) {
      updateInput();
      return;
    }

    // case of calling setValue(null)
    if (!target) {
      if (
        !this.optionsStore.options.multipleDates ||
        this._dates.length === 1 ||
        isClear
      ) {
        this.optionsStore.unset = true;
        this._dates = [];
      } else {
        this._dates.splice(index, 1);
      }

      updateInput();

      this._eventEmitters.triggerEvent.emit({
        type: Namespace.events.change,
        date: undefined,
        oldDate,
        isClear,
        isValid: true,
      } as ChangeEvent);

      this._eventEmitters.updateDisplay.emit('all');
      return;
    }

    index = index || 0;
    target = target.clone;

    // minute stepping is being used, force the minute to the closest value
    if (this.optionsStore.options.stepping !== 1) {
      target.minutes =
        Math.round(target.minutes / this.optionsStore.options.stepping) *
        this.optionsStore.options.stepping;
      target.seconds = 0;
    }

    if (this.validation.isValid(target)) {
      this._dates[index] = target;
      this.optionsStore.viewDate = target.clone;

      updateInput();

      this.optionsStore.unset = false;
      this._eventEmitters.updateDisplay.emit('all');
      this._eventEmitters.triggerEvent.emit({
        type: Namespace.events.change,
        date: target,
        oldDate,
        isClear,
        isValid: true,
      } as ChangeEvent);
      return;
    }

    if (this.optionsStore.options.keepInvalid) {
      this._dates[index] = target;
      this.optionsStore.viewDate = target.clone;

      updateInput();

      this._eventEmitters.triggerEvent.emit({
        type: Namespace.events.change,
        date: target,
        oldDate,
        isClear,
        isValid: false,
      } as ChangeEvent);
    }

    this._eventEmitters.triggerEvent.emit({
      type: Namespace.events.error,
      reason: Namespace.errorMessages.failedToSetInvalidDate,
      date: target,
      oldDate,
    } as FailEvent);
  }
}
