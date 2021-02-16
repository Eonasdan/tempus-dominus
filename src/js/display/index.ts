import DateDisplay from './date-display';
import MonthDisplay from './month-display';
import YearDisplay from './year-display';
import DecadeDisplay from './decade-display';
import TimeDisplay from './time-display';
import {DateTime} from '../datetime';
import {DatePickerModes, Namespace} from '../conts';
import {TempusDominus} from '../tempus-dominus';
import {ActionTypes} from '../actions';


export default class Display {
    private context: TempusDominus;
    private _dateDisplay: DateDisplay;
    private _monthDisplay: MonthDisplay;
    private _yearDisplay: YearDisplay;
    private _decadeDisplay: DecadeDisplay;
    private _timeDisplay: TimeDisplay;
    private _widget: HTMLElement;

    constructor(context: TempusDominus) {
        this.context = context;
        this._dateDisplay = new DateDisplay(context);
        this._monthDisplay = new MonthDisplay(context);
        this._yearDisplay = new YearDisplay(context);
        this._decadeDisplay = new DecadeDisplay(context);
        this._timeDisplay = new TimeDisplay(context);

        this._widget = undefined;
    }

    get widget(): HTMLElement {
        return this._widget;
    }

    update(): void {
        if (!this._widget) return;
        this.updateDateView();
        this.updateTimeView();
    }

    updateDateView(): void {
        if (this._hasDate())
            this._dateDisplay.update();
    }

    updateTimeView(): void {
        if (this._hasTime())
            this._timeDisplay.update();
    }

    show(): void {
        if (this.context._options.useCurrent) {
            //todo in the td4 branch a pr changed this to allow granularity
            this.context.dates._setValue(new DateTime());
        }
        this._buildWidget();
        this._showMode();
        window.addEventListener('resize', () => this._place());
        this._place();
        //todo unhide widget
        this.context._notifyEvent({
            type: Namespace.Events.SHOW
        })
    }

    _showMode(direction?: number): void {
        if (!this.widget) {
            return;
        }
        if (direction) {
            const max = Math.max(this.context.minViewModeNumber, Math.min(3, this.context.currentViewMode + direction));
            if (this.context.currentViewMode == max) return;
            this.context.currentViewMode = max;
        }
        this.widget.querySelectorAll(`.${Namespace.Css.dateContainer} > div, .${Namespace.Css.timeContainer} > div`)
            .forEach((e: HTMLElement) => e.style.display = 'none');

        const datePickerMode = DatePickerModes[this.context.currentViewMode];
        let picker: HTMLElement = this.widget.querySelector(`.${datePickerMode.CLASS_NAME}`);
        const dateContainer = this.widget.querySelector(`.${Namespace.Css.dateContainer}`);
        switch (datePickerMode.CLASS_NAME) {
            case Namespace.Css.decadesContainer:
                if (picker == null) dateContainer.appendChild(this._decadeDisplay.picker);
                this._decadeDisplay.update();
                break;
            case Namespace.Css.yearsContainer:
                if (picker == null) dateContainer.appendChild(this._yearDisplay.picker);
                this._yearDisplay.update();
                break;
            case Namespace.Css.monthsContainer:
                if (picker == null) dateContainer.appendChild(this._monthDisplay.picker);
                this._monthDisplay.update();
                break;
            case Namespace.Css.daysContainer:
                if (picker == null) dateContainer.appendChild(this._dateDisplay.picker);
                this._dateDisplay.update();
                break;
        }
        if (picker == null) {
            picker = this.widget.querySelector(`.${datePickerMode.CLASS_NAME}`);
            //todo migrate this to bootstrap's eventhandler
            const actions = this.widget.querySelectorAll('[data-action]');
            /*actions.forEach(element => element.removeEventListener('click', (e) => {
                this.context.action.do(e);
            }))*/
            /*actions.forEach(element => element.addEventListener('click', (e) => {
                this.context.action.do(e);
            }));*/
        }

        picker.style.display = 'block';
    }

