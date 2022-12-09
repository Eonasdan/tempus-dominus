import { DateTime } from '../datetime';
import ViewMode from './view-mode';
import Options from './options';
export declare class OptionsStore {
  options: Options;
  element: HTMLElement;
  input: HTMLInputElement;
  unset: boolean;
  private _currentCalendarViewMode;
  get currentCalendarViewMode(): number;
  set currentCalendarViewMode(value: number);
  _viewDate: DateTime;
  get viewDate(): DateTime;
  set viewDate(v: DateTime);
  /**
   * When switching back to the calendar from the clock,
   * this sets currentView to the correct calendar view.
   */
  refreshCurrentView(): void;
  minimumCalendarViewMode: number;
  currentView: keyof ViewMode;
  get isTwelveHour(): boolean;
}
