import { OptionConverter } from '../../src/js/utilities/optionConverter';
import DefaultOptions from '../../src/js/utilities/default-options';

export class FixtureOptionsStore {
  options = OptionConverter.deepCopy(DefaultOptions);

  reset() {
    this.options = OptionConverter.deepCopy(DefaultOptions);
  }
}
