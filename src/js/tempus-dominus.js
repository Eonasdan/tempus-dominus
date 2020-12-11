import Display from "./display/index.js";
import Validation from "./validation.js";
import Dates from "./dates.js";
import Actions from "./actions.js";

let Default = {
    timeZone: '',
    format: false,//todo migrate to display:
    dayViewHeaderFormat: 'MMMM YYYY',//todo migrate to display:
    extraFormats: false,//todo migrate to display:
    stepping: 1,
    minDate: false, //todo migrate to a sub object e.g. restrictions: [ min, max....]
    maxDate: false, //todo migrate to restrictions:
    useCurrent: true,
    collapse: true,
    locale: '',//moment.locale(), //todo moment
    defaultDate: false,
    disabledDates: false,//todo migrate to restrictions:
    enabledDates: false,//todo migrate to restrictions:
    icons: { //todo plugin
        type: 'icons',
        time: 'fas fa-clock',
        date: 'fas fa-calendar',
        up: 'fas fa-arrow-up',
        down: 'fas fa-arrow-down',
        previous: 'fas fa-chevron-left',
        next: 'fas fa-chevron-right',
        today: 'fas fa-calendar-check',
        clear: 'fas fa-trash',
        close: 'fas fa-times'
    },
    tooltips: { //todo plugin
        today: 'Go to today',
        clear: 'Clear selection',
        close: 'Close the picker',
        selectMonth: 'Select Month',
        prevMonth: 'Previous Month',
        nextMonth: 'Next Month',
        selectYear: 'Select Year',
        prevYear: 'Previous Year',
        nextYear: 'Next Year',
        selectDecade: 'Select Decade',
        prevDecade: 'Previous Decade',
        nextDecade: 'Next Decade',
        prevCentury: 'Previous Century',
        nextCentury: 'Next Century',
        pickHour: 'Pick Hour',
        incrementHour: 'Increment Hour',
        decrementHour: 'Decrement Hour',
        pickMinute: 'Pick Minute',
        incrementMinute: 'Increment Minute',
        decrementMinute: 'Decrement Minute',
        pickSecond: 'Pick Second',
        incrementSecond: 'Increment Second',
        decrementSecond: 'Decrement Second',
        togglePeriod: 'Toggle Period',
        selectTime: 'Select Time',
        selectDate: 'Select Date'
    },
    useStrict: false, //todo moment
    sideBySide: false,//todo migrate to display:
    daysOfWeekDisabled: false,//todo migrate to restrictions:
    calendarWeeks: false,//todo migrate to display:
    viewMode: 'days',//todo migrate to display:
    toolbarPlacement: 'default',//todo migrate to display:
    buttons: {
        showToday: false,
        showClear: false,
        showClose: false
    },
    widgetPositioning: {
        horizontal: 'auto',
        vertical: 'auto'
    },
    widgetParent: null,
    readonly: false,
    ignoreReadonly: false,
    keepOpen: false,
    focusOnShow: true,
    inline: false,
    keepInvalid: false,
    keyBinds: { //todo plugin //todo jquery //todo moment
        up: function () {
            if (!this.widget) {
                return false;
            }
            const d = this._dates[0] || this.getMoment();
            if (this.widget.find('.datepicker').is(':visible')) {
                this.date(d.clone().subtract(7, 'd'));
            } else {
                this.date(d.clone().add(this.stepping(), 'm'));
            }
            return true;
        },
        down: function () {
            if (!this.widget) {
                this.show();
                return false;
            }
            const d = this._dates[0] || this.getMoment();
            if (this.widget.find('.datepicker').is(':visible')) {
                this.date(d.clone().add(7, 'd'));
            } else {
                this.date(d.clone().subtract(this.stepping(), 'm'));
            }
            return true;
        },
        'control up': function () {
            if (!this.widget) {
                return false;
            }
            const d = this._dates[0] || this.getMoment();
            if (this.widget.find('.datepicker').is(':visible')) {
                this.date(d.clone().subtract(1, 'y'));
            } else {
                this.date(d.clone().add(1, 'h'));
            }
            return true;
        },
        'control down': function () {
            if (!this.widget) {
                return false;
            }
            const d = this._dates[0] || this.getMoment();
            if (this.widget.find('.datepicker').is(':visible')) {
                this.date(d.clone().add(1, 'y'));
            } else {
                this.date(d.clone().subtract(1, 'h'));
            }
            return true;
        },
        left: function () {
            if (!this.widget) {
                return false;
            }
            const d = this._dates[0] || this.getMoment();
            if (this.widget.find('.datepicker').is(':visible')) {
                this.date(d.clone().subtract(1, 'd'));
            }
            return true;
        },
        right: function () {
            if (!this.widget) {
                return false;
            }
            const d = this._dates[0] || this.getMoment();
            if (this.widget.find('.datepicker').is(':visible')) {
                this.date(d.clone().add(1, 'd'));
            }
            return true;
        },
        pageUp: function () {
            if (!this.widget) {
                return false;
            }
            const d = this._dates[0] || this.getMoment();
            if (this.widget.find('.datepicker').is(':visible')) {
                this.date(d.clone().subtract(1, 'M'));
            }
            return true;
        },
        pageDown: function () {
            if (!this.widget) {
                return false;
            }
            const d = this._dates[0] || this.getMoment();
            if (this.widget.find('.datepicker').is(':visible')) {
                this.date(d.clone().add(1, 'M'));
            }
            return true;
        },
        enter: function () {
            if (!this.widget) {
                return false;
            }
            this.hide();
            return true;
        },
        escape: function () {
            if (!this.widget) {
                return false;
            }
            this.hide();
            return true;
        },
        'control space': function () {
            if (!this.widget) {
                return false;
            }
            if (this.widget.find('.timepicker').is(':visible')) {
                this.widget.find('.btn[data-action="togglePeriod"]').click();
            }
            return true;
        },
        t: function () {
            if (!this.widget) {
                return false;
            }
            this.date(this.getMoment());
            return true;
        },
        'delete': function () {
            if (!this.widget) {
                return false;
            }
            this.clear();
            return true;
        }
    },
    debug: false,
    allowInputToggle: false,
    disabledTimeIntervals: false,
    disabledHours: false,//todo migrate to restrictions:
    enabledHours: false,//todo migrate to restrictions:
    viewDate: false,
    allowMultidate: false,
    multidateSeparator: ', ',
    updateOnlyThroughDateOption: false,
    promptTimeOnDateChange: false,
    promptTimeOnDateChangeTransitionDelay: 200
};


export default class TempusDominus {

    constructor(element, options) {
        this._options = this._getOptions(options);
        this._element = element;
        this._viewDate = dayjs();

        this.display = new Display(this);
        this.validation = new Validation(this);
        this.dates = new Dates(this);
        this.action = new Actions(this);

        //temp
        this.dates.add(dayjs());

        this.display._buildWidget();
        this.display.update();

                //date calendar
        //element.appendChild(this.display.datePicker);
        //element.appendChild(this.display.monthPicker);
        //element.appendChild(this.display.yearPicker);
        //element.appendChild(this.display.decadePicker);
        //element.appendChild(this.display.timePicker);
        element.appendChild(this.display.widget);

        Array.from(this.display.widget.querySelectorAll('[data-action]')).forEach(element => element.addEventListener('click', this.action.do));
    }

    _getOptions(config) {
        config = {
            ...Default,
            ...config
        }
        //todo missing Feather defaults
        //typeCheckConfig(NAME, config, DefaultType) //todo after the default structure gets changed, we can provide a object with value types
        return config
    }
}