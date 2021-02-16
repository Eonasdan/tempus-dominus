import {TempusDominus} from '../tempus-dominus';
import {Unit} from '../datetime';
import {Namespace} from '../conts';
import {ActionTypes} from '../actions';

export default class MonthDisplay {
    private context: TempusDominus;

    constructor(context: TempusDominus) {
        this.context = context;
    }

    get picker(): HTMLElement {
        const container = document.createElement('div');
        container.classList.add(Namespace.Css.monthsContainer);

        const table = document.createElement('table');
        table.classList.add('table', 'table-sm'); //todo bootstrap
        const headTemplate = this.context.display.headTemplate;
        const [previous, switcher, next] = headTemplate.getElementsByTagName('th');

        previous.getElementsByTagName('span')[0].setAttribute('title', this.context._options.localization.previousYear);
        switcher.setAttribute('title', this.context._options.localization.selectYear);
        switcher.setAttribute('colspan', '1');
        next.getElementsByTagName('span')[0].setAttribute('title', this.context._options.localization.nextYear);

        table.appendChild(headTemplate);
        const tableBody = document.createElement('tbody');
        let row = document.createElement('tr');
        for (let i = 0; i <= 12; i++) {
            if (i !== 0 && i % 3 === 0) {
                tableBody.appendChild(row);
                row = document.createElement('tr');
            }
            const td = document.createElement('td');
            const span = document.createElement('span');
            span.setAttribute('data-action', ActionTypes.selectMonth);
            td.appendChild(span);
            row.appendChild(td);
        }

        table.appendChild(tableBody);
        container.appendChild(table);

        return container;
    }

    update(): void {
        const container = this.context.display.widget.getElementsByClassName(Namespace.Css.monthsContainer)[0];
        const [previous, switcher, next] = container.getElementsByTagName('thead')[0].getElementsByTagName('th');

        switcher.innerText = this.context._viewDate.format({year: 'numeric'});

        this.context.validation.isValid(this.context._viewDate.clone.manipulate(-1, Unit.year), Unit.year) ?
            previous.classList.remove(Namespace.Css.disabled) : previous.classList.add(Namespace.Css.disabled);

        this.context.validation.isValid(this.context._viewDate.clone.manipulate(1, Unit.year), Unit.year) ?
            next.classList.remove(Namespace.Css.disabled) : next.classList.add(Namespace.Css.disabled);

        //const tableBody = container.getElementsByTagName('tbody')[0];
        //tableBody.querySelectorAll('*').forEach(n => n.remove());
        //this._grid().forEach(row => tableBody.appendChild(row));
        this.newGrid(container.querySelectorAll('tbody td span'));
    }

    private newGrid(nodeList: NodeList) {
        let innerDate = this.context._viewDate.clone.startOf(Unit.year)

        nodeList.forEach((containerClone: HTMLElement, index) => {
            let classes = [];
            classes.push(Namespace.Css.month);

            if (!this.context.unset && this.context.dates.isPicked(innerDate, Unit.month)) {
                classes.push(Namespace.Css.active);
            }
            if (!this.context.validation.isValid(innerDate, Unit.month)) {
                classes.push(Namespace.Css.disabled);
            }

            containerClone.classList.remove(...containerClone.classList);
            containerClone.classList.add(...classes);
            containerClone.setAttribute('data-value', `${index}`);
            containerClone.innerText = `${innerDate.format({month: 'long'})}`;
            innerDate.manipulate(1, Unit.month);
        });
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
                classes.push(Namespace.Css.active);
            }
            if (!this.context.validation.isValid(innerDate, Unit.month)) {
                classes.push(Namespace.Css.disabled);
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