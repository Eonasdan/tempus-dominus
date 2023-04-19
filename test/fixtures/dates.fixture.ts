import { vi } from 'vitest';
import { DateTime, Unit } from '../../src/js/datetime';
import { EventEmitters } from '../../src/js/utilities/event-emitter';
import { OptionsStore } from '../../src/js/utilities/optionsStore';
import Validation from '../../src/js/validation';

export class FixtureDates {
  _dates: DateTime[] = [];
  _eventEmitters: EventEmitters;
  lastPicked: DateTime;
  lastPickedIndex = 0;
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
    this._dates[index] = value;
  }

  updateInput = vi.fn();
}
