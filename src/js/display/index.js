import DateDisplay from './date-display.js';

export default class Display {
    constructor(context) {
        this.context = context;
        this._dateDisplay = new DateDisplay(context);
    }

    get datePicker() {
        return this._dateDisplay.datePicker;
    }

    /***
     *
     * @returns {Node}
     */
    get headTemplate() {
        const headTemplate = document.createElement('thead');
        const previous = document.createElement('th');
        previous.classList.add('prev');
        previous.setAttribute('data-action', 'previous');
        previous.appendChild(this.iconTag(this.context._options.icons.previous));
        headTemplate.appendChild(previous);

        const switcher = document.createElement('th');
        switcher.classList.add('picker-switch');
        switcher.setAttribute('data-action', 'pickerSwitch');
        switcher.setAttribute('colspan', this.context._options.calendarWeeks ? '6' : '5');
        headTemplate.appendChild(switcher);

        const next = document.createElement('th');
        next.classList.add('next');
        next.setAttribute('data-action', 'next');
        next.appendChild(this.iconTag(this.context._options.icons.next));
        headTemplate.appendChild(next);
        return headTemplate.cloneNode(true);
    }

    get contentTemplate() {
        const contentTemplate = document.createElement('tbody');
        const rowElement = document.createElement('tr');
        const td = document.createElement('td');
        td.setAttribute('colspan', this.context._options.calendarWeeks ? '6' : '5');
        rowElement.appendChild(td);
        contentTemplate.appendChild(rowElement);
        return contentTemplate.cloneNode(true);
    }

    iconTag(i) {
        const container = document.createElement('span')
        if (this.context._options.icons.type === 'sprites') {
            const svg = document.createElement('svg');
            svg.innerHTML = `<use xlink:href="${i}"></use>`
            container.appendChild(svg);
            return container;
        }
        const icon = document.createElement('i');
        DOMTokenList.prototype.add.apply(icon.classList, i.split(' '));
        container.appendChild(icon);
        return container;
    }
}