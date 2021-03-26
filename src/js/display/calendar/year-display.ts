import {TempusDominus} from '../../tempus-dominus';
import {DateTime, Unit} from '../../datetime';
import {Namespace} from '../../conts';
import {ActionTypes} from '../../actions';

export default class YearDisplay {
    private context: TempusDominus;
    private _startYear: DateTime;
    private _endYear: DateTime;

    constructor(context: TempusDominus) {
        this.context = context;
        this._startYear = this.context._viewDate.clone.manipulate(-1, Unit.year);
        this._endYear = this.context._viewDate.clone.manipulate(10, Unit.year);
    }

    get picker(): HTMLElement {
        const container = document.createElement('div');
        container.classList.add(Namespace.Css.yearsContainer);

        const table = document.createElement('table');
        //table.classList.add('table', 'table-sm'); //todo bootstrap
        const headTemplate = this.context.display.headTemplate;
        const [previous, switcher, next] = headTemplate.getElementsByTagName('th');

        previous.getElementsByTagName('span')[0].setAttribute('title', this.context._options.localization.previousDecade);
        switcher.setAttribute('title', this.context._options.localization.selectDecade);
        switcher.setAttribute('colspan', '1');
        next.getElementsByTagName('span')[0].setAttribute('title', this.context._options.localization.nextDecade);

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
            span.setAttribute('data-action', ActionTypes.selectYear);
            td.appendChild(span);
            row.appendChild(td);
        }

        table.appendChild(tableBody);
        container.appendChild(table);

        return container;
    }

    update() {
        const container = this.context.display.widget.getElementsByClassName(Namespace.Css.yearsContainer)[0];
        const [previous, switcher, next] = container.getElementsByTagName('thead')[0].getElementsByTagName('th');

        switcher.innerText = `${this._startYear.year}-${this._endYear.year}`;

        this.context.validation.isValid(this._startYear, Unit.year) ? previous.classList.remove(Namespace.Css.disabled) : previous.classList.add(Namespace.Css.disabled);
        this.context.validation.isValid(this._endYear, Unit.year) ? next.classList.remove(Namespace.Css.disabled) : next.classList.add(Namespace.Css.disabled);

        this.grid(container.querySelectorAll('tbody td span'));
    }

    private grid(nodeList: NodeList) {
        let innerDate = this.context._viewDate.clone.startOf(Unit.year).manipulate(-1, Unit.year)

        nodeList.forEach((containerClone: HTMLElement, index) => {
            let classes = [];
            classes.push(Namespace.Css.year);

            if (!this.context.unset && this.context.dates.isPicked(innerDate, Unit.year)) {
                classes.push(Namespace.Css.active);
            }
            if (!this.context.validation.isValid(innerDate, Unit.year)) {
                classes.push(Namespace.Css.disabled);
            }

            containerClone.classList.remove(...containerClone.classList);
            containerClone.classList.add(...classes);
            containerClone.innerText = `${innerDate.year}`;

            innerDate.manipulate(1, Unit.year);
        });
    }
}