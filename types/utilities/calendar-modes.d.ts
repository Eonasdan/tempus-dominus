import { Unit } from '../datetime';
import ViewMode from './view-mode';
declare const CalendarModes: {
    name: keyof ViewMode;
    className: string;
    unit: Unit;
    step: number;
}[];
export default CalendarModes;
