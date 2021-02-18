import Display from './display/index';
import Validation from './validation';
import Dates from './dates';
import Actions from './actions';
import {Default, Namespace} from './conts';
import {DateTime, Unit} from './datetime';
import EventHandler from './dom/event-handler';

export class TempusDominus {
    _options: any;
    private _element: any;
    _viewDate: DateTime;
    currentViewMode: number;
    unset: boolean;
    minViewModeNumber: number;
    display: Display;
    validation: Validation;
    dates: Dates;
    action: Actions;

    constructor(element, options) {
        this._options = this._getOptions(options);
        this._element = element;
        this._viewDate = new DateTime();
        this.currentViewMode = null;
        this.unset = true;
        this.minViewModeNumber = 0;

        this.display = new Display(this);
        this.validation = new Validation(this);
        this.dates = new Dates(this);
        this.action = new Actions(this);

        //#region temp - REMOVE THIS STUFF
        //this.dates.add(new DateTime());
        //#endregion

        this._initFormatting();

        this.currentViewMode = 0; //todo temp

        this.display.show();

        element.appendChild(this.display.widget);

        this.display.widget.querySelectorAll('[data-action]')
            .forEach(element => element.addEventListener('click', (e) => {
                this.action.do(e);
            }));
    }

    _getOptions(config) {
        //the spread operator caused sub keys to be missing after merging
        //this is to fix that issue by using spread on the child objects first
        const spread = (left, right) => {
            Object.keys(left).forEach(key => {
                if (typeof right[key] !== 'object') return;
                spread(left[key], right[key]);
                left[key] = {...right[key], ...left[key]};
            });
        }
        spread(config, Default);

        config = {
            ...Default,
            ...config
        }

        //typeCheckConfig(NAME, config, DefaultType) //todo
        return config
    }

    _initFormatting() {
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