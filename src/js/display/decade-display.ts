import {TempusDominus} from '../tempus-dominus';
import Dates from '../dates';
import {DateTime, Unit} from '../datetime';

export default class DecadeDisplay {
    private context: TempusDominus;
    private _startDecade: DateTime;
    private _endDecade: DateTime;
    constructor(context: TempusDominus) {
        this.context = context;
        const [start, end] = Dates.getStartEndYear(100, this.context._viewDate.year);
        this._startDecade = this.context._viewDate.clone.startOf(Unit.year);
        this._startDecade.year = start;
        this._endDecade = this.context._viewDate.clone.startOf(Unit.year);
        this._endDecade.year = end;
    }

    get picker() {
        const container = document.createElement('div');
        container.classList.add('datepicker-decades');

        const table = document.createElement('table');
        table.classList.add('table', 'table-sm'); //todo bootstrap
        const headTemplate = this.context.display.headTemplate;
        const [previous, switcher, next] = headTemplate.getElementsByTagName('th');

        previous.getElementsByTagName('span')[0].setAttribute('title', this.context._options.localization.previousCentury);
        switcher.setAttribute('title', this.context._options.localization.selectDecade);
        switcher.setAttribute('colspan', '1');
        next.getElementsByTagName('span')[0].setAttribute('title', this.context._options.localization.nextCentury);

        switcher.innerText = `${this._startDecade.year}-${this._endDecade.year}`;

        if (!this.context.validation.isValid(this._startDecade, Unit.year)) {
            previous.classList.add('disabled');
        }
        if (!this.context.validation.isValid(this._endDecade, Unit.year)) {
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
        let row = document.createElement('tr');

        container.setAttribute('data-action', 'selectDecade');
        container.classList.add('decade');

        if (this._startDecade.year - 10 < 0) {
            const td = document.createElement('td')
            const containerClone = document.createElement('span');
            containerClone.innerText = '&nbsp;';
            td.appendChild(containerClone);
            row.appendChild(td);
        } else {
            const td = document.createElement('td')
            const containerClone = <HTMLElement>container.cloneNode(true);
            containerClone.classList.add('old');
            containerClone.innerText = `${this._startDecade.year - 10}`;
            container.setAttribute('data-selection', `${this._startDecade.year + 6}`);
            td.appendChild(containerClone);

            row.appendChild(td);
        }

        const pickedYears = this.context.dates.picked.map(x => x.year);

        for (let i = 1; i <= 10; i++) {
            const startDecadeYear = this._startDecade.year;
            const endDecadeYear = this._startDecade.year + 9;

            if (i !== 0 && i % 3 === 0) {
                rows.push(row);
                row = document.createElement('tr');
            }

            let classes = [];

            if (!this.context.unset && pickedYears.filter(x => x >= startDecadeYear && x <= endDecadeYear).length > 0) {
                classes.push('active');
            }
           /* if (!this.context.validation.isValid(innerDate, 'y')) { //todo between
                classes.push('disabled');
            }*/

            const td = document.createElement('td')
            const containerClone = <HTMLElement>container.cloneNode(true);
            containerClone.classList.add(...classes);
            container.setAttribute('data-selection', `${this._startDecade.year + 6}`);
            containerClone.innerText = `${this._startDecade.year}`;
            td.appendChild(containerClone);

            row.appendChild(td);

            this._startDecade.manipulate(10, Unit.year);
        }

        const td = document.createElement('td')
        const containerClone = <HTMLElement>container.cloneNode(true);
        containerClone.classList.add('old');
        containerClone.innerText = `${this._startDecade.year}`;
        container.setAttribute('data-selection', `${this._startDecade.year + 6}`);
        td.appendChild(containerClone);

        row.appendChild(td);

        rows.push(row);

        return rows;
    }
}