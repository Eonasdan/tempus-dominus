import { vi } from 'vitest';

const fakeEmitter = () => ({
  emit: vi.fn(),
  subscribe: vi.fn(),
  unsubscribe: vi.fn(),
  destroy: vi.fn(),
});

export class FixtureEventEmitters {
  triggerEvent = fakeEmitter();
  viewUpdate = fakeEmitter();
  updateDisplay = fakeEmitter();
  action = fakeEmitter();
  updateViewDate = fakeEmitter();

  destroy = vi.fn();
}
