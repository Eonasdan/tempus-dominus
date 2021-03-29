import { DateTime, Unit } from './datetime';

interface Options {
    restrictions: {
        minDate: DateTime;
        maxDate: DateTime;
        enabledDates: DateTime[];
        disabledDates: DateTime[];
        enabledHours: number[];
        disabledHours: number[];
        disabledTimeIntervals: DateTime[];
        daysOfWeekDisabled: number[];
    };
    display: {
        toolbarPlacement: 'top' | 'bottom' | 'default';
        widgetPositioning: { horizontal: string; vertical: string };
        components: {
            date: boolean;
            century: boolean;
            hours: boolean;
            seconds: boolean;
            month: boolean;
            year: boolean;
            minutes: boolean;
            decades: boolean;
            useTwentyfourHour: boolean;
        };
        buttons: { today: boolean; close: boolean; clear: boolean };
        calendarWeeks: boolean;
        icons: {
            date: string;
            next: string;
            previous: string;
            today: string;
            clear: string;
            time: string;
            up: string;
            type: 'icons' | 'sprites';
            down: string;
            close: string;
        };
        viewMode: 'times' | 'days';
        collapse: boolean;
        sideBySide: boolean;
    };
    stepping: number;
    useCurrent: boolean;
    defaultDate: boolean;
    localization: {
        nextMonth: string;
        pickHour: string;
        incrementSecond: string;
        nextDecade: string;
        selectDecade: string;
        dayViewHeaderFormat: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow';
        decrementHour: string;
        selectDate: string;
        incrementHour: string;
        previousCentury: string;
        decrementSecond: string;
        today: string;
        previousMonth: string;
        selectYear: string;
        pickSecond: string;
        nextCentury: string;
        close: string;
        incrementMinute: string;
        selectTime: string;
        clear: string;
        togglePeriod: string;
        selectMonth: string;
        decrementMinute: string;
        pickMinute: string;
        nextYear: string;
        previousYear: string;
        previousDecade: string;
    };
    readonly: boolean;
    ignoreReadonly: boolean;
    keepOpen: boolean;
    focusOnShow: boolean;
    inline: boolean;
    keepInvalid: boolean;
    keyBinds: {
        'control down': () => boolean;
        pageDown: () => boolean;
        'control up': () => boolean;
        right: () => boolean;
        pageUp: () => boolean;
        down: () => boolean;
        delete: () => boolean;
        t: () => boolean;
        left: () => boolean;
        up: () => boolean;
        enter: () => boolean;
        'control space': () => boolean;
        escape: () => boolean;
    };
    debug: boolean;
    allowInputToggle: boolean;
    viewDate: DateTime;
    allowMultidate: boolean;
    multidateSeparator: string;
    promptTimeOnDateChange: boolean;
    promptTimeOnDateChangeTransitionDelay: number;
}

const DefaultOptions: Options = {
    restrictions: {
        minDate: undefined,
        maxDate: undefined,
        disabledDates: [],
        enabledDates: [],
        daysOfWeekDisabled: [],
        disabledTimeIntervals: [],
        disabledHours: [],
        enabledHours: [],
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
            close: 'fas fa-times',
        },
        collapse: true,
        sideBySide: false,
        calendarWeeks: false,
        viewMode: 'days',
        toolbarPlacement: 'default',
        buttons: {
            today: false,
            clear: false,
            close: false,
        },
        widgetPositioning: {
            horizontal: 'auto',
            vertical: 'auto',
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
            useTwentyfourHour: false,
        },
    },
    stepping: 1,
    useCurrent: true,
    defaultDate: false,
    localization: {
        //todo plugin
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
        dayViewHeaderFormat: 'long',
    },
    readonly: false,
    ignoreReadonly: false,
    keepOpen: false,
    focusOnShow: true,
    inline: false,
    keepInvalid: false,
    keyBinds: {
        //todo plugin //todo jquery //todo moment
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
        delete: function () {
            if (!this.widget) {
                return false;
            }
            this.clear();
            return true;
        },
    },
    debug: false,
    allowInputToggle: false,
    viewDate: new DateTime(),
    allowMultidate: false,
    multidateSeparator: ', ',
    promptTimeOnDateChange: false,
    promptTimeOnDateChangeTransitionDelay: 200,
};

