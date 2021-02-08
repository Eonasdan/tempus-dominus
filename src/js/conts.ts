import {Unit} from './datetime';

const Default = {
    restrictions: {
        minDate: false,
        maxDate: false,
        disabledDates: false,
        enabledDates: false,
        daysOfWeekDisabled: false,
        disabledTimeIntervals: false,
        disabledHours: false,
        enabledHours: false,
    },
    display: {
        icons: {
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
        collapse: true,
        sideBySide: false,
        calendarWeeks: false,
        viewMode: 'days',
        toolbarPlacement: 'default',
        buttons: {
            showToday: false,
            showClear: false,
            showClose: false
        },
        widgetPositioning: {
            horizontal: 'auto',
            vertical: 'auto'
        },
        components: {
            century: true,
            decades: true,
            year: true,
            month: true,
            date: true,
            hours: true,
            minutes: true,
            seconds: false,
            useTwentyfourHour: false
        }
    },
    stepping: 1,
    useCurrent: true,
    defaultDate: false,
    localization: { //todo plugin
        today: 'Go to today',
        clear: 'Clear selection',
        close: 'Close the picker',
        selectMonth: 'Select Month',
        previousMonth: 'Previous Month',
        nextMonth: 'Next Month',
        selectYear: 'Select Year',
        previousYear: 'Previous Year',
        nextYear: 'Next Year',
        selectDecade: 'Select Decade',
        previousDecade: 'Previous Decade',
        nextDecade: 'Next Decade',
        previousCentury: 'Previous Century',
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
        selectDate: 'Select Date',
        dayViewHeaderFormat: 'long'
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
    viewDate: false,
    allowMultidate: false,
    multidateSeparator: ', ',
    promptTimeOnDateChange: false,
    promptTimeOnDateChangeTransitionDelay: 200
};

class Namespace {
    static NAME = 'tempus-dominus';
    static VERSION = '6.0.0-alpha1';
    static DATA_KEY = 'td';
    static DATA_API_KEY = '.data-api';

    static Events = class {
        static KEY = `.${Namespace.DATA_KEY}`;
        static CHANGE = `hide${Namespace.Events.KEY}`
        static UPDATE = `update${Namespace.Events.KEY}`;
        static ERROR = `error${Namespace.Events.KEY}`;
        static SHOW = `show${Namespace.Events.KEY}`;
        static HIDE = `hide${Namespace.Events.KEY}`;
        static BLUR = `blur${Namespace.Events.KEY}`;
        static KEYUP = `keyup${Namespace.Events.KEY}`;
        static KEYDOWN = `keydown${Namespace.Events.KEY}`;
        static FOCUS = `focus${Namespace.Events.KEY}`;
        static CLICK_DATA_API = `click${Namespace.Events.KEY}${Namespace.DATA_API_KEY}`;
    }

    static Css = class {
        static widget = `${Namespace.NAME}-widget`;
        static switch = 'picker-switch';
        // todo the next several classes are to represent states of the picker that would
        // make it wider then usual and it seems like this could be cleaned up.
        static widgetCalendarWeeks = `${Namespace.Css.widget}-with-calendar-weeks`;
        static useTwentyfour = 'useTwentyfour';
        static wider = 'wider';
        static sideBySide = 'timepicker-sbs';
        static previous = 'previous';
        static next = 'next';

        static disabled = 'disabled';
        static old = 'old';
        static new = 'new';
        static active = 'active';
        //#region date container
        static dateContainer = 'date-container';
        static decadesContainer = `${Namespace.Css.dateContainer}-decades`;
        static decade = 'decade';
        static yearsContainer = `${Namespace.Css.dateContainer}-years`;
        static year = 'year';
        static monthsContainer = `${Namespace.Css.dateContainer}-months`;
        static month = 'month';
        static daysContainer = `${Namespace.Css.dateContainer}-days`;
        static day = 'day';
        static calendarWeeks = 'cw';
        static dayOfTheWeek = 'dow';
        static today = 'today';
        static weekend = 'weekend';
        //#endregion

        //#region time container

        static timeContainer = 'time-container';

        //#endregion

    }
}

const DatePickerModes = [{
    CLASS_NAME: Namespace.Css.daysContainer,
    NAV_FUNCTION: Unit.month,
    NAV_STEP: 1
}, {
    CLASS_NAME: Namespace.Css.monthsContainer,
    NAV_FUNCTION: Unit.year,
    NAV_STEP: 1
}, {
    CLASS_NAME: Namespace.Css.yearsContainer,
    NAV_FUNCTION: Unit.year,
    NAV_STEP: 10
}, {
    CLASS_NAME: Namespace.Css.decadesContainer,
    NAV_FUNCTION: Unit.year,
    NAV_STEP: 100
}];

export {Default, DatePickerModes, Namespace}