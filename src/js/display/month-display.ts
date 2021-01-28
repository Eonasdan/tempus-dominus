import {TempusDominus} from '../tempus-dominus';
import {Unit} from '../datetime';

export default class MonthDisplay {
    private context: TempusDominus;

    constructor(context: TempusDominus) {
        this.context = context;
    }

    get picker(): HTMLElement {
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

        if (!this.context.validation.isValid(this.context._viewDate.clone.manipulate(-1, Unit.year), Unit.year)) {
            previous.classList.add('disabled');
        }
        if (!this.context.validation.isValid(this.context._viewDate.clone.manipulate(1, Unit.year), Unit.year)) {
            next.classList.add('disabled');
        }

        table.appendChild(headTemplate);
        const tableBody = document.createElement('tbody');
        this._grid().forEach(row => tableBody.appendChild(row));
        table.appendChild(tableBody);
        container.appendChild(table);

        return container;
    }

    update(): void {
        this.context.display.widget.querySelector<HTMLElement>('[data-action="pickerSwitch"]').innerText = this.context._viewDate.format({year: 'numeric'});
    }

    /**
     *
     * @private
     */
    _grid(): HTMLTableRowElement[] {
        const rows = [], container = document.createElement('span');
        let innerDate = this.context._viewDate.clone.startOf(Unit.year), row = document.createElement('tr');

        container.setAttribute('data-action', 'selectMonth');
        container.classList.add(Unit.month);

        for(let i = 0; i <= 12; i++) {
            if (i !== 0 && i % 3 === 0) {
                rows.push(row);
                row = document.createElement('tr');
            }

            let classes = [];

            if (!this.context.unset && this.context.dates.isPicked(innerDate, Unit.month)) {
                classes.push('active');
            }
            if (!this.context.validation.isValid(innerDate, Unit.month)) {
                classes.push('disabled');
            }

            const td = document.createElement('td');
            const containerClone = <HTMLElement>container.cloneNode(true);
            containerClone.setAttribute('data-value', `${i}`);
            containerClone.classList.add(...classes);
            containerClone.innerText = `${innerDate.format({month: 'long'})}`;
            td.appendChild(containerClone);

            row.appendChild(td);

            innerDate.manipulate(1, Unit.month);
        }

        return rows;
    }
}