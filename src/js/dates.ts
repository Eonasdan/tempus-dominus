import { TempusDominus } from './tempus-dominus';
import { DateTime, Unit } from './datetime';
import Namespace from './namespace';
import { ChangeEvent, FailEvent } from './event-types';
import { OptionConverter } from './options';

export default class Dates {
  private _dates: DateTime[] = [];
  private _context: TempusDominus;

  constructor(context: TempusDominus) {
    this._context = context;
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
   * Adds a new DateTime to selected dates array
   * @param date
   */
  add(date: DateTime): void {
    this._dates.push(date);
  }

  /**
   * Tries to convert the provided value to a DateTime object.
   * If value is null|undefined then clear the value of the provided index (or 0).
   * @param value Value to convert or null|undefined
   * @param index When using multidates this is the index in the array
   * @param from Used in the warning message, useful for debugging.
   */
  set(value: any, index?: number, from: string = 'date.set') {
    if (!value) this._setValue(value, index);
    const converted = OptionConverter._dateConversion(value, from);
    if (converted) {
      converted.setLocale(this._context._options.localization.locale);
      this._setValue(converted, index);
    }
  }

  /**
   * Returns true if the `targetDate` is part of the selected dates array.
   * If `unit` is provided then a granularity to that unit will be used.
   * @param targetDate
   * @param unit
   */
  isPicked(targetDate: DateTime, unit?: Unit): boolean {
    if (!unit) return this._dates.find((x) => x === targetDate) !== undefined;

    const format = Dates.getFormatByUnit(unit);

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

    const format = Dates.getFormatByUnit(unit);

    let innerDateFormatted = targetDate.format(format);

    return this._dates.map((x) => x.format(format)).indexOf(innerDateFormatted);
  }

  /**
   * Clears all selected dates.
   */
  clear() {
    this._context._unset = true;
    this._context._triggerEvent({
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
   * Do not use direectly. Attempts to either clear or set the `target` date at `index`.
   * If the `target` is null then the date will be cleared.
   * If multi-date is being used then it will be removed from the array.
   * If `target` is valid and multi-date is used then if `index` is
   * provided the date at that index will be replaced, otherwise it is appended.
   * @param target
   * @param index
   */
  _setValue(target?: DateTime, index?: number): void {
    const noIndex = typeof index === 'undefined',
      isClear = !target && noIndex;
    let oldDate = this._context._unset ? null : this._dates[index];
    if (!oldDate && !this._context._unset && noIndex && isClear) {
      oldDate = this.lastPicked;
    }

    const updateInput = () => {
      if (!this._context._input) return;

      let newValue = this._context._options.hooks.inputFormat(
        this._context,
        target
      );
      if (this._context._options.multipleDates) {
        newValue = this._dates
          .map((d) =>
            this._context._options.hooks.inputFormat(this._context, d)
          )
          .join(this._context._options.multipleDatesSeparator);
      }
      if (this._context._input.value != newValue)
        this._context._input.value = newValue;
    };

    if (target && oldDate?.isSame(target)) {
      updateInput();
      return;
    }

    // case of calling setValue(null)
    if (!target) {
      if (
        !this._context._options.multipleDates ||
        this._dates.length === 1 ||
        isClear
      ) {
        this._context._unset = true;
        this._dates = [];
      } else {
        this._dates.splice(index, 1);
      }
      this._context._triggerEvent({
        type: Namespace.events.change,
        date: undefined,
        oldDate,
        isClear,
        isValid: true,
      } as ChangeEvent);

      updateInput();
      this._context._display._update('all');
      return;
    }

    index = index || 0;
    target = target.clone;

    // minute stepping is being used, force the minute to the closest value
    if (this._context._options.stepping !== 1) {
      target.minutes =
        Math.round(target.minutes / this._context._options.stepping) *
        this._context._options.stepping;
      target.seconds = 0;
    }

    if (this._context._validation.isValid(target)) {
      this._dates[index] = target;
      this._context._viewDate = target.clone;

      updateInput();

      this._context._unset = false;
      this._context._display._update('all');
      this._context._triggerEvent({
        type: Namespace.events.change,
        date: target,
        oldDate,
        isClear,
        isValid: true,
      } as ChangeEvent);
      return;
    }

    if (this._context._options.keepInvalid) {
      this._dates[index] = target;
      this._context._viewDate = target.clone;

      updateInput();

      this._context._triggerEvent({
        type: Namespace.events.change,
        date: target,
        oldDate,
        isClear,
        isValid: false,
      } as ChangeEvent);
    }
    this._context._triggerEvent({
      type: Namespace.events.error,
      reason: Namespace.errorMessages.failedToSetInvalidDate,
      date: target,
      oldDate,
    } as FailEvent);
  }

  /**
   * Returns a format object based on the granularity of `unit`
   * @param unit
   */
  static getFormatByUnit(unit: Unit): object {
    switch (unit) {
      case 'date':
        return { dateStyle: 'short' };
      case 'month':
        return {
          month: 'numeric',
          year: 'numeric',
        };
      case 'year':
        return { year: 'numeric' };
    }
  }
}
