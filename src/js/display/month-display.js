export default class MonthDisplay {
    constructor(context) {
        this.context = context;
    }

    get picker() {
        const container = document.createElement('div');
        container.classList.add('datepicker-months');

        const table = document.createElement('table');
        table.classList.add('table', 'table-sm'); //todo bootstrap
        const headTemplate = this.context.display.headTemplate;
        const [previous, switcher, next] = headTemplate.getElementsByTagName('th');

        previous.getElementsByTagName('span')[0].setAttribute('title', this.context._options.localization.previousYear);
        switcher.setAttribute('title', this.context._options.localization.selectYear);
        switcher.setAttribute('colspan', '1');
        next.getElementsByTagName('span')[0].setAttribute('title', this.context._options.localization.nextYear);

        switcher.innerText = this.context._viewDate.format({year: 'numeric'});

        if (!this.context.validation.isValid(this.context._viewDate.manipulate(-1, 'year'), 'year')) {
            previous.classList.add('disabled');
        }
        if (!this.context.validation.isValid(this.context._viewDate.manipulate(1, 'year'), 'year')) {
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
        let innerDate = this.context._viewDate.clone.startOf('year'), row = document.createElement('tr');

        container.setAttribute('data-action', 'selectMonth');
        container.classList.add('year');

        for(let i = 0; i <= 12; i++) {
            if (i !== 0 && i % 3 === 0) {
                rows.push(row);
                row = document.createElement('tr');
            }

            let classes = [];

            if (!this.context.unset && this.context.dates.isPicked(innerDate, 'month')) {
                classes.push('active');
            }
            if (!this.context.validation.isValid(innerDate, 'month')) {
                classes.push('disabled');
            }

            const td = document.createElement('td');
            const containerClone = container.cloneNode(true);
            containerClone.classList.add(...classes);
            containerClone.innerText = `${innerDate.format({month: 'long'})}`;
            td.appendChild(containerClone);

            row.appendChild(td);

            innerDate.manipulate(1, 'month');
        }

        return rows;
    }
}