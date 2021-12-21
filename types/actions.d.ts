import { TempusDominus } from './tempus-dominus';
/**
 *
 */
export default class Actions {
    private _context;
    constructor(context: TempusDominus);
    /**
     * Performs the selected `action`. See ActionTypes
     * @param e This is normally a click event
     * @param action If not provided, then look for a [data-action]
     */
    do(e: any, action?: ActionTypes): boolean;
}
export declare enum ActionTypes {
    next = "next",
    previous = "previous",
    pickerSwitch = "pickerSwitch",
    selectMonth = "selectMonth",
    selectYear = "selectYear",
    selectDecade = "selectDecade",
    selectDay = "selectDay",
    selectHour = "selectHour",
    selectMinute = "selectMinute",
    selectSecond = "selectSecond",
    incrementHours = "incrementHours",
    incrementMinutes = "incrementMinutes",
    incrementSeconds = "incrementSeconds",
    decrementHours = "decrementHours",
    decrementMinutes = "decrementMinutes",
    decrementSeconds = "decrementSeconds",
    toggleMeridiem = "toggleMeridiem",
    togglePicker = "togglePicker",
    showClock = "showClock",
    showHours = "showHours",
    showMinutes = "showMinutes",
    showSeconds = "showSeconds",
    clear = "clear",
    close = "close",
    today = "today"
}
