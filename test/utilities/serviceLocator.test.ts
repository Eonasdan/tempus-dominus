import { afterEach, expect, test, vi } from 'vitest';
import {
  serviceLocator,
  setupServiceLocator,
} from '../../src/js/utilities/service-locator';

class MyService {
  count = 0;

  constructor() {
    this.count++;
  }
}

afterEach(() => {
  vi.restoreAllMocks();
});

test('Setup Service Locator creates a new instance', () => {
  expect(serviceLocator).toBe(undefined);
  setupServiceLocator();
  expect(typeof serviceLocator.locate).toBe('function');
});

test('Locate creates and caches service', () => {
  const myService = serviceLocator.locate(MyService);
  expect(myService).not.toBe(undefined);
  expect(myService.count).toBe(1);
});

test('Locate returns caches service', () => {
  const myService = serviceLocator.locate(MyService);
  expect(myService).not.toBe(undefined);

  myService.count++;

  expect(myService.count).toBe(2);
});
