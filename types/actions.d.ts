import ActionTypes from './utilities/action-types';
/**
 *
 */
export default class Actions {
    private optionsStore;
    private validation;
    private dates;
    private display;
    private _eventEmitters;
    constructor();
    /**
     * Performs the selected `action`. See ActionTypes
     * @param e This is normally a click event
     * @param action If not provided, then look for a [data-action]
     */
    do(e: any, action?: ActionTypes): boolean;
    private handleShowClockContainers;
    private handleNextPrevious;
    /**
     * After setting the value it will either show the clock or hide the widget.
     * @param e
     */
    private hideOrClock;
    /**
     * Common function to manipulate {@link lastPicked} by `unit`.
     * @param lastPicked
     * @param unit
     * @param value Value to change by
     */
    private manipulateAndSet;
}
