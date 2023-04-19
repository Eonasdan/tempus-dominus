import { vi } from 'vitest';

export class FixtureDisplay {
  _showMode = vi.fn();
  _updateCalendarHeader = vi.fn();
  hide = vi.fn();
}
