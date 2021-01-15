import DateTime from "../datetime.js";
import {ActionTypes} from "../actions.js";

export default class DateDisplay {
    constructor(context) {
        this.context = context;
    }

    get picker() {
        const daysDiv = document.createElement('div');
        daysDiv.classList.add('datepicker-days');

        const dayTable = document.createElement('table');
        dayTable.classList.add('table', 'table-sm'); //todo bootstrap
        dayTable.appendChild(this.context.display.headTemplate);
        dayTable.appendChild(document.createElement('tbody'));
        daysDiv.appendChild(dayTable);

        return daysDiv;
    }

    update() {
        const datesDiv = this.context.display.widget.getElementsByClassName('datepicker-days')[0];
        const heads = datesDiv.getElementsByTagName('thead')[0].getElementsByTagName('th');
        const previous = heads[0];
        const switcher = heads[1];
        const next = heads[2];

        previous.getElementsByTagName('span')[0].setAttribute('title', this.context._options.localization.previousMonth);
        switcher.setAttribute('title', this.context._options.localization.selectMonth)
        next.getElementsByTagName('span')[0].setAttribute('title', this.context._options.localization.nextMonth);

        switcher.innerText = this.context._viewDate.format({ month: this.context._options.dayViewHeaderFormat});

        if (!this.context.validation.isValid(this.context._viewDate.manipulate(1, 'month'), 'month')) {
            previous.classList.add('disabled');
        }
        if (!this.context.validation.isValid(this.context._viewDate.manipulate(1, 'month'), 'month')) {
            next.classList.add('disabled');
        }

        const dayBody = datesDiv.getElementsByTagName('tbody')[0];
        dayBody.querySelectorAll('*').forEach(n => n.remove());
        dayBody.appendChild(this._daysOfTheWeek());
        this._grid().forEach(row => dayBody.appendChild(row));
    }

    /***
     * Generates an html row that contains the days of the week.
     * @returns {HTMLTableRowElement}
     */
    _daysOfTheWeek() {
        let innerDate = this.context._viewDate.clone.startOf('weekDay').startOf('date');
        const row = document.createElement('tr'),
            endOfWeek = innerDate.clone.endOf('weekDay');

        if (this.context._options.calendarWeeks) {
            const th = document.createElement('th')
            th.classList.add('cw');
            th.innerText = '#';
            row.appendChild(th);
        }

        while (innerDate.isBefore(endOfWeek)) {
            const th = document.createElement('th')
            th.classList.add('dow');
            th.innerText = innerDate.format('dd');
            innerDate.add(1, 'd');
            row.appendChild(th);
        }

        return row;
    }

    _grid() {
        const rows = [];
        let innerDate = this.context._viewDate.clone.startOf('month').startOf('weekDay').manipulate(12, 'hours'), row;

        for (let i = 0; i < 42; i++) {
            if (innerDate.weekday() === 0) {
                if (row)
                    rows.push(row);

                row = document.createElement('tr');
                if (this.context._options.calendarWeeks) {
                    const td = document.createElement('td')
                    td.classList.add('cw');
                    td.innerText = `${innerDate.week()}`;
                }
            }

            let classes = [];
            classes.push('day');
            if (innerDate.isBefore(this.context._viewDate, 'month')) {
                classes.push('old');
            }
            if (innerDate.isAfter(this.context._viewDate, 'month')) {
                classes.push('new');
            }

            if (!this.context.unset && this.context.dates.isPicked(innerDate, 'date')) {
                classes.push('active');
            }
            if (!this.context.validation.isValid(innerDate, 'date')) {
                classes.push('disabled');
            }
            if (innerDate.isSame(new DateTime(), 'date')) {
                classes.push('today');
            }
            if (innerDate.weekday === 0 || innerDate.weekday === 6) {
                classes.push('weekend');
            }

            const td = document.createElement('td');
            td.setAttribute('data-action', ActionTypes.selectDay);
            td.setAttribute('data-day', `${innerDate.year}-${innerDate.monthFormatted}-${innerDate.dateFormatted}`);
            td.classList.add(...classes);
            td.innerText = `${innerDate.date}`;
            row.appendChild(td);

            innerDate.manipulate(1, 'date');
        }

        return rows;
    }
}