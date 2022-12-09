import { afterEach, expect, test, vi } from 'vitest';
//import * as sl from '../../src/js/utilities/service-locator';

// let mockSl = undefined;
//
// vi.mock('../../src/js/utilities/service-locator', async () => {
//   const actual: any = await vi.importActual("../../src/js/utilities/service-locator")
//   return {
//     ...actual,
//     serviceLocator: mockSl
//     // get serviceLocator() {
//     //   console.log('getting')
//     //   return mockSl;
//     // },
//     // set serviceLocator(value) {
//     //   console.log(`setting:`, value)
//     //   mockSl = value;
//     // }
//   };
// });

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

//let serviceLocator = undefined;

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
