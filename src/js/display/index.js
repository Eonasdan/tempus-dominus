import DateDisplay from './date-display.js';
import MonthDisplay from './month-display.js';
import YearDisplay from './year-display.js';
import DecadeDisplay from "./decade-display.js";
import TimeDisplay from "./time-display.js";


export default class Display {
    constructor(context) {
        this.context = context;
        this._dateDisplay = new DateDisplay(context);
        this._monthDisplay = new MonthDisplay(context);
        this._yearDisplay = new YearDisplay(context);
        this._decadeDisplay = new DecadeDisplay(context);
        this._timeDisplay = new TimeDisplay(context);

        this._widget = undefined;
    }

    /*todo need a widget builder
    the old way just created empty shells and then stuffed the tables
    based on the views enabled and on display
    the new way creates everything on get, which I think is ok
     */

    get widget() {
        if (!this._widget) this._buildWidget();

        return this._widget;
    }

    get monthPicker() {
        return this._monthDisplay.picker;
    }

    get yearPicker() {
        return this._yearDisplay.picker;
    }

    get decadePicker() {
        return this._decadeDisplay.picker;
    }

    update() {
        if (!this._widget) return;
        if (this._hasDate())
            this._dateDisplay.update();
        if (this._hasTime())
            this._timeDisplay.update();
    }

    _buildWidget() {
        const template = document.createElement('div');
        //todo bootstrap, need to namespace classes
        template.classList.add('bootstrap-datetimepicker-widget');
        if (this.context._options.calendarWeeks)
            template.classList.add('tempusdominus-bootstrap-datetimepicker-widget-with-calendar-weeks');  //todo namespace

        const dateView = document.createElement('div');
        dateView.classList.add('datepicker');
        dateView.appendChild(this._dateDisplay.picker);

        const timeView = document.createElement('div');
        timeView.classList.add('timepicker');
        timeView.appendChild(this._timeDisplay.picker);

        const toolbar = document.createElement('li');
        toolbar.classList.add('picker-switch');
        if (this.context._options.collapse) toolbar.classList.add('accordion-toggle'); //todo bootstrap
        toolbar.appendChild(this._toolbar);

        /*if (!this.context._options.inline) { //todo restore this. for now I don't want the position stuff it adds
            template.classList.add('dropdown-menu'); //todo bootstrap
        }*/

        if (this.context.use24Hours) {
            template.classList.add('usetwentyfour');  //todo namespace
        }
        if ((this.input !== undefined && this.input.prop('readonly')) || this.context._options.readonly) {
            template.classList.add('bootstrap-datetimepicker-widget-readonly'); //todo namespace
        }
        if (this.context.validation.isEnabled('s') && !this.context.use24Hours) {
            template.classList.add('wider'); //todo namespace?
        }

        if (this.context._options.sideBySide && this._hasDate() && this._hasTime()) {
            template.classList.add('timepicker-sbs'); //todo namespace?
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
                li.classList.add('collapse'); //todo bootstrap
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
                li.classList.add('collapse'); //todo bootstrap
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

    _hasTime() {
        return this.context.validation.isEnabled('h') || this.context.validation.isEnabled('m') || this.context.validation.isEnabled('s');
    }

    _hasDate() {
        return this.context.validation.isEnabled('y') || this.context.validation.isEnabled('M') || this.context.validation.isEnabled('d');
    }

    get _toolbar() {
        return document.createElement('table');
    }

    /***
     *
     * @returns {Node}
     */
    get headTemplate() {
        const headTemplate = document.createElement('thead');
        const previous = document.createElement('th');
        previous.classList.add('prev');
        previous.setAttribute('data-action', 'previous');
        previous.appendChild(this.iconTag(this.context._options.icons.previous));
        headTemplate.appendChild(previous);

        const switcher = document.createElement('th');
        switcher.classList.add('picker-switch');
        switcher.setAttribute('data-action', 'pickerSwitch');
        switcher.setAttribute('colspan', this.context._options.calendarWeeks ? '6' : '5');
        headTemplate.appendChild(switcher);

        const next = document.createElement('th');
        next.classList.add('next');
        next.setAttribute('data-action', 'next');
        next.appendChild(this.iconTag(this.context._options.icons.next));
        headTemplate.appendChild(next);
        return headTemplate.cloneNode(true);
    }

    get contentTemplate() {
        const contentTemplate = document.createElement('tbody');
        const rowElement = document.createElement('tr');
        const td = document.createElement('td');
        td.setAttribute('colspan', this.context._options.calendarWeeks ? '6' : '5');
        rowElement.appendChild(td);
        contentTemplate.appendChild(rowElement);
        return contentTemplate.cloneNode(true);
    }

    iconTag(i) {
        const container = document.createElement('span')
        if (this.context._options.icons.type === 'sprites') {
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