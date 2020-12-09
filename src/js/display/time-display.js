export default class TimeDisplay {
    constructor(context) {
        this.context = context;
    }

    get picker() {
        //todo could move some of this stuff to the ctor
        //then picker function clears and appends table body
        const container = document.createElement('div');
        container.classList.add('timepicker-picker');

        const table = document.createElement('table');
        table.appendChild(document.createElement('tbody'));
        container.appendChild(table);

        return container;
    }

    update() {
        const timesDiv = this.context.display.widget.getElementsByClassName('timepicker-days')[0];
        const tableBody = timesDiv.getElementsByTagName('tbody')[0];
        this._grid().forEach(row => tableBody.appendChild(row));

        if (!this.context.use24Hours) {

        }



    }

    _grid() {
        const rows = [],
            separator = document.createElement('td'), separatorColon = separator.cloneNode(true),
            topRow = document.createElement('tr'), middleRow = document.createElement('tr'),
            bottomRow = document.createElement('tr'),
            upIcon = this.context.display.iconTag(this.context._options.icons.up),
            downIcon = this.context.display.iconTag(this.context._options.icons.down),
            actionLink = document.createElement('a');

        separator.classList.add('separator');
        separatorColon.innerHTML = ':';
        actionLink.classList.add('btn');
        actionLink.setAttribute('href', 'javascript:void(0);');
        actionLink.setAttribute('tabindex', '-1');

        if (this.context.validation.isEnabled('h')) {
            let td = document.createElement('td');
            let actionLinkClone = actionLink.cloneNode(true);
            actionLinkClone.setAttribute('title', this.context._options.tooltips.incrementHour);
            actionLinkClone.setAttribute('data-action', 'incrementHours')
            actionLinkClone.appendChild(upIcon.cloneNode(true));
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
            actionLinkClone.appendChild(downIcon.cloneNode(true));
            td.appendChild(actionLinkClone);
            bottomRow.appendChild(td);
        }
        if (this.context.validation.isEnabled('m')) {
            if (this.context.validation.isEnabled('h')) {
                topRow.appendChild(separator.cloneNode(true));
                middleRow.appendChild(separatorColon.cloneNode(true));
                bottomRow.appendChild(separator.cloneNode(true));
            }

            let td = document.createElement('td');
            let actionLinkClone = actionLink.cloneNode(true);
            actionLinkClone.setAttribute('title', this.context._options.tooltips.incrementMinute);
            actionLinkClone.setAttribute('data-action', 'incrementMinutes')
            actionLinkClone.appendChild(upIcon.cloneNode(true));
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
            actionLinkClone.appendChild(downIcon.cloneNode(true));
            td.appendChild(actionLinkClone);
            bottomRow.appendChild(td);
        }
        if (this.context.validation.isEnabled('s')) {
            if (this.context.validation.isEnabled('m')) {
                topRow.appendChild(separator.cloneNode(true));
                middleRow.appendChild(separatorColon.cloneNode(true));
                bottomRow.appendChild(separator.cloneNode(true));
            }

            let td = document.createElement('td');
            let actionLinkClone = actionLink.cloneNode(true);
            actionLinkClone.setAttribute('title', this.context._options.tooltips.incrementSecond);
            actionLinkClone.setAttribute('data-action', 'incrementSeconds')
            actionLinkClone.appendChild(upIcon.cloneNode(true));
            td.appendChild(actionLinkClone);
            topRow.appendChild(td);

            td = document.createElement('td');
            const span = document.createElement('span');
            span.classList.add('timepicker-second');
            span.setAttribute('title', this.context._options.tooltips.pickSecond);
            span.setAttribute('data-action', 'showSeconds')
            span.setAttribute('data-time-component', 'seconds')
            td.appendChild(span);
            middleRow.appendChild(td);

            td = document.createElement('td');
            actionLinkClone = actionLink.cloneNode(true);
            actionLinkClone.setAttribute('title', this.context._options.tooltips.decrementSecond);
            actionLinkClone.setAttribute('data-action', 'decrementSecond')
            actionLinkClone.appendChild(downIcon.cloneNode(true));
            td.appendChild(actionLinkClone);
            bottomRow.appendChild(td);
        }

        if (!this.context.use24Hours) {
            topRow.appendChild(separator.cloneNode(true));

            let td = document.createElement('td');
            let button = document.createElement('button');
            button.classList.add('btn', 'btn-primary'); //todo bootstrap
            button.setAttribute('title', this.context._options.tooltips.togglePeriod);
            button.setAttribute('data-action', 'togglePeriod');
            button.setAttribute('tabindex', '-1');
            td.appendChild(button);
            middleRow.appendChild(td);

            bottomRow.appendChild(separator.cloneNode(true));
        }

        rows.push(topRow, middleRow, bottomRow);

        return rows;
    }
}