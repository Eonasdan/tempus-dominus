import { vi } from 'vitest';

export class FixtureDisplay {
  _showMode = vi.fn();
  _updateCalendarHeader = vi.fn();
  hide = vi.fn();
  _widget = document.createElement('div');

  get widget() {
    return this._widget;
  }

  _update = vi.fn();

  _iconTag() {
    const iconSpan = document.createElement('span');
    iconSpan.innerHTML = 'icon';
    return iconSpan;
  }
}
