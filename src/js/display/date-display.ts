import {TempusDominus} from '../tempus-dominus';
import {DateTime, Unit} from '../datetime';
import {ActionTypes} from '../actions';
import {Namespace} from '../conts';

export default class DateDisplay {
    private context: TempusDominus;

    constructor(context: TempusDominus) {
        this.context = context;
    }

    get picker(): HTMLElement {
        const container = document.createElement('div');
        container.classList.add(Namespace.Css.daysContainer);

        const table = document.createElement('table');
        table.classList.add('table', 'table-sm'); //todo bootstrap
        const headTemplate = this.context.display.headTemplate;
        const [previous, switcher, next] = headTemplate.getElementsByTagName('th');

        previous.getElementsByTagName('span')[0].setAttribute('title', this.context._options.localization.previousMonth);
        switcher.setAttribute('title', this.context._options.localization.selectMonth)
        next.getElementsByTagName('span')[0].setAttribute('title', this.context._options.localization.nextMonth);

        table.appendChild(headTemplate);
        const tableBody = document.createElement('tbody');
        tableBody.appendChild(this._daysOfTheWeek());
        let row = document.createElement('tr');
        for (let i = 0; i <= 42; i++) {
            if (i !== 0 && i % 7 === 0) {
                tableBody.appendChild(row);
                row = document.createElement('tr');

                if (this.context._options.display.calendarWeeks) {
                    const td = document.createElement('td')
                    td.classList.add(Namespace.Css.calendarWeeks); //todo this option needs to be watched and the grid rebuilt if changed
                    row.appendChild(td);
                }
            }
            const td = document.createElement('td');
            const span = document.createElement('span');
            span.setAttribute('data-action', ActionTypes.selectDay);
            td.appendChild(span);
            row.appendChild(td);
        }

        table.appendChild(tableBody);
        container.appendChild(table);

        return container;
    }

    update(): void {
        const container = this.context.display.widget.getElementsByClassName(Namespace.Css.daysContainer)[0];
        const [previous, switcher, next] = container.getElementsByTagName('thead')[0].getElementsByTagName('th');

        switcher.innerText = this.context._viewDate.format({month: this.context._options.localization.dayViewHeaderFormat});

        this.context.validation.isValid(this.context._viewDate.clone.manipulate(-1, Unit.month), Unit.month) ?
            previous.classList.remove(Namespace.Css.disabled) : previous.classList.add(Namespace.Css.disabled);

        this.context.validation.isValid(this.context._viewDate.clone.manipulate(1, Unit.month), Unit.month) ?
            next.classList.remove(Namespace.Css.disabled) : next.classList.add(Namespace.Css.disabled);

        //const dayBody = container.getElementsByTagName('tbody')[0];
        //dayBody.querySelectorAll('*').forEach(n => n.remove());
        //dayBody.appendChild(this._daysOfTheWeek());
        //this._grid().forEach(row => dayBody.appendChild(row));
        this.newGrid(container.querySelectorAll('tbody td span'));
    }

    private newGrid(nodeList: NodeList) {
        let innerDate = this.context._viewDate.clone.startOf(Unit.month).startOf('weekDay').manipulate(12, Unit.hours);

        nodeList.forEach((containerClone: HTMLElement, index) => {
            if (innerDate.weekDay === 0 && this.context._options.display.calendarWeeks) {
                containerClone.innerText = `${innerDate.week}`;
                return;
            }


            let classes = [];
            classes.push(Namespace.Css.day);

            if (innerDate.isBefore(this.context._viewDate, Unit.month)) {
                classes.push(Namespace.Css.old);
            }
            if (innerDate.isAfter(this.context._viewDate, Unit.month)) {
                classes.push(Namespace.Css.new);
            }

            if (!this.context.unset && this.context.dates.isPicked(innerDate, Unit.date)) {
                classes.push(Namespace.Css.active);
            }
            if (!this.context.validation.isValid(innerDate, Unit.date)) {
                classes.push(Namespace.Css.disabled);
            }
            if (innerDate.isSame(new DateTime(), Unit.date)) {
                classes.push(Namespace.Css.today);
            }
            if (innerDate.weekDay === 0 || innerDate.weekDay === 6) {
                classes.push(Namespace.Css.weekend);
            }

            containerClone.classList.remove(...containerClone.classList);
            containerClone.classList.add(...classes);
            containerClone.setAttribute('data-value', `${innerDate.year}-${innerDate.monthFormatted}-${innerDate.dateFormatted}`);
            containerClone.innerText = `${innerDate.date}`;
            innerDate.manipulate(1, Unit.date);
        });
    }

    /***
     * Generates an html row that contains the days of the week.
     */
    _daysOfTheWeek(): HTMLTableRowElement {
        let innerDate = this.context._viewDate.clone.startOf('weekDay').startOf(Unit.date);
        const row = document.createElement('tr');

        if (this.context._options.display.calendarWeeks) {
            const th = document.createElement('th')
            th.classList.add(Namespace.Css.calendarWeeks);
            th.innerText = '#';
            row.appendChild(th);
        }

        let i = 0;
        while (i < 7) {
            const th = document.createElement('th')
            th.classList.add(Namespace.Css.dayOfTheWeek);
            th.innerText = innerDate.format({weekday: 'short'});
            innerDate.manipulate(1, Unit.date);
            row.appendChild(th);
            i++;
        }

        return row;
    }

    _grid(): HTMLElement[] {
        const rows = [];
        let innerDate = this.context._viewDate.clone.startOf(Unit.month).startOf('weekDay').manipulate(12, Unit.hours),
            row: HTMLElement;

        for (let i = 0; i < 42; i++) {
            if (innerDate.weekDay === 0) {
                if (row)
                    rows.push(row);

                row = document.createElement('tr');
                if (this.context._options.display.calendarWeeks) {
                    const td = document.createElement('td')
                    td.classList.add(Namespace.Css.calendarWeeks);
                    td.innerText = `${innerDate.week}`;
                }
            }

            let classes = [];
            classes.push(Namespace.Css.day);
            if (innerDate.isBefore(this.context._viewDate, Unit.month)) {
                classes.push(Namespace.Css.old);
            }
            if (innerDate.isAfter(this.context._viewDate, Unit.month)) {
                classes.push(Namespace.Css.new);
            }

            if (!this.context.unset && this.context.dates.isPicked(innerDate, Unit.date)) {
                classes.push(Namespace.Css.active);
            }
            if (!this.context.validation.isValid(innerDate, Unit.date)) {
                classes.push(Namespace.Css.disabled);
            }
            if (innerDate.isSame(new DateTime(), Unit.date)) {
                classes.push(Namespace.Css.today);
            }
            if (innerDate.weekDay === 0 || innerDate.weekDay === 6) {
                classes.push(Namespace.Css.weekend);
            }

            const td = document.createElement('td');
            td.setAttribute('data-action', ActionTypes.selectDay);
            td.setAttribute('data-day', `${innerDate.year}-${innerDate.monthFormatted}-${innerDate.dateFormatted}`);
            td.classList.add(...classes);
            td.innerText = `${innerDate.date}`;
            row.appendChild(td);

            innerDate.manipulate(1, Unit.date);
        }

        return rows;
    }
}