import { DateTime, getFormatByUnit, Unit } from './datetime';
import Namespace from './utilities/namespace';
import {
  ChangeEvent,
  FailEvent,
  ParseErrorEvent,
} from './utilities/event-types';
import Validation from './validation';
import { serviceLocator } from './utilities/service-locator';
import { EventEmitters } from './utilities/event-emitter';
import { OptionsStore } from './utilities/optionsStore';
import { OptionConverter } from './utilities/optionConverter';

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
    return [...this._dates];
  }

  /**
   * Returns the last picked value.
   */
  get lastPicked(): DateTime {
    return this._dates[this.lastPickedIndex]?.clone;
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
    if (!date) return '';
    date.localization = this.optionsStore.options.localization;
    return date.format();
  }

  /**
   * parse the value into a DateTime object.
   * this can be overwritten to supply your own parsing.
   */
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  parseInput(value: any): DateTime {
    try {
      return OptionConverter.dateConversion(
        value,
        'input',
        this.optionsStore.options.localization
      );
    } catch (e) {
      this._eventEmitters.triggerEvent.emit({
        type: Namespace.events.error,
        reason: Namespace.errorMessages.failedToParseInput,
        format: this.optionsStore.options.localization.format,
        value: value,
      } as ParseErrorEvent);
      return undefined;
    }
  }

  /**
   * Tries to convert the provided value to a DateTime object.
   * If value is null|undefined then clear the value of the provided index (or 0).
   * @param value Value to convert or null|undefined
   * @param index When using multidates this is the index in the array
   */
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  setFromInput(value: any, index?: number) {
    if (!value) {
      this.setValue(undefined, index);
      return;
    }
    const converted = this.parseInput(value);
    if (converted) {
      converted.setLocalization(this.optionsStore.options.localization);
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
    if (!DateTime.isValid(targetDate)) return false;
    if (!unit)
      return this._dates.find((x) => x.isSame(targetDate)) !== undefined;

    const format = getFormatByUnit(unit);

    const innerDateFormatted = targetDate.format(format);

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
    if (!DateTime.isValid(targetDate)) return -1;
    if (!unit)
      return this._dates.map((x) => x.valueOf()).indexOf(targetDate.valueOf());

    const format = getFormatByUnit(unit);

    const innerDateFormatted = targetDate.format(format);

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
    if (this.optionsStore.input) this.optionsStore.input.value = '';
    this._eventEmitters.updateDisplay.emit('all');
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

  updateInput(target?: DateTime) {
    if (!this.optionsStore.input) return;

    let newValue = this.formatInput(target);
    if (
      this.optionsStore.options.multipleDates ||
      this.optionsStore.options.dateRange
    ) {
      newValue = this._dates
        .map((d) => this.formatInput(d))
        .join(this.optionsStore.options.multipleDatesSeparator);
    }
    if (this.optionsStore.input.value != newValue)
      this.optionsStore.input.value = newValue;
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
    let oldDate = this.optionsStore.unset ? null : this._dates[index]?.clone;
    if (!oldDate && !this.optionsStore.unset && noIndex && isClear) {
      oldDate = this.lastPicked;
    }

    if (target && oldDate?.isSame(target)) {
      this.updateInput(target);
      return;
    }

    // case of calling setValue(null)
    if (!target) {
      this._setValueNull(isClear, index, oldDate);
      return;
    }

    index = index || 0;
    target = target.clone;

    // minute stepping is being used, force the minute to the closest value
    if (this.optionsStore.options.stepping !== 1) {
      target.minutes =
        Math.round(target.minutes / this.optionsStore.options.stepping) *
        this.optionsStore.options.stepping;
      target.startOf(Unit.minutes);
    }

    const onUpdate = (isValid: boolean) => {
      this._dates[index] = target;
      this._eventEmitters.updateViewDate.emit(target.clone);

      this.updateInput(target);

      this.optionsStore.unset = false;
      this._eventEmitters.updateDisplay.emit('all');
      this._eventEmitters.triggerEvent.emit({
        type: Namespace.events.change,
        date: target,
        oldDate,
        isClear,
        isValid: isValid,
      } as ChangeEvent);
    };

    if (
      this.validation.isValid(target) &&
      this.validation.dateRangeIsValid(this.picked, index, target)
    ) {
      onUpdate(true);
      return;
    }

    if (this.optionsStore.options.keepInvalid) {
      onUpdate(false);
    }

    this._eventEmitters.triggerEvent.emit({
      type: Namespace.events.error,
      reason: Namespace.errorMessages.failedToSetInvalidDate,
      date: target,
      oldDate,
    } as FailEvent);
  }

  private _setValueNull(isClear: boolean, index: number, oldDate: DateTime) {
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

    this.updateInput();

    this._eventEmitters.triggerEvent.emit({
      type: Namespace.events.change,
      date: undefined,
      oldDate,
      isClear,
      isValid: true,
    } as ChangeEvent);

    this._eventEmitters.updateDisplay.emit('all');
  }
}
