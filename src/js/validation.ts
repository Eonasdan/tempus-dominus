import {TempusDominus} from './tempus-dominus';
import {DateTime, Unit} from './datetime';
import Dates from './dates';

export default class Validation {
    private context: TempusDominus;

    constructor(context: TempusDominus) {
        this.context = context;
    }

    /**
     *
     * @param targetDate
     * @param granularity
     */
    isValid(targetDate: DateTime, granularity?: Unit): boolean {
        if (granularity === Unit.date) {
            if (this.context._options.restrictions.disabledDates && this._isInDisabledDates(targetDate)) {
                return false;
            }
            if (this.context._options.restrictions.enabledDates&& !this._isInEnabledDates(targetDate)) {
                return false;
            }
            if (this.context._options.restrictions.daysOfWeekDisabled && this.context._options.restrictions.daysOfWeekDisabled.indexOf(targetDate.weekDay) !== -1) {
                return false;
            }
        }

        if (this.context._options.restrictions.minDate && targetDate.isBefore(this.context._options.restrictions.minDate, granularity)) {
            return false;
        }
        if (this.context._options.restrictions.maxDate && targetDate.isAfter(this.context._options.restrictions.maxDate, granularity)) {
            return false;
        }

        if (granularity === Unit.hours || granularity === Unit.minutes || granularity === Unit.seconds) {
            if (this.context._options.restrictions.disabledHours && this._isInDisabledHours(targetDate)) {
                return false;
            }
            if (this.context._options.restrictions.enabledHours && !this._isInEnabledHours(targetDate)) {
                return false;
            }
            if (this.context._options.restrictions.disabledTimeIntervals) {
                for (let i = 0; i < this.context._options.restrictions.disabledTimeIntervals.length; i++) {
                    if (targetDate.isBetween(this.context._options.restrictions.disabledTimeIntervals[i],
                        this.context._options.restrictions.disabledTimeIntervals[i+1])) return false;
                    i++;
                }
            }
        }

        return true;
    }

    _isInDisabledDates(testDate: DateTime) {
        return this.context._options.restrictions.disabledDates[testDate.format(Dates.getFormatByUnit(Unit.date))];
    }

    _isInEnabledDates(testDate: DateTime) {
        return this.context._options.restrictions.enabledDates[testDate.format(Dates.getFormatByUnit(Unit.date))];
    }

    _isInDisabledHours(testDate: DateTime) {
        return this.context._options.restrictions.disabledHours[testDate.hours];
    }

    _isInEnabledHours(testDate: DateTime) {
        return this.context._options.restrictions.enabledHours[testDate.hours];
    }
}