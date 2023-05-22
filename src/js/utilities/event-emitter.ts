import { DateTime, Unit } from '../datetime';
import ActionTypes from './action-types';
import { BaseEvent } from './event-types';

export type ViewUpdateValues = Unit | 'decade' | 'clock' | 'calendar' | 'all';

class EventEmitter<T> {
  private subscribers: ((value?: T) => void)[] = [];

  subscribe(callback: (value: T) => void) {
    this.subscribers.push(callback);
    return this.unsubscribe.bind(this, this.subscribers.length - 1);
  }

  unsubscribe(index: number) {
    this.subscribers.splice(index, 1);
  }

  emit(value?: T) {
    this.subscribers.forEach((callback) => {
      callback(value);
    });
  }

  destroy() {
    this.subscribers = null;
    this.subscribers = [];
  }
}

export class EventEmitters {
  triggerEvent = new EventEmitter<BaseEvent>();
  viewUpdate = new EventEmitter();
  updateDisplay = new EventEmitter<ViewUpdateValues>();
  action = new EventEmitter<{ e: any; action?: ActionTypes }>(); //eslint-disable-line @typescript-eslint/no-explicit-any
  updateViewDate = new EventEmitter<DateTime>();

  destroy() {
    this.triggerEvent.destroy();
    this.viewUpdate.destroy();
    this.updateDisplay.destroy();
    this.action.destroy();
    this.updateViewDate.destroy();
  }
}
