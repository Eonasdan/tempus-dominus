import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import Dates from '../src/js/dates';
import {
  serviceLocator,
  setupServiceLocator,
} from '../src/js/utilities/service-locator';
import { DateTime } from '../src/js/datetime';

beforeEach(() => {
  setupServiceLocator();
});

test('Picked getter returns array', () => {
  const dates = new Dates();
  expect(dates.picked instanceof Array<DateTime>).toBe(true);
  expect(dates.picked.length).toBe(0);

  const dt = new DateTime();

  dates.add(dt);

  expect(dates.picked.length).toBe(1);
});

test('lastPicked to return last selected date', () => {
  const dates = new Dates();

  expect(dates.lastPickedIndex).toBe(0);

  const dt1 = new DateTime();
  const dt2 = new DateTime();

  dates.add(dt1);
  dates.add(dt2);

  expect(dates.lastPicked.valueOf()).toBe(dt2.valueOf());
  expect(dates.lastPickedIndex).toBe(1);
});

test('Format input should return string date', () => {});
