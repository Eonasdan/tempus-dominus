import { DateTime, getFormatByUnit, Unit } from './datetime';
import { serviceLocator } from './utilities/service-locator';
import {OptionsStore} from "./utilities/optionsStore";

/**
 * Main class for date validation rules based on the options provided.
 */
export default class Validation {
  private optionsStore: OptionsStore;

  constructor() {
    this.optionsStore = serviceLocator.locate(OptionsStore);
  }

  /**
   * Checks to see if the target date is valid based on the rules provided in the options.
   * Granularity can be provide to chek portions of the date instead of the whole.
   * @param targetDate
   * @param granularity
   */
  isValid(targetDate: DateTime, granularity?: Unit): boolean {
    if (
      this.optionsStore.options.restrictions.disabledDates.length > 0 &&
      this._isInDisabledDates(targetDate)
    ) {
      return false;
    }
    if (
      this.optionsStore.options.restrictions.enabledDates.length > 0 &&
      !this._isInEnabledDates(targetDate)
    ) {
      return false;
    }
    if (
      granularity !== Unit.month &&
      granularity !== Unit.year &&
      this.optionsStore.options.restrictions.daysOfWeekDisabled?.length > 0 &&
      this.optionsStore.options.restrictions.daysOfWeekDisabled.indexOf(
        targetDate.weekDay
      ) !== -1
    ) {
      return false;
    }

    if (
      this.optionsStore.options.restrictions.minDate &&
      targetDate.isBefore(
        this.optionsStore.options.restrictions.minDate,
        granularity
      )
    ) {
      return false;
    }
    if (
      this.optionsStore.options.restrictions.maxDate &&
      targetDate.isAfter(
        this.optionsStore.options.restrictions.maxDate,
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
        this.optionsStore.options.restrictions.disabledHours.length > 0 &&
        this._isInDisabledHours(targetDate)
      ) {
        return false;
      }
      if (
        this.optionsStore.options.restrictions.enabledHours.length > 0 &&
        !this._isInEnabledHours(targetDate)
      ) {
        return false;
      }
      if (
        this.optionsStore.options.restrictions.disabledTimeIntervals.length > 0
      ) {
        for (let disabledTimeIntervals of this.optionsStore.options.restrictions.disabledTimeIntervals) {
          if (
            targetDate.isBetween(
              disabledTimeIntervals.from,
              disabledTimeIntervals.to
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
      !this.optionsStore.options.restrictions.disabledDates ||
      this.optionsStore.options.restrictions.disabledDates.length === 0
    )
      return false;
    const formattedDate = testDate.format(getFormatByUnit(Unit.date));
    return this.optionsStore.options.restrictions.disabledDates
      .map((x) => x.format(getFormatByUnit(Unit.date)))
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
      !this.optionsStore.options.restrictions.enabledDates ||
      this.optionsStore.options.restrictions.enabledDates.length === 0
    )
      return true;
    const formattedDate = testDate.format(getFormatByUnit(Unit.date));
    return this.optionsStore.options.restrictions.enabledDates
      .map((x) => x.format(getFormatByUnit(Unit.date)))
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
      !this.optionsStore.options.restrictions.disabledHours ||
      this.optionsStore.options.restrictions.disabledHours.length === 0
    )
      return false;
    const formattedDate = testDate.hours;
    return this.optionsStore.options.restrictions.disabledHours.find(
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
      !this.optionsStore.options.restrictions.enabledHours ||
      this.optionsStore.options.restrictions.enabledHours.length === 0
    )
      return true;
    const formattedDate = testDate.hours;
    return this.optionsStore.options.restrictions.enabledHours.find(
      (x) => x === formattedDate
    );
  }
}
