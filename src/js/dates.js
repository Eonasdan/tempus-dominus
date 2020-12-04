export default class Dates {
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

    isPicked(innerDate, unit) {
        if (!unit)
            return this._dates.find(x => x === innerDate);

        let format = '', innerDateFormatted = innerDate;

        switch (unit.toLowerCase()) {
            case 'd':
                format = 'MM/DD/YYYY';
                break;
            case 'm':
                format = 'MM/YYYY';
                break;
            case 'y':
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
}