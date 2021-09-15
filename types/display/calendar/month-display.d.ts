import { TempusDominus } from '../../tempus-dominus';
/**
 * Creates and updates the grid for `month`
 */
export default class MonthDisplay {
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
}
