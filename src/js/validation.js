export default class Validation {
    constructor(context) {
        this.context = context;
    }

    /**
     *
     * @param {Date|DateTime} targetDate
     * @param {Unit?} granularity
     * @returns {boolean}
     */
    isValid(targetDate, granularity) {
        return true;
    }
}