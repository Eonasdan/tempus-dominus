import Namespace from "./namespace";

export default class AriaHelpers {
    static createAriaElements(visibleText: string, readerText: string, container: HTMLElement) {
        let span = document.createElement('span');
        span.ariaHidden = 'true';
        span.innerText = visibleText;

        container.appendChild(span);

        span = document.createElement('span');
        span.classList.add(Namespace.css.hidden);
        span.innerText = readerText;
        container.appendChild(span);
    }
}
