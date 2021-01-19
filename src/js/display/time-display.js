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
        const tableBody = document.createElement('tbody');
        this._grid().forEach(row => tableBody.appendChild(row));
        table.appendChild(tableBody);
        container.appendChild(table);

        return container;
    }

    update() {
        const timesDiv = this.context.display.widget.getElementsByClassName('timepicker-picker')[0];
        const lastPicked = (this.context.dates.lastPicked || this.context._viewDate).clone;

        if (!this.context.use24Hours) {
            const toggle = timesDiv.querySelector('[data-action=togglePeriod]');

            toggle.innerText = lastPicked.meridiem();

            if (!this.context.validation.isValid(lastPicked.clone.manipulate(lastPicked.hours >= 12 ? -12 : 12, 'hours'))) {
                toggle.classList.add('disabled');
            }
            else {
                toggle.classList.remove('disabled');
            }
        }

        timesDiv.querySelectorAll('.disabled').forEach(element => element.classList.remove('disabled'));
        if (!this.context.validation.isValid(this.context._viewDate.clone.manipulate(1, 'hours'), 'hours')) {
            timesDiv.querySelector('[data-action=incrementHours]').classList.add('disabled');
        }
        if (!this.context.validation.isValid(this.context._viewDate.clone.manipulate(-1, 'hours'), 'hours')) {
            timesDiv.querySelector('[data-action=decrementHours]').classList.add('disabled');
        }
        if (!this.context.validation.isValid(this.context._viewDate.clone.manipulate(1, 'minutes'), 'minutes')) {
            timesDiv.querySelector('[data-action=incrementMinutes]').classList.add('disabled');
        }
        if (!this.context.validation.isValid(this.context._viewDate.clone.manipulate(-1, 'minutes'), 'minutes')) {
            timesDiv.querySelector('[data-action=decrementMinutes]').classList.add('disabled');
        }
        if (!this.context.validation.isValid(this.context._viewDate.clone.manipulate(1, 'seconds'), 'seconds')) {
            timesDiv.querySelector('[data-action=incrementSeconds]').classList.add('disabled');
        }
        if (!this.context.validation.isValid(this.context._viewDate.clone.manipulate(-1, 'seconds'), 'seconds')) {
            timesDiv.querySelector('[data-action=decrementSeconds]').classList.add('disabled');
        }

        if (this.context._options.display.components.hours)
            timesDiv.querySelector('[data-time-component=hours]').innerText = lastPicked.hoursFormatted;
        if (this.context._options.display.components.minutes)
            timesDiv.querySelector('[data-time-component=minutes]').innerText = lastPicked.minutesFormatted;
        if (this.context._options.display.components.seconds)
            timesDiv.querySelector('[data-time-component=seconds]').innerText = lastPicked.secondsFormatted;

    }

    _grid() {
        const rows = [],
            separator = document.createElement('td'), separatorColon = separator.cloneNode(true),
            topRow = document.createElement('tr'), middleRow = document.createElement('tr'),
            bottomRow = document.createElement('tr'),
            upIcon = this.context.display.iconTag(this.context._options.display.icons.up),
            downIcon = this.context.display.iconTag(this.context._options.display.icons.down),
            actionLink = document.createElement('a');

        separator.classList.add('separator');
        separatorColon.innerHTML = ':';
        actionLink.classList.add('btn');
        actionLink.setAttribute('href', 'javascript:void(0);');
        actionLink.setAttribute('tabindex', '-1');

        if (this.context._options.display.components.hours) {
            let td = document.createElement('td');
            let actionLinkClone = actionLink.cloneNode(true);
            actionLinkClone.setAttribute('title', this.context._options.localization.incrementHour);
            actionLinkClone.setAttribute('data-action', 'incrementHours')
            actionLinkClone.appendChild(upIcon.cloneNode(true));
            td.appendChild(actionLinkClone);
            topRow.appendChild(td);

            td = document.createElement('td');
            const span = document.createElement('span');
            span.classList.add('timepicker-hour');
            span.setAttribute('title', this.context._options.localization.pickHour);
            span.setAttribute('data-action', 'showHours')
            span.setAttribute('data-time-component', 'hours')
            td.appendChild(span);
            middleRow.appendChild(td);

            td = document.createElement('td');
            actionLinkClone = actionLink.cloneNode(true);
            actionLinkClone.setAttribute('title', this.context._options.localization.decrementHour);
            actionLinkClone.setAttribute('data-action', 'decrementHours')
            actionLinkClone.appendChild(downIcon.cloneNode(true));
            td.appendChild(actionLinkClone);
            bottomRow.appendChild(td);
        }
        if (this.context._options.display.components.minutes) {
            if (this.context._options.display.components.hours) {
                topRow.appendChild(separator.cloneNode(true));
                middleRow.appendChild(separatorColon.cloneNode(true));
                bottomRow.appendChild(separator.cloneNode(true));
            }

            let td = document.createElement('td');
            let actionLinkClone = actionLink.cloneNode(true);
            actionLinkClone.setAttribute('title', this.context._options.localization.incrementMinute);
            actionLinkClone.setAttribute('data-action', 'incrementMinutes')
            actionLinkClone.appendChild(upIcon.cloneNode(true));
            td.appendChild(actionLinkClone);
            topRow.appendChild(td);

            td = document.createElement('td');
            const span = document.createElement('span');
            span.classList.add('timepicker-minute');
            span.setAttribute('title', this.context._options.localization.pickMinute);
            span.setAttribute('data-action', 'showMinutes')
            span.setAttribute('data-time-component', 'minutes')
            td.appendChild(span);
            middleRow.appendChild(td);

            td = document.createElement('td');
            actionLinkClone = actionLink.cloneNode(true);
            actionLinkClone.setAttribute('title', this.context._options.localization.decrementMinute);
            actionLinkClone.setAttribute('data-action', 'decrementMinutes')
            actionLinkClone.appendChild(downIcon.cloneNode(true));
            td.appendChild(actionLinkClone);
            bottomRow.appendChild(td);
        }
        if (this.context._options.display.components.seconds) {
            if (this.context._options.display.components.minutes) {
                topRow.appendChild(separator.cloneNode(true));
                middleRow.appendChild(separatorColon.cloneNode(true));
                bottomRow.appendChild(separator.cloneNode(true));
            }

            let td = document.createElement('td');
            let actionLinkClone = actionLink.cloneNode(true);
            actionLinkClone.setAttribute('title', this.context._options.localization.incrementSecond);
            actionLinkClone.setAttribute('data-action', 'incrementSeconds')
            actionLinkClone.appendChild(upIcon.cloneNode(true));
            td.appendChild(actionLinkClone);
            topRow.appendChild(td);

            td = document.createElement('td');
            const span = document.createElement('span');
            span.classList.add('timepicker-second');
            span.setAttribute('title', this.context._options.localization.pickSecond);
            span.setAttribute('data-action', 'showSeconds')
            span.setAttribute('data-time-component', 'seconds')
            td.appendChild(span);
            middleRow.appendChild(td);

            td = document.createElement('td');
            actionLinkClone = actionLink.cloneNode(true);
            actionLinkClone.setAttribute('title', this.context._options.localization.decrementSecond);
            actionLinkClone.setAttribute('data-action', 'decrementSeconds')
            actionLinkClone.appendChild(downIcon.cloneNode(true));
            td.appendChild(actionLinkClone);
            bottomRow.appendChild(td);
        }

        if (!this.context._options.display.components.useTwentyfourHour) {
            topRow.appendChild(separator.cloneNode(true));

            let td = document.createElement('td');
            let button = document.createElement('button');
            button.classList.add('btn', 'btn-primary'); //todo bootstrap
            button.setAttribute('title', this.context._options.localization.togglePeriod);
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