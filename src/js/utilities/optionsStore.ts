import {DateTime} from "../datetime";
import CalendarModes from "./calendar-modes";
import ViewMode from "./view-mode";
import Options from "./options";

export class OptionsStore {
    options: Options;
    element: HTMLElement;
    viewDate = new DateTime();
    input: HTMLInputElement;
    unset: boolean;
    private _currentCalendarViewMode = 0;
    get currentCalendarViewMode() {
        return this._currentCalendarViewMode;
    }

    set currentCalendarViewMode(value) {
        this._currentCalendarViewMode = value;
        this.currentView = CalendarModes[value].name;
    }

    /**
     * When switching back to the calendar from the clock,
     * this sets currentView to the correct calendar view.
     */
    refreshCurrentView() {
        this.currentView = CalendarModes[this.currentCalendarViewMode].name;
    }

    minimumCalendarViewMode = 0;
    currentView: keyof ViewMode = 'calendar';
}
