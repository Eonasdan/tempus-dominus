import {TempusDominus} from '../tempus-dominus';
import {DateTime, Unit} from '../datetime';
import {ActionTypes} from '../actions';

export default class DateDisplay {
    private context: TempusDominus;
    constructor(context: TempusDominus) {
        this.context = context;
    }

    get picker(): HTMLElement {
        const daysDiv = document.createElement('div');
        daysDiv.classList.add('datepicker-days');

        const dayTable = document.createElement('table');
        dayTable.classList.add('table', 'table-sm'); //todo bootstrap
        dayTable.appendChild(this.context.display.headTemplate);
        dayTable.appendChild(document.createElement('tbody'));
        daysDiv.appendChild(dayTable);

        return daysDiv;
    }

    update(): void {
        const datesDiv = this.context.display.widget.getElementsByClassName('datepicker-days')[0];
        const [previous, switcher, next] = datesDiv.getElementsByTagName('thead')[0].getElementsByTagName('th');

        previous.getElementsByTagName('span')[0].setAttribute('title', this.context._options.localization.previousMonth);
        switcher.setAttribute('title', this.context._options.localization.selectMonth)
        next.getElementsByTagName('span')[0].setAttribute('title', this.context._options.localization.nextMonth);

        switcher.innerText = this.context._viewDate.format({ month: this.context._options.localization.dayViewHeaderFormat});

        if (!this.context.validation.isValid(this.context._viewDate.clone.manipulate(1, Unit.month), Unit.month)) {
            previous.classList.add('disabled');
        }
        if (!this.context.validation.isValid(this.context._viewDate.clone.manipulate(1, Unit.month), Unit.month)) {
            next.classList.add('disabled');
        }

        const dayBody = datesDiv.getElementsByTagName('tbody')[0];
        dayBody.querySelectorAll('*').forEach(n => n.remove());
        dayBody.appendChild(this._daysOfTheWeek());
        this._grid().forEach(row => dayBody.appendChild(row));
    }

    /***
     * Generates an html row that contains the days of the week.
     */
    _daysOfTheWeek(): HTMLTableRowElement {
        let innerDate = this.context._viewDate.clone.startOf('weekDay').startOf(Unit.date);
        const row = document.createElement('tr');

        if (this.context._options.display.calendarWeeks) {
            const th = document.createElement('th')
            th.classList.add('cw');
            th.innerText = '#';
            row.appendChild(th);
        }

        let i = 0;
        while (i < 7) {
            const th = document.createElement('th')
            th.classList.add('dow');
            th.innerText = innerDate.format({weekday: 'short'});
            innerDate.manipulate(1, Unit.date);
            row.appendChild(th);
            i++;
        }

        return row;
    }

    _grid(): HTMLElement[] {
        const rows = [];
        let innerDate = this.context._viewDate.clone.startOf(Unit.month).startOf('weekDay').manipulate(12, Unit.hours), row: HTMLElement;

        for (let i = 0; i < 42; i++) {
            if (innerDate.weekDay === 0) {
                if (row)
                    rows.push(row);

                row = document.createElement('tr');
                if (this.context._options.display.calendarWeeks) {
                    const td = document.createElement('td')
                    td.classList.add('cw');
                    td.innerText = `${innerDate.week}`;
                }
            }

            let classes = [];
            classes.push('day');
            if (innerDate.isBefore(this.context._viewDate, Unit.month)) {
                classes.push('old');
            }
            if (innerDate.isAfter(this.context._viewDate, Unit.month)) {
                classes.push('new');
            }

            if (!this.context.unset && this.context.dates.isPicked(innerDate, Unit.date)) {
                classes.push('active');
            }
            if (!this.context.validation.isValid(innerDate, Unit.date)) {
                classes.push('disabled');
            }
            if (innerDate.isSame(new DateTime(), Unit.date)) {
                classes.push('today');
            }
            if (innerDate.weekDay === 0 || innerDate.weekDay === 6) {
                classes.push('weekend');
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