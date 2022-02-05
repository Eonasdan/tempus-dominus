import { Paint } from '../index';
/**
 * Creates and updates the grid for `seconds`
 */
export default class DecadeDisplay {
    private _startDecade;
    private _endDecade;
    private optionsStore;
    private dates;
    private validation;
    constructor();
    /**
     * Build the container html for the display
     * @private
     */
    getPicker(): HTMLDivElement;
    /**
     * Populates the grid and updates enabled states
     * @private
     */
    _update(widget: HTMLElement, paint: Paint): void;
}
