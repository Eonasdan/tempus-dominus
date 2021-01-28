import {TempusDominus} from './tempus-dominus';
import { DateTime, Unit } from './datetime';

export default class Validation {
    private context: TempusDominus;

    constructor(context: TempusDominus) {
        this.context = context;
    }

    /**
     *
     * @param targetDate
     * @param granularity
     */
    isValid(targetDate: Date|DateTime, granularity?: Unit): boolean {
        return true;
    }
}