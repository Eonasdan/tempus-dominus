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
            if (this.context.options.restrictions.disabledDates && this._isInDisabledDates(targetDate)) {
                return false;
            }
            if (this.context.options.restrictions.enabledDates && !this._isInEnabledDates(targetDate)) {
                return false;
            }
            if (this.context.options.restrictions.daysOfWeekDisabled && this.context.options.restrictions.daysOfWeekDisabled.indexOf(targetDate.weekDay) !== -1) {
                return false;
            }
        }

        if (this.context.options.restrictions.minDate && targetDate.isBefore(this.context.options.restrictions.minDate, granularity)) {
            return false;
        }
        if (this.context.options.restrictions.maxDate && targetDate.isAfter(this.context.options.restrictions.maxDate, granularity)) {
            return false;
        }

        if (granularity === Unit.hours || granularity === Unit.minutes || granularity === Unit.seconds) {
            if (this.context.options.restrictions.disabledHours && this._isInDisabledHours(targetDate)) {
                return false;
            }
            if (this.context.options.restrictions.enabledHours && !this._isInEnabledHours(targetDate)) {
                return false;
            }
            if (this.context.options.restrictions.disabledTimeIntervals) {
                for (let i = 0; i < this.context.options.restrictions.disabledTimeIntervals.length; i++) {
                    if (targetDate.isBetween(this.context.options.restrictions.disabledTimeIntervals[i],
                        this.context.options.restrictions.disabledTimeIntervals[i + 1])) return false;
                    i++;
                }
            }
        }

        return true;
    }

    _isInDisabledDates(testDate: DateTime) {
        if (!this.context.options.restrictions.disabledDates || this.context.options.restrictions.disabledDates.length === 0)
            return false;
        const formattedDate = testDate.format(Dates.getFormatByUnit(Unit.date));
        return this.context.options.restrictions.disabledDates.map(x => x.format(Dates.getFormatByUnit(Unit.date))).find(x => x === formattedDate);
    }

    _isInEnabledDates(testDate: DateTime) {
        if (!this.context.options.restrictions.enabledDates || this.context.options.restrictions.enabledDates.length === 0)
            return true;
        const formattedDate = testDate.format(Dates.getFormatByUnit(Unit.date));
        return this.context.options.restrictions.enabledDates.map(x => x.format(Dates.getFormatByUnit(Unit.date))).find(x => x === formattedDate);
    }

    _isInDisabledHours(testDate: DateTime) {
        if (!this.context.options.restrictions.disabledHours || this.context.options.restrictions.disabledHours.length === 0)
            return false;
        const formattedDate = testDate.hours;
        return this.context.options.restrictions.disabledHours.find(x => x === formattedDate);
    }

    _isInEnabledHours(testDate: DateTime) {
        if (!this.context.options.restrictions.enabledHours || this.context.options.restrictions.enabledHours.length === 0)
            return true;
        const formattedDate = testDate.hours;
        return this.context.options.restrictions.enabledHours.find(x => x === formattedDate);
    }
}