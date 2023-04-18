import { vi } from 'vitest';
import { DateTime, Unit } from '../../src/js/datetime';
import { EventEmitters } from '../../src/js/utilities/event-emitter';
import { OptionsStore } from '../../src/js/utilities/optionsStore';
import Validation from '../../src/js/validation';

export class FixtureDates {
  _dates: DateTime[];
  _eventEmitters: EventEmitters;
  readonly lastPicked: DateTime;
  readonly lastPickedIndex: number;
  optionsStore: OptionsStore;
  readonly picked: DateTime[];
  validation: Validation;

  add = vi.fn();
  clear = vi.fn();
  formatInput = vi.fn();
  isPicked = vi.fn();
  parseInput = vi.fn();
  pickedIndex = vi.fn();
  setFromInput = vi.fn();
  setValue = vi.fn();
  updateInput = vi.fn();
}
