import Namespace from '../utilities/namespace';

/**
 * Provides a collapse functionality to the view changes
 */
export default class Collapse {
  /**
   * Flips the show/hide state of `target`
   * @param target html element to affect.
   */
  static toggle(target: HTMLElement) {
    if (target.classList.contains(Namespace.css.show)) {
      this.hide(target);
    } else {
      this.show(target);
    }
  }

  /**
   * Skips any animation or timeouts and immediately set the element to show.
   * @param target
   */
  static showImmediately(target: HTMLElement) {
    target.classList.remove(Namespace.css.collapsing);
    target.classList.add(Namespace.css.collapse, Namespace.css.show);
    target.style.height = '';
  }

  /**
   * If `target` is not already showing, then show after the animation.
   * @param target
   */
  static show(target: HTMLElement) {
    if (
      target.classList.contains(Namespace.css.collapsing) ||
      target.classList.contains(Namespace.css.show)
    )
      return;

    let timeOut = null;
    const complete = () => {
      Collapse.showImmediately(target);
      timeOut = null;
    };

    target.style.height = '0';
    target.classList.remove(Namespace.css.collapse);
    target.classList.add(Namespace.css.collapsing);

    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    timeOut = setTimeout(
      complete,
      this.getTransitionDurationFromElement(target)
    );
    target.style.height = `${target.scrollHeight}px`;
  }

  /**
   * Skips any animation or timeouts and immediately set the element to hide.
   * @param target
   */
  static hideImmediately(target: HTMLElement) {
    if (!target) return;
    target.classList.remove(Namespace.css.collapsing, Namespace.css.show);
    target.classList.add(Namespace.css.collapse);
  }

  /**
   * If `target` is not already hidden, then hide after the animation.
   * @param target HTML Element
   */
  static hide(target: HTMLElement) {
    if (
      target.classList.contains(Namespace.css.collapsing) ||
      !target.classList.contains(Namespace.css.show)
    )
      return;

    let timeOut = null;
    const complete = () => {
      Collapse.hideImmediately(target);
      timeOut = null;
    };

    target.style.height = `${target.getBoundingClientRect()['height']}px`;

    const reflow = (element) => element.offsetHeight;

    reflow(target);

    target.classList.remove(Namespace.css.collapse, Namespace.css.show);
    target.classList.add(Namespace.css.collapsing);
    target.style.height = '';

    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    timeOut = setTimeout(
      complete,
      this.getTransitionDurationFromElement(target)
    );
  }

  /**
   * Gets the transition duration from the `element` by getting css properties
   * `transition-duration` and `transition-delay`
   * @param element HTML Element
   */
  private static getTransitionDurationFromElement = (element: HTMLElement) => {
    if (!element) {
      return 0;
    }

    // Get transition-duration of the element
    let { transitionDuration, transitionDelay } =
      window.getComputedStyle(element);

    const floatTransitionDuration = Number.parseFloat(transitionDuration);
    const floatTransitionDelay = Number.parseFloat(transitionDelay);

    // Return 0 if element or transition duration is not found
    if (!floatTransitionDuration && !floatTransitionDelay) {
      return 0;
    }

    // If multiple durations are defined, take the first
    transitionDuration = transitionDuration.split(',')[0];
    transitionDelay = transitionDelay.split(',')[0];

    return (
      (Number.parseFloat(transitionDuration) +
        Number.parseFloat(transitionDelay)) *
      1000
    );
  };
}
