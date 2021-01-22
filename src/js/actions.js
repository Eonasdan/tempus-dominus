import {DatePickerModes} from "./conts.js";

export default class Actions {

    /**
     *
     * @param {TempusDominus} context
     */
    constructor(context) {
        this.context = context;
    }

    do(e, action) {
        if (e.currentTarget.classList.contains('disabled')) return false;

        action = action || e.currentTarget.dataset.action;

        switch (action) {
            case ActionTypes.next:
            case ActionTypes.previous:
                const {NAV_FUNCTION, NAV_STEP} = DatePickerModes[this.context.currentViewMode];
                if (action === ActionTypes.next)
                    this.context._viewDate.manipulate(NAV_STEP, NAV_FUNCTION);
                else
                    this.context._viewDate.manipulate(NAV_STEP * -1, NAV_FUNCTION);
                this.context.display.updateDateView();
                this.context._viewUpdate(NAV_FUNCTION);
                break;
            case ActionTypes.pickerSwitch:
                this.context.display._showMode(1);
                break;
            case ActionTypes.selectMonth:
                const month = +e.target.getAttribute('data-value');
                this.context._viewDate.month = month;

                if (this.context.currentViewMode === this.context.minViewModeNumber) {
                    //todo in the old td this only used month/year and not the whole viewdate
                    this.context.dates._setValue(this.context._viewDate, this.context.dates.lastPickedIndex);
                    if (!this.context._options.inline) {
                        this.context.display.hide();
                    }
                } else {
                    this.context.display._showMode(-1);
                    this.context.display.updateDateView();
                }
                this.context._viewUpdate('month');
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

        console.log('action', action);
        console.log('e', e);
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
export {ActionTypes}