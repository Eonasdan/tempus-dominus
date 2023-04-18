import {
  loadFixtures,
  newDate,
  newDateMinute,
  newDateStringMinute,
  reset,
  secondaryDate,
  store,
} from './test-utilities';
import { afterAll, beforeAll, beforeEach, expect, test, vi } from 'vitest';
import Dates from '../src/js/dates';
import { DateTime, Unit } from '../src/js/datetime';
import { OptionConverter } from '../src/js/utilities/optionConverter';
import Validation from '../src/js/validation';
import { FixtureValidation } from './fixtures/validation.fixture';

let dates: Dates;

// @ts-ignore
const datesArray = () => dates?._dates;

const clearDates = () => {
  // @ts-ignore
  dates._dates = [];
};

// @ts-ignore
const emitters = () => dates._eventEmitters;

// @ts-ignore
const validation = () => dates.validation;
const dateConversionSpy = vi.spyOn(OptionConverter, 'dateConversion');

let setValueSpy;
let parseInputSpy;
let triggerEventSpy;
let updateDisplaySpy;
let formatInputSpy;
let setValueNullSpy;
let updateInputSpy;
let isValidSpy;
let dateRangeIsValidSpy;
let updateViewDateSpy;

const setupAllSpies = () => {
  triggerEventSpy = vi.spyOn(emitters().triggerEvent, 'emit');
  updateDisplaySpy = vi.spyOn(emitters().updateDisplay, 'emit');
  updateViewDateSpy = vi.spyOn(emitters().updateViewDate, 'emit');

  isValidSpy = vi.spyOn(validation(), 'isValid');
  dateRangeIsValidSpy = vi.spyOn(validation(), 'dateRangeIsValid');

  setValueSpy = vi.spyOn(dates, 'setValue');
  parseInputSpy = vi.spyOn(dates, 'parseInput');
  formatInputSpy = vi.spyOn(dates, 'formatInput');
  // @ts-ignore
  setValueNullSpy = vi.spyOn(dates, '_setValueNull');
  updateInputSpy = vi.spyOn(dates, 'updateInput');
};

beforeAll(() => {
  loadFixtures({ Validation: FixtureValidation });
  reset();
});

beforeEach(() => {
  reset();
  dates = new Dates();
  setupAllSpies();
});

afterAll(() => {
  vi.restoreAllMocks();
});

test('Picked getter returns array', () => {
  expect(dates.picked instanceof Array<DateTime>).toBe(true);
  expect(dates.picked.length).toBe(0);

  dates.add(newDate());

  expect(dates.picked.length).toBe(1);
  expect(datesArray()).toEqual([newDate()]);
});

test('lastPicked to return last selected date', () => {
  expect(dates.lastPickedIndex).toBe(0);

  dates.add(new DateTime());
  dates.add(newDate());

  expect(dates.lastPicked.valueOf()).toBe(newDate().valueOf());
  expect(dates.lastPickedIndex).toBe(1);
});

test('formatInput', () => {
  expect(dates.formatInput(undefined)).toBe('');

  expect(dates.formatInput(newDate())).toBe(newDateStringMinute);
});

test('parseInput', () => {
  //by default this function just calls the option converter which does way
  //too much for this unit test, so we'll just verify that the function can be called
  //with undefined and string. Probably should just hide this from the coverage.

  //test undefined
  dateConversionSpy.mockImplementationOnce(() => null);
  expect(dates.parseInput(undefined)).toBe(null);
  expect(dateConversionSpy).toHaveBeenCalledTimes(1);

  dateConversionSpy.mockImplementationOnce(() => newDateMinute());
  expect(dates.parseInput(newDateStringMinute).toISOString()).toBe(
    newDateMinute().toISOString()
  );
  expect(dateConversionSpy).toHaveBeenCalledTimes(2);
});

test('setFromInput', () => {
  dates.add(newDate());
  expect(datesArray()).toEqual([newDate()]);

  //test clearing the selected dates

  setValueSpy.mockImplementationOnce(() => clearDates());
  dates.setFromInput(undefined);
  expect(datesArray()).toEqual([]);
  expect(setValueSpy).toHaveBeenCalledTimes(1);
  clearDates();

  //test setting date from string
  setValueSpy.mockImplementationOnce(() => dates.add(newDateMinute()));
  parseInputSpy.mockImplementationOnce(() => newDateMinute());
  dates.setFromInput(newDateStringMinute);
  expect(datesArray()).toEqual([newDateMinute()]);
  expect(parseInputSpy).toHaveBeenCalledTimes(1);
  expect(setValueSpy).toHaveBeenCalledTimes(2);
});

test('isPicked', () => {
  //test invalid date
  // @ts-ignore
  expect(dates.isPicked('foo')).toBe(false);

  //test unselected date
  expect(dates.isPicked(newDate())).toBe(false);

  //test selected date
  dates.add(newDate());
  expect(dates.isPicked(newDate())).toBe(true);
  clearDates();

  //test unselected date
  expect(dates.isPicked(newDate(), Unit.date)).toBe(false);

  //test selected date
  dates.add(newDate());
  expect(dates.isPicked(newDate(), Unit.date)).toBe(true);
});