    hide(): void {

    }

    _place(): void {
        console.log('place called');
    }

    _buildWidget(): HTMLElement {
        const template = document.createElement('div');
        //todo bootstrap, need to namespace classes
        template.classList.add(Namespace.Css.widget);
        if (this.context._options.calendarWeeks)
            template.classList.add(Namespace.Css.widgetCalendarWeeks);

        const dateView = document.createElement('div');
        dateView.classList.add(Namespace.Css.dateContainer);

        const timeView = document.createElement('div');
        timeView.classList.add(Namespace.Css.timeContainer);
        timeView.appendChild(this._timeDisplay.picker);

        const toolbar = document.createElement('li');
        toolbar.classList.add(Namespace.Css.switch);
        if (this.context._options.collapse) toolbar.classList.add('accordion-toggle'); //todo bootstrap
        toolbar.appendChild(this._toolbar);

        /*if (!this.context._options.inline) { //todo restore this. for now I don't want the position stuff it adds
            template.classList.add('dropdown-menu'); //todo bootstrap
        }*/

        if (this.context._options.display.components.useTwentyfourHour) {
            template.classList.add(Namespace.Css.useTwentyfour);
        }

        if (this.context._options.display.components.second && !this.context._options.display.components.useTwentyfourHour) {
            template.classList.add(Namespace.Css.wider);
        }

        if (this.context._options.sideBySide && this._hasDate() && this._hasTime()) {
            template.classList.add(Namespace.Css.sideBySide);
            if (this.context._options.toolbarPlacement === 'top') {
                template.appendChild(toolbar);
            }
            const row = document.createElement('div');
            row.classList.add('row'); //todo bootstrap
            dateView.classList.add('col-md-6');
            timeView.classList.add('col-md-6');

            row.appendChild(dateView);
            row.appendChild(timeView);

            if (this.context._options.toolbarPlacement === 'bottom' || this.context._options.toolbarPlacement === 'default') {
                template.appendChild(toolbar);
            }
            this._widget = template;
            return;
        }

        const content = document.createElement('ul');
        content.classList.add('list-unstyled'); //todo bootstrap

        if (this.context._options.toolbarPlacement === 'top') {
            content.appendChild(toolbar);
        }
        if (this._hasDate()) {
            const li = document.createElement('li');
            if (this.context._options.collapse && this._hasTime()) {
                //li.classList.add('collapse'); //todo bootstrap
                if (this.context._options.viewMode !== 'times') li.classList.add('show');
            }
            li.appendChild(dateView);
            content.appendChild(li);
        }
        if (this.context._options.toolbarPlacement === 'default') {
            content.appendChild(toolbar);
        }
        if (this._hasTime()) {
            const li = document.createElement('li');
            if (this.context._options.collapse && this._hasDate()) {
                //li.classList.add('collapse'); //todo bootstrap
                if (this.context._options.viewMode === 'times') li.classList.add('show');
            }
            li.appendChild(timeView);
            content.appendChild(li);
        }
        if (this.context._options.toolbarPlacement === 'bottom') {
            content.appendChild(toolbar);
        }

        template.appendChild(content);

        this._widget = template;
    }

    _hasTime(): boolean {
        return this.context._options.display.components.hours || this.context._options.display.components.minutes || this.context._options.display.components.seconds;
    }

    _hasDate(): boolean {
        return this.context._options.display.components.year || this.context._options.display.components.month || this.context._options.display.components.date;
    }

