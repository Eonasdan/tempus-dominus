import { DateTime } from '../datetime';
import CalendarModes from './calendar-modes';
import ViewMode from './view-mode';
import Options from './options';

export class OptionsStore {
  options: Options;
  element: HTMLElement;
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

  _viewDate = new DateTime();

  get viewDate() {
    return this._viewDate;
  }

  set viewDate(v) {
    this._viewDate = v;
    if (this.options) this.options.viewDate = v;
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

  get isTwelveHour() {
    return ['h12', 'h11'].includes(this.options.localization.hourCycle);
  }
}
