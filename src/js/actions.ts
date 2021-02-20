import {DatePickerModes, Namespace} from './conts.js';
import {Unit} from './datetime';
import {TempusDominus} from './tempus-dominus';
import Collapse from './display/collapse';

export default class Actions {
    private context: TempusDominus;
    private collapse: Collapse;

    constructor(context: TempusDominus) {
        this.context = context;
        this.collapse = new Collapse();
    }

    do(e, action?) {
        const currentTarget = e.currentTarget;
        if (currentTarget.classList.contains(Namespace.Css.disabled)) return false;
        action = action || currentTarget.dataset.action;
        console.log('action', action);

        switch (action) {
            case ActionTypes.next:
            case ActionTypes.previous:
                const {NAV_FUNCTION, NAV_STEP} = DatePickerModes[this.context.currentViewMode];
                if (action === ActionTypes.next)
                    this.context._viewDate.manipulate(NAV_STEP, NAV_FUNCTION);
                else
                    this.context._viewDate.manipulate(NAV_STEP * -1, NAV_FUNCTION);
                this.context.display.updateDateView();
                this.context._viewUpdate(NAV_FUNCTION);
                break;
            case ActionTypes.pickerSwitch:
                this.context.display._showMode(1);
                break;
            case ActionTypes.selectMonth: //todo seems like these could be merged
                const month = +currentTarget.getAttribute('data-value');
                this.context._viewDate.month = month;

                if (this.context.currentViewMode === this.context.minViewModeNumber) {
                    this.context.dates._setValue(this.context._viewDate, this.context.dates.lastPickedIndex);
                    if (!this.context._options.inline) {
                        this.context.display.hide();
                    }
                } else {
                    this.context.display._showMode(-1);
                }
                this.context._viewUpdate(Unit.month);
                break;
            case ActionTypes.selectYear:
                const year = +currentTarget.getAttribute('data-value');
                this.context._viewDate.year = year;

                if (this.context.currentViewMode === this.context.minViewModeNumber) {
                    this.context.dates._setValue(this.context._viewDate, this.context.dates.lastPickedIndex);
                    if (!this.context._options.inline) {
                        this.context.display.hide();
                    }
                } else {
                    this.context.display._showMode(-1);
                }
                this.context._viewUpdate(Unit.year);
                break;
            case ActionTypes.selectDecade:
                const decadeYear = +currentTarget.getAttribute('data-value');
                this.context._viewDate.year = decadeYear;

                if (this.context.currentViewMode === this.context.minViewModeNumber) {
                    this.context.dates._setValue(this.context._viewDate, this.context.dates.lastPickedIndex);
                    if (!this.context._options.inline) {
                        this.context.display.hide();
                    }
                } else {
                    this.context.display._showMode(-1);
                }
                this.context._viewUpdate(Unit.year);
                break;
            case ActionTypes.selectDay:
                const day = this.context._viewDate.clone;
                if (currentTarget.classList.contains(Namespace.Css.old)) {
                    day.manipulate(-11, Unit.month);
                }
                if (currentTarget.classList.contains(Namespace.Css.new)) {
                    day.manipulate(1, Unit.month);
                }

                day.date = +currentTarget.innerText;
                let index = 0;
                if (this.context._options.allowMultidate) {
                    index = this.context.dates.pickedIndex(day, Unit.date);
                    if (index !== -1) {
                        this.context.dates._setValue(null, index); //deselect multidate
                    } else {
                        this.context.dates._setValue(day, this.context.dates.lastPickedIndex + 1);
                    }
                } else {
                    this.context.dates._setValue(day, this.context.dates.lastPickedIndex);
                }

                if (!this.context.display._hasTime() && !this.context._options.keepOpen &&
                    !this.context._options.inline && !this.context._options.allowMultidate) {
                    this.context.display.hide();
                }
                break;
            case ActionTypes.selectHour:

                break;
            case ActionTypes.selectMinute:

                break;
            case ActionTypes.selectSecond:

                break;
            case ActionTypes.incrementHours:

                break;
            case ActionTypes.incrementMinutes:

                break;
            case ActionTypes.incrementSeconds:

                break;
            case ActionTypes.decrementHours:

                break;
            case ActionTypes.decrementMinutes:

                break;
            case ActionTypes.decrementSeconds:

                break;
            case ActionTypes.togglePeriod:

                break;
            case ActionTypes.togglePicker:
                this.context.display.widget
                    .querySelectorAll(`.${Namespace.Css.dateContainer}, .${Namespace.Css.timeContainer}`)
                    .forEach((e: HTMLElement) => this.collapse.toggle(e));

                if (currentTarget.getAttribute('title') === this.context._options.localization.selectDate) {
                    currentTarget.setAttribute('title', this.context._options.localization.selectTime);
                    currentTarget.innerHTML = this.context.display.iconTag(this.context._options.display.icons.time).outerHTML;
                    this.context.display.updateDateView();
                } else {
                    currentTarget.setAttribute('title', this.context._options.localization.selectDate);
                    currentTarget.innerHTML = this.context.display.iconTag(this.context._options.display.icons.date).outerHTML;
                    this.context.display.updateTimeView();
                }
                break;
            case ActionTypes.showPicker:

                break;
            case ActionTypes.showHours:

                break;
            case ActionTypes.showMinutes:

                break;
            case ActionTypes.showSeconds:

                break;
            case ActionTypes.clear:

                break;
            case ActionTypes.close:

                break;
            case ActionTypes.today:

                break;
        }
    }
}

export enum ActionTypes {
    next = 'next',
    previous = 'previous',
    pickerSwitch = 'pickerSwitch',
    selectMonth = 'selectMonth',
    selectYear = 'selectYear',
    selectDecade = 'selectDecade',
    selectDay = 'selectDay',
    selectHour = 'selectHour',
    selectMinute = 'selectMinute',
    selectSecond = 'selectSecond',
    incrementHours = 'incrementHours',
    incrementMinutes = 'incrementMinutes',
    incrementSeconds = 'incrementSeconds',
    decrementHours = 'decrementHours',
    decrementMinutes = 'decrementMinutes',
    decrementSeconds = 'decrementSeconds',
    togglePeriod = 'togglePeriod',
    togglePicker = 'togglePicker',
    showPicker = 'showPicker',
    showHours = 'showHours',
    showMinutes = 'showMinutes',
    showSeconds = 'showSeconds',
    clear = 'clear',
    close = 'close',
    today = 'today'
}