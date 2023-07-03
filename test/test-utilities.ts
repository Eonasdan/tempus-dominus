import { DateTime, Unit } from '../src/js/datetime';
import { OptionsStore } from '../src/js/utilities/optionsStore';
import DefaultFormatLocalization from '../src/js/utilities/default-format-localization';
import { vi } from 'vitest';
import {
  FixtureServiceLocator,
  MockLoad,
} from './fixtures/serviceLocator.fixture';
import { FixtureOptionsStore } from './fixtures/optionStore.fixture';
import { FixtureEventEmitters } from './fixtures/eventemitters.fixture';

vi.doMock('../src/js/utilities/service-locator', () => {
  const slm = new FixtureServiceLocator();
  slm.loadEach({
    OptionsStore: FixtureOptionsStore,
    EventEmitters: FixtureEventEmitters,
  });
  return {
    serviceLocator: slm,
  };
});

// vi.mock('../src/js/utilities/service-locator', () => {
//   return {
//     serviceLocator: slm
//   };
// });

import { serviceLocator } from '../src/js/utilities/service-locator';

/**
 * March 14th, 2023 1:25:42:500 PM
 */
const newDate = () => new DateTime(2023, 3 - 1, 14, 13, 25, 42, 500);
const vanillaDate = () => new Date(2023, 3 - 1, 14, 13, 25, 42, 500);

/**
 * July 8th, 2023 3:00 AM
 */
const secondaryDate = () => new DateTime(2023, 7 - 1, 8, 3, 0);

const newDateMinute = () => newDate().startOf(Unit.minutes);
const newDateStringMinute = newDateMinute().format('L LT');
const newDateStringIso = newDate().toISOString();

let store = serviceLocator.locate(OptionsStore);

const reset = () => {
  (store as unknown as FixtureOptionsStore).reset();
  store.viewDate = newDate();
};

const loadFixtures = (load: MockLoad) => {
  (serviceLocator as unknown as FixtureServiceLocator).loadEach(load);
};

const defaultLocalization = () => ({ ...DefaultFormatLocalization });

const createElementWithClasses = (tagName: string, ...classes) => {
  const tag = document.createElement(tagName);
  tag.classList.add(...classes);
  return tag;
};

reset();

export {
  newDate,
  newDateMinute,
  newDateStringMinute,
  newDateStringIso,
  vanillaDate,
  secondaryDate,
  reset,
  store,
  defaultLocalization,
  loadFixtures,
  createElementWithClasses,
};
