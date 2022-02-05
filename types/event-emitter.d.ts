import { Unit } from './datetime';
import { BaseEvent } from './event-types';
import { ActionTypes } from './actionTypes';
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
    viewUpdate: EventEmitter<Unit>;
    updateDisplay: EventEmitter<ViewUpdateValues>;
    action: EventEmitter<{
        e: any;
        action?: ActionTypes;
    }>;
    destory(): void;
}
