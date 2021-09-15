import { TempusDominus } from '../../tempus-dominus';
/**
 * Creates and updates the grid for `date`
 */
export default class DateDisplay {
    private _context;
    constructor(context: TempusDominus);
    /**
     * Build the container html for the display
     * @private
     */
    get _picker(): HTMLElement;
    /**
     * Populates the grid and updates enabled states
     * @private
     */
    _update(): void;
    /***
     * Generates an html row that contains the days of the week.
     * @private
     */
    private _daysOfTheWeek;
}
