import {DateTime, Unit} from './datetime';

interface BaseEvent {
    event: string;
}

interface ErrorEvent extends BaseEvent {
    reason: string;
    date: DateTime;
    oldDate: DateTime;
}

interface HideEvent extends BaseEvent  {
    date: DateTime;
}

interface ChangeEvent extends BaseEvent  {
    date: DateTime;
    oldDate: DateTime;
    isClear: boolean;
    isValid: boolean;
}

interface ViewUpdateEvent extends BaseEvent  {
    change: Unit;
    viewDate: DateTime;
}

export { BaseEvent, ErrorEvent, HideEvent, ChangeEvent, ViewUpdateEvent}