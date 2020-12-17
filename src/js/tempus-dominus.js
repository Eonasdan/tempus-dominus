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
        this._viewDate = DateTime.today;
        this.currentViewMode = null;
        this.unset = true;
        this.MinViewModeNumber = 0;

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

    _initFormatting() {
        const format = this._options.format || 'L LT', self = this;

        this.actualFormat = format.replace(/(\[[^\[]*])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g, function (formatInput) {
            return ((self.isInitFormatting && self._options.date === null
                ? self.getMoment() //todo moment
                : self._dates[0]).localeData().longDateFormat(formatInput)) || formatInput; //todo taking the first date should be ok
        });

        this.parseFormats = this._options.extraFormats ? this._options.extraFormats.slice() : [];
        if (this.parseFormats.indexOf(format) < 0 && this.parseFormats.indexOf(this.actualFormat) < 0) {
            this.parseFormats.push(this.actualFormat);
        }

        this.use24Hours = this.actualFormat.toLowerCase().indexOf('a') < 1 && this.actualFormat.replace(/\[.*?]/g, '').indexOf('h') < 1;

        if (this.validation._isEnabled('y')) {
            this.MinViewModeNumber = 2;
        }
        if (this.validation._isEnabled('M')) {
            this.MinViewModeNumber = 1;
        }
        if (this.validation._isEnabled('d')) {
            this.MinViewModeNumber = 0;
        }

        this.currentViewMode = Math.max(this.MinViewModeNumber, this.currentViewMode);

        if (!this.unset) {
            this._setValue(this._dates[0], 0);
        }
    }
}