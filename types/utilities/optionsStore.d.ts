import { DateTime } from "../datetime";
import ViewMode from "./view-mode";
import Options from "./options";
export declare class OptionsStore {
    options: Options;
    element: HTMLElement;
    viewDate: DateTime;
    input: HTMLInputElement;
    unset: boolean;
    private _currentCalendarViewMode;
    get currentCalendarViewMode(): number;
    set currentCalendarViewMode(value: number);
    /**
     * When switching back to the calendar from the clock,
     * this sets currentView to the correct calendar view.
     */
    refreshCurrentView(): void;
    minimumCalendarViewMode: number;
    currentView: keyof ViewMode;
}
