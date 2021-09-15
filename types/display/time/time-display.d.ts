import { TempusDominus } from '../../tempus-dominus';
/**
 * Creates the clock display
 */
export default class TimeDisplay {
    private _context;
    private _gridColumns;
    constructor(context: TempusDominus);
    /**
     * Build the container html for the clock display
     * @private
     */
    get _picker(): HTMLElement;
    /**
     * Populates the various elements with in the clock display
     * like the current hour and if the manipulation icons are enabled.
     * @private
     */
    _update(): void;
    /**
     * Creates the table for the clock display depending on what options are selected.
     * @private
     */
    private _grid;
}
