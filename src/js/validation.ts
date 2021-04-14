import { TempusDominus } from './tempus-dominus';
import { DateTime, Unit } from './datetime';
import Dates from './dates';

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
            if (this._context.options.restrictions.disabledDates && this._isInDisabledDates(targetDate)) {
                return false;
            }
            if (this._context.options.restrictions.enabledDates && !this._isInEnabledDates(targetDate)) {
                return false;
            }
            if (this._context.options.restrictions.daysOfWeekDisabled && this._context.options.restrictions.daysOfWeekDisabled.indexOf(targetDate.weekDay) !== -1) {
                return false;
            }
        }

        if (this._context.options.restrictions.minDate && targetDate.isBefore(this._context.options.restrictions.minDate, granularity)) {
            return false;
        }
        if (this._context.options.restrictions.maxDate && targetDate.isAfter(this._context.options.restrictions.maxDate, granularity)) {
            return false;
        }

        if (granularity === Unit.hours || granularity === Unit.minutes || granularity === Unit.seconds) {
            if (this._context.options.restrictions.disabledHours && this._isInDisabledHours(targetDate)) {
                return false;
            }
            if (this._context.options.restrictions.enabledHours && !this._isInEnabledHours(targetDate)) {
                return false;
            }
            if (this._context.options.restrictions.disabledTimeIntervals) {
                for (let i = 0; i < this._context.options.restrictions.disabledTimeIntervals.length; i++) {
                    if (targetDate.isBetween(this._context.options.restrictions.disabledTimeIntervals[i],
                        this._context.options.restrictions.disabledTimeIntervals[i + 1])) return false;
                    i++;
                }
            }
        }

        return true;
    }

    private _isInDisabledDates(testDate: DateTime) {
        if (!this._context.options.restrictions.disabledDates || this._context.options.restrictions.disabledDates.length === 0)
            return false;
        const formattedDate = testDate.format(Dates.getFormatByUnit(Unit.date));
        return this._context.options.restrictions.disabledDates.map(x => x.format(Dates.getFormatByUnit(Unit.date))).find(x => x === formattedDate);
    }

    private _isInEnabledDates(testDate: DateTime) {
        if (!this._context.options.restrictions.enabledDates || this._context.options.restrictions.enabledDates.length === 0)
            return true;
        const formattedDate = testDate.format(Dates.getFormatByUnit(Unit.date));
        return this._context.options.restrictions.enabledDates.map(x => x.format(Dates.getFormatByUnit(Unit.date))).find(x => x === formattedDate);
    }

    private _isInDisabledHours(testDate: DateTime) {
        if (!this._context.options.restrictions.disabledHours || this._context.options.restrictions.disabledHours.length === 0)
            return false;
        const formattedDate = testDate.hours;
        return this._context.options.restrictions.disabledHours.find(x => x === formattedDate);
    }

    private _isInEnabledHours(testDate: DateTime) {
        if (!this._context.options.restrictions.enabledHours || this._context.options.restrictions.enabledHours.length === 0)
            return true;
        const formattedDate = testDate.hours;
        return this._context.options.restrictions.enabledHours.find(x => x === formattedDate);
    }
}