import {DatePickerModes} from "./conts.js";

export default class Actions {
    constructor(context) {
        this.context = context;
    }

    do(e, action) {
        if (e.currentTarget.classList.contains('disabled')) return false;

        action = action || e.currentTarget.dataset.action;

        switch (action) {
            case ActionTypes.next:
            case ActionTypes.previous:
                const navFnc = DatePickerModes[this.context.currentViewMode].NAV_FUNCTION;
                if (action === ActionTypes.next)
                    this.context._viewDate.add(DatePickerModes[this.context.currentViewMode].NAV_STEP, navFnc);
                else
                    this.context._viewDate.subtract(DatePickerModes[this.context.currentViewMode].NAV_STEP, navFnc);
                this.context.display.updateDateView();
                //this._viewUpdate(navFnc);todo trigger view date change event

                break;
            case ActionTypes.pickerSwitch:

                break;
            case ActionTypes.selectMonth:

                break;
            case ActionTypes.selectYear:

                break;
            case ActionTypes.selectDecade:

                break;
            case ActionTypes.selectDay:

                break;
            case ActionTypes.selectHour:

                break;
            case ActionTypes.selectMinute:

                break;
            case ActionTypes.selectSecond:

                break;
            case ActionTypes.incrementHours:

                break;
            case ActionTypes.incrementMinutes:

                break;
            case ActionTypes.incrementSeconds:

                break;
            case ActionTypes.decrementHours:

                break;
            case ActionTypes.decrementMinutes:

                break;
            case ActionTypes.decrementSeconds:

                break;
            case ActionTypes.togglePeriod:

                break;
            case ActionTypes.togglePicker:

                break;
            case ActionTypes.showPicker:

                break;
            case ActionTypes.showHours:

                break;
            case ActionTypes.showMinutes:

                break;
            case ActionTypes.showSeconds:

                break;
            case ActionTypes.clear:

                break;
            case ActionTypes.close:

                break;
            case ActionTypes.today:

                break;
        }

        console.log('action');
        console.log(action);
        console.log('e');
        console.log(e);
    }
}


let ActionTypes;
(function (ActionTypes) {
    ActionTypes["next"] = "next";
    ActionTypes["previous"] = "previous";
    ActionTypes["pickerSwitch"] = "pickerSwitch";
    ActionTypes["selectMonth"] = "selectMonth";
    ActionTypes["selectYear"] = "selectYear";
    ActionTypes["selectDecade"] = "selectDecade";
    ActionTypes["selectDay"] = "selectDay";
    ActionTypes["selectHour"] = "selectHour";
    ActionTypes["selectMinute"] = "selectMinute";
    ActionTypes["selectSecond"] = "selectSecond";
    ActionTypes["incrementHours"] = "incrementHours";
    ActionTypes["incrementMinutes"] = "incrementMinutes";
    ActionTypes["incrementSeconds"] = "incrementSeconds";
    ActionTypes["decrementHours"] = "decrementHours";
    ActionTypes["decrementMinutes"] = "decrementMinutes";
    ActionTypes["decrementSeconds"] = "decrementSeconds";
    ActionTypes["togglePeriod"] = "togglePeriod";
    ActionTypes["togglePicker"] = "togglePicker";
    ActionTypes["showPicker"] = "showPicker";
    ActionTypes["showHours"] = "showHours";
    ActionTypes["showMinutes"] = "showMinutes";
    ActionTypes["showSeconds"] = "showSeconds";
    ActionTypes["clear"] = "clear";
    ActionTypes["close"] = "close";
    ActionTypes["today"] = "today";
})(ActionTypes || (ActionTypes = {}));
export { ActionTypes }