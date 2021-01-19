import Dates from "../dates.js";

export default class YearDisplay {
    constructor(context) {
        this.context = context;
        /*const yearCaps = Dates.getStartEndYear(10, this.context._viewDate.year());
        this._startYear = this.context._viewDate.year(yearCaps[0]);
        this._endYear = this.context._viewDate.year(yearCaps[1]);*/
        this._startYear = this.context._viewDate.clone.manipulate(-1, 'year');
        this._endYear = this.context._viewDate.clone.manipulate(10, 'year');
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

        previous.getElementsByTagName('span')[0].setAttribute('title', this.context._options.localization.previousDecade);
        switcher.setAttribute('title', this.context._options.localization.selectDecade);
        switcher.setAttribute('colspan', '1');
        next.getElementsByTagName('span')[0].setAttribute('title', this.context._options.localization.nextDecade);

        switcher.innerText = `${this._startYear.year()}-${this._endYear.year()}`;

        if (!this.context.validation.isValid(this._startYear, 'year')) {
            previous.classList.add('disabled');
        }
        if (!this.context.validation.isValid(this._endYear, 'year')) {
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
        let innerDate = this.context._viewDate.clone.startOf('year').manipulate(-1, 'year'), row = document.createElement('tr');

        container.setAttribute('data-action', 'selectYear');
        container.classList.add('year');

        for (let i = 0; i <= 12; i++) {
            if (i !== 0 && i % 3 === 0) {
                rows.push(row);
                row = document.createElement('tr');
            }

            let classes = [];

            if (!this.context.unset && this.context.dates.isPicked(innerDate, 'year')) {
                classes.push('active');
            }
            if (!this.context.validation.isValid(innerDate, 'year')) {
                classes.push('disabled');
            }

            const td = document.createElement('td')
            const containerClone = container.cloneNode(true);
            containerClone.classList.add(...classes);
            containerClone.innerText = `${innerDate.year}`;
            td.appendChild(containerClone);

            row.appendChild(td);

            innerDate.manipulate(1, 'year');
        }

        return rows;
    }
}