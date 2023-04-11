/* eslint-disable  @typescript-eslint/ban-ts-comment */

import { beforeAll, beforeEach, expect, test } from 'vitest';
import {
  serviceLocator,
  setupServiceLocator,
} from '../src/js/utilities/service-locator';
import Validation from '../src/js/validation';
import DefaultOptions from '../src/js/utilities/default-options';
import { DateTime, Unit } from '../src/js/datetime';
import { OptionsStore } from '../src/js/utilities/optionsStore';
import { OptionConverter } from '../src/js/utilities/optionConverter';

let validation: Validation;
let store: OptionsStore;

const resetOptions = () => {
  store.options = OptionConverter.deepCopy(DefaultOptions);
};

beforeAll(() => {
  setupServiceLocator();
  store = serviceLocator.locate(OptionsStore);
  resetOptions();
  validation = new Validation();
});

beforeEach(() => {
  resetOptions();
});

test('isValid', () => {
  let targetDate = new DateTime();

  //no rules
  expect(validation.isValid(targetDate, Unit.month)).toBe(true);
  expect(validation.isValid(targetDate, Unit.date)).toBe(true);
  expect(validation.isValid(targetDate, Unit.hours)).toBe(true);

  //enabled date
  store.options.restrictions.enabledDates = [targetDate];
  expect(validation.isValid(targetDate, Unit.date)).toBe(true);

  store.options.restrictions.enabledDates = [
    targetDate.clone.manipulate(1, Unit.date),
  ];
  expect(validation.isValid(targetDate, Unit.date)).toBe(false);

  store.options.restrictions.enabledDates = [];

  store.options.restrictions.daysOfWeekDisabled = [targetDate.weekDay];
  expect(validation.isValid(targetDate, Unit.date)).toBe(false);
  store.options.restrictions.daysOfWeekDisabled = [];

  store.options.restrictions.disabledHours = [targetDate.hours];
  expect(validation.isValid(targetDate, Unit.hours)).toBe(false);
  store.options.restrictions.disabledHours = [];

  store.options.restrictions.disabledTimeIntervals = [
    {
      from: targetDate.clone.manipulate(-2, Unit.hours),
      to: targetDate.clone.manipulate(2, Unit.hours),
    },
  ];
  expect(validation.isValid(targetDate, Unit.hours)).toBe(false);
});

test('enabledDisabledDatesIsValid ignores granularity', () => {
  let targetDate = new DateTime();
  // @ts-ignore
  const method = validation._enabledDisabledDatesIsValid.bind(validation);
  //ignore month
  expect(method(Unit.month, targetDate)).toBe(true);
});

test('enabledDisabledDatesIsValid', () => {
  let targetDate = new DateTime();
  // @ts-ignore
  const method = validation._enabledDisabledDatesIsValid.bind(validation);
  //ignore month
  expect(method(Unit.month, targetDate)).toBe(true);
  //no rules
  expect(method(Unit.date, targetDate)).toBe(true);

  //target date is one of the disabled dates
  store.options.restrictions.disabledDates = [targetDate];
  expect(method(Unit.date, targetDate)).toBe(false);

  //target date is not one of the disabled dates
  store.options.restrictions.disabledDates = [
    targetDate.clone.manipulate(1, Unit.date),
  ];
  expect(method(Unit.date, targetDate)).toBe(true);

  //target date is one of the enabledDates
  store.options.restrictions.enabledDates = [targetDate];
  expect(method(Unit.date, targetDate)).toBe(true);

  //target date is not one of the enabledDates
  store.options.restrictions.enabledDates = [
    targetDate.clone.manipulate(1, Unit.date),
  ];
  expect(method(Unit.date, targetDate)).toBe(false);
});

test('isInDisabledDates', () => {
  let targetDate = new DateTime();

  // @ts-ignore
  const method = validation._isInDisabledDates.bind(validation);

  //no rules
  store.options.restrictions.disabledDates = [];
  expect(method(targetDate)).toBe(false);

  //target date is in the array
  store.options.restrictions.disabledDates = [targetDate];
  expect(method(targetDate)).toBe(true);

  //target date is not in the array
  store.options.restrictions.disabledDates = [
    targetDate.clone.manipulate(1, Unit.date),
  ];
  expect(method(Unit.date, targetDate)).toBe(false);
});

