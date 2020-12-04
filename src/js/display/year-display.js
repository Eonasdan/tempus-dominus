import Dates from "../dates.js";

export default class YearDisplay {
    constructor(context) {
        this.context = context;
        /*const yearCaps = Dates.getStartEndYear(10, this.context._viewDate.year());
        this._startYear = this.context._viewDate.year(yearCaps[0]);
        this._endYear = this.context._viewDate.year(yearCaps[1]);*/
        this._startYear = this.context._viewDate.subtract(1, 'y');
        this._endYear = this.context._viewDate.add(10, 'y')
    }

    get picker() {
        const container = document.createElement('div');
        container.classList.add('datepicker-years');

        const table = document.createElement('table');
        table.classList.add('table', 'table-sm'); //todo bootstrap
        const headTemplate = this.context.display.headTemplate;
        const heads = headTemplate.getElementsByTagName('th');
        const previous = heads[0];
        const switcher = heads[1];
        const next = heads[2];

        previous.getElementsByTagName('span')[0].setAttribute('title', this.context._options.tooltips.prevDecade);
        switcher.setAttribute('title', this.context._options.tooltips.selectDecade);
        switcher.setAttribute('colspan', '1');
        next.getElementsByTagName('span')[0].setAttribute('title', this.context._options.tooltips.nextDecade);

        switcher.innerText = `${this._startYear.year()}-${this._endYear.year()}`;

        if (!this.context.validation.isValid(this._startYear, 'y')) {
            previous.classList.add('disabled');
        }
        if (!this.context.validation.isValid(this._endYear, 'y')) {
            next.classList.add('disabled');
        }

        table.appendChild(headTemplate);
        const tableBody = document.createElement('tbody');
        this._grid().forEach(row => tableBody.appendChild(row));
        table.appendChild(tableBody);
        container.appendChild(table);

        return container;
    }

    _grid() {
        const rows = [], container = document.createElement('span');
        let innerDate = this.context._viewDate.startOf('y').subtract(1, 'y'), row = document.createElement('tr');

        container.setAttribute('data-action', 'selectYear');
        container.classList.add('year');

        for (let i = 0; i <= 12; i++) {
            if (i !== 0 && i % 3 === 0) {
                rows.push(row);
                row = document.createElement('tr');
            }

            let classes = [];

            if (!this.context.unset && this.context.dates.isPicked(innerDate, 'y')) {
                classes.push('active');
            }
            if (!this.context.validation.isValid(innerDate, 'y')) {
                classes.push('disabled');
            }

            const td = document.createElement('td')
            const containerClone = container.cloneNode(true);
            containerClone.classList.add(...classes);
            containerClone.innerText = `${innerDate.year()}`;
            td.appendChild(containerClone);

            row.appendChild(td);

            innerDate = innerDate.add(1, 'y');
        }

        return rows;
    }
}