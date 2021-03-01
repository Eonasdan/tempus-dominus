import {TempusDominus} from '../../tempus-dominus';
import {Unit} from '../../datetime';
import {Namespace} from '../../conts';
import {ActionTypes} from '../../actions';

export default class TimeDisplay {
    private context: TempusDominus;
    constructor(context: TempusDominus) {
        this.context = context;
    }

    get picker(): HTMLElement {
        const container = document.createElement('div');
        container.classList.add(Namespace.Css.clockContainer);

        const table = document.createElement('table');
        const tableBody = document.createElement('tbody');
        this._grid().forEach(row => tableBody.appendChild(row));
        table.appendChild(tableBody);
        container.appendChild(table);

        return container;
    }

    update(): void {
        const timesDiv = this.context.display.widget.getElementsByClassName(Namespace.Css.timeContainer)[0];
        const lastPicked = (this.context.dates.lastPicked || this.context._viewDate).clone;

        if (!this.context._options.display.components.useTwentyfourHour) {
            const toggle = timesDiv.querySelector<HTMLElement>(`[data-action=${ActionTypes.togglePeriod}]`);

            toggle.innerText = lastPicked.meridiem();

            if (!this.context.validation.isValid(lastPicked.clone.manipulate(lastPicked.hours >= 12 ? -12 : 12, Unit.hours))) {
                toggle.classList.add(Namespace.Css.disabled);
            }
            else {
                toggle.classList.remove(Namespace.Css.disabled);
            }
        }

        timesDiv.querySelectorAll('.disabled').forEach(element => element.classList.remove(Namespace.Css.disabled));
        if (this.context._options.display.components.hours) {

            if (!this.context.validation.isValid(this.context._viewDate.clone.manipulate(1, Unit.hours), Unit.hours)) {
                timesDiv.querySelector(`[data-action=${ActionTypes.incrementHours}]`).classList.add(Namespace.Css.disabled);
            }
            if (!this.context.validation.isValid(this.context._viewDate.clone.manipulate(-1, Unit.hours), Unit.hours)) {
                timesDiv.querySelector(`[data-action=${ActionTypes.decrementHours}]`).classList.add(Namespace.Css.disabled);
            }
            timesDiv.querySelector<HTMLElement>(`[data-time-component=${Unit.hours}]`).innerText =
                this.context._options.display.components.useTwentyfourHour ? lastPicked.hoursFormatted : lastPicked.twelveHoursFormatted;
        }
        if (this.context._options.display.components.minutes) {
            if (!this.context.validation.isValid(this.context._viewDate.clone.manipulate(1, Unit.minutes), Unit.minutes)) {
                timesDiv.querySelector(`[data-action=${ActionTypes.incrementMinutes}]`).classList.add(Namespace.Css.disabled);
            }
            if (!this.context.validation.isValid(this.context._viewDate.clone.manipulate(-1, Unit.minutes), Unit.minutes)) {
                timesDiv.querySelector(`[data-action=${ActionTypes.decrementMinutes}]`).classList.add(Namespace.Css.disabled);
            }
            timesDiv.querySelector<HTMLElement>(`[data-time-component=${Unit.minutes}]`).innerText = lastPicked.minutesFormatted;
        }
        if (this.context._options.display.components.seconds) {
            if (!this.context.validation.isValid(this.context._viewDate.clone.manipulate(1, Unit.seconds), Unit.seconds)) {
                timesDiv.querySelector(`[data-action=${ActionTypes.incrementSeconds}]`).classList.add(Namespace.Css.disabled);
            }
            if (!this.context.validation.isValid(this.context._viewDate.clone.manipulate(-1, Unit.seconds), Unit.seconds)) {
                timesDiv.querySelector(`[data-action=${ActionTypes.decrementSeconds}]`).classList.add(Namespace.Css.disabled);
            }
            timesDiv.querySelector<HTMLElement>(`[data-time-component=${Unit.seconds}]`).innerText = lastPicked.secondsFormatted;
        }
    }

