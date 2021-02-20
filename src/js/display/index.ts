import DateDisplay from './calendar/date-display';
import MonthDisplay from './calendar/month-display';
import YearDisplay from './calendar/year-display';
import DecadeDisplay from './calendar/decade-display';
import TimeDisplay from './time/time-display';
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
        this.widget.querySelectorAll(`.${Namespace.Css.dateContainer} > div`)//, .${Namespace.Css.timeContainer} > div`)
            .forEach((e: HTMLElement) => e.style.display = 'none');

        const datePickerMode = DatePickerModes[this.context.currentViewMode];
        let picker: HTMLElement = this.widget.querySelector(`.${datePickerMode.CLASS_NAME}`);

        switch (datePickerMode.CLASS_NAME) {
            case Namespace.Css.decadesContainer:
                this._decadeDisplay.update();
                break;
            case Namespace.Css.yearsContainer:
                this._yearDisplay.update();
                break;
            case Namespace.Css.monthsContainer:
                this._monthDisplay.update();
                break;
            case Namespace.Css.daysContainer:
                this._dateDisplay.update();
                break;
        }

        picker.style.display = 'block';
    }

    hide(): void {
        console.log('hide called');
    }

    _place(): void {
        console.log('place called');
    }

    _buildWidget(): HTMLElement {
        const template = document.createElement('div');
        template.classList.add(Namespace.Css.widget);
        if (this.context._options.display.calendarWeeks)
            template.classList.add(Namespace.Css.widgetCalendarWeeks);

        const dateView = document.createElement('div');
        dateView.classList.add(Namespace.Css.dateContainer);
        dateView.appendChild(this._decadeDisplay.picker);
        dateView.appendChild(this._yearDisplay.picker);
        dateView.appendChild(this._monthDisplay.picker);
        dateView.appendChild(this._dateDisplay.picker);

        const timeView = document.createElement('div');
        timeView.classList.add(Namespace.Css.timeContainer);
        timeView.appendChild(this._timeDisplay.picker);

        const toolbar = document.createElement('div');
        toolbar.classList.add(Namespace.Css.switch);
        toolbar.appendChild(this._toolbar);

        if (this.context._options.display.components.useTwentyfourHour) {
            template.classList.add(Namespace.Css.useTwentyfour);
        }

        if (this.context._options.display.components.seconds && !this.context._options.display.components.useTwentyfourHour) {
            template.classList.add(Namespace.Css.wider);
        }

        if (this.context._options.display.sideBySide && this._hasDate() && this._hasTime()) {
            template.classList.add(Namespace.Css.sideBySide);
            if (this.context._options.display.toolbarPlacement === 'top') {
                template.appendChild(toolbar);
            }
            const row = document.createElement('div');
            row.classList.add('row'); //todo bootstrap
            dateView.classList.add('col-md-6');
            timeView.classList.add('col-md-6');

            row.appendChild(dateView);
            row.appendChild(timeView);

            if (this.context._options.display.toolbarPlacement === 'bottom' || this.context._options.display.toolbarPlacement === 'default') {
                template.appendChild(toolbar);
            }
            this._widget = template;
            return;
        }

        const content = document.createElement('div');

        if (this.context._options.display.toolbarPlacement === 'top') {
            content.appendChild(toolbar);
        }
        if (this._hasDate()) {
            if (this.context._options.display.collapse && this._hasTime()) {
                dateView.classList.add(Namespace.Css.collapse);
                if (this.context._options.display.viewMode !== 'times') dateView.classList.add(Namespace.Css.show);
            }
            content.appendChild(dateView);
        }
        if (this.context._options.display.toolbarPlacement === 'default') {
            content.appendChild(toolbar);
        }
        if (this._hasTime()) {
            if (this.context._options.display.collapse && this._hasDate()) {
                timeView.classList.add(Namespace.Css.collapse);
                if (this.context._options.display.viewMode === 'times') timeView.classList.add(Namespace.Css.show);
            }
            content.appendChild(timeView);
        }
        if (this.context._options.display.toolbarPlacement === 'bottom') {
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
            const span = document.createElement('span');
            span.setAttribute('data-action', ActionTypes.today);
            span.setAttribute('title', this.context._options.localization.today);

            span.appendChild(this.iconTag(this.context._options.display.icons.today));
            td.appendChild(span);
            tbody.appendChild(td);
        }
        if (!this.context._options.display.sideBySide && this.context._options.display.collapse && this._hasDate() && this._hasTime()) {
            let title, icon;
            if (this.context._options.display.viewMode === 'times') {
                title = this.context._options.localization.selectDate;
                icon = this.context._options.display.icons.date;
            } else {
                title = this.context._options.localization.selectTime;
                icon = this.context._options.display.icons.time;
            }

            const td = document.createElement('td');
            const span = document.createElement('span');
            span.setAttribute('data-action', ActionTypes.togglePicker);
            span.setAttribute('title', title);

            span.appendChild(this.iconTag(icon));
            td.appendChild(span);
            tbody.appendChild(td);
        }
        if (this.context._options.display.buttons.showClear) {
            const td = document.createElement('td');
            const span = document.createElement('span');
            span.setAttribute('data-action', ActionTypes.clear);
            span.setAttribute('title', this.context._options.localization.clear);

            span.appendChild(this.iconTag(this.context._options.display.icons.today));
            td.appendChild(span);
            tbody.appendChild(td);
        }
        if (this.context._options.display.buttons.showClose) {
            const td = document.createElement('td');
            const span = document.createElement('span');
            span.setAttribute('data-action', ActionTypes.close);
            span.setAttribute('title', this.context._options.localization.close);

            span.appendChild(this.iconTag(this.context._options.display.icons.today));
            td.appendChild(span);
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
        let span = document.createElement('span');
        const headTemplate = document.createElement('thead');
        const previous = document.createElement('th');
        previous.classList.add(Namespace.Css.previous);
        previous.setAttribute('data-action', ActionTypes.previous);
        span.appendChild(this.iconTag(this.context._options.display.icons.previous));
        previous.appendChild(span);
        headTemplate.appendChild(previous);

        const switcher = document.createElement('th');
        switcher.classList.add(Namespace.Css.switch);
        switcher.setAttribute('data-action', ActionTypes.pickerSwitch);
        switcher.setAttribute('colspan', this.context._options.display.calendarWeeks ? '6' : '5');
        headTemplate.appendChild(switcher);

        const next = document.createElement('th');
        next.classList.add(Namespace.Css.next);
        next.setAttribute('data-action', ActionTypes.next);
        span = document.createElement('span');
        span.appendChild(this.iconTag(this.context._options.display.icons.next));
        next.appendChild(span);
        headTemplate.appendChild(next);
        return <HTMLElement>headTemplate.cloneNode(true);
    }

    iconTag(i): HTMLElement {
        if (this.context._options.display.icons.type === 'sprites') {
            const svg = document.createElement('svg');
            svg.innerHTML = `<use xlink:href="${i}"></use>`
            return svg;
        }
        const icon = document.createElement('i');
        DOMTokenList.prototype.add.apply(icon.classList, i.split(' '));
        return icon;
    }
}