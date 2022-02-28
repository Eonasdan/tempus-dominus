import { Unit } from '../datetime';
import ActionTypes from './action-types';
import { BaseEvent } from './event-types';
export declare type ViewUpdateValues = Unit | 'clock' | 'calendar' | 'all';
export declare class EventEmitter<T> {
    private subscribers;
    subscribe(callback: (value: T) => void): any;
    unsubscribe(index: number): void;
    emit(value?: T): void;
    destory(): void;
}
export declare class EventEmitters {
    triggerEvent: EventEmitter<BaseEvent>;
    viewUpdate: EventEmitter<unknown>;
    updateDisplay: EventEmitter<ViewUpdateValues>;
    action: EventEmitter<{
        e: any;
        action?: ActionTypes;
    }>;
    destory(): void;
}
