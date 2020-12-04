export default class Validation {
    constructor(context) {
        this.context = context;
    }

    isValid(targetMoment, granularity) {
        return true;
    }

    isEnabled(unit) {
        return true;
    }
}