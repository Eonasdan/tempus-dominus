import { DateTime, Unit } from './datetime';
/**
 * Main class for date validation rules based on the options provided.
 */
export default class Validation {
    private optionsStore;
    constructor();
    /**
     * Checks to see if the target date is valid based on the rules provided in the options.
     * Granularity can be provide to chek portions of the date instead of the whole.
     * @param targetDate
     * @param granularity
     */
    isValid(targetDate: DateTime, granularity?: Unit): boolean;
    /**
     * Checks to see if the disabledDates option is in use and returns true (meaning invalid)
     * if the `testDate` is with in the array. Granularity is by date.
     * @param testDate
     * @private
     */
    private _isInDisabledDates;
    /**
     * Checks to see if the enabledDates option is in use and returns true (meaning valid)
     * if the `testDate` is with in the array. Granularity is by date.
     * @param testDate
     * @private
     */
    private _isInEnabledDates;
    /**
     * Checks to see if the disabledHours option is in use and returns true (meaning invalid)
     * if the `testDate` is with in the array. Granularity is by hours.
     * @param testDate
     * @private
     */
    private _isInDisabledHours;
    /**
     * Checks to see if the enabledHours option is in use and returns true (meaning valid)
     * if the `testDate` is with in the array. Granularity is by hours.
     * @param testDate
     * @private
     */
    private _isInEnabledHours;
}
