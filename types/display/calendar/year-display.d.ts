import { TempusDominus } from '../../tempus-dominus';
/**
 * Creates and updates the grid for `year`
 */
export default class YearDisplay {
    private _context;
    private _startYear;
    private _endYear;
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
}
