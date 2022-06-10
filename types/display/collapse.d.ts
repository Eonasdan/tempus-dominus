/**
 * Provides a collapse functionality to the view changes
 */
export default class Collapse {
    /**
     * Flips the show/hide state of `target`
     * @param target html element to affect.
     */
    static toggle(target: HTMLElement): void;
    /**
     * Skips any animation or timeouts and immediately set the element to show.
     * @param target
     */
    static showImmediately(target: HTMLElement): void;
    /**
     * If `target` is not already showing, then show after the animation.
     * @param target
     */
    static show(target: HTMLElement): void;
    /**
     * Skips any animation or timeouts and immediately set the element to hide.
     * @param target
     */
    static hideImmediately(target: HTMLElement): void;
    /**
     * If `target` is not already hidden, then hide after the animation.
     * @param target HTML Element
     */
    static hide(target: HTMLElement): void;
    /**
     * Gets the transition duration from the `element` by getting css properties
     * `transition-duration` and `transition-delay`
     * @param element HTML Element
     */
    private static getTransitionDurationFromElement;
}
