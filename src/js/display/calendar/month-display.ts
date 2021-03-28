import {TempusDominus} from '../../tempus-dominus';
import {Unit} from '../../datetime';
import {Namespace} from '../../conts';
import {ActionTypes} from '../../actions';

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

        previous.getElementsByTagName('div')[0].setAttribute('title', this.context.options.localization.previousYear);
        switcher.setAttribute('title', this.context.options.localization.selectYear);
        switcher.setAttribute('colspan', '1');
        next.getElementsByTagName('div')[0].setAttribute('title', this.context.options.localization.nextYear);

        table.appendChild(headTemplate);
        const tableBody = document.createElement('tbody');
        let row = document.createElement('tr');
        for (let i = 0; i <= 12; i++) {
            if (i !== 0 && i % 3 === 0) {
                tableBody.appendChild(row);
                row = document.createElement('tr');
            }
            const td = document.createElement('td');
            const div = document.createElement('div');
            div.setAttribute('data-action', ActionTypes.selectMonth);
            td.appendChild(div);
            row.appendChild(td);
        }

        table.appendChild(tableBody);
        container.appendChild(table);

        return container;
    }

    update(): void {
        const container = this.context.display.widget.getElementsByClassName(Namespace.Css.monthsContainer)[0];
        const [previous, switcher, next] = container.getElementsByTagName('thead')[0].getElementsByTagName('th');

        switcher.innerText = this.context.viewDate.format({year: 'numeric'});

        this.context.validation.isValid(this.context.viewDate.clone.manipulate(-1, Unit.year), Unit.year) ?
            previous.classList.remove(Namespace.Css.disabled) : previous.classList.add(Namespace.Css.disabled);

        this.context.validation.isValid(this.context.viewDate.clone.manipulate(1, Unit.year), Unit.year) ?
            next.classList.remove(Namespace.Css.disabled) : next.classList.add(Namespace.Css.disabled);

        this.grid(container.querySelectorAll('tbody td div'));
    }

    private grid(nodeList: NodeList) {
        let innerDate = this.context.viewDate.clone.startOf(Unit.year)

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
}