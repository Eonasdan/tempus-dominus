import { Paint } from '../index';
/**
 * Creates and updates the grid for `date`
 */
export default class DateDisplay {
    private optionsStore;
    private dates;
    private validation;
    constructor();
    /**
     * Build the container html for the display
     * @private
     */
    getPicker(): HTMLElement;
    /**
     * Populates the grid and updates enabled states
     * @private
     */
    _update(widget: HTMLElement, paint: Paint): void;
    /***
     * Generates an html row that contains the days of the week.
     * @private
     */
    private _daysOfTheWeek;
}
