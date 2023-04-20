import { OptionConverter } from '../../src/js/utilities/optionConverter';
import DefaultOptions from '../../src/js/utilities/default-options';
import { DateTime } from '../../src/js/datetime';
import { vi } from 'vitest';

export class FixtureOptionsStore {
  options = OptionConverter.deepCopy(DefaultOptions);
  element: HTMLElement;
  input: HTMLInputElement;
  unset: boolean;
  currentCalendarViewMode = 0;
  viewDate: DateTime;
  minimumCalendarViewMode = 0;
  refreshCurrentView = vi.fn();

  isTwelveHour = true;

  reset() {
    this.options = OptionConverter.deepCopy(DefaultOptions);
    this.unset = undefined;
    this.input = undefined;
    this.element = undefined;
    this.currentCalendarViewMode = 0;
    this.minimumCalendarViewMode = 0;
    this.options.localization.hourCycle = 'h12';
  }
}
