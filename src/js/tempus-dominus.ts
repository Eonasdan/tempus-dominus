import Display from './display/index';
import Validation from './validation';
import Dates from './dates';
import Actions from './actions';
import { Default, Namespace, Options } from './conts';
import { DateTime, Unit } from './datetime';
import { threadId } from 'worker_threads';

export class TempusDominus {
    _options: Options;
    _element: HTMLElement;
    _input: HTMLInputElement;
    _viewDate: DateTime;
    currentViewMode: number;
    unset: boolean;
    minViewModeNumber: number;
    display: Display;
    validation: Validation;
    dates: Dates;
    action: Actions;

    constructor(element: HTMLElement, options: Options) {
        this._options = this.initializeOptions(options, Default);
        this._element = element;
        this._viewDate = new DateTime();
        this.currentViewMode = null;
        this.unset = true;
        this.minViewModeNumber = 0;

        this.display = new Display(this);
        this.validation = new Validation(this);
        this.dates = new Dates(this);
        this.action = new Actions(this);

        this.initializeViewMode();
        this.initializeInput();

        element.addEventListener('click', () => this.display.toggle());
    }


    // noinspection JSUnusedGlobalSymbols
    /**
     *
     * @param options
     * @public
     */
    updateOptions(options): void {
        this._options = this.initializeOptions(options, this._options);
    }

    private initializeOptions(config: Options, mergeTo: Options): Options {
        const dateArray = (optionName: string, value, providedType: string) => {
            if (!Array.isArray(value)) {
                throw Namespace.ErrorMessages.typeMismatch(optionName, providedType, 'array of DateTime or Date');
            }
            for (let i = 0; i < value.length; i++) {
                let d = value[i];
                const dateTime = dateConversion(d, optionName);
                if (dateTime !== undefined) {
                    value[i] = dateTime;
                    continue;
                }
                throw Namespace.ErrorMessages.typeMismatch(optionName, typeof d, 'DateTime or Date');
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
            if (d.constructor.name === 'DateTime') return d;
            if (d.constructor.name === 'Date') {
                return DateTime.convert(d);
            }
            if (typeof d === typeof '') {
                const dateTime = new DateTime(d);
                if (JSON.stringify(dateTime) === 'null') {
                    throw Namespace.ErrorMessages.failedToParseDate(optionName, d);
                }
                console.warn(Namespace.ErrorMessages.dateString);
                return dateTime;
            }
            return undefined;
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
                    provided[key] = { ...defaultOption[key], ...provided[key] };
                }
                path = path.substring(0, path.lastIndexOf(`.${key}`));
            });
        }
        spread(config, mergeTo);

        config = {
            ...mergeTo,
            ...config
        }

        return config
    }

    private initializeViewMode() {
        if (this._options.display.components.year) {
            this.minViewModeNumber = 2;
        }
        if (this._options.display.components.month) {
            this.minViewModeNumber = 1;
        }
        if (this._options.display.components.date) {
            this.minViewModeNumber = 0;
        }

        this.currentViewMode = Math.max(this.minViewModeNumber, this.currentViewMode);
    }

    private initializeInput() {
        if (this._element.tagName == 'INPUT') {
            this._input = this._element as HTMLInputElement;
        } else {
            let query = this._element.dataset.targetInput;
            if (query !== undefined) {
                if (query == 'nearest') {
                    this._input = this._element.querySelector('input');
                } else {
                    this._input = this._element.querySelector(query);
                }
            }
        }
    }

    _notifyEvent(config) {
        console.log('notify', JSON.stringify(config, null, 2));
    }


    /**
     *
     * @param {Unit} e
     * @private
     */
    _viewUpdate(e: Unit) {
        this._notifyEvent({
            type: Namespace.Events.UPDATE,
            change: e,
            viewDate: this._viewDate.clone
        });
    }
}