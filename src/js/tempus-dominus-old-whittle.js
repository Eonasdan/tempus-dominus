/**
 * --------------------------------------------------------------------------
 * Tempus Dominus (v6.0.0-alpha1)
 * Licensed under MIT (https://github.com/eonasdan/tempus-dominus/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


const TempusDominus = ($ => {
//#region Constants
    const NAME = 'datetimepicker';//'tempus-dominus' todo
    const VERSION = '6.0.0-alpha1';
    const DATA_KEY = 'datetimepicker';//todo 'td'
    const EVENT_KEY = `.${DATA_KEY}`
    const DATA_API_KEY = '.data-api'

    const EVENT_CHANGE = `hide${EVENT_KEY}`
    const EVENT_ERROR = `error${EVENT_KEY}`
    const EVENT_UPDATE = `update${EVENT_KEY}`;
    const EVENT_SHOW = `show${EVENT_KEY}`;
    const EVENT_HIDE = `hide${EVENT_KEY}`;
    const EVENT_BLUR = `blur${EVENT_KEY}`;
    const EVENT_KEYUP = `keyup${EVENT_KEY}`;
    const EVENT_KEYDOWN = `keydown${EVENT_KEY}`;
    const EVENT_FOCUS = `focus${EVENT_KEY}`;
    const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;

    const
        KeyMap = {
            'up': 38,
            38: 'up',
            'down': 40,
            40: 'down',
            'left': 37,
            37: 'left',
            'right': 39,
            39: 'right',
            'tab': 9,
            9: 'tab',
            'escape': 27,
            27: 'escape',
            'enter': 13,
            13: 'enter',
            'pageUp': 33,
            33: 'pageUp',
            'pageDown': 34,
            34: 'pageDown',
            'shift': 16,
            16: 'shift',
            'control': 17,
            17: 'control',
            'space': 32,
            32: 'space',
            't': 84,
            84: 't',
            'delete': 46,
            46: 'delete'
        };

//#endregion

    class TempusDominus {
        constructor(element, options) {
            this._element = element;
            //todo seems like some opportunity for cleanup
            this._dates = [];
            this._datesFormatted = [];
            this._viewDate = null;
            this.unset = true;
            this.component = false;
            this.widget = false;
            this.use24Hours = null;
            this.actualFormat = null;
            this.parseFormats = null;
            this.currentViewMode = null;
            this.MinViewModeNumber = 0;
            this.isInitFormatting = false;
            this.isInit = false;
            this.isDateUpdateThroughDateOptionFromClientCode = false;
            this.hasInitDate = false;
            this.initDate = void 0;
            this._notifyChangeEventContext = void 0;
            this._currentPromptTimeTimeout = null;

            this._int();
        }

        //#region Private

        _areSameDates(a, b) {
            const format = this._format();
            return a && b && (a.isSame(b) || moment(a.format(format), format).isSame(moment(b.format(format), format))); //todo moment
        }

        _notifyEvent(e) { //todo migrate to event handler?
            if (e.type === EVENT_CHANGE) {
                this._notifyChangeEventContext = this._notifyChangeEventContext || 0;
                this._notifyChangeEventContext++;
                if (
                    (e.date && this._areSameDates(e.date, e.oldDate))
                    ||
                    (!e.isClear && !e.date && !e.oldDate)
                    ||
                    (this._notifyChangeEventContext > 1)
                ) {
                    this._notifyChangeEventContext = void 0;
                    return;
                }
                this._handlePromptTimeIfNeeded(e);
            }
            this._element.trigger(e); //todo jquery
            this._notifyChangeEventContext = void 0;
        }

        _handlePromptTimeIfNeeded(e) {
            if (this._options.promptTimeOnDateChange) {
                if (!e.oldDate && this._options.useCurrent) {
                    // First time ever. If useCurrent option is set to true (default), do nothing
                    // because the first date is selected automatically.
                    return;
                } else if (
                    e.oldDate &&
                    e.date &&
                    (
                        (e.oldDate.format('YYYY-MM-DD') === e.date.format('YYYY-MM-DD')) //todo moment
                        ||
                        (
                            e.oldDate.format('YYYY-MM-DD') !== e.date.format('YYYY-MM-DD')
                            &&
                            e.oldDate.format('HH:mm:ss') !== e.date.format('HH:mm:ss')
                        )
                    )
                ) {
                    // Date didn't change (time did) or date changed because time did.
                    return;
                }

                const that = this;
                clearTimeout(this._currentPromptTimeTimeout);
                this._currentPromptTimeTimeout = setTimeout(function () {
                    if (that.widget) {
                        that.widget.find('[data-action="togglePicker"]').click(); //todo jquery
                    }
                }, this._options.promptTimeOnDateChangeTransitionDelay);
            }
        }



        _parseInputDate(inputDate, {isPickerShow = false} = {}) {
            if (this._options.parseInputDate === undefined || isPickerShow) {
                if (!moment.isMoment(inputDate)) { //todo moment
                    inputDate = this.getMoment(inputDate);
                }
            } else {
                inputDate = this._options.parseInputDate(inputDate);
            }
            //inputDate.locale(this.options.locale);
            return inputDate;
        }

        _keydown(e) {
            let handler = null,
                index,
                index2,
                keyBindKeys,
                allModifiersPressed;
            const pressedKeys = [],
                pressedModifiers = {},
                currentKey = e.which,
                pressed = 'p';

            keyState[currentKey] = pressed;

            for (index in keyState) { //todo cleanup
                if (keyState.hasOwnProperty(index) && keyState[index] === pressed) {
                    pressedKeys.push(index);
                    if (parseInt(index, 10) !== currentKey) {
                        pressedModifiers[index] = true;
                    }
                }
            }

            for (index in this._options.keyBinds) {
                if (this._options.keyBinds.hasOwnProperty(index) && typeof this._options.keyBinds[index] === 'function') {
                    keyBindKeys = index.split(' ');
                    if (keyBindKeys.length === pressedKeys.length && KeyMap[currentKey] === keyBindKeys[keyBindKeys.length - 1]) {
                        allModifiersPressed = true;
                        for (index2 = keyBindKeys.length - 2; index2 >= 0; index2--) {
                            if (!(KeyMap[keyBindKeys[index2]] in pressedModifiers)) {
                                allModifiersPressed = false;
                                break;
                            }
                        }
                        if (allModifiersPressed) {
                            handler = this._options.keyBinds[index];
                            break;
                        }
                    }
                }
            }

            if (handler) {
                if (handler.call(this)) {
                    e.stopPropagation();
                    e.preventDefault();
                }
            }
        }

        _keyup(e) {
            keyState[e.which] = 'r';
            if (keyPressHandled[e.which]) {
                keyPressHandled[e.which] = false;
                e.stopPropagation();
                e.preventDefault();
            }
        }

        _place(e) {//todo replace with popper2
            let self = (e && e.data && e.data.picker) || this, vertical = self._options.widgetPositioning.vertical,
                horizontal = self._options.widgetPositioning.horizontal,
                parent;
            const position = (self.component && self.component.length ? self.component : self._element).position(),//todo jquery
                offset = (self.component && self.component.length ? self.component : self._element).offset();//todo jquery
            if (self._options.widgetParent) {
                parent = self._options.widgetParent.append(self.widget);//todo jquery
            } else if (self._element.is('input')) {//todo jquery
                parent = self._element.after(self.widget).parent();//todo jquery
            } else if (self._options.inline) {
                parent = self._element.append(self.widget);//todo jquery
                return;
            } else {
                parent = self._element;
                self._element.children().first().after(self.widget);//todo jquery
            }

            // Top and bottom logic
            if (vertical === 'auto') {
                //noinspection JSValidateTypes
                //todo jquery
                if (offset.top + self.widget.height() * 1.5 >= $(window).height() + $(window).scrollTop() && self.widget.height() + self._element.outerHeight() < offset.top) {
                    vertical = 'top';
                } else {
                    vertical = 'bottom';
                }
            }

            // Left and right logic
            if (horizontal === 'auto') {
                if (parent.width() < offset.left + self.widget.outerWidth() / 2 && offset.left + self.widget.outerWidth() > $(window).width()) {//todo jquery
                    horizontal = 'right';
                } else {
                    horizontal = 'left';
                }
            }

            if (vertical === 'top') {//todo jquery
                self.widget.addClass('top').removeClass('bottom');
            } else {
                self.widget.addClass('bottom').removeClass('top');
            }

            if (horizontal === 'right') {//todo jquery
                self.widget.addClass('float-right');
            } else {
                self.widget.removeClass('float-right');
            }

            // find the first parent element that has a relative css positioning
            if (parent.css('position') !== 'relative') {//todo jquery
                parent = parent.parents().filter(function () {
                    return $(this).css('position') === 'relative';
                }).first();
            }

            if (parent.length === 0) {
                throw new Error('datetimepicker component should be placed within a relative positioned container');
            }

            self.widget.css({//todo jquery
                top: vertical === 'top' ? 'auto' : position.top + self._element.outerHeight() + 'px',
                bottom: vertical === 'top' ? parent.outerHeight() - (parent === self._element ? 0 : position.top) + 'px' : 'auto',
                left: horizontal === 'left' ? (parent === self._element ? 0 : position.left) + 'px' : 'auto',
                right: horizontal === 'left' ? 'auto' : parent.outerWidth() - self._element.outerWidth() - (parent === self._element ? 0 : position.left) + 'px'
            });
        }



        //#endregion

        //#region Public




        //todo seems like all these options setter/getters could be cleaned up
        //could use bootstraps utility to verify type requirements and then
        //move all to one function e.g. option('readonly', value)
        readonly(readonly) {
            if (arguments.length === 0) {
                return this._options.readonly;
            }
            if (typeof readonly !== 'boolean') {
                throw new TypeError('readonly() expects a boolean parameter');
            }
            this._options.readonly = readonly;
            if (this.input !== undefined) {
                this.input.prop('readonly', this._options.readonly); //todo jquery
            }
            if (this.widget) {
                this.hide();
                this.show();
            }
        }

        ignoreReadonly(ignoreReadonly) {
            if (arguments.length === 0) {
                return this._options.ignoreReadonly;
            }
            if (typeof ignoreReadonly !== 'boolean') {
                throw new TypeError('ignoreReadonly() expects a boolean parameter');
            }
            this._options.ignoreReadonly = ignoreReadonly;
        }

        date(newDate, index) {
            index = index || 0;
            if (arguments.length === 0) {
                if (this.unset) {
                    return null;
                }
                if (this._options.allowMultidate) {
                    return this._dates.join(this._options.multidateSeparator);
                } else {
                    return this._dates[index].clone();
                }
            }

            if (newDate !== null && typeof newDate !== 'string' && !moment.isMoment(newDate) && !(newDate instanceof Date)) {  //todo moment
                throw new TypeError('date() parameter must be one of [null, string, moment or Date]');
            }

            function isValidDateTimeStr(str) { //todo do I want this scooped here?
                function isValidDate(date) {
                    return Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date.getTime());
                }

                return isValidDate(new Date(str));
            }

            if (typeof newDate === 'string' && isValidDateTimeStr(newDate)) {
                newDate = new Date(newDate);
            }

            this._setValue(newDate === null ? null : this._parseInputDate(newDate), index);
        }

        updateOnlyThroughDateOption(updateOnlyThroughDateOption) {
            if (typeof updateOnlyThroughDateOption !== 'boolean') {
                throw new TypeError('updateOnlyThroughDateOption() expects a boolean parameter');
            }

            this._options.updateOnlyThroughDateOption = updateOnlyThroughDateOption;
        }

        dayViewHeaderFormat(newFormat) {
            if (arguments.length === 0) {
                return this._options.dayViewHeaderFormat;
            }

            if (typeof newFormat !== 'string') {
                throw new TypeError('dayViewHeaderFormat() expects a string parameter');
            }

            this._options.dayViewHeaderFormat = newFormat;
        }

        disabledDates(dates) {
            if (arguments.length === 0) {
                return this._options.disabledDates ? $.extend({}, this._options.disabledDates) : this._options.disabledDates; //todo jquery
            }

            if (!dates) {
                this._options.disabledDates = false;
                this._update();
                return true;
            }
            if (!(dates instanceof Array)) {
                throw new TypeError('disabledDates() expects an array parameter');
            }
            this._options.disabledDates = this._indexGivenDates(dates);
            this._options.enabledDates = false;
            this._update();
        }

        enabledDates(dates) {
            if (arguments.length === 0) {
                return this._options.enabledDates ? $.extend({}, this._options.enabledDates) : this._options.enabledDates; //todo jquery
            }

            if (!dates) {
                this._options.enabledDates = false;
                this._update();
                return true;
            }
            if (!(dates instanceof Array)) {
                throw new TypeError('enabledDates() expects an array parameter');
            }
            this._options.enabledDates = this._indexGivenDates(dates);
            this._options.disabledDates = false;
            this._update();
        }

        daysOfWeekDisabled(daysOfWeekDisabled) {
            if (arguments.length === 0) {
                return this._options.daysOfWeekDisabled.splice(0);
            }

            if (typeof daysOfWeekDisabled === 'boolean' && !daysOfWeekDisabled) {
                this._options.daysOfWeekDisabled = false;
                this._update();
                return true;
            }

            if (!(daysOfWeekDisabled instanceof Array)) {
                throw new TypeError('daysOfWeekDisabled() expects an array parameter');
            }
            this._options.daysOfWeekDisabled = daysOfWeekDisabled.reduce(function (previousValue, currentValue) {
                currentValue = parseInt(currentValue, 10);
                if (currentValue > 6 || currentValue < 0 || isNaN(currentValue)) {
                    return previousValue;
                }
                if (previousValue.indexOf(currentValue) === -1) {
                    previousValue.push(currentValue);
                }
                return previousValue;
            }, []).sort();
            if (this._options.useCurrent && !this._options.keepInvalid) {
                for (let i = 0; i < this._dates.length; i++) {
                    let tries = 0;
                    while (!this._isValid(this._dates[i], 'd')) {
                        this._dates[i].add(1, 'd');
                        if (tries === 31) {
                            throw 'Tried 31 times to find a valid date';
                        }
                        tries++;
                    }
                    this._setValue(this._dates[i], i);
                }
            }
            this._update();
        }

        maxDate(maxDate) {
            if (arguments.length === 0) {
                return this._options.maxDate ? this._options.maxDate.clone() : this._options.maxDate; //todo moment
            }

            if (typeof maxDate === 'boolean' && maxDate === false) {
                this._options.maxDate = false;
                this._update();
                return true;
            }

            if (typeof maxDate === 'string') {
                if (maxDate === 'now' || maxDate === 'moment') {
                    maxDate = this.getMoment();
                }
            }

            const parsedDate = this._parseInputDate(maxDate);

            if (!parsedDate.isValid()) { //todo moment
                throw new TypeError(`maxDate() Could not parse date parameter: ${maxDate}`);
            }
            if (this._options.minDate && parsedDate.isBefore(this._options.minDate)) { //todo moment
                throw new TypeError(`maxDate() date parameter is before this.options.minDate: ${parsedDate.format(this.actualFormat)}`);
            }
            this._options.maxDate = parsedDate;
            for (let i = 0; i < this._dates.length; i++) {
                if (this._options.useCurrent && !this._options.keepInvalid && this._dates[i].isAfter(maxDate)) {
                    this._setValue(this._options.maxDate, i);
                }
            }
            if (this._viewDate.isAfter(parsedDate)) { //todo moment
                this._viewDate = parsedDate.clone().subtract(this._options.stepping, 'm'); //todo moment
            }
            this._update();
        }

        minDate(minDate) {
            if (arguments.length === 0) {
                return this._options.minDate ? this._options.minDate.clone() : this._options.minDate; //todo moment
            }

            if (typeof minDate === 'boolean' && minDate === false) {
                this._options.minDate = false;
                this._update();
                return true;
            }

            if (typeof minDate === 'string') {
                if (minDate === 'now' || minDate === 'moment') {
                    minDate = this.getMoment();
                }
            }

            const parsedDate = this._parseInputDate(minDate);

            if (!parsedDate.isValid()) { //todo moment
                throw new TypeError(`minDate() Could not parse date parameter: ${minDate}`);
            }
            if (this._options.maxDate && parsedDate.isAfter(this._options.maxDate)) {
                throw new TypeError(`minDate() date parameter is after this.options.maxDate: ${parsedDate.format(this.actualFormat)}`);
            }
            this._options.minDate = parsedDate;
            for (let i = 0; i < this._dates.length; i++) {
                if (this._options.useCurrent && !this._options.keepInvalid && this._dates[i].isBefore(minDate)) { //todo moment
                    this._setValue(this._options.minDate, i);
                }
            }
            if (this._viewDate.isBefore(parsedDate)) {
                this._viewDate = parsedDate.clone().add(this._options.stepping, 'm'); //todo moment
            }
            this._update();
        }

        defaultDate(defaultDate) {
            if (arguments.length === 0) {
                return this._options.defaultDate ? this._options.defaultDate.clone() : this._options.defaultDate; //todo moment
            }
            if (!defaultDate) {
                this._options.defaultDate = false;
                return true;
            }

            if (typeof defaultDate === 'string') {
                if (defaultDate === 'now' || defaultDate === 'moment') {
                    defaultDate = this.getMoment();
                } else {
                    defaultDate = this.getMoment(defaultDate);
                }
            }

            const parsedDate = this._parseInputDate(defaultDate);
            if (!parsedDate.isValid()) { //todo moment
                throw new TypeError(`defaultDate() Could not parse date parameter: ${defaultDate}`);
            }
            if (!this._isValid(parsedDate)) {
                throw new TypeError('defaultDate() date passed is invalid according to component setup validations');
            }

            this._options.defaultDate = parsedDate;

            if (this._options.defaultDate && this._options.inline || this.input !== undefined && this.input.val().trim() === '') {
                this._setValue(this._options.defaultDate, 0);
            }
        }

        locale(locale) {
            if (arguments.length === 0) {
                return this._options.locale;
            }

            if (!moment.localeData(locale)) { //todo moment
                throw new TypeError(`locale() locale ${locale} is not loaded from moment locales!`);
            }

            this._options.locale = locale;

            for (let i = 0; i < this._dates.length; i++) {
                this._dates[i].locale(this._options.locale); //todo moment
            }
            this._viewDate.locale(this._options.locale); //todo moment

            if (this.actualFormat) {
                this._initFormatting(); // reinitialize formatting
            }
            if (this.widget) {
                this.hide();
                this.show();
            }
        }

        stepping(stepping) {
            if (arguments.length === 0) {
                return this._options.stepping;
            }

            stepping = parseInt(stepping, 10);
            if (isNaN(stepping) || stepping < 1) {
                stepping = 1;
            }
            this._options.stepping = stepping;
        }

        useCurrent(useCurrent) {
            const useCurrentOptions = ['year', 'month', 'day', 'hour', 'minute'];
            if (arguments.length === 0) {
                return this._options.useCurrent;
            }

            if (typeof useCurrent !== 'boolean' && typeof useCurrent !== 'string') {
                throw new TypeError('useCurrent() expects a boolean or string parameter');
            }
            if (typeof useCurrent === 'string' && useCurrentOptions.indexOf(useCurrent.toLowerCase()) === -1) {
                throw new TypeError(`useCurrent() expects a string parameter of ${useCurrentOptions.join(', ')}`);
            }
            this._options.useCurrent = useCurrent;
        }

        collapse(collapse) {
            if (arguments.length === 0) {
                return this._options.collapse;
            }

            if (typeof collapse !== 'boolean') {
                throw new TypeError('collapse() expects a boolean parameter');
            }
            if (this._options.collapse === collapse) {
                return true;
            }
            this._options.collapse = collapse;
            if (this.widget) {
                this.hide();
                this.show();
            }
        }

        icons(icons) {
            if (arguments.length === 0) {
                return $.extend({}, this._options.icons); //todo jquery
            }

            if (!(icons instanceof Object)) {
                throw new TypeError('icons() expects parameter to be an Object');
            }

            $.extend(this._options.icons, icons); //todo jquery

            if (this.widget) {
                this.hide();
                this.show();
            }
        }

        tooltips(tooltips) {
            if (arguments.length === 0) {
                return $.extend({}, this._options.tooltips); //todo jquery
            }

            if (!(tooltips instanceof Object)) {
                throw new TypeError('tooltips() expects parameter to be an Object');
            }
            $.extend(this._options.tooltips, tooltips);
            if (this.widget) {
                this.hide();
                this.show();
            }
        }

        sideBySide(sideBySide) {
            if (arguments.length === 0) {
                return this._options.sideBySide;
            }

            if (typeof sideBySide !== 'boolean') {
                throw new TypeError('sideBySide() expects a boolean parameter');
            }
            this._options.sideBySide = sideBySide;
            if (this.widget) {
                this.hide();
                this.show();
            }
        }

        viewMode(viewMode) {
            if (arguments.length === 0) {
                return this._options.viewMode;
            }

            if (typeof viewMode !== 'string') {
                throw new TypeError('viewMode() expects a string parameter');
            }

            if (ViewModes.indexOf(viewMode) === -1) {
                throw new TypeError(`viewMode() parameter must be one of (${ViewModes.join(', ')}) value`);
            }

            this._options.viewMode = viewMode;
            this.currentViewMode = Math.max(ViewModes.indexOf(viewMode) - 1, this.MinViewModeNumber);

            this._showMode();
        }

        calendarWeeks(calendarWeeks) {
            if (arguments.length === 0) {
                return this._options.calendarWeeks;
            }

            if (typeof calendarWeeks !== 'boolean') {
                throw new TypeError('calendarWeeks() expects parameter to be a boolean value');
            }

            this._options.calendarWeeks = calendarWeeks;
            this._update();
        }

        buttons(buttons) {
            if (arguments.length === 0) {
                return $.extend({}, this._options.buttons); //todo jquery
            }

            if (!(buttons instanceof Object)) {
                throw new TypeError('buttons() expects parameter to be an Object');
            }

            buttons = {
                showToday: buttons.showToday || false,
                showClear: buttons.showClear || false,
                showClose: buttons.showClose || false
            }

            if (typeof buttons.showToday !== 'boolean') {
                throw new TypeError('buttons.showToday expects a boolean parameter');
            }
            if (typeof buttons.showClear !== 'boolean') {
                throw new TypeError('buttons.showClear expects a boolean parameter');
            }
            if (typeof buttons.showClose !== 'boolean') {
                throw new TypeError('buttons.showClose expects a boolean parameter');
            }

            $.extend(this._options.buttons, buttons); //todo jquery

            if (this.widget) {
                this.hide();
                this.show();
            }
        }

        keepOpen(keepOpen) {
            if (arguments.length === 0) {
                return this._options.keepOpen;
            }

            if (typeof keepOpen !== 'boolean') {
                throw new TypeError('keepOpen() expects a boolean parameter');
            }

            this._options.keepOpen = keepOpen;
        }

        focusOnShow(focusOnShow) {
            if (arguments.length === 0) {
                return this._options.focusOnShow;
            }

            if (typeof focusOnShow !== 'boolean') {
                throw new TypeError('focusOnShow() expects a boolean parameter');
            }

            this._options.focusOnShow = focusOnShow;
        }

        inline(inline) {
            if (arguments.length === 0) {
                return this._options.inline;
            }

            if (typeof inline !== 'boolean') {
                throw new TypeError('inline() expects a boolean parameter');
            }

            this._options.inline = inline;
        }

        clear() {
            this._setValue(null); //todo
        }

        keyBinds(keyBinds) {
            if (arguments.length === 0) {
                return this._options.keyBinds;
            }

            this._options.keyBinds = keyBinds;
        }

        debug(debug) {
            if (typeof debug !== 'boolean') {
                throw new TypeError('debug() expects a boolean parameter');
            }

            this._options.debug = debug;
        }

        allowInputToggle(allowInputToggle) {
            if (arguments.length === 0) {
                return this._options.allowInputToggle;
            }

            if (typeof allowInputToggle !== 'boolean') {
                throw new TypeError('allowInputToggle() expects a boolean parameter');
            }

            this._options.allowInputToggle = allowInputToggle;
        }

        keepInvalid(keepInvalid) {
            if (arguments.length === 0) {
                return this._options.keepInvalid;
            }

            if (typeof keepInvalid !== 'boolean') {
                throw new TypeError('keepInvalid() expects a boolean parameter');
            }
            this._options.keepInvalid = keepInvalid;
        }

        datepickerInput(datepickerInput) {
            if (arguments.length === 0) {
                return this._options.datepickerInput;
            }

            if (typeof datepickerInput !== 'string') {
                throw new TypeError('datepickerInput() expects a string parameter');
            }

            this._options.datepickerInput = datepickerInput;
        }

        parseInputDate(parseInputDate) {
            if (arguments.length === 0) {
                return this._options.parseInputDate;
            }

            if (typeof parseInputDate !== 'function') {
                throw new TypeError('parseInputDate() should be as function');
            }

            this._options.parseInputDate = parseInputDate;
        }

        disabledTimeIntervals(disabledTimeIntervals) {
            if (arguments.length === 0) {
                return this._options.disabledTimeIntervals ? $.extend({}, this._options.disabledTimeIntervals) : this._options.disabledTimeIntervals; //todo jquery
            }

            if (!disabledTimeIntervals) {
                this._options.disabledTimeIntervals = false;
                this._update();
                return true;
            }
            if (!(disabledTimeIntervals instanceof Array)) {
                throw new TypeError('disabledTimeIntervals() expects an array parameter');
            }
            this._options.disabledTimeIntervals = disabledTimeIntervals;
            this._update();
        }

        disabledHours(hours) {
            if (arguments.length === 0) {
                return this._options.disabledHours ? $.extend({}, this._options.disabledHours) : this._options.disabledHours; //todo jquery
            }

            if (!hours) {
                this._options.disabledHours = false;
                this._update();
                return true;
            }
            if (!(hours instanceof Array)) {
                throw new TypeError('disabledHours() expects an array parameter');
            }
            this._options.disabledHours = this._indexGivenHours(hours);
            this._options.enabledHours = false;
            if (this._options.useCurrent && !this._options.keepInvalid) {
                for (let i = 0; i < this._dates.length; i++) {
                    let tries = 0;
                    while (!this._isValid(this._dates[i], 'h')) {
                        this._dates[i].add(1, 'h');
                        if (tries === 24) {
                            throw 'Tried 24 times to find a valid date';
                        }
                        tries++;
                    }
                    this._setValue(this._dates[i], i);
                }
            }
            this._update();
        }

        enabledHours(hours) {
            if (arguments.length === 0) {
                return this._options.enabledHours ? $.extend({}, this._options.enabledHours) : this._options.enabledHours; //todo jquery
            }

            if (!hours) {
                this._options.enabledHours = false;
                this._update();
                return true;
            }
            if (!(hours instanceof Array)) {
                throw new TypeError('enabledHours() expects an array parameter');
            }
            this._options.enabledHours = this._indexGivenHours(hours);
            this._options.disabledHours = false;
            if (this._options.useCurrent && !this._options.keepInvalid) {
                for (let i = 0; i < this._dates.length; i++) {
                    let tries = 0;
                    while (!this._isValid(this._dates[i], 'h')) {
                        this._dates[i].add(1, 'h');
                        if (tries === 24) {
                            throw 'Tried 24 times to find a valid date';
                        }
                        tries++;
                    }
                    this._setValue(this._dates[i], i);
                }
            }
            this._update();
        }

        viewDate(newDate) {
            if (arguments.length === 0) {
                return this._viewDate.clone();
            }

            if (!newDate) {
                this._viewDate = (this._dates[0] || this.getMoment()).clone(); //todo moment
                return true;
            }

            if (typeof newDate !== 'string' && !moment.isMoment(newDate) && !(newDate instanceof Date)) { //todo moment
                throw new TypeError('viewDate() parameter must be one of [string, moment or Date]');
            }

            this._viewDate = this._parseInputDate(newDate);
            this._update();
            this._viewUpdate(DatePickerModes[this.currentViewMode] && DatePickerModes[this.currentViewMode].NAV_FUNCTION);
        }

        allowMultidate(allowMultidate) {
            if (typeof allowMultidate !== 'boolean') {
                throw new TypeError('allowMultidate() expects a boolean parameter');
            }

            this._options.allowMultidate = allowMultidate;
        }

        multidateSeparator(multidateSeparator) {
            if (arguments.length === 0) {
                return this._options.multidateSeparator;
            }

            if (typeof multidateSeparator !== 'string') {
                throw new TypeError('multidateSeparator expects a string parameter');
            }

            this._options.multidateSeparator = multidateSeparator;
        }

        hide() { //todo jquery
            let transitioning = false;
            if (!this.widget) {
                return;
            }
            // Ignore event if in the middle of a picker transition
            this.widget.find('.collapse').each(function () {
                const collapseData = $(this).data('collapse');
                if (collapseData && collapseData.transitioning) {
                    transitioning = true;
                    return false;
                }
                return true;
            });
            if (transitioning) {
                return;
            }
            if (this.component && this.component.hasClass('btn')) {
                this.component.toggleClass('active');
            }
            this.widget.hide();

            $(window).off('resize', this._place);
            this.widget.off('click', '[data-action]');
            this.widget.off('mousedown', false);

            this.widget.remove();
            this.widget = false;

            if (this.input !== undefined && this.input.val() !== undefined && this.input.val().trim().length !== 0) {
                this._setValue(this._parseInputDate(this.input.val().trim(), {
                    isPickerShow: false
                }), 0);
            }
            const lastPickedDate = this._getLastPickedDate();
            this._notifyEvent({
                type: EVENT_HIDE,
                date: this.unset ? null : (lastPickedDate ? lastPickedDate.clone() : void 0)
            });

            if (this.input !== undefined) {
                this.input.blur();
            }

            this._viewDate = lastPickedDate ? lastPickedDate.clone() : this.getMoment();
        }

        show() { //todo jquery moment
            let currentMoment, shouldUseCurrentIfUnset = false;
            const useCurrentGranularity = {
                'year': function (m) {
                    return m.month(0).date(1).hours(0).seconds(0).minutes(0);
                },
                'month': function (m) {
                    return m.date(1).hours(0).seconds(0).minutes(0);
                },
                'day': function (m) {
                    return m.hours(0).seconds(0).minutes(0);
                },
                'hour': function (m) {
                    return m.seconds(0).minutes(0);
                },
                'minute': function (m) {
                    return m.seconds(0);
                }
            };

            if (this.input !== undefined) {
                if (this.input.prop('disabled') || !this._options.ignoreReadonly && this.input.prop('readonly') || this.widget) {
                    return;
                }
                if (this.input.val() !== undefined && this.input.val().trim().length !== 0) {
                    this._setValue(this._parseInputDate(this.input.val().trim(), {
                        isPickerShow: true
                    }), 0);
                } else {
                    shouldUseCurrentIfUnset = true
                }
            } else {
                shouldUseCurrentIfUnset = true;
            }

            if (shouldUseCurrentIfUnset && this.unset && this._options.useCurrent) {
                currentMoment = this.getMoment();
                if (typeof this._options.useCurrent === 'string') {
                    currentMoment = useCurrentGranularity[this._options.useCurrent](currentMoment);
                }
                this._setValue(currentMoment, 0);
            }

            this.widget = this._getTemplate();

            this._fillDow();
            this._fillMonths();

            this.widget.find('.timepicker-hours').hide();
            this.widget.find('.timepicker-minutes').hide();
            this.widget.find('.timepicker-seconds').hide();

            this._update();
            this._showMode();

            $(window).on('resize', {picker: this}, this._place);
            this.widget.on('click', '[data-action]', $.proxy(this._doAction, this)); // this handles clicks on the widget
            this.widget.on('mousedown', false);

            if (this.component && this.component.hasClass('btn')) {
                this.component.toggleClass('active');
            }
            this._place();
            this.widget.show();
            if (this.input !== undefined && this._options.focusOnShow && !this.input.is(':focus')) {
                this.input.focus();
            }

            this._notifyEvent({
                type: EVENT_SHOW
            });
        }

        destroy() { //todo jquery
            this.hide();
            //todo doc off?
            this._element.removeData(DATA_KEY);
            this._element.removeData('date');
        }

        disable() { //todo jquery
            this.hide();
            if (this.component && this.component.hasClass('btn')) {
                this.component.addClass('disabled');
            }
            if (this.input !== undefined) {
                this.input.prop('disabled', true); //todo disable this/comp if input is null
            }
        }

        enable() { //todo jquery
            if (this.component && this.component.hasClass('btn')) {
                this.component.removeClass('disabled');
            }
            if (this.input !== undefined) {
                this.input.prop('disabled', false); //todo enable comp/this if input is null
            }
        }

        toolbarPlacement(toolbarPlacement) {
            if (arguments.length === 0) {
                return this._options.toolbarPlacement;
            }

            if (typeof toolbarPlacement !== 'string') {
                throw new TypeError('toolbarPlacement() expects a string parameter');
            }
            if (toolbarPlacements.indexOf(toolbarPlacement) === -1) {
                throw new TypeError(`toolbarPlacement() parameter must be one of (${toolbarPlacements.join(', ')}) value`);
            }
            this._options.toolbarPlacement = toolbarPlacement;

            if (this.widget) {
                this.hide();
                this.show();
            }
        }

        widgetPositioning(widgetPositioning) {
            if (arguments.length === 0) {
                return $.extend({}, this._options.widgetPositioning); //todo jquery
            }

            if ({}.toString.call(widgetPositioning) !== '[object Object]') {
                throw new TypeError('widgetPositioning() expects an object variable');
            }
            if (widgetPositioning.horizontal) {
                if (typeof widgetPositioning.horizontal !== 'string') {
                    throw new TypeError('widgetPositioning() horizontal variable must be a string');
                }
                widgetPositioning.horizontal = widgetPositioning.horizontal.toLowerCase();
                if (horizontalModes.indexOf(widgetPositioning.horizontal) === -1) {
                    throw new TypeError(`widgetPositioning() expects horizontal parameter to be one of (${horizontalModes.join(', ')})`);
                }
                this._options.widgetPositioning.horizontal = widgetPositioning.horizontal;
            }
            if (widgetPositioning.vertical) {
                if (typeof widgetPositioning.vertical !== 'string') {
                    throw new TypeError('widgetPositioning() vertical variable must be a string');
                }
                widgetPositioning.vertical = widgetPositioning.vertical.toLowerCase();
                if (verticalModes.indexOf(widgetPositioning.vertical) === -1) {
                    throw new TypeError(`widgetPositioning() expects vertical parameter to be one of (${verticalModes.join(', ')})`);
                }
                this._options.widgetPositioning.vertical = widgetPositioning.vertical;
            }
            this._update();
        }

        widgetParent(widgetParent) {
            if (arguments.length === 0) {
                return this._options.widgetParent;
            }

            if (typeof widgetParent === 'string') {
                widgetParent = $(widgetParent); //todo jquery
            }

            if (widgetParent !== null && typeof widgetParent !== 'string' && !(widgetParent instanceof $)) {
                throw new TypeError('widgetParent() expects a string or a jQuery object parameter');
            }

            this._options.widgetParent = widgetParent;
            if (this.widget) {
                this.hide();
                this.show();
            }
        }

        setMultiDate(multiDateArray) { //todo moment
            const dateFormat = this._options.format;
            this.clear();
            for (let index = 0; index < multiDateArray.length; index++) {
                let date = moment(multiDateArray[index], dateFormat);
                this._setValue(date, index);
            }
        }

        options(newOptions) {
            if (arguments.length === 0) {
                return $.extend(true, {}, this._options); //todo jquery
            }

            if (!(newOptions instanceof Object)) {
                throw new TypeError('options() this.options parameter should be an object');
            }
            $.extend(true, this._options, newOptions); //todo jquery
            const self = this,
                optionsKeys = Object.keys(this._options).sort(optionsSortFn);
            $.each(optionsKeys, function (i, key) { //todo jquery
                const value = self._options[key];
                if (self[key] !== undefined) {
                    if (self.isInit && key === 'date') {
                        self.hasInitDate = true;
                        self.initDate = value;
                        return;
                    }
                    self[key](value);
                }
            });
        }

        //#endregion

        //static
        static _jQueryHandleThis(me, option, argument) {
            let data = $(me).data(DATA_KEY);
            if (typeof option === 'object') {
                $.extend({}, Default, option); //todo jquery
            }

            if (!data) {
                data = new TempusDominus($(me), option);
                $(me).data(DATA_KEY, data);
            }

            if (typeof option === 'string') {
                if (data[option] === undefined) {
                    throw new Error(`No method named "${option}"`);
                }
                if (argument === undefined) {
                    return data[option]();
                } else {
                    if (option === 'date') {
                        data.isDateUpdateThroughDateOptionFromClientCode = true;
                    }
                    const ret = data[option](argument);
                    data.isDateUpdateThroughDateOptionFromClientCode = false;
                    return ret;
                }
            }
        }


        static _jQueryInterface(option, argument) {
            if (this.length === 1) {
                return TempusDominus._jQueryHandleThis(this[0], option, argument);
            }
            return this.each(function () {
                TempusDominus._jQueryHandleThis(this, option, argument);
            });
        }
    }

    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */
    $(document).on(EVENT_CLICK_DATA_API, Selector.DATA_TOGGLE, function () {
        const $originalTarget = $(this), $target = getSelectorFromElement($originalTarget),
            config = $target.data(DATA_KEY);
        if ($target.length === 0) {
            return;
        }
        if (config._options.allowInputToggle && $originalTarget.is('input[data-toggle="datetimepicker"]')) {
            return;
        }
        TempusDominus._jQueryInterface.call($target, 'toggle');
    }).on(EVENT_CHANGE, `.${ClassName.INPUT}`, function (event) {
        const $target = getSelectorFromElement($(this));
        if ($target.length === 0 || event.isInit) {
            return;
        }
        TempusDominus._jQueryInterface.call($target, '_change', event);
    }).on(EVENT_BLUR, `.${ClassName.INPUT}`, function (event) {
        const $target = getSelectorFromElement($(this)), config = $target.data(DATA_KEY);
        if ($target.length === 0) {
            return;
        }
        if (config._options.debug || window.debug) {
            return;
        }
        TempusDominus._jQueryInterface.call($target, 'hide', event);
    }).on(EVENT_KEYDOWN, `.${ClassName.INPUT}`, function (event) {
        const $target = getSelectorFromElement($(this));
        if ($target.length === 0) {
            return;
        }
        TempusDominus._jQueryInterface.call($target, '_keydown', event);
    }).on(EVENT_KEYUP, `.${ClassName.INPUT}`, function (event) {
        const $target = getSelectorFromElement($(this));
        if ($target.length === 0) {
            return;
        }
        TempusDominus._jQueryInterface.call($target, '_keyup', event);
    }).on(EVENT_FOCUS, `.${ClassName.INPUT}`, function (event) {
        const $target = getSelectorFromElement($(this)), config = $target.data(DATA_KEY);
        if ($target.length === 0) {
            return;
        }
        if (!config._options.allowInputToggle) {
            return;
        }
        TempusDominus._jQueryInterface.call($target, 'show', event);
    });

    $.fn[NAME] = TempusDominus._jQueryInterface;
    $.fn[NAME].Constructor = TempusDominus;
    $.fn[NAME].noConflict = function () {
        $.fn[NAME] = JQUERY_NO_CONFLICT;
        return TempusDominus._jQueryInterface;
    };
    return TempusDominus;
})(jQuery);