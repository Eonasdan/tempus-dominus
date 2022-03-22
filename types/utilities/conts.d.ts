import { Unit } from '../datetime';
import Options from './options';
declare const DefaultOptions: Options;
declare const DatePickerModes: {
    name: string;
    className: string;
    unit: Unit;
    step: number;
}[];
export { DefaultOptions, DatePickerModes };
