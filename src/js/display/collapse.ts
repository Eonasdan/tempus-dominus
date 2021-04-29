import Namespace from '../namespace';

/**
 * Provides a collapse functionality to the view changes
 */
export default class Collapse {
  private timeOut;

  /**
   * Flips the show/hide state of `target`
   * @param target html element to affect.
   */
  toggle(target: HTMLElement) {
    if (target.classList.contains(Namespace.Css.show)) {
      this.hide(target);
    } else {
      this.show(target);
    }
  }

  /**
   * If `target` is not already showing, then show after the animation.
   * @param target
   */
  show(target: HTMLElement) {
    if (
      target.classList.contains(Namespace.Css.collapsing) ||
      target.classList.contains(Namespace.Css.show)
    )
      return;

    const complete = () => {
      target.classList.remove(Namespace.Css.collapsing);
      target.classList.add(Namespace.Css.collapse, Namespace.Css.show);
      target.style.height = '';
      this.timeOut = null;
    };

    target.style.height = '0';
    target.classList.remove(Namespace.Css.collapse);
    target.classList.add(Namespace.Css.collapsing);

    this.timeOut = setTimeout(
      complete,
      this.getTransitionDurationFromElement(target)
    );
    target.style.height = `${target.scrollHeight}px`;
  }

  /**
   * If `target` is not already hidden, then hide after the animation.
   * @param target HTML Element
   */
  hide(target: HTMLElement) {
    if (
      target.classList.contains(Namespace.Css.collapsing) ||
      !target.classList.contains(Namespace.Css.show)
    )
      return;

    const complete = () => {
      target.classList.remove(Namespace.Css.collapsing);
      target.classList.add(Namespace.Css.collapse);
      this.timeOut = null;
    };

    target.style.height = `${target.getBoundingClientRect()['height']}px`;

    const reflow = (element) => element.offsetHeight;

    reflow(target);

    target.classList.remove(Namespace.Css.collapse, Namespace.Css.show);
    target.classList.add(Namespace.Css.collapsing);
    target.style.height = '';

    this.timeOut = setTimeout(
      complete,
      this.getTransitionDurationFromElement(target)
    );
  }

  /**
   * Gets the transition duration from the `element` by getting css properties
   * `transition-duration` and `transition-delay`
   * @param element HTML Element
   */
  private getTransitionDurationFromElement = (element: HTMLElement) => {
    if (!element) {
      return 0;
    }

    // Get transition-duration of the element
    let { transitionDuration, transitionDelay } = window.getComputedStyle(
      element
    );

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
