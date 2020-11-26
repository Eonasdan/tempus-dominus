export default class Dates {
    _dates = [];

    constructor(context) {
        this.context = context;
    }

    get dates() {
        return this._dates;
    }

    get lastPicked() {
        return this._dates[this.lastPickedIndex];
    }

    get lastPickedIndex() {
        return this._dates.length - 1;
    }

    isPicked(innerDate) {
        return this._dates.find(x => innerDate.toISOString());
    }
}