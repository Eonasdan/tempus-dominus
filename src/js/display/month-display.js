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
        const heads = headTemplate.getElementsByTagName('th');
        const previous = heads[0];
        const switcher = heads[1];
        const next = heads[2];

        previous.getElementsByTagName('span')[0].setAttribute('title', this.context._options.tooltips.prevYear);
        switcher.setAttribute('title', this.context._options.tooltips.selectYear);
        switcher.setAttribute('colspan', '1');
        next.getElementsByTagName('span')[0].setAttribute('title', this.context._options.tooltips.nextYear);

        switcher.innerText = this.context._viewDate.format('YYYY');

        if (!this.context.validation.isValid(this.context._viewDate.subtract(1, 'y'), 'y')) {
            previous.classList.add('disabled');
        }
        if (!this.context.validation.isValid(this.context._viewDate.add(1, 'y'), 'y')) {
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
        let innerDate = this.context._viewDate.startOf('y'), row = document.createElement('tr');

        container.setAttribute('data-action', 'selectMonth');
        container.classList.add('year');

        for(let i = 0; i <= 12; i++) {
            if (i !== 0 && i % 3 === 0) {
                rows.push(row);
                row = document.createElement('tr');
            }

            let classes = [];

            if (!this.context.unset && this.context.dates.isPicked(innerDate, 'M')) {
                classes.push('active');
            }
            if (!this.context.validation.isValid(innerDate, 'M')) {
                classes.push('disabled');
            }

            const td = document.createElement('td');
            const containerClone = container.cloneNode(true);
            containerClone.classList.add(...classes);
            containerClone.innerText = `${innerDate.format('MMMM')}`;
            td.appendChild(containerClone);

            row.appendChild(td);

            innerDate = innerDate.add(1, 'M');
        }

        return rows;
    }
}