import { Paint } from '../index';
/**
 * Creates and updates the grid for `seconds`
 */
export default class secondDisplay {
    private optionsStore;
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
}
