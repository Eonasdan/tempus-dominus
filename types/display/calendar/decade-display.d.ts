import { TempusDominus } from '../../tempus-dominus';
/**
 * Creates and updates the grid for `seconds`
 */
export default class DecadeDisplay {
    private _context;
    private _startDecade;
    private _endDecade;
    constructor(context: TempusDominus);
    /**
     * Build the container html for the display
     * @private
     */
    get _picker(): HTMLDivElement;
    /**
     * Populates the grid and updates enabled states
     * @private
     */
    _update(): void;
}
