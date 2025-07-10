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

  private _enabledDisabledHoursIsValid(targetDate: DateTime) {
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

  /**
   * The dateRangeIsValid check only looks at a single date at a time, but if
   * the user changes the text input as a whole (or the developer updates it
   * programmatically), then we must consider all the dates together, otherwise we
   * will be comparing the new start date with the old end date or vice versa (which
   * is an invalid comparison). This method will return undefined if the validation
   * does not make sense (such as if there aren't 2 dates to compare, along with
   * other similarly invalid checks). It returns true or false if the range is valid
   * @param dates
   */
  proposedDateRangeIsValid(dates: DateTime[]): boolean {
    // If we're not using the option, then the validation is irrelevant
    if (!this.optionsStore.options.dateRange) return undefined;

    // Technically, this should be undefined, but 1 date is problematic for
    // dateRangeIsValid if it is before the existing range
    if (dates.length === 1 && dates[0]) return true;

    // If we are not looking at exactly 2 dates, we will not pre-approve this
    // date range
    if (dates.length !== 2) return undefined;

    // If either date is undefined, something probably went wrong in parsing
    if (!dates[0] || !dates[1]) return undefined;

    const startDate = dates[0].clone;
    const endDate = dates[1].clone;

    // The startDate must be before or the same as the end date
    if (startDate.isAfter(endDate)) return false;

    // We are immediately invalid if either date is invalid
    if (
      !this.isValid(startDate, Unit.date) ||
      !this.isValid(endDate, Unit.date)
    )
      return false;

    // Finally, check each date within the range
    startDate.manipulate(1, Unit.date);

    while (!startDate.isSame(endDate, Unit.date)) {
      if (!this.isValid(startDate, Unit.date)) return false;

      startDate.manipulate(1, Unit.date);
    }

    return true;
  }

  dateRangeIsValid(
    dates: DateTime[],
    index: number,
    target: DateTime,
    proposedRangeValid?: boolean
  ) {
    // if we're not using the option, then return valid
    if (!this.optionsStore.options.dateRange) return true;

    // when setting the value explicitly, we validate everything ahead of time,
    // so just use those results
    if (proposedRangeValid !== undefined) return proposedRangeValid;

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

    // sanity check to avoid an infinite loop
    if (start.isAfter(target))
      throw new Error(`Unexpected '${start}' is after '${target}'`);

    // check each date in the range to make sure it's valid
    while (!start.isSame(target, Unit.date)) {
      const valid = this.isValid(start, Unit.date);
      if (!valid) return false;
      start.manipulate(1, Unit.date);
    }

    return true;
  }
}
