import { TempusDominus } from './tempus-dominus';
import { DateTime, Unit } from './datetime';
export default class Dates {
    private _dates;
    private _context;
    constructor(context: TempusDominus);
    /**
     * Returns the array of selected dates
     */
    get picked(): DateTime[];
    /**
     * Returns the last picked value.
     */
    get lastPicked(): DateTime;
    /**
     * Returns the length of picked dates -1 or 0 if none are selected.
     */
    get lastPickedIndex(): number;
    /**
     * Adds a new DateTime to selected dates array
     * @param date
     */
    add(date: DateTime): void;
    /**
     * Tries to convert the provided value to a DateTime object.
     * If value is null|undefined then clear the value of the provided index (or 0).
     * @param value Value to convert or null|undefined
     * @param index When using multidates this is the index in the array
     * @param from Used in the warning message, useful for debugging.
     */
    set(value: any, index?: number, from?: string): void;
    /**
     * Returns true if the `targetDate` is part of the selected dates array.
     * If `unit` is provided then a granularity to that unit will be used.
     * @param targetDate
     * @param unit
     */
    isPicked(targetDate: DateTime, unit?: Unit): boolean;
    /**
     * Returns the index at which `targetDate` is in the array.
     * This is used for updating or removing a date when multi-date is used
     * If `unit` is provided then a granularity to that unit will be used.
     * @param targetDate
     * @param unit
     */
    pickedIndex(targetDate: DateTime, unit?: Unit): number;
    /**
     * Clears all selected dates.
     */
    clear(): void;
    /**
     * Find the "book end" years given a `year` and a `factor`
     * @param factor e.g. 100 for decades
     * @param year e.g. 2021
     */
    static getStartEndYear(factor: number, year: number): [number, number, number];
    /**
     * Do not use direectly. Attempts to either clear or set the `target` date at `index`.
     * If the `target` is null then the date will be cleared.
     * If multi-date is being used then it will be removed from the array.
     * If `target` is valid and multi-date is used then if `index` is
     * provided the date at that index will be replaced, otherwise it is appended.
     * @param target
     * @param index
     */
    _setValue(target?: DateTime, index?: number): void;
    /**
     * Returns a format object based on the granularity of `unit`
     * @param unit
     */
    static getFormatByUnit(unit: Unit): object;
}