    _grid(): HTMLElement[] {
        const rows = [],
            separator = document.createElement('td'), separatorColon = <HTMLElement>separator.cloneNode(true),
            topRow = document.createElement('tr'), middleRow = document.createElement('tr'),
            bottomRow = document.createElement('tr'),
            upIcon = this.context.display.iconTag(this.context._options.display.icons.up),
            downIcon = this.context.display.iconTag(this.context._options.display.icons.down),
            actionLink = document.createElement('span');

        separator.classList.add(Namespace.Css.separator);
        separatorColon.innerHTML = ':';
        actionLink.classList.add('btn'); //todo bootstrap

        if (this.context._options.display.components.hours) {
            let td = document.createElement('td');
            let actionLinkClone = <HTMLElement>actionLink.cloneNode(true);
            actionLinkClone.setAttribute('title', this.context._options.localization.incrementHour);
            actionLinkClone.setAttribute('data-action', ActionTypes.incrementHours)
            actionLinkClone.appendChild(upIcon.cloneNode(true));
            td.appendChild(actionLinkClone);
            topRow.appendChild(td);

            td = document.createElement('td');
            const span = document.createElement('span');
            span.setAttribute('title', this.context._options.localization.pickHour);
            span.setAttribute('data-action', ActionTypes.showHours)
            span.setAttribute('data-time-component', Unit.hours)
            td.appendChild(span);
            middleRow.appendChild(td);

            td = document.createElement('td');
            actionLinkClone = <HTMLElement>actionLink.cloneNode(true);
            actionLinkClone.setAttribute('title', this.context._options.localization.decrementHour);
            actionLinkClone.setAttribute('data-action', ActionTypes.decrementHours)
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
            let actionLinkClone = <HTMLElement>actionLink.cloneNode(true);
            actionLinkClone.setAttribute('title', this.context._options.localization.incrementMinute);
            actionLinkClone.setAttribute('data-action', ActionTypes.incrementMinutes)
            actionLinkClone.appendChild(upIcon.cloneNode(true));
            td.appendChild(actionLinkClone);
            topRow.appendChild(td);

            td = document.createElement('td');
            const span = document.createElement('span');
            span.setAttribute('title', this.context._options.localization.pickMinute);
            span.setAttribute('data-action', ActionTypes.showMinutes)
            span.setAttribute('data-time-component', Unit.minutes)
            td.appendChild(span);
            middleRow.appendChild(td);

            td = document.createElement('td');
            actionLinkClone = <HTMLElement>actionLink.cloneNode(true);
            actionLinkClone.setAttribute('title', this.context._options.localization.decrementMinute);
            actionLinkClone.setAttribute('data-action', ActionTypes.decrementMinutes)
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
            let actionLinkClone = <HTMLElement>actionLink.cloneNode(true);
            actionLinkClone.setAttribute('title', this.context._options.localization.incrementSecond);
            actionLinkClone.setAttribute('data-action', ActionTypes.incrementSeconds)
            actionLinkClone.appendChild(upIcon.cloneNode(true));
            td.appendChild(actionLinkClone);
            topRow.appendChild(td);

            td = document.createElement('td');
            const span = document.createElement('span');
            span.setAttribute('title', this.context._options.localization.pickSecond);
            span.setAttribute('data-action', ActionTypes.showSeconds)
            span.setAttribute('data-time-component', Unit.seconds)
            td.appendChild(span);
            middleRow.appendChild(td);

            td = document.createElement('td');
            actionLinkClone = <HTMLElement>actionLink.cloneNode(true);
            actionLinkClone.setAttribute('title', this.context._options.localization.decrementSecond);
            actionLinkClone.setAttribute('data-action', ActionTypes.decrementSeconds)
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
            button.setAttribute('data-action', ActionTypes.togglePeriod);
            button.setAttribute('tabindex', '-1');
            td.appendChild(button);
            middleRow.appendChild(td);

            bottomRow.appendChild(separator.cloneNode(true));
        }

        rows.push(topRow, middleRow, bottomRow);

        return rows;
    }
}