test('pickedIndex', () => {
  //test invalid date
  // @ts-ignore
  expect(dates.pickedIndex('foo')).toBe(-1);

  //test unselected date
  expect(dates.pickedIndex(newDate())).toBe(-1);

  //test selected date
  dates.add(newDate());
  expect(dates.pickedIndex(newDate())).toBe(+0);
  clearDates();

  //test unselected date
  expect(dates.pickedIndex(newDate(), Unit.date)).toBe(-1);

  //test selected date
  dates.add(newDate());
  expect(dates.pickedIndex(newDate(), Unit.date)).toBe(+0);
});

test('clear', () => {
  expect(store.unset).toBe(undefined);

  //add a date to confirm clear works
  dates.add(newDate());
  expect(datesArray()).toEqual([newDate()]);

  //test clear
  dates.clear();
  //change event should fire
  expect(triggerEventSpy).toHaveBeenCalled();
  //selected dates should be empty
  expect(datesArray()).toEqual([]);
  //updateDisplay should fire
  expect(updateDisplaySpy).toHaveBeenCalled();

  //reset to test clearing input field
  dates.add(newDate());
  expect(datesArray()).toEqual([newDate()]);
  store.input = document.createElement('input');
  store.input.value = 'foo';
  expect(store.input.value).toBe('foo');

  dates.clear();
  expect(triggerEventSpy).toHaveBeenCalled();
  expect(datesArray()).toEqual([]);
  expect(updateDisplaySpy).toHaveBeenCalled();
  expect(store.input.value).toBe('');
});

test('getStartEndYear', () => {
  expect(Dates.getStartEndYear(100, 2023)).toEqual([2000, 2090, 2020]);
  expect(Dates.getStartEndYear(10, 2023)).toEqual([2020, 2029, 2023]);
});

test('updateInput', () => {
  //test no input
  dates.updateInput(undefined);

  store.input = document.createElement('input');
  formatInputSpy.mockImplementation(() => newDateStringMinute);

  //test input
  dates.updateInput(newDate());
  expect(store.input.value).toBe('03/14/2023 1:25 PM');
  expect(formatInputSpy).toHaveBeenCalled();

  //test multipleDates
  store.options.multipleDates = true;
  dates.add(newDate());
  dates.add(newDate());

  dates.updateInput();
  expect(store.input.value).toBe('03/14/2023 1:25 PM; 03/14/2023 1:25 PM');
  expect(formatInputSpy).toHaveBeenCalled();
});

test('setValue', () => {
  setValueNullSpy.mockImplementation(vi.fn());
  updateInputSpy.mockImplementation(vi.fn());
  //test null value and no index
  store.unset = true;
  dates.setValue();
  expect(setValueNullSpy).toHaveBeenCalled();

  //test getting last picked to clear
  dates.add(newDate());
  store.unset = false;
  dates.setValue();
  clearDates();

  //test old date is the same
  dates.add(newDate());
  store.unset = false;
  dates.setValue(newDate(), 0);
  expect(updateInputSpy).toHaveBeenCalled();

  //test valid date with stepping
  isValidSpy.mockImplementationOnce(() => true);
  dateRangeIsValidSpy.mockImplementationOnce(() => true);

  store.options.stepping = 5;
  dates.setValue(newDate());
  expect(isValidSpy).toHaveBeenCalled();
  expect(dateRangeIsValidSpy).toHaveBeenCalled();
  expect(datesArray()).toEqual([newDate().startOf(Unit.minutes)]);
  expect(updateViewDateSpy).toHaveBeenCalled();
  expect(triggerEventSpy).toHaveBeenCalled();
  expect(store.unset).toBe(false);
  store.options.stepping = 1;

  //test keep invalid
  store.options.keepInvalid = true;
  isValidSpy.mockImplementationOnce(() => false);
  dates.setValue(newDate());
  expect(datesArray()).toEqual([newDate()]);
  store.options.keepInvalid = false;
  expect(updateViewDateSpy).toHaveBeenCalled();
  expect(triggerEventSpy).toHaveBeenCalled();
});

test('_setValueNull', () => {
  // @ts-ignore
  const method = dates._setValueNull.bind(dates);
  updateInputSpy.mockImplementation(vi.fn());

  //test clear with no options
  dates.add(newDate());
  method();
  expect(store.unset).toBe(true);
  expect(datesArray()).toEqual([]);
  expect(triggerEventSpy).toHaveBeenCalled();

  //test clear with multiple dates and one selection
  store.options.multipleDates = true;
  dates.add(newDate());
  method();
  expect(store.unset).toBe(true);
  expect(datesArray()).toEqual([]);
  expect(triggerEventSpy).toHaveBeenCalled();

  //test clear with multiple dates, two dates but passing isClear
  dates.add(newDate());
  dates.add(newDate());
  method(true);
  expect(store.unset).toBe(true);
  expect(datesArray()).toEqual([]);
  expect(triggerEventSpy).toHaveBeenCalled();

  //test clearing given index
  dates.add(newDate());
  dates.add(secondaryDate());
  method(false, 0);
  expect(store.unset).toBe(true);
  expect(datesArray()).toEqual([secondaryDate()]);
  expect(triggerEventSpy).toHaveBeenCalled();
});
