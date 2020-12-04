import Dates from "../dates.js";

export default class TimeDisplay {
    constructor(context) {
        this.context = context;
    }

    get picker() {
        const container = document.createElement('div');
        container.classList.add('timepicker-picker');

        const table = document.createElement('table');
        const tableBody = document.createElement('tbody');
        this._grid().forEach(row => tableBody.appendChild(row));
        table.appendChild(tableBody);
        container.appendChild(table);

        return container;
    }

    _grid() {
        const rows = [], separator = document.createElement('td'),
            topRow = document.createElement('tr'), middleRow = document.createElement('tr'),
            bottomRow = document.createElement('tr'),
            upIcon = this.context.display.iconTag(this.context._options.icons.up),
            downIcon = this.context.display.iconTag(this.context._options.icons.down),
            actionLink = document.createElement('a');

        separator.classList.add('separator');
        actionLink.classList.add('btn');
        actionLink.setAttribute('href', 'javascript:void(0);');
        actionLink.setAttribute('tabindex', '-1');

        if (this.context.validation.isEnabled('h')) {
            let td = document.createElement('td');
            let actionLinkClone = actionLink.cloneNode(true);
            actionLinkClone.setAttribute('title', this.context._options.tooltips.incrementHour);
            actionLinkClone.setAttribute('data-action', 'incrementHours')
            actionLinkClone.appendChild(upIcon);
            td.appendChild(actionLinkClone);
            topRow.appendChild(td);

            td = document.createElement('td');
            const span = document.createElement('span');
            span.classList.add('timepicker-hour');
            span.setAttribute('title', this.context._options.tooltips.pickHour);
            span.setAttribute('data-action', 'showHours')
            span.setAttribute('data-time-component', 'hours')
            td.appendChild(span);
            middleRow.appendChild(td);

            td = document.createElement('td');
            actionLinkClone = actionLink.cloneNode(true);
            actionLinkClone.setAttribute('title', this.context._options.tooltips.decrementHour);
            actionLinkClone.setAttribute('data-action', 'decrementHours')
            actionLinkClone.appendChild(downIcon);
            td.appendChild(actionLinkClone);
            bottomRow.appendChild(td);
        }
        if (this.context.validation.isEnabled('m')) {
            if (this.context.validation.isEnabled('h')) {
                topRow.appendChild(separator.cloneNode(true));
                middleRow.append($('<td>').addClass('separator').html(':'));
                bottomRow.append(separator.cloneNode(true));
            }

            let td = document.createElement('td');
            let actionLinkClone = actionLink.cloneNode(true);
            actionLinkClone.setAttribute('title', this.context._options.tooltips.incrementMinute);
            actionLinkClone.setAttribute('data-action', 'incrementMinutes')
            actionLinkClone.appendChild(upIcon);
            td.appendChild(actionLinkClone);
            topRow.appendChild(td);

            td = document.createElement('td');
            const span = document.createElement('span');
            span.classList.add('timepicker-minute');
            span.setAttribute('title', this.context._options.tooltips.pickMinute);
            span.setAttribute('data-action', 'showMinutes')
            span.setAttribute('data-time-component', 'minutes')
            td.appendChild(span);
            middleRow.appendChild(td);

            td = document.createElement('td');
            actionLinkClone = actionLink.cloneNode(true);
            actionLinkClone.setAttribute('title', this.context._options.tooltips.decrementMinute);
            actionLinkClone.setAttribute('data-action', 'decrementMinutes')
            actionLinkClone.appendChild(downIcon);
            td.appendChild(actionLinkClone);
            bottomRow.appendChild(td);
        }
        if (this.context.validation.isEnabled('s')) {
            if (this.context.validation.isEnabled('m')) {
                topRow.append($('<td>').addClass('separator'));
                middleRow.append($('<td>').addClass('separator').html(':'));
                bottomRow.append($('<td>').addClass('separator'));
            }
            topRow.append($('<td>').append($('<a>').attr({
                href: '#',
                tabindex: '-1',
                'title': this.context._options.tooltips.incrementSecond
            }).addClass('btn').attr('data-action', 'incrementSeconds').append(upIcon)));
            middleRow.append($('<td>').append($('<span>').addClass('timepicker-second').attr({
                'data-time-component': 'seconds',
                'title': this.context._options.tooltips.pickSecond
            }).attr('data-action', 'showSeconds')));
            bottomRow.append($('<td>').append($('<a>').attr({
                href: '#',
                tabindex: '-1',
                'title': this.context._options.tooltips.decrementSecond
            }).addClass('btn').attr('data-action', 'decrementSeconds').append(downIcon)));
        }

        if (!this.context.use24Hours) {
            topRow.append($('<td>').addClass('separator'));
            middleRow.append($('<td>').append($('<button>').addClass('btn btn-primary').attr({
                'data-action': 'togglePeriod',
                tabindex: '-1',
                'title': this.context._options.tooltips.togglePeriod
            })));
            bottomRow.append($('<td>').addClass('separator'));
        }

        return rows;
    }
}