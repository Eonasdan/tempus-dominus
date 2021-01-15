export default class Dates {

    /**
     *
     * @type {DateTime[]}
     * @private
     */
    _dates = [];

    constructor(context) {
        this.context = context;
    }

    get picked() {
        return this._dates;
    }

    get lastPicked() {
        return this._dates[this.lastPickedIndex];
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
     * @param {Unit|undefined} unit
     * @returns {*}
     */
    isPicked(innerDate, unit) {
        if (!unit)
            return this._dates.find(x => x === innerDate);

        let format = '', innerDateFormatted = innerDate;

        switch (unit) {
            case 'date':
                format = 'MM/DD/YYYY';
                break;
            case 'month':
                format = 'MM/YYYY';
                break;
            case 'year':
                format = 'YYYY';
                break;
        }

        innerDateFormatted = innerDate.format(format);

        return this._dates.map(x => x.format(format)).find(x => x === innerDateFormatted);
    }

    static getStartEndYear(factor, year) {
        const step = factor / 10,
            startYear = Math.floor(year / factor) * factor,
            endYear = startYear + step * 9,
            focusValue = Math.floor(year / step) * step;
        return [startYear, endYear, focusValue];
    }

    _setValue(targetMoment, index) {
        const noIndex = (typeof index === 'undefined'),
            isClear = !targetMoment && noIndex;
        let isInvalid = false, oldDate = this.unset ? null : this._dates[index];
        if (!oldDate && !this.unset && noIndex && isClear) {
            oldDate = this.lastPicked;
        }

        // case of calling setValue(null or false)
        if (!targetMoment) {
            if (!this.context._options.allowMultidate || this._dates.length === 1 || isClear) {
                this.unset = true;
                this._dates = [];
            } else {
                this._dates.splice(index, 1);
            }
            this._notifyEvent({
                type: EVENT_CHANGE,
                date: false,
                oldDate: oldDate,
                isClear,
                isInvalid,
                isDateUpdateThroughDateOptionFromClientCode,
                isInit: this.isInit
            });
            this._update();
            return;
        }

        targetMoment = targetMoment.clone().locale(this._options.locale); //todo moment

        if (this._hasTimeZone()) {
            targetMoment.tz(this._options.timeZone); //todo moment
        }

        if (this._options.stepping !== 1) {
            targetMoment.minutes(Math.round(targetMoment.minutes() / this._options.stepping) * this._options.stepping).seconds(0);  //todo moment
        }

        if (this._isValid(targetMoment)) {
            if (isNotAllowedProgrammaticUpdate) {
                this._notifyEvent({
                    type: EVENT_CHANGE,
                    date: targetMoment.clone(), //todo moment
                    oldDate: oldDate,
                    isClear,
                    isInvalid,
                    isDateUpdateThroughDateOptionFromClientCode,
                    isInit: this.isInit
                });
                return;
            }
            this._dates[index] = targetMoment;
            this._datesFormatted[index] = targetMoment.format('YYYY-MM-DD'); //todo moment
            this._viewDate = targetMoment.clone(); //todo moment
            if (this._options.allowMultidate && this._dates.length > 1) {
                for (let i = 0; i < this._dates.length; i++) {
                    outputValue += `${this._dates[i].format(this.actualFormat)}${this._options.multidateSeparator}`; //todo moment
                }
                outputValue = outputValue.replace(new RegExp(`${this._options.multidateSeparator}\\s*$`), '');
            } else {
                outputValue = this._dates[index].format(this.actualFormat); //todo moment
            }
            outputValue = trim(outputValue)
            if (this.input !== undefined) {
                this.input.val(outputValue); //todo jquery
                this.input.trigger('input'); //todo jquery
            }
            this._element.data('date', outputValue); //todo jquery

            this.unset = false;
            this._update();
            this._notifyEvent({
                type: EVENT_CHANGE,
                date: this._dates[index].clone(), //todo moment
                oldDate: oldDate,
                isClear,
                isInvalid,
                isDateUpdateThroughDateOptionFromClientCode,
                isInit: this.isInit
            });
        } else {
            isInvalid = true;
            if (!this._options.keepInvalid) {
                if (this.input !== undefined) {
                    this.input.val(`${this.unset ? '' : this._dates[index].format(this.actualFormat)}`); //todo jquery
                    this.input.trigger('input'); //todo jquery
                }
            } else {
                this._notifyEvent({
                    type: EVENT_CHANGE,
                    date: targetMoment,
                    oldDate: oldDate,
                    isClear,
                    isInvalid,
                    isDateUpdateThroughDateOptionFromClientCode,
                    isInit: this.isInit
                });
            }
            this._notifyEvent({
                type: EVENT_ERROR,
                date: targetMoment,
                oldDate: oldDate
            });
        }
    }
}