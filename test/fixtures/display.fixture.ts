import { vi } from 'vitest';

export class FixtureDisplay {
  _showMode = vi.fn();
  _updateCalendarHeader = vi.fn();
  hide = vi.fn();
  widget = document.createElement('div');

  _update = vi.fn();

  _iconTag() {
    const iconSpan = document.createElement('span');
    iconSpan.innerHTML = 'icon';
    return iconSpan;
  }

  _hasTime = true;
  _hasDate = true;

  get _hasDateAndTime(): boolean {
    return this._hasDate && this._hasTime;
  }
}