    get _toolbar(): HTMLTableElement {
        const tbody = document.createElement('tbody');

        if (this.context._options.display.buttons.showToday) {
            const td = document.createElement('td');
            const a = document.createElement('a');
            a.setAttribute('href', 'javascript:void(0);');
            a.setAttribute('tabindex', '-1');
            a.setAttribute('data-action', ActionTypes.today);
            a.setAttribute('title', this.context._options.localization.today);

            a.appendChild(this.iconTag(this.context._options.display.icons.today));
            td.appendChild(a);
            tbody.appendChild(td);
        }
        if (!this.context._options.sideBySide && this.context._options.collapse && this._hasDate() && this._hasTime()) {
            let title, icon;
            if (this.context._options.viewMode === 'times') {
                title = this.context._options.localization.selectDate;
                icon = this.context._options.display.icons.date;
            } else {
                title = this.context._options.localization.selectTime;
                icon = this.context._options.display.icons.time;
            }

            const td = document.createElement('td');
            const a = document.createElement('a');
            a.setAttribute('href', 'javascript:void(0);');
            a.setAttribute('tabindex', '-1');
            a.setAttribute('data-action', ActionTypes.togglePicker);
            a.setAttribute('title', title);

            a.appendChild(this.iconTag(icon));
            td.appendChild(a);
            tbody.appendChild(td);
        }
        if (this.context._options.display.buttons.showClear) {
            const td = document.createElement('td');
            const a = document.createElement('a');
            a.setAttribute('href', 'javascript:void(0);');
            a.setAttribute('tabindex', '-1');
            a.setAttribute('data-action', ActionTypes.clear);
            a.setAttribute('title', this.context._options.localization.clear);

            a.appendChild(this.iconTag(this.context._options.display.icons.today));
            td.appendChild(a);
            tbody.appendChild(td);
        }
        if (this.context._options.display.buttons.showClose) {
            const td = document.createElement('td');
            const a = document.createElement('a');
            a.setAttribute('href', 'javascript:void(0);');
            a.setAttribute('tabindex', '-1');
            a.setAttribute('data-action', ActionTypes.close);
            a.setAttribute('title', this.context._options.localization.close);

            a.appendChild(this.iconTag(this.context._options.display.icons.today));
            td.appendChild(a);
            tbody.appendChild(td);
        }
        const table = document.createElement('table');
        table.appendChild(tbody);

        return table;
    }

    /***
     *
     */
    get headTemplate(): HTMLElement {
        const headTemplate = document.createElement('thead');
        const previous = document.createElement('th');
        previous.classList.add(Namespace.Css.previous);
        previous.setAttribute('data-action', ActionTypes.previous);
        previous.appendChild(this.iconTag(this.context._options.display.icons.previous));
        headTemplate.appendChild(previous);

        const switcher = document.createElement('th');
        switcher.classList.add(Namespace.Css.switch);
        switcher.setAttribute('data-action', ActionTypes.pickerSwitch);
        switcher.setAttribute('colspan', this.context._options.calendarWeeks ? '6' : '5');
        headTemplate.appendChild(switcher);

        const next = document.createElement('th');
        next.classList.add(Namespace.Css.next);
        next.setAttribute('data-action', ActionTypes.next);
        next.appendChild(this.iconTag(this.context._options.display.icons.next));
        headTemplate.appendChild(next);
        return <HTMLElement>headTemplate.cloneNode(true);
    }

    get contentTemplate(): HTMLElement {
        const contentTemplate = document.createElement('tbody');
        const rowElement = document.createElement('tr');
        const td = document.createElement('td');
        td.setAttribute('colspan', this.context._options.calendarWeeks ? '6' : '5');
        rowElement.appendChild(td);
        contentTemplate.appendChild(rowElement);
        return <HTMLElement>contentTemplate.cloneNode(true);
    }

    iconTag(i): HTMLElement {
        const container = document.createElement('span')
        if (this.context._options.display.icons.type === 'sprites') {
            const svg = document.createElement('svg');
            svg.innerHTML = `<use xlink:href="${i}"></use>`
            container.appendChild(svg);
            return container;
        }
        const icon = document.createElement('i');
        DOMTokenList.prototype.add.apply(icon.classList, i.split(' '));
        container.appendChild(icon);
        return container;
    }
}