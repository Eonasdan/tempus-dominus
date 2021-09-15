/**
 * Provides a collapse functionality to the view changes
 */
export default class Collapse {
    private timeOut;
    /**
     * Flips the show/hide state of `target`
     * @param target html element to affect.
     */
    toggle(target: HTMLElement, callback?: any): void;
    /**
     * If `target` is not already showing, then show after the animation.
     * @param target
     */
    show(target: HTMLElement, callback?: any): void;
    /**
     * If `target` is not already hidden, then hide after the animation.
     * @param target HTML Element
     */
    hide(target: HTMLElement, callback?: any): void;
    /**
     * Gets the transition duration from the `element` by getting css properties
     * `transition-duration` and `transition-delay`
     * @param element HTML Element
     */
    private getTransitionDurationFromElement;
}
