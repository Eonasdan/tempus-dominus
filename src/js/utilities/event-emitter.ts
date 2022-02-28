import { Unit } from '../datetime';
import ActionTypes from './action-types';
import { BaseEvent } from './event-types';

export type ViewUpdateValues = Unit | 'clock' | 'calendar' | 'all';

export class EventEmitter<T> {
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

  destory() {
    this.subscribers = null;
    this.subscribers = [];
  }
}

export class EventEmitters {
  triggerEvent = new EventEmitter<BaseEvent>();
  viewUpdate = new EventEmitter();
  updateDisplay = new EventEmitter<ViewUpdateValues>();
  action = new EventEmitter<{ e: any; action?: ActionTypes }>();

  destory() {
    this.triggerEvent.destory();
    this.viewUpdate.destory();
    this.updateDisplay.destory();
    this.action.destory();
  }
}
