import { Namespace } from './conts.js';
import { TempusDominus } from './tempus-dominus';
import { DateTime, Unit } from './datetime';

export default class Dates {

    _dates: DateTime[] = [];

    private context: TempusDominus;

    constructor(context: TempusDominus) {
        this.context = context;
    }


    get picked(): DateTime[] {
        return this._dates;
    }

    get lastPicked(): DateTime {
        return this._dates[this.lastPickedIndex];
    }

    get lastPickedIndex(): number {
        if (this._dates.length === 0) return 0;
        return this._dates.length - 1;
    }

    add(date: DateTime): void {
        this._dates.push(date);
    }

    /**
     *
     * @param innerDate
     * @param unit
     */
    isPicked(innerDate: DateTime, unit?: Unit): boolean {
        if (!unit)
            return this._dates.find(x => x === innerDate) !== undefined;

        const format = Dates.getFormatByUnit(unit);

        let innerDateFormatted = innerDate.format(format);

        return this._dates.map(x => x.format(format)).find(x => x === innerDateFormatted) !== undefined;
    }

    pickedIndex(innerDate: DateTime, unit?: Unit): number {
        if (!unit)
            return this._dates.indexOf(innerDate);

        const format = Dates.getFormatByUnit(unit);

        let innerDateFormatted = innerDate.format(format);

        return this._dates.map(x => x.format(format)).indexOf(innerDateFormatted);
    }

    static getStartEndYear(factor: number, year: number): [number, number, number] {
        const step = factor / 10,
            startYear = Math.floor(year / factor) * factor,
            endYear = startYear + step * 9,
            focusValue = Math.floor(year / step) * step;
        return [startYear, endYear, focusValue];
    }

    _setValue(target: DateTime | undefined, index?: number): void {
        const noIndex = (typeof index === 'undefined'),
            isClear = !target && noIndex;
        let oldDate = this.context.unset ? null : this._dates[index];
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
                type: Namespace.Events.CHANGE,
                date: undefined,
                oldDate,
                isClear,
                isValid: true,
            });

            this.context.display.update('all');
            return;
        }

        index = 0;
        target = target.clone;

        if (this.context._options.stepping !== 1) {
            target.minutes = Math.round(target.minutes / this.context._options.stepping) * this.context._options.stepping;
            target.seconds = 0;
        }

        if (this.context.validation.isValid(target)) {
            this._dates[index] = target;
            this.context._viewDate = target.clone;
            
            if(this.context._input.value != target.toString())
            {
                this.context._input.value = target.toString()
            }

            this.context.unset = false;
            this.context.display.update('all');
            this.context._notifyEvent({
                type: Namespace.Events.CHANGE,
                date: target,
                oldDate,
                isClear,
                isValid: true,
            });
            //todo remove this
            console.log(JSON.stringify(this._dates.map(d => d.format({ dateStyle: 'full', timeStyle: 'long' })), null, 2)); //todo remove
            return;
        }

        if (this.context._options.keepInvalid) {
            this._dates[index] = target;
            this.context._viewDate = target.clone;
            this.context._notifyEvent({
                type: Namespace.Events.CHANGE,
                date: target,
                oldDate,
                isClear,
                isValid: false,
            });
        }
        this.context._notifyEvent({
            type: Namespace.Events.ERROR,
            reason: Namespace.ErrorMessages.failedToSetInvalidDate,
            date: target,
            oldDate
        });
    }

    static getFormatByUnit(unit: Unit): object {
        switch (unit) {
            case 'date':
                return { dateStyle: 'short' };
            case 'month':
                return {
                    month: 'numeric',
                    year: 'numeric'
                };
            case 'year':
                return { year: 'numeric' };
        }
    }
}