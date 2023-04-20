import { vi } from 'vitest';
import { DateTime } from '../../src/js/datetime';
import { EventEmitters } from '../../src/js/utilities/event-emitter';
import { OptionsStore } from '../../src/js/utilities/optionsStore';
import Validation from '../../src/js/validation';

export class FixtureDates {
  _dates: DateTime[] = [];
  _eventEmitters: EventEmitters;
  get lastPicked(): DateTime {
    return this._dates[this.lastPickedIndex];
  }

  get lastPickedIndex(): number {
    if (this._dates.length === 0) return 0;
    return this._dates.length - 1;
  }

  optionsStore: OptionsStore;

  get picked(): DateTime[] {
    return this._dates;
  }

  validation: Validation;

  add(value) {
    this._dates.push(value);
  }

  clear() {
    this._dates = [];
  }

  formatInput = vi.fn();
  isPicked = vi.fn();
  parseInput = vi.fn();
  pickedIndex = vi.fn();
  setFromInput = vi.fn();

  setValue(value, index) {
    if (!value) this._dates.splice(index, 1);
    else this._dates[index] = value;
  }

  updateInput = vi.fn();
}
