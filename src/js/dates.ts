import {Namespace} from "./conts.js";
import {TempusDominus} from './tempus-dominus';
import {DateTime, Unit} from './datetime';

export default class Dates {

    _dates: DateTime[] = [];

    private context: TempusDominus;

    constructor(context:TempusDominus) {
        this.context = context;
    }

    get picked() {
        return this._dates;
    }

    get lastPicked() {
        return this._dates[this.lastPickedIndex]?.clone;
    }

    get lastPickedIndex() {
        return this._dates.length - 1;
    }

    add(date) {
        this._dates.push(date);
    }

    /**
     *
     * @param innerDate
     * @param unit
     */
    isPicked(innerDate: DateTime, unit: Unit): boolean {
        if (!unit)
            return this._dates.find(x => x === innerDate) !== undefined;

        let format = {}, innerDateFormatted = '';

        switch (unit) {
            case 'date':
                format = {dateStyle: "short"};
                break;
            case 'month':
                format = {
                    month: 'numeric',
                    year: 'numeric'
                };
                break;
            case 'year':
                format = {year: 'numeric'};
                break;
        }

        innerDateFormatted = innerDate.format(format);

        return this._dates.map(x => x.format(format)).find(x => x === innerDateFormatted) !== undefined;
    }

    static getStartEndYear(factor: number, year: number) {
        const step = factor / 10,
            startYear = Math.floor(year / factor) * factor,
            endYear = startYear + step * 9,
            focusValue = Math.floor(year / step) * step;
        return [startYear, endYear, focusValue];
    }

    _setValue(target: DateTime|undefined, index?: number) {
        const noIndex = (typeof index === 'undefined'),
            isClear = !target && noIndex;
        let isValid = true, oldDate = this.context.unset ? null : this._dates[index];
        if (!oldDate && !this.context.unset && noIndex && isClear) {
            oldDate = this.lastPicked;
        }

        // case of calling setValue(null or false)
        if (!target) {
            if (!this.context._options.allowMultidate || this._dates.length === 1 || isClear) {
                this.context.unset = true;
                this._dates = [];
            } else {
                this._dates.splice(index, 1);
            }
            this.context._notifyEvent({
                type: Namespace.EVENT_CHANGE,
                date: undefined,
                oldDate,
                isClear,
                isValid,
            });
            this.context.display.update();
            return;
        }

        target = target.clone;

        if (this.context._options.stepping !== 1) {
            target.minutes = Math.round(target.minutes / this.context._options.stepping) * this.context._options.stepping;
            target.seconds = 0;
        }

        if (this.context.validation.isValid(target)) {
            this._dates[index] = target;
            this.context._viewDate = target.clone;
            this.context.unset = false;
            this.context.display.update();
            this.context._notifyEvent({
                type: Namespace.EVENT_CHANGE,
                date: this._dates[index],
                oldDate,
                isClear,
                isValid,
            });
        } else {
            isValid = false;
            if (this.context._options.keepInvalid) {
                this._dates[index] = target;
                this.context._viewDate = target.clone
                this.context._notifyEvent({
                    type: Namespace.EVENT_CHANGE,
                    date: target,
                    oldDate,
                    isClear,
                    isValid,
                });
            }
            this.context._notifyEvent({
                type: Namespace.EVENT_ERROR,
                date: target,
                oldDate
            });
        }
    }
}