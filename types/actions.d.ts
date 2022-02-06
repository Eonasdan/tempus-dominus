import { ActionTypes } from './utilities/actionTypes';
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
    private handleNextPrevious;
    /**
     * Common function to manipulate {@link lastPicked} by `unit`.
     * After setting the value it will either show the clock or hide the widget.
     * @param unit
     * @param value Value to change by
     */
    private hideOrClock;
    /**
     * Common function to manipulate {@link lastPicked} by `unit`.
     * @param unit
     * @param value Value to change by
     */
    private manipulateAndSet;
}
