import Display from './display/index.js';
import Validation from './validation.js';
import Dates from './dates.js';
import Actions from './actions.js';
import {Default} from "./conts.js";
import DateTime from "./datetime.js";

export default class TempusDominus {

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

        //temp
        this.dates.add(new DateTime());

        this.display._buildWidget();
        this.display.update();

        //date calendar
        //element.appendChild(this.display.datePicker);
        //element.appendChild(this.display.monthPicker);
        //element.appendChild(this.display.yearPicker);
        //element.appendChild(this.display.decadePicker);
        //element.appendChild(this.display.timePicker);
        element.appendChild(this.display.widget);

        this.display.widget.querySelectorAll('[data-action]').forEach(element => element.addEventListener('click', this.action.do));
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

    _initFormatting() {
        if (this._options.display.components.year) {
            this.minViewModeNumber = 2;
        }
        if (this._options.display.components.month) {
            this.minViewModeNumber = 1;
        }
        if (this._options.display.components.day) {
            this.minViewModeNumber = 0;
        }

        this.currentViewMode = Math.max(this.minViewModeNumber, this.currentViewMode);
    }
}