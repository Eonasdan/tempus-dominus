import { OptionConverter } from '../../src/js/utilities/optionConverter';
import DefaultOptions from '../../src/js/utilities/default-options';

export class FixtureOptionsStore {
  options = OptionConverter.deepCopy(DefaultOptions);
  element: HTMLElement;
  input: HTMLInputElement;
  unset: boolean;
  currentCalendarViewMode = 0;

  reset() {
    this.options = OptionConverter.deepCopy(DefaultOptions);
    this.unset = undefined;
    this.input = undefined;
    this.element = undefined;
  }
}
