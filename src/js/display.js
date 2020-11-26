//import Date from 'date'

import DateTime from "./datetime.js";

export default class Display {
    constructor(context) {
        this.context = context;
    }

    get datePicker() {
        const daysDiv = document.createElement('div');
        daysDiv.classList.add('datepicker-days');

        const dayTable = document.createElement('table');
        dayTable.classList.add('table table-sm'); //todo bootstrap

        const daysHeader = document.createElement('thead');

        const previous = document.createElement('th');
        previous.classList.add('prev');
        previous.setAttribute('data-action', 'previous');
        previous.appendChild(this._iconTag(this.context._options.icons.previous));
        daysHeader.appendChild(previous);

        const switcher = document.createElement('th');
        switcher.classList.add('picker-switch');
        switcher.setAttribute('data-action', 'pickerSwitch');
        switcher.setAttribute('colspan', this.context._options.calendarWeeks ? '6' : '5');
        daysHeader.appendChild(switcher);

        const next = document.createElement('th');
        next.classList.add('next');
        next.setAttribute('data-action', 'next');
        next.appendChild(this._iconTag(this.context._options.icons.next));
        daysHeader.appendChild(next);

        const daysBody = document.createElement('tbody');
        const daysBodyRow = document.createElement('tr');
        daysBody.appendChild(daysBodyRow);

        const td = document.createElement('td');
        td.setAttribute('colspan', this.context._options.calendarWeeks ? '6' : '5');
        //daysBodyRow.appendChild(td);

        dayTable.appendChild(daysHeader);
        //dayTable.appendChild(daysBody);

        daysDiv.appendChild(dayTable);
        daysDiv.appendChild(document.createElement('tbody'));
    }

    _iconTag(i) {
        if (this.context._options.icons.type === 'sprites') {
            const svg = document.createElement('svg');
            svg.innerHTML = `<use xlink:href="${i}"></use>` //todo use createElement for this?
            return svg;
        }
        const icon = document.createElement('i');
        icon.classList.add(i);
        return icon;
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

    _dayGrid() {
        const rows = [];
        let innerDate = this.context._viewDate.startOf('M').startOf('w').add(12, 'h'), row;

        for (let i = 0; i < 42; i++) {
            if (innerDate.weekday() === 0) {
                row = document.createElement('tr');
                if (this.context._options.calendarWeeks) {
                    const td = document.createElement('td')
                    td.classList.add('cw');
                    td.innerText = innerDate.week();
                }
                rows.push(row);
            }

            let classes = [];
            classes.push('day');
            if (innerDate.isBefore(this.context._viewDate, 'M')) {
                classes.push('old');
            }
            if (innerDate.isAfter(this.context._viewDate, 'M')) {
                classes.push('new');
            }

            if (!this.context.unset && this.context.dates.isPicked(innerDate)) {
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
            td.innerText = innerDate.date();
            row.appendChild(td);

            innerDate = innerDate.add(1, 'd');
        }

        return rows;
    }
}