test('isInEnabledDates', () => {
  let targetDate = new DateTime();

  // @ts-ignore
  const method = validation._isInEnabledDates.bind(validation);

  //no rules
  store.options.restrictions.enabledDates = [];
  expect(method(targetDate)).toBe(true);

  //target date is in the array
  store.options.restrictions.enabledDates = [targetDate];
  expect(method(targetDate)).toBe(true);

  //target date is not in the array
  store.options.restrictions.enabledDates = [
    targetDate.clone.manipulate(1, Unit.date),
  ];
  expect(method(Unit.date, targetDate)).toBe(false);
});

test('minMaxIsValid', () => {
  let targetDate = new DateTime();
  let backOne = targetDate.clone.manipulate(-1, Unit.date);
  let forwardOne = targetDate.clone.manipulate(1, Unit.date);

  // @ts-ignore
  const method = validation._minMaxIsValid.bind(validation);

  //no rules
  expect(method(Unit.date, targetDate)).toBe(true);

  //min date
  store.options.restrictions.minDate = backOne;
  expect(method(Unit.date, targetDate)).toBe(true);
  expect(method(Unit.date, targetDate.clone.manipulate(-2, Unit.date))).toBe(
    false
  );

  //max date
  store.options.restrictions.maxDate = forwardOne;
  expect(method(Unit.date, targetDate)).toBe(true);
  expect(method(Unit.date, targetDate.clone.manipulate(2, Unit.date))).toBe(
    false
  );
});

test('enabledDisabledHoursIsValid', () => {
  let targetDate = new DateTime();
  // @ts-ignore
  const method = validation._enabledDisabledHoursIsValid.bind(validation);

  //no rules
  expect(method(Unit.date, targetDate)).toBe(true);

  //target date's hour
  store.options.restrictions.disabledHours = [targetDate.hours];
  expect(method(targetDate)).toBe(false);

  //target date is not one of the disabled dates
  store.options.restrictions.disabledHours = [
    targetDate.clone.manipulate(1, Unit.hours).hours,
  ];
  expect(method(targetDate)).toBe(true);

  //target date is one of the enabledDates
  store.options.restrictions.enabledHours = [targetDate.hours];
  expect(method(targetDate)).toBe(true);

  //target date is not one of the enabledDates
  store.options.restrictions.enabledHours = [
    targetDate.clone.manipulate(1, Unit.hours).hours,
  ];
  expect(method(targetDate)).toBe(false);
});

test('isInDisabledHours', () => {
  let targetDate = new DateTime();

  // @ts-ignore
  const method = validation._isInDisabledHours.bind(validation);

  //no rules
  store.options.restrictions.disabledHours = [];
  expect(method(targetDate)).toBe(false);

  //target date's hour is in the array
  store.options.restrictions.disabledHours = [targetDate.hours];
  expect(method(targetDate)).toBe(true);

  //target date's hour is not in the array
  store.options.restrictions.disabledHours = [
    targetDate.clone.manipulate(1, Unit.hours).hours,
  ];
  expect(method(Unit.date, targetDate)).toBe(false);
});

test('isInEnabledHours', () => {
  let targetDate = new DateTime();

  // @ts-ignore
  const method = validation._isInEnabledHours.bind(validation);

  //no rules
  store.options.restrictions.enabledHours = [];
  expect(method(targetDate)).toBe(true);

  //target date's hour is in the array
  store.options.restrictions.enabledHours = [targetDate.hours];
  expect(method(targetDate)).toBe(true);

  //target date's hour is in the array
  store.options.restrictions.enabledHours = [
    targetDate.clone.manipulate(1, Unit.hours).hours,
  ];
  expect(method(Unit.date, targetDate)).toBe(false);
});

test('dateRangeIsValid', () => {
  let targetDate = new DateTime();
  let back = targetDate.clone.manipulate(-1, Unit.date);
  let forward = targetDate.clone.manipulate(3, Unit.date);

  //no rules
  expect(validation.dateRangeIsValid([], 0, targetDate)).toBe(true);

  //option is enabled but no dates are selected or not testing the end date
  store.options.dateRange = true;
  expect(validation.dateRangeIsValid([], 0, targetDate)).toBe(true);

  store.options.restrictions.maxDate = forward;

  //one of the dates in range fails validation
  expect(
    validation.dateRangeIsValid(
      [back],
      1,
      targetDate.clone.manipulate(5, Unit.date)
    )
  ).toBe(false);

  //all dates pass
  expect(
    validation.dateRangeIsValid(
      [back],
      1,
      targetDate.clone.manipulate(2, Unit.date)
    )
  ).toBe(true);
});
