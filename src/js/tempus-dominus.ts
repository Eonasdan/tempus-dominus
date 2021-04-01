import Display from './display/index';
import Validation from './validation';
import Dates from './dates';
import Actions, {ActionTypes} from './actions';
import {DefaultOptions} from './conts';
import {DateTime, Unit} from './datetime';
import Namespace from './namespace';
import Options from './options';

export class TempusDominus {
    options: Options;
    element: any;
    viewDate: DateTime;
    _input: HTMLInputElement;
    _toggle: HTMLElement;
    currentViewMode: number;
    unset: boolean;
    minViewModeNumber: number;
    display: Display;
    validation: Validation;
    dates: Dates;
    action: Actions;
    _notifyChangeEventContext: number;
    private _currentPromptTimeTimeout: any;

    constructor(element: HTMLElement, options: Options) {
        this.options = this.initializeOptions(options, DefaultOptions);
        this.element = element;
        this.viewDate = new DateTime();
        this.currentViewMode = null;
        this.unset = true;
        this.minViewModeNumber = 0;

        this.display = new Display(this);
        this.validation = new Validation(this);
        this.dates = new Dates(this);
        this.action = new Actions(this);

        this.initializeViewMode();
        this.initializeInput();
        this.initializeToggle();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     *
     * @param options
     * @param reset
     * @public
     */
    updateOptions(options, reset = false): void {
        if (reset)
            this.options = this.initializeOptions(options, DefaultOptions);
        else
            this.options = this.initializeOptions(options, this.options);
    }

    private initializeOptions(config: Options, mergeTo: Options): Options {
        const dateArray = (optionName: string, value, providedType: string) => {
            if (!Array.isArray(value)) {
                throw Namespace.ErrorMessages.typeMismatch(optionName, providedType, 'array of DateTime or Date');
            }
            for (let i = 0; i < value.length; i++) {
                let d = value[i];
                const dateTime = dateConversion(d, optionName);
                if (!dateTime) {
                    throw Namespace.ErrorMessages.typeMismatch(optionName, typeof d, 'DateTime or Date');
                }
                value[i] = dateTime;
            }
        }
        const numberArray = (optionName: string, value, providedType: string) => {
            if (!Array.isArray(value)) {
                throw Namespace.ErrorMessages.typeMismatch(optionName, providedType, 'array of numbers');
            }
            if (value.find(x => typeof x !== typeof 0)) console.log('throw an error');
            return;
        }
        const dateConversion = (d: any, optionName: string) => {
            if (typeof d === typeof '') {
                console.warn(Namespace.ErrorMessages.dateString);
            }

            const converted = this.dateTypeCheck(d);

            if (!converted) {
                throw Namespace.ErrorMessages.failedToParseDate(optionName, d);
            }
            return converted;
        }

        //the spread operator caused sub keys to be missing after merging
        //this is to fix that issue by using spread on the child objects first
        let path = '';
        const spread = (provided, defaultOption) => {
            Object.keys(provided).forEach(key => {
                let providedType = typeof provided[key];
                if (providedType === undefined) return;
                path += `.${key}`;
                let defaultType = typeof defaultOption[key];
                let value = provided[key];
                if (!value) return;//todo not sure if null checking here is right
                switch (key) {
                    case 'viewDate': {
                        const dateTime = dateConversion(value, 'viewDate');
                        if (dateTime !== undefined) {
                            provided[key] = dateTime;
                            break;
                        }
                        throw Namespace.ErrorMessages.typeMismatch('viewDate', providedType, 'DateTime or Date');
                    }
                    case 'minDate': {
                        const dateTime = dateConversion(value, 'restrictions.minDate');
                        if (dateTime !== undefined) {
                            provided[key] = dateTime;
                            break;
                        }
                        throw Namespace.ErrorMessages.typeMismatch('restrictions.minDate', providedType, 'DateTime or Date');
                    }
                    case 'maxDate': {
                        const dateTime = dateConversion(value, 'restrictions.maxDate');
                        if (dateTime !== undefined) {
                            provided[key] = dateTime;
                            break;
                        }
                        throw Namespace.ErrorMessages.typeMismatch('restrictions.maxDate', providedType, 'DateTime or Date');
                    }
                    case 'disabledHours':
                        numberArray('restrictions.disabledHours', value, providedType);
                        if (value.filter(x => x < 0 || x > 23))
                            throw Namespace.ErrorMessages.numbersOutOfRage('restrictions.disabledHours', 0, 23);
                        break;
                    case 'enabledHours':
                        numberArray('restrictions.enabledHours', value, providedType);
                        if (value.filter(x => x < 0 || x > 23))
                            throw Namespace.ErrorMessages.numbersOutOfRage('restrictions.enabledHours', 0, 23);
                        break;
                    case 'daysOfWeekDisabled':
                        numberArray(
                            'restrictions.daysOfWeekDisabled',
                            value,
                            providedType
                        );
                        if (value.filter(x => x < 0 || x > 6))
                            throw Namespace.ErrorMessages.numbersOutOfRage('restrictions.daysOfWeekDisabled', 0, 6);
                        break;
                    case 'enabledDates':
                        dateArray('restrictions.enabledDates', value, providedType);
                        break;
                    case 'disabledDates':
                        dateArray('restrictions.disabledDates', value, providedType);
                        break;
                    case 'disabledTimeIntervals':
                        dateArray(
                            'restrictions.disabledTimeIntervals',
                            value,
                            providedType
                        );
                        break;
                    default:
                        if (providedType !== defaultType) {
                            if (defaultType === typeof undefined) throw Namespace.ErrorMessages.unexpectedOption(path.substring(1));
                            throw Namespace.ErrorMessages.typeMismatch(path.substring(1), providedType, defaultType);
                        }
                        break;
                }

                if (typeof defaultOption[key] !== 'object') {
                    path = path.substring(0, path.lastIndexOf(`.${key}`));
                    return;
                }
                if (!Array.isArray(provided[key]) && provided[key] != null) {
                    spread(provided[key], defaultOption[key]);
                    path = path.substring(0, path.lastIndexOf(`.${key}`));
                    provided[key] = {...defaultOption[key], ...provided[key]};
                }
                path = path.substring(0, path.lastIndexOf(`.${key}`));
            });
        }
        spread(config, mergeTo);

        config = {
            ...mergeTo,
            ...config
        }

        if (config.display.inputFormat === undefined) {
            const components = config.display.components;
            config.display.inputFormat = {
                year: components.year ? 'numeric' : undefined,
                month: components.month ? '2-digit' : undefined,
                day: components.date ? '2-digit' : undefined,
                hour: components.hours ? components.useTwentyfourHour ? '2-digit' : 'numeric' : undefined,
                minute: components.minutes ? '2-digit' : undefined,
                second: components.seconds ? '2-digit' : undefined,
                hour12: !components.useTwentyfourHour
            };

        }

        return config
    }

    private initializeViewMode() {
        if (this.options.display.components.year) {
            this.minViewModeNumber = 2;
        }
        if (this.options.display.components.month) {
            this.minViewModeNumber = 1;
        }
        if (this.options.display.components.date) {
            this.minViewModeNumber = 0;
        }

        this.currentViewMode = Math.max(this.minViewModeNumber, this.currentViewMode);
    }

    notifyEvent(event: string, args?) {
        console.log(`notify: ${event}`, JSON.stringify(args, null, 2));
        if (event === Namespace.Events.CHANGE) {
            this._notifyChangeEventContext = this._notifyChangeEventContext || 0;
            this._notifyChangeEventContext++;
            if (
                (args.date && args.oldDate && args.date.isSame(args.oldDate))
                ||
                (!args.isClear && !args.date && !args.oldDate)
                ||
                (this._notifyChangeEventContext > 1)
            ) {
                this._notifyChangeEventContext = undefined;
                return;
            }
            this.handlePromptTimeIfNeeded(args);
        }

        const evt = new CustomEvent(event, args);
        this.element.dispatchEvent(evt);

        this._notifyChangeEventContext = void 0;
    }

    private initializeInput() {
        if (this.element.tagName == 'INPUT') {
            this._input = this.element as HTMLInputElement;
        } else {
            let query = this.element.dataset.targetInput;
            if (query == undefined || query == 'nearest') {
                this._input = this.element.querySelector('input');
            } else {
                this._input = this.element.querySelector(query);
            }
        }

        this._input?.addEventListener('change', (ev) => {
            let parsedDate = this.dateTypeCheck(this._input.value);
            console.log(parsedDate);

            if (parsedDate) {
                this.dates._setValue(parsedDate);
            }
            else {
                this.notifyEvent(Namespace.Events.ERROR, {
                    reason: Namespace.ErrorMessages.failedToParseInput,
                    date: parsedDate
                });
            }
        });
    }

    private initializeToggle() {
        let query = this.element.dataset.targetToggle;
        if (query == 'nearest') {
            query = '[data-toggle="datetimepicker"]';
        }
        this._toggle = query == undefined ? this.element : this.element.querySelector(query);
        this._toggle.addEventListener('click', () => this.display.toggle());
    }

    private dateTypeCheck(d: any): DateTime | null {
        if (d.constructor.name === 'DateTime') return d;
        if (d.constructor.name === 'Date') {
            return DateTime.convert(d);
        }
        if (typeof d === typeof '') {
            const dateTime = new DateTime(d);
            if (JSON.stringify(dateTime) === 'null') {
                return null;
            }
            return dateTime;
        }
        return null;
    }

    private handlePromptTimeIfNeeded(e) {
        if (this.options.promptTimeOnDateChange) {
            if (!e.oldDate && this.options.useCurrent) {
                // First time ever. If useCurrent option is set to true (default), do nothing
                // because the first date is selected automatically.
                return;
            } else if (
                e.oldDate &&
                e.date &&
                e.data.isSame(e.oldDate)
            ) {
                // Date didn't change (time did) or date changed because time did.
                return;
            }

            clearTimeout(this._currentPromptTimeTimeout);
            this._currentPromptTimeTimeout = setTimeout(() => {
                if (this.display.widget) {
                    this.display.widget.querySelector(`[data-action="${ActionTypes.togglePicker}"]`)[0].click();
                }
            }, this.options.promptTimeOnDateChangeTransitionDelay);
        }
    }

    /**
     *
     * @param {Unit} unit
     * @private
     */
    viewUpdate(unit: Unit) {
        this.notifyEvent(Namespace.Events.UPDATE, {
            change: unit,
            viewDate: this.viewDate.clone
        });
    }
}