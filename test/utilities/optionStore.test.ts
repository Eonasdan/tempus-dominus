import { newDate, secondaryDate } from '../test-utilities';
import { beforeEach, expect, test } from 'vitest';
import { OptionsStore } from '../../src/js/utilities/optionsStore';

let optionStore: OptionsStore;

beforeEach(() => {
  optionStore = new OptionsStore();
  optionStore.viewDate = newDate();
});

test('currentCalendarViewMode', () => {
  //default should be 0 on the calendar view
  expect(optionStore.currentCalendarViewMode).toBe(0);
  expect(optionStore.currentView).toBe('calendar');

  //mode 1 should be the months view
  optionStore.currentCalendarViewMode = 1;
  expect(optionStore.currentCalendarViewMode).toBe(1);
  expect(optionStore.currentView).toBe('months');

  //set the view to the clock and then simulate it back to the calendar
  optionStore.currentView = 'clock';
  expect(optionStore.currentView).toBe('clock');
  optionStore.refreshCurrentView();
  expect(optionStore.currentView).toBe('months');
});

test('viewDate', () => {
  //viewDate should be the initial date
  expect(optionStore.viewDate).toEqual(newDate());

  //using the setter
  optionStore.options = {};
  optionStore.viewDate = secondaryDate();
  expect(optionStore.viewDate).toEqual(secondaryDate());
  expect(optionStore.options.viewDate).toEqual(secondaryDate());
});

test('isTwelveHour', () => {
  optionStore.options = { localization: { hourCycle: 'h12' } };
  expect(optionStore.isTwelveHour).toBe(true);

  optionStore.options = { localization: { hourCycle: 'h23' } };
  expect(optionStore.isTwelveHour).toBe(false);
});
