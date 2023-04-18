import { DateTime, Unit } from '../src/js/datetime';
import { OptionsStore } from '../src/js/utilities/optionsStore';
import { OptionConverter } from '../src/js/utilities/optionConverter';
import DefaultOptions from '../src/js/utilities/default-options';
import DefaultFormatLocalization from '../src/js/utilities/default-format-localization';
import { vi } from 'vitest';
import { FixtureServiceLocator } from './fixtures/fixture-serviceLocator';
import { FixtureOptionsStore } from './fixtures/fixture-optionStore';

vi.doMock('../src/js/utilities/service-locator', () => {
  const slm = new FixtureServiceLocator();
  slm.load('OptionsStore', FixtureOptionsStore);
  return {
    serviceLocator: slm,
  };
});

import { serviceLocator } from '../src/js/utilities/service-locator';

const newDate = () => new DateTime(2023, 3 - 1, 14, 13, 25, 42, 500);
const newDateMinute = () => newDate().startOf(Unit.minutes);
const newDateStringMinute = newDateMinute().format('L LT');
const newDateStringIso = newDate().toISOString();

let store = serviceLocator.locate(OptionsStore);

const resetOptions = () => {
  store.options = OptionConverter.deepCopy(DefaultOptions);
};

const defaultLocalization = () => ({ ...DefaultFormatLocalization });

resetOptions();

export {
  newDate,
  newDateMinute,
  newDateStringMinute,
  newDateStringIso,
  resetOptions,
  store,
  defaultLocalization,
};
