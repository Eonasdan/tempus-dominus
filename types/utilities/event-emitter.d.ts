import { DateTime, Unit } from '../datetime';
import ActionTypes from './action-types';
import { BaseEvent } from './event-types';
export type ViewUpdateValues = Unit | 'decade' | 'clock' | 'calendar' | 'all';
declare class EventEmitter<T> {
  private subscribers;
  subscribe(callback: (value: T) => void): any;
  unsubscribe(index: number): void;
  emit(value?: T): void;
  destroy(): void;
}
export declare class EventEmitters {
  triggerEvent: EventEmitter<BaseEvent>;
  viewUpdate: EventEmitter<unknown>;
  updateDisplay: EventEmitter<ViewUpdateValues>;
  action: EventEmitter<{
    e: any;
    action?: ActionTypes;
  }>;
  updateViewDate: EventEmitter<DateTime>;
  destroy(): void;
}
export {};
