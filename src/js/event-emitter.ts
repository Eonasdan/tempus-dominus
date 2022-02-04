import { Unit } from './datetime';
import { BaseEvent } from './event-types';
import { ActionTypes } from './actionTypes';

export class EventEmitter<T> {
  private subscribers: ((value?: T) => void)[] = [];

  subscribe(callback: (value: T) => void) {
    this.subscribers.push(callback);
    return this.unsubscribe.bind(
      this,
      this.subscribers.length - 1
    )
  }

  unsubscribe(index: number) {
    this.subscribers.splice(index, 1);
  }

  emit(value?: T) {
    this.subscribers.forEach((callback) => {
      callback(value);
    });
  }
}

export class EventEmitters {
  static triggerEvent = new EventEmitter<BaseEvent>();
  static viewUpdate = new EventEmitter<Unit>();
  static updateDisplay = new EventEmitter<string>();
  static action = new EventEmitter<{e:any, action?: ActionTypes}>();
}