import { TempusDominus } from './tempus-dominus';
import { DateTime, Unit } from './datetime';
import Dates from './dates';

/**
 * Main class for date validation rules based on the options provided.
 */
export default class Validation {
  private _context: TempusDominus;

  constructor(context: TempusDominus) {
    this._context = context;
  }

  /**
   * Checks to see if the target date is valid based on the rules provided in the options.
   * Granularity can be provide to chek portions of the date instead of the whole.
   * @param targetDate
   * @param granularity
   */
  isValid(targetDate: DateTime, granularity?: Unit): boolean {
    if (granularity === Unit.date) {
      if (
        this._context.options.restrictions.disabledDates &&
        this._isInDisabledDates(targetDate)
      ) {
        return false;
      }
      if (
        this._context.options.restrictions.enabledDates &&
        !this._isInEnabledDates(targetDate)
      ) {
        return false;
      }
      if (
        this._context.options.restrictions.daysOfWeekDisabled &&
        this._context.options.restrictions.daysOfWeekDisabled.indexOf(
          targetDate.weekDay
        ) !== -1
      ) {
        return false;
      }
    }

    if (
      this._context.options.restrictions.minDate &&
      targetDate.isBefore(
        this._context.options.restrictions.minDate,
        granularity
      )
    ) {
      return false;
    }
    if (
      this._context.options.restrictions.maxDate &&
      targetDate.isAfter(
        this._context.options.restrictions.maxDate,
        granularity
      )
    ) {
      return false;
    }

    if (
      granularity === Unit.hours ||
      granularity === Unit.minutes ||
      granularity === Unit.seconds
    ) {
      if (
        this._context.options.restrictions.disabledHours &&
        this._isInDisabledHours(targetDate)
      ) {
        return false;
      }
      if (
        this._context.options.restrictions.enabledHours &&
        !this._isInEnabledHours(targetDate)
      ) {
        return false;
      }
      if (this._context.options.restrictions.disabledTimeIntervals) {
        for (
          let i = 0;
          i < this._context.options.restrictions.disabledTimeIntervals.length;
          i++
        ) {
          if (
            targetDate.isBetween(
              this._context.options.restrictions.disabledTimeIntervals[i].from,
              this._context.options.restrictions.disabledTimeIntervals[i].to
            )
          )
            return false;
        }
      }
    }

    return true;
  }

  /**
   * Checks to see if the disabledDates option is in use and returns true (meaning invalid)
   * if the `testDate` is with in the array. Granularity is by date.
   * @param testDate
   * @private
   */
  private _isInDisabledDates(testDate: DateTime) {
    if (
      !this._context.options.restrictions.disabledDates ||
      this._context.options.restrictions.disabledDates.length === 0
    )
      return false;
    const formattedDate = testDate.format(Dates.getFormatByUnit(Unit.date));
    return this._context.options.restrictions.disabledDates
      .map((x) => x.format(Dates.getFormatByUnit(Unit.date)))
      .find((x) => x === formattedDate);
  }

  /**
   * Checks to see if the enabledDates option is in use and returns true (meaning valid)
   * if the `testDate` is with in the array. Granularity is by date.
   * @param testDate
   * @private
   */
  private _isInEnabledDates(testDate: DateTime) {
    if (
      !this._context.options.restrictions.enabledDates ||
      this._context.options.restrictions.enabledDates.length === 0
    )
      return true;
    const formattedDate = testDate.format(Dates.getFormatByUnit(Unit.date));
    return this._context.options.restrictions.enabledDates
      .map((x) => x.format(Dates.getFormatByUnit(Unit.date)))
      .find((x) => x === formattedDate);
  }

  /**
   * Checks to see if the disabledHours option is in use and returns true (meaning invalid)
   * if the `testDate` is with in the array. Granularity is by hours.
   * @param testDate
   * @private
   */
  private _isInDisabledHours(testDate: DateTime) {
    if (
      !this._context.options.restrictions.disabledHours ||
      this._context.options.restrictions.disabledHours.length === 0
    )
      return false;
    const formattedDate = testDate.hours;
    return this._context.options.restrictions.disabledHours.find(
      (x) => x === formattedDate
    );
  }

  /**
   * Checks to see if the enabledHours option is in use and returns true (meaning valid)
   * if the `testDate` is with in the array. Granularity is by hours.
   * @param testDate
   * @private
   */
  private _isInEnabledHours(testDate: DateTime) {
    if (
      !this._context.options.restrictions.enabledHours ||
      this._context.options.restrictions.enabledHours.length === 0
    )
      return true;
    const formattedDate = testDate.hours;
    return this._context.options.restrictions.enabledHours.find(
      (x) => x === formattedDate
    );
  }
}