//this is not the way I want this to stay but nested classes seemed to blown up once its compiled.
const NAME = 'tempus-dominus';
const VERSION = '6.0.0-alpha1';
const DATA_KEY = 'td';
const DATA_API_KEY = '.data-api';

class Events {
    KEY = `.${DATA_KEY}`;
    CHANGE = `change${this.KEY}`;
    UPDATE = `update${this.KEY}`;
    ERROR = `error${this.KEY}`;
    SHOW = `show${this.KEY}`;
    HIDE = `hide${this.KEY}`;
    BLUR = `blur${this.KEY}`;
    KEYUP = `keyup${this.KEY}`;
    KEYDOWN = `keydown${this.KEY}`;
    FOCUS = `focus${this.KEY}`;
    CLICK_DATA_API = `click${this.KEY}${DATA_API_KEY}`;
    clickAction = `click${this.KEY}.action`;
}

class Css {
    widget = `${NAME}-widget`;
    switch = 'picker-switch';
    // todo the next several classes are to represent states of the picker that would
    // make it wider then usual and it seems like this could be cleaned up.
    widgetCalendarWeeks = `${this.widget}-with-calendar-weeks`;
    useTwentyfour = 'useTwentyfour';
    wider = 'wider';
    sideBySide = 'timepicker-sbs';

    previous = 'previous';
    next = 'next';
    disabled = 'disabled';
    old = 'old';
    new = 'new';
    active = 'active';
    separator = 'separator';
    //#region date container
    dateContainer = 'date-container';
    decadesContainer = `${this.dateContainer}-decades`;
    decade = 'decade';
    yearsContainer = `${this.dateContainer}-years`;
    year = 'year';
    monthsContainer = `${this.dateContainer}-months`;
    month = 'month';
    daysContainer = `${this.dateContainer}-days`;
    day = 'day';
    calendarWeeks = 'cw';
    dayOfTheWeek = 'dow';
    today = 'today';
    weekend = 'weekend';
    //#endregion

    //#region time container

    timeContainer = 'time-container';
    clockContainer = `${this.timeContainer}-clock`;
    hourContainer = `${this.timeContainer}-hour`;
    minuteContainer = `${this.timeContainer}-minute`;
    secondContainer = `${this.timeContainer}-second`;

    hour = 'hour';
    minute = 'minute';
    second = 'second';

    //#endregion

    //#region collapse

    show = 'show';
    collapsing = 'td-collapsing';
    collapse = 'td-collapse';

    //#endregion
}

class ErrorMessages {
    //#region out to console
    unexpectedOption(optionName: string) {
        return `TD: Unexpected option: ${optionName} does not match a known option.`;
    }

    typeMismatch(optionName: string, badType: string, expectedType: string) {
        return `TD: Mismatch types: ${optionName} has a type of ${badType} instead of the required ${expectedType}`;
    }

    dateString = 'TD: Using a string for date options is not recommended unless you specify an ISO string.';

    numbersOutOfRage(optionName: string, lower: number, upper: number) {
        return `'TD: ${optionName} expected an array of number between ${lower} and ${upper}.'`
    }

    failedToParseDate(optionName: string, date: any) {
        return `TD: Could not correctly parse "${date}" to a date for option ${optionName}.`
    }

    //#endregion

    //#region used with notify.error
    failedToSetInvalidDate = 'Failed to set invalid date';
    //#endregion
}

class Namespace {
    static NAME = NAME;
    static VERSION = VERSION;
    static DATA_KEY = DATA_KEY;
    static DATA_API_KEY = DATA_API_KEY;

    static Events = new Events();

    static Css = new Css();

    static ErrorMessages = new ErrorMessages();
}

const DatePickerModes = [
    {
        CLASS_NAME: Namespace.Css.daysContainer,
        NAV_FUNCTION: Unit.month,
        NAV_STEP: 1,
    },
    {
        CLASS_NAME: Namespace.Css.monthsContainer,
        NAV_FUNCTION: Unit.year,
        NAV_STEP: 1,
    },
    {
        CLASS_NAME: Namespace.Css.yearsContainer,
        NAV_FUNCTION: Unit.year,
        NAV_STEP: 10,
    },
    {
        CLASS_NAME: Namespace.Css.decadesContainer,
        NAV_FUNCTION: Unit.year,
        NAV_STEP: 100,
    },
];

export { DefaultOptions, DatePickerModes, Namespace, Options };
