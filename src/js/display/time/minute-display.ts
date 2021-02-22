import {TempusDominus} from '../../tempus-dominus';
import {Unit} from '../../datetime';
import {Namespace} from '../../conts';
import {ActionTypes} from '../../actions';

export default class MinuteDisplay {
    private context: TempusDominus;

    constructor(context: TempusDominus) {
        this.context = context;
    }

    get picker(): HTMLElement {
        const container = document.createElement('div');
        container.classList.add(Namespace.Css.minuteContainer );

        const table = document.createElement('table');
        table.classList.add('table', 'table-sm'); //todo bootstrap
        const tableBody = document.createElement('tbody');
        let row = document.createElement('tr');
        let step = this.context._options.stepping === 1 ? 5 : this.context._options.stepping;
        for (let i = 0; i <= 60/step ; i++) {
            if (i !== 0 && i % 4 === 0) {
                tableBody.appendChild(row);
                row = document.createElement('tr');
            }
            const td = document.createElement('td');
            const span = document.createElement('span');
            span.setAttribute('data-action', ActionTypes.selectMinute);
            td.appendChild(span);
            row.appendChild(td);
        }

        table.appendChild(tableBody);
        container.appendChild(table);

        return container;
    }

    update(): void {
        const container = this.context.display.widget.getElementsByClassName(Namespace.Css.minuteContainer)[0];
        let innerDate = this.context._viewDate.clone.startOf(Unit.hours);
        let step = this.context._options.stepping === 1 ? 5 : this.context._options.stepping;

        container.querySelectorAll('tbody td span').forEach((containerClone: HTMLElement, index) => {
            let classes = [];
            classes.push(Namespace.Css.minute);

            if (!this.context.validation.isValid(innerDate, Unit.minutes)) {
                classes.push(Namespace.Css.disabled);
            }

            containerClone.classList.remove(...containerClone.classList);
            containerClone.classList.add(...classes);
            containerClone.setAttribute('data-value', `${innerDate.minutes}`);
            containerClone.innerText = innerDate.minutesFormatted;
            innerDate.manipulate(step, Unit.minutes);
        });
    }
}