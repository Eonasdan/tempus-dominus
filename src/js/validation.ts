import { DateTime, Unit } from './datetime';
import { serviceLocator } from './utilities/service-locator';
import { OptionsStore } from './utilities/optionsStore';

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
   * Granularity can be provided to check portions of the date instead of the whole.
   * @param targetDate
   * @param granularity
   */
  isValid(targetDate: DateTime, granularity?: Unit): boolean {
    if (!this._enabledDisabledDatesIsValid(granularity, targetDate))
      return false;

    if (
      granularity !== Unit.month &&
      granularity !== Unit.year &&
      this.optionsStore.options.restrictions.daysOfWeekDisabled?.length > 0 &&
      this.optionsStore.options.restrictions.daysOfWeekDisabled.indexOf(
        targetDate.weekDay
      ) !== -1
    )
      return false;

    if (!this._minMaxIsValid(granularity, targetDate)) return false;

    if (
      granularity === Unit.hours ||
      granularity === Unit.minutes ||
      granularity === Unit.seconds
    ) {
      if (!this._enabledDisabledHoursIsValid(targetDate)) return false;

      if (
        this.optionsStore.options.restrictions.disabledTimeIntervals?.filter(
          (internal) => targetDate.isBetween(internal.from, internal.to)
        ).length !== 0
      )
        return false;
    }

    return true;
  }

  private _enabledDisabledDatesIsValid(
    granularity: Unit,
    targetDate: DateTime
  ): boolean {
    if (granularity !== Unit.date) return true;

    if (
      this.optionsStore.options.restrictions.disabledDates.length > 0 &&
      this._isInDisabledDates(targetDate)
    ) {
      return false;
    }

    // noinspection RedundantIfStatementJS
    if (
      this.optionsStore.options.restrictions.enabledDates.length > 0 &&
      !this._isInEnabledDates(targetDate)
    ) {
      return false;
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

    return !!this.optionsStore.options.restrictions.disabledDates.find((x) =>
      x.isSame(testDate, Unit.date)
    );
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

    return !!this.optionsStore.options.restrictions.enabledDates.find((x) =>
      x.isSame(testDate, Unit.date)
    );
  }

  private _minMaxIsValid(granularity: Unit, targetDate: DateTime) {
    if (
      this.optionsStore.options.restrictions.minDate &&
      targetDate.isBefore(
        this.optionsStore.options.restrictions.minDate,
        granularity
      )
    ) {
      return false;
    }

    // noinspection RedundantIfStatementJS
    if (
      this.optionsStore.options.restrictions.maxDate &&
      targetDate.isAfter(
        this.optionsStore.options.restrictions.maxDate,
        granularity
      )
    ) {
      return false;
    }

    return true;
  }

  private _enabledDisabledHoursIsValid(targetDate) {
    if (
      this.optionsStore.options.restrictions.disabledHours.length > 0 &&
      this._isInDisabledHours(targetDate)
    ) {
      return false;
    }

    // noinspection RedundantIfStatementJS
    if (
      this.optionsStore.options.restrictions.enabledHours.length > 0 &&
      !this._isInEnabledHours(targetDate)
    ) {
      return false;
    }

    return true;
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
    return this.optionsStore.options.restrictions.disabledHours.includes(
      formattedDate
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
    return this.optionsStore.options.restrictions.enabledHours.includes(
      formattedDate
    );
  }

  dateRangeIsValid(dates: DateTime[], index: number, target: DateTime) {
    // if we're not using the option, then return valid
    if (!this.optionsStore.options.dateRange) return true;

    // if we've only selected 0..1 dates, and we're not setting the end date
    // then return valid. We only want to validate the range if both are selected,
    // because the other validation on the target has already occurred.
    if (dates.length !== 2 && index !== 1) return true;

    // initialize start date
    const start = dates[0].clone;
    // check if start date is not the same as target date
    if (start.isSame(target, Unit.date)) return true;

    // add one day to start; start has already been validated
    start.manipulate(1, Unit.date);

    // check each date in the range to make sure it's valid
    while (!start.isSame(target, Unit.date)) {
      const valid = this.isValid(start, Unit.date);
      if (!valid) return false;
      start.manipulate(1, Unit.date);
    }

    return true;
  }
}
