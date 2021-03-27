import { TempusDominus } from './tempus-dominus';
import { DateTime, Unit } from './datetime';
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
            if (this.context._options.restrictions.enabledDates && !this._isInEnabledDates(targetDate)) {
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
                        this.context._options.restrictions.disabledTimeIntervals[i + 1])) return false;
                    i++;
                }
            }
        }

        return true;
    }

    _isInDisabledDates(testDate: DateTime) {
        if (!this.context._options.restrictions.disabledDates || this.context._options.restrictions.disabledDates.length === 0)
            return false;
        const formattedDate = testDate.format(Dates.getFormatByUnit(Unit.date));
        return this.context._options.restrictions.disabledDates.map(x => x.format(Dates.getFormatByUnit(Unit.date))).find(x => x === formattedDate);
    }

    _isInEnabledDates(testDate: DateTime) {
        if (!this.context._options.restrictions.enabledDates || this.context._options.restrictions.enabledDates.length === 0)
            return true;
        const formattedDate = testDate.format(Dates.getFormatByUnit(Unit.date));
        return this.context._options.restrictions.enabledDates.map(x => x.format(Dates.getFormatByUnit(Unit.date))).find(x => x === formattedDate);
    }

    _isInDisabledHours(testDate: DateTime) {
        if (!this.context._options.restrictions.disabledHours || this.context._options.restrictions.disabledHours.length === 0)
            return false;
        const formattedDate = testDate.hours;
        return this.context._options.restrictions.disabledHours.find(x => x === formattedDate);
    }

    _isInEnabledHours(testDate: DateTime) {
        if (!this.context._options.restrictions.enabledHours || this.context._options.restrictions.enabledHours.length === 0)
            return true;
        const formattedDate = testDate.hours;
        return this.context._options.restrictions.enabledHours.find(x => x === formattedDate);
    }
}