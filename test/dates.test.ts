// @ts-ignore
import {
  newDate,
  newDateMinute,
  newDateStringMinute,
  resetOptions,
  store,
} from './test-utilities';
import { afterAll, beforeAll, beforeEach, expect, test, vi } from 'vitest';
import Dates from '../src/js/dates';
import { DateTime, Unit } from '../src/js/datetime';
import { OptionConverter } from '../src/js/utilities/optionConverter';

let dates: Dates;

// @ts-ignore
const datesArray = () => dates?._dates;

const clearDates = () => {
  // @ts-ignore
  dates._dates = [];
};

beforeAll(() => {
  resetOptions();
});

beforeEach(() => {
  resetOptions();
  dates = new Dates();
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

  const spy = vi.spyOn(OptionConverter, 'dateConversion');

  //test undefined
  spy.mockImplementationOnce(() => null);
  expect(dates.parseInput(undefined)).toBe(null);
  expect(spy).toHaveBeenCalledTimes(1);

  spy.mockImplementationOnce(() => newDateMinute());
  expect(dates.parseInput(newDateStringMinute).toISOString()).toBe(
    newDateMinute().toISOString()
  );
  expect(spy).toHaveBeenCalledTimes(2);
});

test('setFromInput', () => {
  const setValueSpy = vi.spyOn(dates, 'setValue');
  const parseInputSpy = vi.spyOn(dates, 'parseInput');

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
