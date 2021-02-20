import { Namespace } from "../conts";

export default class Collapse {
    toggle(target: HTMLElement) {
        if (target.classList.contains(Namespace.Css.show)) {
            this.hide(target);
        } else {
            this.show(target);
        }
    }

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
        };

        target.style.height = '0';
        target.classList.remove(Namespace.Css.collapse);
        target.classList.add(Namespace.Css.collapsing);

        setTimeout(complete, this.getTransitionDurationFromElement(target));
        target.style.height = `${target.scrollHeight}px`;
    }

    hide(target: HTMLElement) {
        if (
            target.classList.contains(Namespace.Css.collapsing) ||
            !target.classList.contains(Namespace.Css.show)
        )
            return;

        const complete = () => {
            target.classList.remove(Namespace.Css.collapsing);
            target.classList.add(Namespace.Css.collapse);
        };

        target.style.height = `${target.getBoundingClientRect()['height']}px`;

        const reflow = element => element.offsetHeight;

        reflow(target);

        target.classList.remove(Namespace.Css.collapse, Namespace.Css.show);
        target.classList.add(Namespace.Css.collapsing);
        target.style.height = '';

        setTimeout(complete, this.getTransitionDurationFromElement(target));
    }

    private getTransitionDurationFromElement = element => {
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