/**
 * Creates the clock display
 */
export default class TimeDisplay {
    private _gridColumns;
    private optionsStore;
    private validation;
    private dates;
    constructor();
    /**
     * Build the container html for the clock display
     * @private
     */
    getPicker(iconTag: (iconClass: string) => HTMLElement): HTMLElement;
    /**
     * Populates the various elements with in the clock display
     * like the current hour and if the manipulation icons are enabled.
     * @private
     */
    _update(widget: HTMLElement): void;
    /**
     * Creates the table for the clock display depending on what options are selected.
     * @private
     */
    private _grid;
}
