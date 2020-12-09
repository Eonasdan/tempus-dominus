import DateTime from "../datetime.js";

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

        previous.getElementsByTagName('span')[0].setAttribute('title', this.context._options.tooltips.prevMonth);
        switcher.setAttribute('title', this.context._options.tooltips.selectMonth)
        next.getElementsByTagName('span')[0].setAttribute('title', this.context._options.tooltips.nextMonth);

        switcher.innerText = this.context._viewDate.format(this.context._options.dayViewHeaderFormat);

        if (!this.context.validation.isValid(this.context._viewDate.subtract(1, 'M'), 'M')) {
            previous.classList.add('disabled');
        }
        if (!this.context.validation.isValid(this.context._viewDate.add(1, 'M'), 'M')) {
            next.classList.add('disabled');
        }

        const dayBody = datesDiv.getElementsByTagName('tbody')[0];
        dayBody.appendChild(this._daysOfTheWeek());
        this._grid().forEach(row => dayBody.appendChild(row));
    }

    /***
     * Generates an html row that contains the days of the week.
     * @returns {HTMLTableRowElement}
     */
    _daysOfTheWeek() {
        let innerDate = this.context._viewDate.startOf('w').startOf('d');
        const row = document.createElement('tr'),
            endOfWeek = innerDate.endOf('w');

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
            innerDate = innerDate.add(1, 'd');
            row.appendChild(th);
        }

        return row;
    }

    _grid() {
        const rows = [];
        let innerDate = this.context._viewDate.startOf('M').startOf('w').add(12, 'h'), row;

        for (let i = 0; i < 42; i++) {
            if (innerDate.weekday() === 0) {
                if (row)
                    rows.push(row);

                row = document.createElement('tr');
                if (this.context._options.calendarWeeks) {
                    const td = document.createElement('td')
                    td.classList.add('cw');
                    td.innerText = innerDate.week();
                }
            }

            let classes = [];
            classes.push('day');
            if (innerDate.isBefore(this.context._viewDate, 'M')) {
                classes.push('old');
            }
            if (innerDate.isAfter(this.context._viewDate, 'M')) {
                classes.push('new');
            }

            if (!this.context.unset && this.context.dates.isPicked(innerDate, 'd')) {
                classes.push('active');
            }
            if (!this.context.validation.isValid(innerDate, 'd')) {
                classes.push('disabled');
            }
            if (innerDate.isSame(DateTime.today, 'd')) {
                classes.push('today');
            }
            if (innerDate.day() === 0 || innerDate.day() === 6) {
                classes.push('weekend');
            }

            const td = document.createElement('td')
            td.classList.add(...classes);
            td.innerText = `${innerDate.date()}`;
            row.appendChild(td);

            innerDate = innerDate.add(1, 'd');
        }

        return rows;
    }
}