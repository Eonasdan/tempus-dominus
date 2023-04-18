import { loadFixtures, newDate, reset, store } from './test-utilities';
import { afterAll, beforeAll, beforeEach, test, vi } from 'vitest';
import Actions from '../src/js/actions';
import { FixtureValidation } from './fixtures/validation.fixture';
import { FixtureDates } from './fixtures/dates.fixture';
import { FixtureDisplay } from './fixtures/display.fixture';
import Namespace from '../src/js/utilities/namespace';
import ActionTypes from '../src/js/utilities/action-types';

let actions;
let event;
let element: HTMLElement;

beforeAll(() => {
  loadFixtures({
    Validation: FixtureValidation,
    Dates: FixtureDates,
    Display: FixtureDisplay,
  });
  reset();
});

beforeEach(() => {
  reset();
  element = document.createElement('div');
  event = { currentTarget: element };
  actions = new Actions();
  store.viewDate = newDate();
});

afterAll(() => {
  vi.restoreAllMocks();
});

test('disabled', () => {
  element.classList.add(Namespace.css.disabled);
  actions.do(event);
  //what else could be done here?
});

test('next or previous', () => {
  actions.do(event, ActionTypes.next);
});
