/*
mostly I'm considering if I can/should write a date class like this so that I can use dayjs without it bleeding into the rest
of the project. This is super redundant right now, however, if the native js date functions ever catch up, it will be easier to replace.
 */

export default class DateTime {
    _dateObject;

    constructor() { }

    startOf(unit) {
        return this;
    }

    endOf(unit) {
        return this;
    }

    add(value, unit) {
        return this;
    }

    format(template) {
        return '';
    }

    isBefore(compare, unit) {
        return false;
    }

    isAfter(compare, unit) {
        return false;
    }

    isSame(compare, unit) {
        return false;
    }

    day() {
        return 0;
    }

    week() {
        return 0;
    }

    weekday() {
        return 0;
    }

    static get today() {
        return dayjs();
    }
}