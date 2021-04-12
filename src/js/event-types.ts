import {DateTime, Unit} from './datetime';

interface BaseEvent {
    name: string;
}

interface FailEvent extends BaseEvent {
    reason: string;
    date: DateTime;
    oldDate: DateTime;
}

interface HideEvent extends BaseEvent  {
    date: DateTime;
}

interface ChangeEvent extends BaseEvent  {
    date: DateTime | undefined;
    oldDate: DateTime;
    isClear: boolean;
    isValid: boolean;
}

interface ViewUpdateEvent extends BaseEvent  {
    change: Unit;
    viewDate: DateTime;
}

export { BaseEvent, FailEvent, HideEvent, ChangeEvent, ViewUpdateEvent}