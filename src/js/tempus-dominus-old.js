/**
 * --------------------------------------------------------------------------
 * Tempus Dominus (v6.0.0-alpha1)
 * Licensed under MIT (https://github.com/eonasdan/tempus-dominus/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

const TempusDominus = (($) => {
  //#region Constants
  const NAME = 'datetimepicker'; //'tempus-dominus' todo
  const VERSION = '6.0.0-alpha1';
  const DATA_KEY = 'datetimepicker'; //todo 'td'
  const EVENT_KEY = `.${DATA_KEY}`;
  const DATA_API_KEY = '.data-api';

  const EVENT_CHANGE = `hide${EVENT_KEY}`;
  const EVENT_ERROR = `error${EVENT_KEY}`;
  const EVENT_UPDATE = `update${EVENT_KEY}`;
  const EVENT_SHOW = `show${EVENT_KEY}`;
  const EVENT_HIDE = `hide${EVENT_KEY}`;
  const EVENT_BLUR = `blur${EVENT_KEY}`;
  const EVENT_KEYUP = `keyup${EVENT_KEY}`;
  const EVENT_KEYDOWN = `keydown${EVENT_KEY}`;
  const EVENT_FOCUS = `focus${EVENT_KEY}`;
  const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;

  const Selector = {
      DATA_TOGGLE: `[data-toggle="${DATA_KEY}"]`,
    },
    ClassName = {
      INPUT: `${NAME}-input`,
    },
    trim = (str) => str.replace(/(^\s+)|(\s+$)/g, '');

  const DatePickerModes = [
      {
        className: 'days',
        unit: 'M',
        step: 1,
      },
      {
        className: 'months',
        unit: 'y',
        step: 1,
      },
      {
        className: 'years',
        unit: 'y',
        step: 10,
      },
      {
        className: 'decades',
        unit: 'y',
        step: 100,
      },
    ],
    KeyMap = {
      up: 38,
      38: 'up',
      down: 40,
      40: 'down',
      left: 37,
      37: 'left',
      right: 39,
      39: 'right',
      tab: 9,
      9: 'tab',
      escape: 27,
      27: 'escape',
      enter: 13,
      13: 'enter',
      pageUp: 33,
      33: 'pageUp',
      pageDown: 34,
      34: 'pageDown',
      shift: 16,
      16: 'shift',
      control: 17,
      17: 'control',
      space: 32,
      32: 'space',
      t: 84,
      84: 't',
      delete: 46,
      46: 'delete',
    },
    ViewModes = ['times', 'days', 'months', 'years', 'decades'],
    keyState = {},
    keyPressHandled = {},
    optionsSortMap = {
      timeZone: -39,
      format: -38,
      dayViewHeaderFormat: -37,
      extraFormats: -36,
      stepping: -35,
      minDate: -34,
      maxDate: -33,
      useCurrent: -32,
      collapse: -31,
      locale: -30,
      defaultDate: -29,
      disabledDates: -28,
      enabledDates: -27,
      icons: -26,
      tooltips: -25,
      useStrict: -24,
      sideBySide: -23,
      daysOfWeekDisabled: -22,
      calendarWeeks: -21,
      viewMode: -20,
      toolbarPlacement: -19,
      buttons: -18,
      widgetPositioning: -17,
      widgetParent: -16,
      ignoreReadonly: -15,
      keepOpen: -14,
      focusOnShow: -13,
      inline: -12,
      keepInvalid: -11,
      keyBinds: -10,
      debug: -9,
      allowInputToggle: -8,
      disabledTimeIntervals: -7,
      disabledHours: -6,
      enabledHours: -5,
      viewDate: -4,
      allowMultidate: -3,
      multidateSeparator: -2,
      updateOnlyThroughDateOption: -1,
      date: 1,
    },
    JQUERY_NO_CONFLICT = $.fn[NAME],
    verticalModes = ['top', 'bottom', 'auto'],
    horizontalModes = ['left', 'right', 'auto'],
    toolbarPlacements = ['default', 'top', 'bottom'],
    getSelectorFromElement = function ($element) {
      let selector = $element.data('target'), //todo jquery
        $selector;

      if (!selector) {
        selector = $element.attr('href') || ''; //todo jquery
        selector = /^#[a-z]/i.test(selector) ? selector : null;
      }
      $selector = $(selector); //todo jquery
      if ($selector.length === 0) {
        return $element;
      }

      if (!$selector.data(DATA_KEY)) {
        //todo jquery
        $.extend({}, $selector.data(), $(this).data()); //todo jquery
      }

      return $selector;
    };

  function optionsSortFn(optionKeyA, optionKeyB) {
    //todo investigate
    if (optionsSortMap[optionKeyA] && optionsSortMap[optionKeyB]) {
      if (optionsSortMap[optionKeyA] < 0 && optionsSortMap[optionKeyB] < 0) {
        return (
          Math.abs(optionsSortMap[optionKeyB]) -
          Math.abs(optionsSortMap[optionKeyA])
        );
      } else if (optionsSortMap[optionKeyA] < 0) {
        return -1;
      } else if (optionsSortMap[optionKeyB] < 0) {
        return 1;
      }
      return optionsSortMap[optionKeyA] - optionsSortMap[optionKeyB];
    } else if (optionsSortMap[optionKeyA]) {
      return optionsSortMap[optionKeyA];
    } else if (optionsSortMap[optionKeyB]) {
      return optionsSortMap[optionKeyB];
    }
    return 0;
  }

  let Default = {
    timeZone: '',
    format: false, //todo migrate to display:
    dayViewHeaderFormat: 'MMMM YYYY', //todo migrate to display:
    extraFormats: false, //todo migrate to display:
    stepping: 1,
    minDate: false, //todo migrate to a sub object e.g. restrictions: [ min, max....]
    maxDate: false, //todo migrate to restrictions:
    useCurrent: true,
    collapse: true,
    locale: moment.locale(), //todo moment
    defaultDate: false,
    disabledDates: false, //todo migrate to restrictions:
    enabledDates: false, //todo migrate to restrictions:
    icons: {
      //todo plugin
      type: 'class',
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
    tooltips: {
      //todo plugin
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
      selectDate: 'Select Date',
    },
    useStrict: false, //todo moment
    sideBySide: false, //todo migrate to display:
    daysOfWeekDisabled: false, //todo migrate to restrictions:
    calendarWeeks: false, //todo migrate to display:
    viewMode: 'days', //todo migrate to display:
    toolbarPlacement: 'default', //todo migrate to display:
    buttons: {
      showToday: false,
      showClear: false,
      showClose: false,
    },
    widgetPositioning: {
      horizontal: 'auto',
      vertical: 'auto',
    },
    widgetParent: null,
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
    disabledTimeIntervals: false,
    disabledHours: false, //todo migrate to restrictions:
    enabledHours: false, //todo migrate to restrictions:
    viewDate: false,
    allowMultidate: false,
    multidateSeparator: ', ',
    updateOnlyThroughDateOption: false,
    promptTimeOnDateChange: false,
    promptTimeOnDateChangeTransitionDelay: 200,
  };

  //#endregion

  class TempusDominus {
    constructor(element, options) {
      this._options = this._getOptions(options);
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

    _getOptions(config) {
      config = {
        ...Default,
        ...config,
      };
      //todo missing Feather defaults
      //typeCheckConfig(NAME, config, DefaultType) //todo after the default structure gets changed, we can provide a object with value types
      return config;
    }

    _int() {
      this.isInit = true;
      const targetInput = this._element.data('target-input'); //todo jquery
      if (this._element.is('input')) {
        //todo jquery
        this.input = this._element;
      } else if (targetInput !== undefined) {
        if (targetInput === 'nearest') {
          this.input = this._element.find('input'); //todo jquery
        } else {
          this.input = $(targetInput); //todo jquery
        }
      }

      this._dates = [];
      this._dates[0] = this.getMoment(); //todo moment
      this._viewDate = this.getMoment().clone(); //todo moment

      $.extend(true, this._options, this._dataToOptions()); //todo jquery

      this.hasInitDate = false;
      this.initDate = void 0;
      this.options(this._options);

      this.isInitFormatting = true;
      this._initFormatting();
      this.isInitFormatting = false;

      if (
        this.input !== undefined &&
        this.input.is('input') &&
        this.input.val().trim().length !== 0
      ) {
        //todo jquery
        this._setValue(this._parseInputDate(this.input.val().trim()), 0); //todo jquery
      } else if (
        this._options.defaultDate &&
        this.input !== undefined &&
        this.input.attr('placeholder') === undefined
      ) {
        //todo jquery
        this._setValue(this._options.defaultDate, 0);
      }
      if (this.hasInitDate) {
        this.date(this.initDate);
      }

      if (this._options.inline) {
        this.show();
      }

      if (this._element.hasClass('input-group')) {
        //todo jquery //todo bootstrap
        const datepickerButton = this._element.find('.datepickerbutton'); //todo jquery
        if (datepickerButton.length === 0) {
          this.component = this._element.find('[data-toggle="datetimepicker"]'); //todo jquery
        } else {
          this.component = datepickerButton;
        }
      }

      this.isInit = false;
    }

    _update() {
      if (!this.widget) {
        return;
      }
      this._fillDate();
      this._fillTime();
    }

    _setValue(targetMoment, index) {
      const noIndex = typeof index === 'undefined',
        isClear = !targetMoment && noIndex,
        isDateUpdateThroughDateOptionFromClientCode =
          this.isDateUpdateThroughDateOptionFromClientCode,
        isNotAllowedProgrammaticUpdate =
          !this.isInit &&
          this._options.updateOnlyThroughDateOption &&
          !isDateUpdateThroughDateOptionFromClientCode;
      let outputValue = '',
        isInvalid = false,
        oldDate = this.unset ? null : this._dates[index];
      if (!oldDate && !this.unset && noIndex && isClear) {
        oldDate = this._dates[this._dates.length - 1];
      }

      // case of calling setValue(null or false)
      if (!targetMoment) {
        if (isNotAllowedProgrammaticUpdate) {
          this._notifyEvent({
            type: EVENT_CHANGE,
            date: targetMoment,
            oldDate: oldDate,
            isClear,
            isInvalid,
            isDateUpdateThroughDateOptionFromClientCode,
            isInit: this.isInit,
          });
          return;
        }
        if (
          !this._options.multipleDates ||
          this._dates.length === 1 ||
          isClear
        ) {
          this.unset = true;
          this._dates = [];
          this._datesFormatted = [];
        } else {
          outputValue = `${this._element.data('date')}${
            this._options.multipleDatesSeparator
          }`; //todo jquery .data
          outputValue =
            (oldDate &&
              outputValue
                .replace(
                  `${oldDate.format(this.actualFormat)}${
                    this._options.multipleDatesSeparator
                  }`,
                  '' //todo moment
                )
                .replace(
                  `${this._options.multipleDatesSeparator}${this._options.multipleDatesSeparator}`,
                  ''
                )
                .replace(
                  new RegExp(
                    `${escapeRegExp(this._options.multipleDatesSeparator)}\\s*$`
                  ),
                  ''
                )) ||
            '';
          this._dates.splice(index, 1);
          this._datesFormatted.splice(index, 1);
        }
        outputValue = trim(outputValue);
        if (this.input !== undefined) {
          this.input.val(outputValue); //todo jquery
          this.input.trigger('input'); //todo jquery
        }
        this._element.data('date', outputValue); //todo jquery
        this._notifyEvent({
          type: EVENT_CHANGE,
          date: false,
          oldDate: oldDate,
          isClear,
          isInvalid,
          isDateUpdateThroughDateOptionFromClientCode,
          isInit: this.isInit,
        });
        this._update();
        return;
      }

      targetMoment = targetMoment.clone().locale(this._options.locale); //todo moment

      if (this._hasTimeZone()) {
        targetMoment.tz(this._options.timeZone); //todo moment
      }

      if (this._options.stepping !== 1) {
        targetMoment
          .minutes(
            Math.round(targetMoment.minutes() / this._options.stepping) *
              this._options.stepping
          )
          .seconds(0); //todo moment
      }

      if (this._isValid(targetMoment)) {
        if (isNotAllowedProgrammaticUpdate) {
          this._notifyEvent({
            type: EVENT_CHANGE,
            date: targetMoment.clone(), //todo moment
            oldDate: oldDate,
            isClear,
            isInvalid,
            isDateUpdateThroughDateOptionFromClientCode,
            isInit: this.isInit,
          });
          return;
        }
        this._dates[index] = targetMoment;
        this._datesFormatted[index] = targetMoment.format('YYYY-MM-DD'); //todo moment
        this._viewDate = targetMoment.clone(); //todo moment
        if (this._options.multipleDates && this._dates.length > 1) {
          for (let i = 0; i < this._dates.length; i++) {
            outputValue += `${this._dates[i].format(this.actualFormat)}${
              this._options.multipleDatesSeparator
            }`; //todo moment
          }
          outputValue = outputValue.replace(
            new RegExp(`${this._options.multipleDatesSeparator}\\s*$`),
            ''
          );
        } else {
          outputValue = this._dates[index].format(this.actualFormat); //todo moment
        }
        outputValue = trim(outputValue);
        if (this.input !== undefined) {
          this.input.val(outputValue); //todo jquery
          this.input.trigger('input'); //todo jquery
        }
        this._element.data('date', outputValue); //todo jquery

        this.unset = false;
        this._update();
        this._notifyEvent({
          type: EVENT_CHANGE,
          date: this._dates[index].clone(), //todo moment
          oldDate: oldDate,
          isClear,
          isInvalid,
          isDateUpdateThroughDateOptionFromClientCode,
          isInit: this.isInit,
        });
      } else {
        isInvalid = true;
        if (!this._options.keepInvalid) {
          if (this.input !== undefined) {
            this.input.val(
              `${
                this.unset ? '' : this._dates[index].format(this.actualFormat)
              }`
            ); //todo jquery
            this.input.trigger('input'); //todo jquery
          }
        } else {
          this._notifyEvent({
            type: EVENT_CHANGE,
            date: targetMoment,
            oldDate: oldDate,
            isClear,
            isInvalid,
            isDateUpdateThroughDateOptionFromClientCode,
            isInit: this.isInit,
          });
        }
        this._notifyEvent({
          type: EVENT_ERROR,
          date: targetMoment,
          oldDate: oldDate,
        });
      }
    }

    _change(e) {
      const val = $(e.target).val().trim(), //todo jquery
        parsedDate = val ? this._parseInputDate(val) : null;
      this._setValue(parsedDate, 0);
      e.stopImmediatePropagation();
      return false;
    }

    _hasTimeZone() {
      //todo moment
      return (
        moment.tz !== undefined &&
        this._options.timeZone !== undefined &&
        this._options.timeZone !== null &&
        this._options.timeZone !== ''
      );
    }

    _isEnabled(granularity) {
      if (typeof granularity !== 'string' || granularity.length > 1) {
        throw new TypeError(
          'isEnabled expects a single character string parameter'
        );
      }
      switch (granularity) {
        case 'y':
          return this.actualFormat.indexOf('Y') !== -1;
        case 'M':
          return this.actualFormat.indexOf('M') !== -1;
        case 'd':
          return this.actualFormat.toLowerCase().indexOf('d') !== -1;
        case 'h':
        case 'H':
          return this.actualFormat.toLowerCase().indexOf('h') !== -1;
        case 'm':
          return this.actualFormat.indexOf('m') !== -1;
        case 's':
          return this.actualFormat.indexOf('s') !== -1;
        case 'a':
        case 'A':
          return this.actualFormat.toLowerCase().indexOf('a') !== -1;
        default:
          return false;
      }
    }

    _hasTime() {
      return (
        this._isEnabled('h') || this._isEnabled('m') || this._isEnabled('s')
      );
    }

    _hasDate() {
      return (
        this._isEnabled('y') || this._isEnabled('M') || this._isEnabled('d')
      );
    }

    _dataToOptions() {
      //todo migrate to data utility
      const eData = this._element.data(); //todo jquery
      let dataOptions = {};

      if (eData.dateOptions && eData.dateOptions instanceof Object) {
        dataOptions = $.extend(true, dataOptions, eData.dateOptions); //todo jquery
      }

      $.each(this._options, function (key) {
        //todo jquery
        const attributeName = `date${key.charAt(0).toUpperCase()}${key.slice(
          1
        )}`; //todo data api key
        if (eData[attributeName] !== undefined) {
          dataOptions[key] = eData[attributeName];
        } else {
          delete dataOptions[key];
        }
      });
      return dataOptions;
    }

    _format() {
      return this._options.format || 'YYYY-MM-DD HH:mm';
    }

    _areSameDates(a, b) {
      const format = this._format();
      return (
        a &&
        b &&
        (a.isSame(b) ||
          moment(a.format(format), format).isSame(
            moment(b.format(format), format)
          ))
      ); //todo moment
    }

    _notifyEvent(e) {
      //todo migrate to event handler?
      if (e.type === EVENT_CHANGE) {
        this._notifyChangeEventContext = this._notifyChangeEventContext || 0;
        this._notifyChangeEventContext++;
        if (
          (e.date && this._areSameDates(e.date, e.oldDate)) ||
          (!e.isClear && !e.date && !e.oldDate) ||
          this._notifyChangeEventContext > 1
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
          (e.oldDate.format('YYYY-MM-DD') === e.date.format('YYYY-MM-DD') || //todo moment
            (e.oldDate.format('YYYY-MM-DD') !== e.date.format('YYYY-MM-DD') &&
              e.oldDate.format('HH:mm:ss') !== e.date.format('HH:mm:ss')))
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

    _viewUpdate(e) {
      if (e === 'y') {
        e = 'YYYY';
      }
      this._notifyEvent({
        type: EVENT_UPDATE,
        change: e,
        viewDate: this._viewDate.clone(), //todo moment
      });
    }

    _showMode(dir) {
      if (!this.widget) {
        return;
      }
      if (dir) {
        this._currentViewMode = Math.max(
          this.MinViewModeNumber,
          Math.min(3, this._currentViewMode + dir)
        );
      }
      this.widget
        .find('.datepicker > div')
        .hide()
        .filter(
          `.datepicker-${DatePickerModes[this._currentViewMode].className}`
        )
        .show(); //todo jquery
    }

    _isInDisabledDates(testDate) {
      return (
        this._options.disabledDates[testDate.format('YYYY-MM-DD')] === true
      ); //todo moment
    }

    _isInEnabledDates(testDate) {
      return this._options.enabledDates[testDate.format('YYYY-MM-DD')] === true; //todo moment
    }

    _isInDisabledHours(testDate) {
      return this._options.disabledHours[testDate.format('H')] === true; //todo moment
    }

    _isInEnabledHours(testDate) {
      return this._options.enabledHours[testDate.format('H')] === true; //todo moment
    }

    _isValid(targetMoment, granularity) {
      if (!targetMoment || !targetMoment.isValid()) {
        //todo moment
        return false;
      }
      if (
        this._options.disabledDates &&
        granularity === 'd' &&
        this._isInDisabledDates(targetMoment)
      ) {
        return false;
      }
      if (
        this._options.enabledDates &&
        granularity === 'd' &&
        !this._isInEnabledDates(targetMoment)
      ) {
        return false;
      }
      if (
        this._options.minDate &&
        targetMoment.isBefore(this._options.minDate, granularity)
      ) {
        //todo moment
        return false;
      }
      if (
        this._options.maxDate &&
        targetMoment.isAfter(this._options.maxDate, granularity)
      ) {
        //todo moment
        return false;
      }
      if (
        this._options.daysOfWeekDisabled &&
        granularity === 'd' &&
        this._options.daysOfWeekDisabled.indexOf(targetMoment.day()) !== -1
      ) {
        return false;
      }
      if (
        this._options.disabledHours &&
        (granularity === 'h' || granularity === 'm' || granularity === 's') &&
        this._isInDisabledHours(targetMoment)
      ) {
        return false;
      }
      if (
        this._options.enabledHours &&
        (granularity === 'h' || granularity === 'm' || granularity === 's') &&
        !this._isInEnabledHours(targetMoment)
      ) {
        return false;
      }
      if (
        this._options.disabledTimeIntervals &&
        (granularity === 'h' || granularity === 'm' || granularity === 's')
      ) {
        let found = false;
        $.each(this._options.disabledTimeIntervals, function () {
          //todo jquery
          if (targetMoment.isBetween(this[0], this[1])) {
            //todo moment
            found = true;
            return false;
          }
        });
        if (found) {
          return false;
        }
      }
      return true;
    }

    _parseInputDate(inputDate, { isPickerShow = false } = {}) {
      if (this._options.parseInputDate === undefined || isPickerShow) {
        if (!moment.isMoment(inputDate)) {
          //todo moment
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

      for (index in keyState) {
        //todo cleanup
        if (keyState.hasOwnProperty(index) && keyState[index] === pressed) {
          pressedKeys.push(index);
          if (parseInt(index, 10) !== currentKey) {
            pressedModifiers[index] = true;
          }
        }
      }

      for (index in this._options.keyBinds) {
        if (
          this._options.keyBinds.hasOwnProperty(index) &&
          typeof this._options.keyBinds[index] === 'function'
        ) {
          keyBindKeys = index.split(' ');
          if (
            keyBindKeys.length === pressedKeys.length &&
            KeyMap[currentKey] === keyBindKeys[keyBindKeys.length - 1]
          ) {
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

    _indexGivenDates(givenDatesArray) {
      // Store given enabledDates and disabledDates as keys.
      // This way we can check their existence in O(1) time instead of looping through whole array.
      // (for example: options.enabledDates['2014-02-27'] === true)
      const givenDatesIndexed = {},
        self = this;
      $.each(givenDatesArray, function () {
        //todo jquery
        const dDate = self._parseInputDate(this);
        if (dDate.isValid()) {
          //todo moment
          givenDatesIndexed[dDate.format('YYYY-MM-DD')] = true; //todo moment
        }
      });
      return Object.keys(givenDatesIndexed).length ? givenDatesIndexed : false;
    }

    _indexGivenHours(givenHoursArray) {
      // Store given enabledHours and disabledHours as keys.
      // This way we can check their existence in O(1) time instead of looping through whole array.
      // (for example: options.enabledHours['2014-02-27'] === true)
      const givenHoursIndexed = {};
      $.each(givenHoursArray, function () {
        //todo jquery
        givenHoursIndexed[this] = true;
      });
      return Object.keys(givenHoursIndexed).length ? givenHoursIndexed : false;
    }

    _initFormatting() {
      const format = this._options.format || 'L LT',
        self = this;

      this.actualFormat = format.replace(
        /(\[[^\[]*])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,
        function (formatInput) {
          return (
            (self.isInitFormatting && self._options.date === null
              ? self.getMoment() //todo moment
              : self._dates[0]
            )
              .localeData()
              .longDateFormat(formatInput) || formatInput
          ); //todo taking the first date should be ok
        }
      );

      this.parseFormats = this._options.extraFormats
        ? this._options.extraFormats.slice()
        : [];
      if (
        this.parseFormats.indexOf(format) < 0 &&
        this.parseFormats.indexOf(this.actualFormat) < 0
      ) {
        this.parseFormats.push(this.actualFormat);
      }

      this.use24Hours =
        this.actualFormat.toLowerCase().indexOf('a') < 1 &&
        this.actualFormat.replace(/\[.*?]/g, '').indexOf('h') < 1;

      if (this._isEnabled('y')) {
        this.MinViewModeNumber = 2;
      }
      if (this._isEnabled('M')) {
        this.MinViewModeNumber = 1;
      }
      if (this._isEnabled('d')) {
        this.MinViewModeNumber = 0;
      }

      this._currentViewMode = Math.max(
        this.MinViewModeNumber,
        this._currentViewMode
      );

      if (!this.unset) {
        this._setValue(this._dates[0], 0);
      }
    }

    _getLastPickedDate() {
      let lastPickedDate = this._dates[this._getLastPickedDateIndex()];
      if (!lastPickedDate && this._options.multipleDates) {
        lastPickedDate = moment(new Date()); //todo moment
      }
      return lastPickedDate;
    }

    _getLastPickedDateIndex() {
      return this._dates.length - 1;
    }

    _iconTag(iconName) {
      return $('<span>').addClass(iconName); //todo jquery //todo #2334
    }

    _getDatePickerTemplate() {
      //todo jquery cries in jquery
      const headTemplate = $('<thead>').append(
          $('<tr>')
            .append(
              $('<th>')
                .addClass('prev')
                .attr('data-action', 'previous')
                .append(this._iconTag(this._options.icons.previous))
            )
            .append(
              $('<th>')
                .addClass('picker-switch')
                .attr('data-action', 'pickerSwitch')
                .attr('colspan', `${this._options.calendarWeeks ? '6' : '5'}`)
            )
            .append(
              $('<th>')
                .addClass('next')
                .attr('data-action', 'next')
                .append(this._iconTag(this._options.icons.next))
            )
        ),
        contTemplate = $('<tbody>').append(
          $('<tr>').append(
            $('<td>').attr(
              'colspan',
              `${this._options.calendarWeeks ? '8' : '7'}`
            )
          )
        );

      return [
        $('<div>')
          .addClass('datepicker-days')
          .append(
            $('<table>')
              .addClass('table table-sm')
              .append(headTemplate)
              .append($('<tbody>'))
          ),
        $('<div>')
          .addClass('datepicker-months')
          .append(
            $('<table>')
              .addClass('table-condensed')
              .append(headTemplate.clone())
              .append(contTemplate.clone())
          ),
        $('<div>')
          .addClass('datepicker-years')
          .append(
            $('<table>')
              .addClass('table-condensed')
              .append(headTemplate.clone())
              .append(contTemplate.clone())
          ),
        $('<div>')
          .addClass('datepicker-decades')
          .append(
            $('<table>')
              .addClass('table-condensed')
              .append(headTemplate.clone())
              .append(contTemplate.clone())
          ),
      ];
    }

    _getTimePickerMainTemplate() {
      //todo jquery cries in jquery
      const topRow = $('<tr>'),
        middleRow = $('<tr>'),
        bottomRow = $('<tr>');

      if (this._isEnabled('h')) {
        topRow.append(
          $('<td>').append(
            $('<a>')
              .attr({
                href: '#',
                tabindex: '-1',
                title: this._options.tooltips.incrementHour,
              })
              .addClass('btn')
              .attr('data-action', 'incrementHours')
              .append(this._iconTag(this._options.icons.up))
          )
        );
        middleRow.append(
          $('<td>').append(
            $('<span>')
              .addClass('timepicker-hour')
              .attr({
                'data-time-component': 'hours',
                title: this._options.tooltips.pickHour,
              })
              .attr('data-action', 'showHours')
          )
        );
        bottomRow.append(
          $('<td>').append(
            $('<a>')
              .attr({
                href: '#',
                tabindex: '-1',
                title: this._options.tooltips.decrementHour,
              })
              .addClass('btn')
              .attr('data-action', 'decrementHours')
              .append(this._iconTag(this._options.icons.down))
          )
        );
      }
      if (this._isEnabled('m')) {
        if (this._isEnabled('h')) {
          topRow.append($('<td>').addClass('separator'));
          middleRow.append($('<td>').addClass('separator').html(':'));
          bottomRow.append($('<td>').addClass('separator'));
        }
        topRow.append(
          $('<td>').append(
            $('<a>')
              .attr({
                href: '#',
                tabindex: '-1',
                title: this._options.tooltips.incrementMinute,
              })
              .addClass('btn')
              .attr('data-action', 'incrementMinutes')
              .append(this._iconTag(this._options.icons.up))
          )
        );
        middleRow.append(
          $('<td>').append(
            $('<span>')
              .addClass('timepicker-minute')
              .attr({
                'data-time-component': 'minutes',
                title: this._options.tooltips.pickMinute,
              })
              .attr('data-action', 'showMinutes')
          )
        );
        bottomRow.append(
          $('<td>').append(
            $('<a>')
              .attr({
                href: '#',
                tabindex: '-1',
                title: this._options.tooltips.decrementMinute,
              })
              .addClass('btn')
              .attr('data-action', 'decrementMinutes')
              .append(this._iconTag(this._options.icons.down))
          )
        );
      }
      if (this._isEnabled('s')) {
        if (this._isEnabled('m')) {
          topRow.append($('<td>').addClass('separator'));
          middleRow.append($('<td>').addClass('separator').html(':'));
          bottomRow.append($('<td>').addClass('separator'));
        }
        topRow.append(
          $('<td>').append(
            $('<a>')
              .attr({
                href: '#',
                tabindex: '-1',
                title: this._options.tooltips.incrementSecond,
              })
              .addClass('btn')
              .attr('data-action', 'incrementSeconds')
              .append(this._iconTag(this._options.icons.up))
          )
        );
        middleRow.append(
          $('<td>').append(
            $('<span>')
              .addClass('timepicker-second')
              .attr({
                'data-time-component': 'seconds',
                title: this._options.tooltips.pickSecond,
              })
              .attr('data-action', 'showSeconds')
          )
        );
        bottomRow.append(
          $('<td>').append(
            $('<a>')
              .attr({
                href: '#',
                tabindex: '-1',
                title: this._options.tooltips.decrementSecond,
              })
              .addClass('btn')
              .attr('data-action', 'decrementSeconds')
              .append(this._iconTag(this._options.icons.down))
          )
        );
      }

      if (!this.use24Hours) {
        topRow.append($('<td>').addClass('separator'));
        middleRow.append(
          $('<td>').append(
            $('<button>').addClass('btn btn-primary').attr({
              'data-action': 'togglePeriod',
              tabindex: '-1',
              title: this._options.tooltips.togglePeriod,
            })
          )
        );
        bottomRow.append($('<td>').addClass('separator'));
      }

      return $('<div>')
        .addClass('timepicker-picker')
        .append(
          $('<table>')
            .addClass('table-condensed')
            .append([topRow, middleRow, bottomRow])
        );
    }

    _getTimePickerTemplate() {
      //todo jquery cries in jquery
      const hoursView = $('<div>')
          .addClass('timepicker-hours')
          .append($('<table>').addClass('table-condensed')),
        minutesView = $('<div>')
          .addClass('timepicker-minutes')
          .append($('<table>').addClass('table-condensed')),
        secondsView = $('<div>')
          .addClass('timepicker-seconds')
          .append($('<table>').addClass('table-condensed')),
        ret = [this._getTimePickerMainTemplate()];

      if (this._isEnabled('h')) {
        ret.push(hoursView);
      }
      if (this._isEnabled('m')) {
        ret.push(minutesView);
      }
      if (this._isEnabled('s')) {
        ret.push(secondsView);
      }

      return ret;
    }

    _getToolbar() {
      //todo jquery cries in jquery
      const row = [];
      if (this._options.buttons.showToday) {
        row.push(
          $('<td>').append(
            $('<a>')
              .attr({
                href: '#',
                tabindex: '-1',
                'data-action': 'today',
                title: this._options.tooltips.today,
              })
              .append(this._iconTag(this._options.icons.today))
          )
        );
      }
      if (
        !this._options.sideBySide &&
        this._options.collapse &&
        this._hasDate() &&
        this._hasTime()
      ) {
        let title, icon;
        if (this._options.viewMode === 'times') {
          title = this._options.tooltips.selectDate;
          icon = this._options.icons.date;
        } else {
          title = this._options.tooltips.selectTime;
          icon = this._options.icons.time;
        }
        row.push(
          $('<td>').append(
            $('<a>')
              .attr({
                href: '#',
                tabindex: '-1',
                'data-action': 'togglePicker',
                title: title,
              })
              .append(this._iconTag(icon))
          )
        );
      }
      if (this._options.buttons.showClear) {
        row.push(
          $('<td>').append(
            $('<a>')
              .attr({
                href: '#',
                tabindex: '-1',
                'data-action': 'clear',
                title: this._options.tooltips.clear,
              })
              .append(this._iconTag(this._options.icons.clear))
          )
        );
      }
      if (this._options.buttons.showClose) {
        row.push(
          $('<td>').append(
            $('<a>')
              .attr({
                href: '#',
                tabindex: '-1',
                'data-action': 'close',
                title: this._options.tooltips.close,
              })
              .append(this._iconTag(this._options.icons.close))
          )
        );
      }
      return row.length === 0
        ? ''
        : $('<table>')
            .addClass('table-condensed')
            .append($('<tbody>').append($('<tr>').append(row)));
    }

    _getTemplate() {
      //todo jquery cries in jquery
      const template = $('<div>').addClass(
          `bootstrap-datetimepicker-widget dropdown-menu ${
            this._options.calendarWeeks
              ? 'tempusdominus-bootstrap-datetimepicker-widget-with-calendar-weeks'
              : ''
          } `.trim()
        ),
        dateView = $('<div>')
          .addClass('datepicker')
          .append(this._getDatePickerTemplate()),
        timeView = $('<div>')
          .addClass('timepicker')
          .append(this._getTimePickerTemplate()),
        content = $('<ul>').addClass('list-unstyled'),
        toolbar = $('<li>')
          .addClass(
            `picker-switch${
              this._options.collapse ? ' accordion-toggle' : ''
            }`.trim()
          )
          .append(this._getToolbar());

      if (this._options.inline) {
        template.removeClass('dropdown-menu');
      }

      if (this.use24Hours) {
        template.addClass('usetwentyfour');
      }
      if (
        (this.input !== undefined && this.input.prop('readonly')) ||
        this._options.readonly
      ) {
        template.addClass('bootstrap-datetimepicker-widget-readonly');
      }
      if (this._isEnabled('s') && !this.use24Hours) {
        template.addClass('wider');
      }

      if (this._options.sideBySide && this._hasDate() && this._hasTime()) {
        template.addClass('timepicker-sbs');
        if (this._options.toolbarPlacement === 'top') {
          template.append(toolbar);
        }
        template.append(
          $('<div>')
            .addClass('row')
            .append(dateView.addClass('col-md-6'))
            .append(timeView.addClass('col-md-6'))
        );
        if (
          this._options.toolbarPlacement === 'bottom' ||
          this._options.toolbarPlacement === 'default'
        ) {
          template.append(toolbar);
        }
        return template;
      }

      if (this._options.toolbarPlacement === 'top') {
        content.append(toolbar);
      }
      if (this._hasDate()) {
        content.append(
          $('<li>')
            .addClass(
              this._options.collapse && this._hasTime() ? 'collapse' : ''
            )
            .addClass(
              this._options.collapse &&
                this._hasTime() &&
                this._options.viewMode === 'times'
                ? ''
                : 'show'
            )
            .append(dateView)
        );
      }
      if (this._options.toolbarPlacement === 'default') {
        content.append(toolbar);
      }
      if (this._hasTime()) {
        content.append(
          $('<li>')
            .addClass(
              this._options.collapse && this._hasDate() ? 'collapse' : ''
            )
            .addClass(
              this._options.collapse &&
                this._hasDate() &&
                this._options.viewMode === 'times'
                ? 'show'
                : ''
            )
            .append(timeView)
        );
      }
      if (this._options.toolbarPlacement === 'bottom') {
        content.append(toolbar);
      }
      return template.append(content);
    }

    _place(e) {
      //todo replace with popper2
      let self = (e && e.data && e.data.picker) || this,
        vertical = self._options.widgetPositioning.vertical,
        horizontal = self._options.widgetPositioning.horizontal,
        parent;
      const position = (
          self.component && self.component.length
            ? self.component
            : self._element
        ).position(), //todo jquery
        offset = (
          self.component && self.component.length
            ? self.component
            : self._element
        ).offset(); //todo jquery
      if (self._options.widgetParent) {
        parent = self._options.widgetParent.append(self.widget); //todo jquery
      } else if (self._element.is('input')) {
        //todo jquery
        parent = self._element.after(self.widget).parent(); //todo jquery
      } else if (self._options.inline) {
        parent = self._element.append(self.widget); //todo jquery
        return;
      } else {
        parent = self._element;
        self._element.children().first().after(self.widget); //todo jquery
      }

      // Top and bottom logic
      if (vertical === 'auto') {
        //noinspection JSValidateTypes
        //todo jquery
        if (
          offset.top + self.widget.height() * 1.5 >=
            $(window).height() + $(window).scrollTop() &&
          self.widget.height() + self._element.outerHeight() < offset.top
        ) {
          vertical = 'top';
        } else {
          vertical = 'bottom';
        }
      }

      // Left and right logic
      if (horizontal === 'auto') {
        if (
          parent.width() < offset.left + self.widget.outerWidth() / 2 &&
          offset.left + self.widget.outerWidth() > $(window).width()
        ) {
          //todo jquery
          horizontal = 'right';
        } else {
          horizontal = 'left';
        }
      }

      if (vertical === 'top') {
        //todo jquery
        self.widget.addClass('top').removeClass('bottom');
      } else {
        self.widget.addClass('bottom').removeClass('top');
      }

      if (horizontal === 'right') {
        //todo jquery
        self.widget.addClass('float-right');
      } else {
        self.widget.removeClass('float-right');
      }

      // find the first parent element that has a relative css positioning
      if (parent.css('position') !== 'relative') {
        //todo jquery
        parent = parent
          .parents()
          .filter(function () {
            return $(this).css('position') === 'relative';
          })
          .first();
      }

      if (parent.length === 0) {
        throw new Error(
          'datetimepicker component should be placed within a relative positioned container'
        );
      }

      self.widget.css({
        //todo jquery
        top:
          vertical === 'top'
            ? 'auto'
            : position.top + self._element.outerHeight() + 'px',
        bottom:
          vertical === 'top'
            ? parent.outerHeight() -
              (parent === self._element ? 0 : position.top) +
              'px'
            : 'auto',
        left:
          horizontal === 'left'
            ? (parent === self._element ? 0 : position.left) + 'px'
            : 'auto',
        right:
          horizontal === 'left'
            ? 'auto'
            : parent.outerWidth() -
              self._element.outerWidth() -
              (parent === self._element ? 0 : position.left) +
              'px',
      });
    }

    _fillDow() {
      //todo jquery todo moment
      const row = $('<tr>'),
        currentDate = this._viewDate.clone().startOf('w').startOf('d');

      if (this._options.calendarWeeks === true) {
        row.append($('<th>').addClass('cw').text('#'));
      }

      while (currentDate.isBefore(this._viewDate.clone().endOf('w'))) {
        row.append($('<th>').addClass('dow').text(currentDate.format('dd')));
        currentDate.add(1, 'd');
      }
      this.widget.find('.datepicker-days thead').append(row);
    }

    _fillMonths() {
      //todo jquery todo moment
      const spans = [],
        monthsShort = this._viewDate.clone().startOf('y').startOf('d');
      while (monthsShort.isSame(this._viewDate, 'y')) {
        spans.push(
          $('<span>')
            .attr('data-action', 'selectMonth')
            .addClass('month')
            .text(monthsShort.format('MMM'))
        );
        monthsShort.add(1, 'M');
      }
      this.widget.find('.datepicker-months td').empty().append(spans);
    }

    _updateMonths() {
      //todo jquery todo moment
      const monthsView = this.widget.find('.datepicker-months'),
        monthsViewHeader = monthsView.find('th'),
        months = monthsView.find('tbody').find('span'),
        self = this,
        lastPickedDate = this._getLastPickedDate();

      monthsViewHeader
        .eq(0)
        .find('span')
        .attr('title', this._options.tooltips.prevYear);
      monthsViewHeader.eq(1).attr('title', this._options.tooltips.selectYear);
      monthsViewHeader
        .eq(2)
        .find('span')
        .attr('title', this._options.tooltips.nextYear);

      monthsView.find('.disabled').removeClass('disabled');

      if (!this._isValid(this._viewDate.clone().subtract(1, 'y'), 'y')) {
        monthsViewHeader.eq(0).addClass('disabled');
      }

      monthsViewHeader.eq(1).text(this._viewDate.year());

      if (!this._isValid(this._viewDate.clone().add(1, 'y'), 'y')) {
        monthsViewHeader.eq(2).addClass('disabled');
      }

      months.removeClass('active');
      if (
        lastPickedDate &&
        lastPickedDate.isSame(this._viewDate, 'y') &&
        !this.unset
      ) {
        months.eq(lastPickedDate.month()).addClass('active');
      }

      months.each(function (index) {
        if (!self._isValid(self._viewDate.clone().month(index), 'M')) {
          $(this).addClass('disabled');
        }
      });
    }

    _getStartEndYear(factor, year) {
      const step = factor / 10,
        startYear = Math.floor(year / factor) * factor,
        endYear = startYear + step * 9,
        focusValue = Math.floor(year / step) * step;
      return [startYear, endYear, focusValue];
    }

    _updateYears() {
      //todo jquery moment
      const yearsView = this.widget.find('.datepicker-years'),
        yearsViewHeader = yearsView.find('th'),
        yearCaps = this._getStartEndYear(10, this._viewDate.year()),
        startYear = this._viewDate.clone().year(yearCaps[0]),
        endYear = this._viewDate.clone().year(yearCaps[1]);
      let html = '';

      yearsViewHeader
        .eq(0)
        .find('span')
        .attr('title', this._options.tooltips.prevDecade);
      yearsViewHeader.eq(1).attr('title', this._options.tooltips.selectDecade);
      yearsViewHeader
        .eq(2)
        .find('span')
        .attr('title', this._options.tooltips.nextDecade);

      yearsView.find('.disabled').removeClass('disabled');

      if (
        this._options.minDate &&
        this._options.minDate.isAfter(startYear, 'y')
      ) {
        yearsViewHeader.eq(0).addClass('disabled');
      }

      yearsViewHeader.eq(1).text(`${startYear.year()}-${endYear.year()}`);

      if (
        this._options.maxDate &&
        this._options.maxDate.isBefore(endYear, 'y')
      ) {
        yearsViewHeader.eq(2).addClass('disabled');
      }

      html += `<span data-action="selectYear" class="year old${
        !this._isValid(startYear, 'y') ? ' disabled' : ''
      }">${startYear.year() - 1}</span>`;
      while (!startYear.isAfter(endYear, 'y')) {
        html += `<span data-action="selectYear" class="year${
          startYear.isSame(this._getLastPickedDate(), 'y') && !this.unset
            ? ' active'
            : ''
        }${
          !this._isValid(startYear, 'y') ? ' disabled' : ''
        }">${startYear.year()}</span>`;
        startYear.add(1, 'y');
      }
      html += `<span data-action="selectYear" class="year old${
        !this._isValid(startYear, 'y') ? ' disabled' : ''
      }">${startYear.year()}</span>`;

      yearsView.find('td').html(html);
    }

    _updateDecades() {
      //todo jquery moment
      const decadesView = this.widget.find('.datepicker-decades'),
        decadesViewHeader = decadesView.find('th'),
        yearCaps = this._getStartEndYear(100, this._viewDate.year()),
        startDecade = this._viewDate.clone().year(yearCaps[0]),
        endDecade = this._viewDate.clone().year(yearCaps[1]),
        lastPickedDate = this._getLastPickedDate();
      let minDateDecade = false,
        maxDateDecade = false,
        endDecadeYear,
        html = '';

      decadesViewHeader
        .eq(0)
        .find('span')
        .attr('title', this._options.tooltips.prevCentury);
      decadesViewHeader
        .eq(2)
        .find('span')
        .attr('title', this._options.tooltips.nextCentury);

      decadesView.find('.disabled').removeClass('disabled');

      if (
        startDecade.year() === 0 ||
        (this._options.minDate &&
          this._options.minDate.isAfter(startDecade, 'y'))
      ) {
        decadesViewHeader.eq(0).addClass('disabled');
      }

      decadesViewHeader.eq(1).text(`${startDecade.year()}-${endDecade.year()}`);

      if (
        this._options.maxDate &&
        this._options.maxDate.isBefore(endDecade, 'y')
      ) {
        decadesViewHeader.eq(2).addClass('disabled');
      }

      if (startDecade.year() - 10 < 0) {
        html += '<span>&nbsp;</span>';
      } else {
        html += `<span data-action="selectDecade" class="decade old" data-selection="${
          startDecade.year() + 6
        }">${startDecade.year() - 10}</span>`;
      }

      while (!startDecade.isAfter(endDecade, 'y')) {
        endDecadeYear = startDecade.year() + 11;
        minDateDecade =
          this._options.minDate &&
          this._options.minDate.isAfter(startDecade, 'y') &&
          this._options.minDate.year() <= endDecadeYear;
        maxDateDecade =
          this._options.maxDate &&
          this._options.maxDate.isAfter(startDecade, 'y') &&
          this._options.maxDate.year() <= endDecadeYear;
        html += `<span data-action="selectDecade" class="decade${
          lastPickedDate &&
          lastPickedDate.isAfter(startDecade) &&
          lastPickedDate.year() <= endDecadeYear
            ? ' active'
            : ''
        }${
          !this._isValid(startDecade, 'y') && !minDateDecade && !maxDateDecade
            ? ' disabled'
            : ''
        }" data-selection="${
          startDecade.year() + 6
        }">${startDecade.year()}</span>`;
        startDecade.add(10, 'y');
      }
      html += `<span data-action="selectDecade" class="decade old" data-selection="${
        startDecade.year() + 6
      }">${startDecade.year()}</span>`;

      decadesView.find('td').html(html);
    }

    _fillDate() {
      //todo jquery moment
      const daysView = this.widget.find('.datepicker-days'),
        daysViewHeader = daysView.find('th'),
        html = [];
      let currentDate, row, clsName, i;

      if (!this._hasDate()) {
        return;
      }

      daysViewHeader
        .eq(0)
        .find('span')
        .attr('title', this._options.tooltips.prevMonth);
      daysViewHeader.eq(1).attr('title', this._options.tooltips.selectMonth);
      daysViewHeader
        .eq(2)
        .find('span')
        .attr('title', this._options.tooltips.nextMonth);

      daysView.find('.disabled').removeClass('disabled');
      daysViewHeader
        .eq(1)
        .text(this._viewDate.format(this._options.dayViewHeaderFormat));

      if (!this._isValid(this._viewDate.clone().subtract(1, 'M'), 'M')) {
        daysViewHeader.eq(0).addClass('disabled');
      }
      if (!this._isValid(this._viewDate.clone().add(1, 'M'), 'M')) {
        daysViewHeader.eq(2).addClass('disabled');
      }

      currentDate = this._viewDate
        .clone()
        .startOf('M')
        .startOf('w')
        .add(12, 'hours');

      for (i = 0; i < 42; i++) {
        //always display 42 days (should show 6 weeks)
        if (currentDate.weekday() === 0) {
          row = $('<tr>');
          if (this._options.calendarWeeks) {
            row.append(`<td class="cw">${currentDate.week()}</td>`);
          }
          html.push(row);
        }
        clsName = '';
        if (currentDate.isBefore(this._viewDate, 'M')) {
          clsName += ' old';
        }
        if (currentDate.isAfter(this._viewDate, 'M')) {
          clsName += ' new';
        }
        if (this._options.multipleDates) {
          var index = this._datesFormatted.indexOf(
            currentDate.format('YYYY-MM-DD')
          );
          if (index !== -1) {
            if (
              currentDate.isSame(this._datesFormatted[index], 'd') &&
              !this.unset
            ) {
              clsName += ' active';
            }
          }
        } else {
          if (
            currentDate.isSame(this._getLastPickedDate(), 'd') &&
            !this.unset
          ) {
            clsName += ' active';
          }
        }
        if (!this._isValid(currentDate, 'd')) {
          clsName += ' disabled';
        }
        if (currentDate.isSame(this.getMoment(), 'd')) {
          clsName += ' today';
        }
        if (currentDate.day() === 0 || currentDate.day() === 6) {
          clsName += ' weekend';
        }
        row.append(
          `<td data-action="selectDay" data-day="${currentDate.format(
            'L'
          )}" class="day${clsName}">${currentDate.date()}</td>`
        );
        currentDate.add(1, 'd');
      }

      $('body').addClass(
        'tempusdominus-bootstrap-datetimepicker-widget-day-click'
      );
      $('body').append(
        '<div class="tempusdominus-bootstrap-datetimepicker-widget-day-click-glass-panel"></div>'
      );
      daysView.find('tbody').empty().append(html);
      $('body')
        .find(
          '.tempusdominus-bootstrap-datetimepicker-widget-day-click-glass-panel'
        )
        .remove();
      $('body').removeClass(
        'tempusdominus-bootstrap-datetimepicker-widget-day-click'
      );

      this._updateMonths();

      this._updateYears();

      this._updateDecades();
    }

    _fillHours() {
      //todo jquery moment
      const table = this.widget.find('.timepicker-hours table'),
        currentHour = this._viewDate.clone().startOf('d'),
        html = [];
      let row = $('<tr>');

      if (this._viewDate.hour() > 11 && !this.use24Hours) {
        currentHour.hour(12);
      }
      while (
        currentHour.isSame(this._viewDate, 'd') &&
        (this.use24Hours ||
          (this._viewDate.hour() < 12 && currentHour.hour() < 12) ||
          this._viewDate.hour() > 11)
      ) {
        if (currentHour.hour() % 4 === 0) {
          row = $('<tr>');
          html.push(row);
        }
        row.append(
          `<td data-action="selectHour" class="hour${
            !this._isValid(currentHour, 'h') ? ' disabled' : ''
          }">${currentHour.format(this.use24Hours ? 'HH' : 'hh')}</td>`
        );
        currentHour.add(1, 'h');
      }
      table.empty().append(html);
    }

    _fillMinutes() {
      //todo jquery moment
      const table = this.widget.find('.timepicker-minutes table'),
        currentMinute = this._viewDate.clone().startOf('h'),
        html = [],
        step = this._options.stepping === 1 ? 5 : this._options.stepping;
      let row = $('<tr>');

      while (this._viewDate.isSame(currentMinute, 'h')) {
        if (currentMinute.minute() % (step * 4) === 0) {
          row = $('<tr>');
          html.push(row);
        }
        row.append(
          `<td data-action="selectMinute" class="minute${
            !this._isValid(currentMinute, 'm') ? ' disabled' : ''
          }">${currentMinute.format('mm')}</td>`
        );
        currentMinute.add(step, 'm');
      }
      table.empty().append(html);
    }

    _fillSeconds() {
      //todo jquery moment
      const table = this.widget.find('.timepicker-seconds table'),
        currentSecond = this._viewDate.clone().startOf('m'),
        html = [];
      let row = $('<tr>');

      while (this._viewDate.isSame(currentSecond, 'm')) {
        if (currentSecond.second() % 20 === 0) {
          row = $('<tr>');
          html.push(row);
        }
        row.append(
          `<td data-action="selectSecond" class="second${
            !this._isValid(currentSecond, 's') ? ' disabled' : ''
          }">${currentSecond.format('ss')}</td>`
        );
        currentSecond.add(5, 's');
      }

      table.empty().append(html);
    }

    _fillTime() {
      //todo jquery moment
      let toggle, newDate;
      const timeComponents = this.widget.find(
          '.timepicker span[data-time-component]'
        ),
        lastPickedDate = this._getLastPickedDate();

      if (!this.use24Hours) {
        toggle = this.widget.find('.timepicker [data-action=togglePeriod]');
        newDate = lastPickedDate
          ? lastPickedDate
              .clone()
              .add(lastPickedDate.hours() >= 12 ? -12 : 12, 'h')
          : void 0;

        lastPickedDate && toggle.text(lastPickedDate.format('A'));

        if (this._isValid(newDate, 'h')) {
          toggle.removeClass('disabled');
        } else {
          toggle.addClass('disabled');
        }
      }
      lastPickedDate &&
        timeComponents
          .filter('[data-time-component=hours]')
          .text(lastPickedDate.format(`${this.use24Hours ? 'HH' : 'hh'}`));
      lastPickedDate &&
        timeComponents
          .filter('[data-time-component=minutes]')
          .text(lastPickedDate.format('mm'));
      lastPickedDate &&
        timeComponents
          .filter('[data-time-component=seconds]')
          .text(lastPickedDate.format('ss'));

      this._fillHours();
      this._fillMinutes();
      this._fillSeconds();
    }

    _doAction(e, action) {
      let lastPicked = this._getLastPickedDate();
      if ($(e.currentTarget).is('.disabled')) {
        return false;
      }
      action = action || $(e.currentTarget).data('action');
      switch (action) {
        case 'next': {
          const navFnc = DatePickerModes[this._currentViewMode].unit;
          this._viewDate.add(
            DatePickerModes[this._currentViewMode].step,
            navFnc
          );
          this._fillDate();
          this._viewUpdate(navFnc);
          break;
        }
        case 'previous': {
          const navFnc = DatePickerModes[this._currentViewMode].unit;
          this._viewDate.subtract(
            DatePickerModes[this._currentViewMode].step,
            navFnc
          );
          this._fillDate();
          this._viewUpdate(navFnc);
          break;
        }
        case 'pickerSwitch':
          this._showMode(1);
          break;
        case 'selectMonth': {
          const month = $(e.target)
            .closest('tbody')
            .find('span')
            .index($(e.target));
          this._viewDate.month(month);
          if (this._currentViewMode === this.MinViewModeNumber) {
            this._setValue(
              lastPicked
                .clone()
                .year(this._viewDate.year())
                .month(this._viewDate.month()),
              this._getLastPickedDateIndex()
            );
            if (!this._options.inline) {
              this.hide();
            }
          } else {
            this._showMode(-1);
            this._fillDate();
          }
          this._viewUpdate('M');
          break;
        }
        case 'selectYear': {
          const year = parseInt($(e.target).text(), 10) || 0;
          this._viewDate.year(year);
          if (this._currentViewMode === this.MinViewModeNumber) {
            this._setValue(
              lastPicked.clone().year(this._viewDate.year()),
              this._getLastPickedDateIndex()
            );
            if (!this._options.inline) {
              this.hide();
            }
          } else {
            this._showMode(-1);
            this._fillDate();
          }
          this._viewUpdate('YYYY');
          break;
        }
        case 'selectDecade': {
          const year = parseInt($(e.target).data('selection'), 10) || 0;
          this._viewDate.year(year);
          if (this._currentViewMode === this.MinViewModeNumber) {
            this._setValue(
              lastPicked.clone().year(this._viewDate.year()),
              this._getLastPickedDateIndex()
            );
            if (!this._options.inline) {
              this.hide();
            }
          } else {
            this._showMode(-1);
            this._fillDate();
          }
          this._viewUpdate('YYYY');
          break;
        }
        case 'selectDay': {
          const day = this._viewDate.clone();
          if ($(e.target).is('.old')) {
            day.subtract(1, 'M');
          }
          if ($(e.target).is('.new')) {
            day.add(1, 'M');
          }

          var selectDate = day.date(parseInt($(e.target).text(), 10)),
            index = 0;
          if (this._options.multipleDates) {
            index = this._datesFormatted.indexOf(
              selectDate.format('YYYY-MM-DD')
            );
            if (index !== -1) {
              this._setValue(null, index); //deselect multidate
            } else {
              this._setValue(selectDate, this._getLastPickedDateIndex() + 1);
            }
          } else {
            this._setValue(selectDate, this._getLastPickedDateIndex());
          }

          if (
            !this._hasTime() &&
            !this._options.keepOpen &&
            !this._options.inline &&
            !this._options.multipleDates
          ) {
            this.hide();
          }
          break;
        }
        case 'incrementHours': {
          if (!lastPicked) {
            break;
          }
          const newDate = lastPicked.clone().add(1, 'h');
          if (this._isValid(newDate, 'h')) {
            if (this._getLastPickedDateIndex() < 0) {
              this.date(newDate);
            }
            this._setValue(newDate, this._getLastPickedDateIndex());
          }
          break;
        }
        case 'incrementMinutes': {
          if (!lastPicked) {
            break;
          }
          const newDate = lastPicked.clone().add(this._options.stepping, 'm');
          if (this._isValid(newDate, 'm')) {
            if (this._getLastPickedDateIndex() < 0) {
              this.date(newDate);
            }
            this._setValue(newDate, this._getLastPickedDateIndex());
          }
          break;
        }
        case 'incrementSeconds': {
          if (!lastPicked) {
            break;
          }
          const newDate = lastPicked.clone().add(1, 's');
          if (this._isValid(newDate, 's')) {
            if (this._getLastPickedDateIndex() < 0) {
              this.date(newDate);
            }
            this._setValue(newDate, this._getLastPickedDateIndex());
          }
          break;
        }
        case 'decrementHours': {
          if (!lastPicked) {
            break;
          }
          const newDate = lastPicked.clone().subtract(1, 'h');
          if (this._isValid(newDate, 'h')) {
            if (this._getLastPickedDateIndex() < 0) {
              this.date(newDate);
            }
            this._setValue(newDate, this._getLastPickedDateIndex());
          }
          break;
        }
        case 'decrementMinutes': {
          if (!lastPicked) {
            break;
          }
          const newDate = lastPicked
            .clone()
            .subtract(this._options.stepping, 'm');
          if (this._isValid(newDate, 'm')) {
            if (this._getLastPickedDateIndex() < 0) {
              this.date(newDate);
            }
            this._setValue(newDate, this._getLastPickedDateIndex());
          }
          break;
        }
        case 'decrementSeconds': {
          if (!lastPicked) {
            break;
          }
          const newDate = lastPicked.clone().subtract(1, 's');
          if (this._isValid(newDate, 's')) {
            if (this._getLastPickedDateIndex() < 0) {
              this.date(newDate);
            }
            this._setValue(newDate, this._getLastPickedDateIndex());
          }
          break;
        }
        case 'togglePeriod': {
          this._setValue(
            lastPicked.clone().add(lastPicked.hours() >= 12 ? -12 : 12, 'h'),
            this._getLastPickedDateIndex()
          );
          break;
        }
        case 'togglePicker':
          {
            const $this = $(e.target),
              $link = $this.closest('a'),
              $parent = $this.closest('ul'),
              expanded = $parent.find('.show'),
              closed = $parent.find('.collapse:not(.show)'),
              $span = $this.is('span') ? $this : $this.find('span');
            let collapseData, inactiveIcon, iconTest;

            if (expanded && expanded.length) {
              collapseData = expanded.data('collapse');
              if (collapseData && collapseData.transitioning) {
                return true;
              }
              if (expanded.collapse) {
                // if collapse plugin is available through bootstrap.js then use it
                expanded.collapse('hide');
                closed.collapse('show');
              } else {
                // otherwise just toggle in class on the two views
                expanded.removeClass('show');
                closed.addClass('show');
              }

              $span.toggleClass(
                this._options.icons.time + ' ' + this._options.icons.date
              );

              iconTest = $span.hasClass(this._options.icons.date);

              if (iconTest) {
                $link.attr('title', this._options.tooltips.selectDate);
              } else {
                $link.attr('title', this._options.tooltips.selectTime);
              }
            }
          }
          break;
        case 'showPicker':
          this.widget.find('.timepicker > div:not(.timepicker-picker)').hide();
          this.widget.find('.timepicker .timepicker-picker').show();
          break;
        case 'showHours':
          this.widget.find('.timepicker .timepicker-picker').hide();
          this.widget.find('.timepicker .timepicker-hours').show();
          break;
        case 'showMinutes':
          this.widget.find('.timepicker .timepicker-picker').hide();
          this.widget.find('.timepicker .timepicker-minutes').show();
          break;
        case 'showSeconds':
          this.widget.find('.timepicker .timepicker-picker').hide();
          this.widget.find('.timepicker .timepicker-seconds').show();
          break;
        case 'selectHour': {
          let hour = parseInt($(e.target).text(), 10);

          if (!this.use24Hours) {
            if (lastPicked.hours() >= 12) {
              if (hour !== 12) {
                hour += 12;
              }
            } else {
              if (hour === 12) {
                hour = 0;
              }
            }
          }
          this._setValue(
            lastPicked.clone().hours(hour),
            this._getLastPickedDateIndex()
          );
          if (
            !this._isEnabled('a') &&
            !this._isEnabled('m') &&
            !this._options.keepOpen &&
            !this._options.inline
          ) {
            this.hide();
          } else {
            this._doAction(e, 'showPicker');
          }
          break;
        }
        case 'selectMinute':
          this._setValue(
            lastPicked.clone().minutes(parseInt($(e.target).text(), 10)),
            this._getLastPickedDateIndex()
          );
          if (
            !this._isEnabled('a') &&
            !this._isEnabled('s') &&
            !this._options.keepOpen &&
            !this._options.inline
          ) {
            this.hide();
          } else {
            this._doAction(e, 'showPicker');
          }
          break;
        case 'selectSecond':
          this._setValue(
            lastPicked.clone().seconds(parseInt($(e.target).text(), 10)),
            this._getLastPickedDateIndex()
          );
          if (
            !this._isEnabled('a') &&
            !this._options.keepOpen &&
            !this._options.inline
          ) {
            this.hide();
          } else {
            this._doAction(e, 'showPicker');
          }
          break;
        case 'clear':
          this.clear();
          break;
        case 'close':
          this.hide();
          break;
        case 'today': {
          const todaysDate = this.getMoment();
          if (this._isValid(todaysDate, 'd')) {
            this._setValue(todaysDate, this._getLastPickedDateIndex());
          }
          break;
        }
      }
      return false;
    }

    //#endregion

    //#region Public

    getMoment(d) {
      //todo moment... lots of moment, I mean it's in the name
      let returnMoment;

      if (d === undefined || d === null) {
        // TODO: Should this use format?
        returnMoment = moment().clone().locale(this._options.locale);
      } else if (this._hasTimeZone()) {
        // There is a string to parse and a default time zone
        // parse with the tz function which takes a default time zone if it is not in the format string
        returnMoment = moment.tz(
          d,
          this.parseFormats,
          this._options.locale,
          this._options.useStrict,
          this._options.timeZone
        );
      } else {
        returnMoment = moment(
          d,
          this.parseFormats,
          this._options.locale,
          this._options.useStrict
        );
      }

      if (this._hasTimeZone()) {
        returnMoment.tz(this._options.timeZone);
      }

      return returnMoment;
    }

    toggle() {
      return this.widget ? this.hide() : this.show();
    }

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
        if (this._options.multipleDates) {
          return this._dates.join(this._options.multipleDatesSeparator);
        } else {
          return this._dates[index].clone();
        }
      }

      if (
        newDate !== null &&
        typeof newDate !== 'string' &&
        !moment.isMoment(newDate) &&
        !(newDate instanceof Date)
      ) {
        //todo moment
        throw new TypeError(
          'date() parameter must be one of [null, string, moment or Date]'
        );
      }

      function isValidDateTimeStr(str) {
        //todo do I want this scooped here?
        function isValidDate(date) {
          return (
            Object.prototype.toString.call(date) === '[object Date]' &&
            !isNaN(date.getTime())
          );
        }

        return isValidDate(new Date(str));
      }

      if (typeof newDate === 'string' && isValidDateTimeStr(newDate)) {
        newDate = new Date(newDate);
      }

      this._setValue(
        newDate === null ? null : this._parseInputDate(newDate),
        index
      );
    }

    updateOnlyThroughDateOption(updateOnlyThroughDateOption) {
      if (typeof updateOnlyThroughDateOption !== 'boolean') {
        throw new TypeError(
          'updateOnlyThroughDateOption() expects a boolean parameter'
        );
      }

      this._options.updateOnlyThroughDateOption = updateOnlyThroughDateOption;
    }

    format(newFormat) {
      if (arguments.length === 0) {
        return this._options.format;
      }

      if (
        typeof newFormat !== 'string' &&
        (typeof newFormat !== 'boolean' || newFormat !== false)
      ) {
        throw new TypeError(
          `format() expects a string or boolean:false parameter ${newFormat}`
        );
      }

      this._options.format = newFormat;
      if (this.actualFormat) {
        this._initFormatting(); // reinitialize formatting
      }
    }

    timeZone(newZone) {
      if (arguments.length === 0) {
        return this._options.timeZone;
      }

      if (typeof newZone !== 'string') {
        throw new TypeError('newZone() expects a string parameter');
      }

      this._options.timeZone = newZone;
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

    extraFormats(formats) {
      if (arguments.length === 0) {
        return this._options.extraFormats;
      }

      if (formats !== false && !(formats instanceof Array)) {
        throw new TypeError(
          'extraFormats() expects an array or false parameter'
        );
      }

      this._options.extraFormats = formats;
      if (this.parseFormats) {
        this._initFormatting(); // reinitialize formatting
      }
    }

    disabledDates(dates) {
      if (arguments.length === 0) {
        return this._options.disabledDates
          ? $.extend({}, this._options.disabledDates)
          : this._options.disabledDates; //todo jquery
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
        return this._options.enabledDates
          ? $.extend({}, this._options.enabledDates)
          : this._options.enabledDates; //todo jquery
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
      this._options.daysOfWeekDisabled = daysOfWeekDisabled
        .reduce(function (previousValue, currentValue) {
          currentValue = parseInt(currentValue, 10);
          if (currentValue > 6 || currentValue < 0 || isNaN(currentValue)) {
            return previousValue;
          }
          if (previousValue.indexOf(currentValue) === -1) {
            previousValue.push(currentValue);
          }
          return previousValue;
        }, [])
        .sort();
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
        return this._options.maxDate
          ? this._options.maxDate.clone()
          : this._options.maxDate; //todo moment
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

      if (!parsedDate.isValid()) {
        //todo moment
        throw new TypeError(
          `maxDate() Could not parse date parameter: ${maxDate}`
        );
      }
      if (this._options.minDate && parsedDate.isBefore(this._options.minDate)) {
        //todo moment
        throw new TypeError(
          `maxDate() date parameter is before this.options.minDate: ${parsedDate.format(
            this.actualFormat
          )}`
        );
      }
      this._options.maxDate = parsedDate;
      for (let i = 0; i < this._dates.length; i++) {
        if (
          this._options.useCurrent &&
          !this._options.keepInvalid &&
          this._dates[i].isAfter(maxDate)
        ) {
          this._setValue(this._options.maxDate, i);
        }
      }
      if (this._viewDate.isAfter(parsedDate)) {
        //todo moment
        this._viewDate = parsedDate
          .clone()
          .subtract(this._options.stepping, 'm'); //todo moment
      }
      this._update();
    }

    minDate(minDate) {
      if (arguments.length === 0) {
        return this._options.minDate
          ? this._options.minDate.clone()
          : this._options.minDate; //todo moment
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

      if (!parsedDate.isValid()) {
        //todo moment
        throw new TypeError(
          `minDate() Could not parse date parameter: ${minDate}`
        );
      }
      if (this._options.maxDate && parsedDate.isAfter(this._options.maxDate)) {
        throw new TypeError(
          `minDate() date parameter is after this.options.maxDate: ${parsedDate.format(
            this.actualFormat
          )}`
        );
      }
      this._options.minDate = parsedDate;
      for (let i = 0; i < this._dates.length; i++) {
        if (
          this._options.useCurrent &&
          !this._options.keepInvalid &&
          this._dates[i].isBefore(minDate)
        ) {
          //todo moment
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
        return this._options.defaultDate
          ? this._options.defaultDate.clone()
          : this._options.defaultDate; //todo moment
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
      if (!parsedDate.isValid()) {
        //todo moment
        throw new TypeError(
          `defaultDate() Could not parse date parameter: ${defaultDate}`
        );
      }
      if (!this._isValid(parsedDate)) {
        throw new TypeError(
          'defaultDate() date passed is invalid according to component setup validations'
        );
      }

      this._options.defaultDate = parsedDate;

      if (
        (this._options.defaultDate && this._options.inline) ||
        (this.input !== undefined && this.input.val().trim() === '')
      ) {
        this._setValue(this._options.defaultDate, 0);
      }
    }

    locale(locale) {
      if (arguments.length === 0) {
        return this._options.locale;
      }

      if (!moment.localeData(locale)) {
        //todo moment
        throw new TypeError(
          `locale() locale ${locale} is not loaded from moment locales!`
        );
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
        throw new TypeError(
          'useCurrent() expects a boolean or string parameter'
        );
      }
      if (
        typeof useCurrent === 'string' &&
        useCurrentOptions.indexOf(useCurrent.toLowerCase()) === -1
      ) {
        throw new TypeError(
          `useCurrent() expects a string parameter of ${useCurrentOptions.join(
            ', '
          )}`
        );
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

    useStrict(useStrict) {
      //todo useStrict is a moment construct. might not be needed.
      if (arguments.length === 0) {
        return this._options.useStrict;
      }

      if (typeof useStrict !== 'boolean') {
        throw new TypeError('useStrict() expects a boolean parameter');
      }
      this._options.useStrict = useStrict;
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
        throw new TypeError(
          `viewMode() parameter must be one of (${ViewModes.join(', ')}) value`
        );
      }

      this._options.viewMode = viewMode;
      this._currentViewMode = Math.max(
        ViewModes.indexOf(viewMode) - 1,
        this.MinViewModeNumber
      );

      this._showMode();
    }

    calendarWeeks(calendarWeeks) {
      if (arguments.length === 0) {
        return this._options.calendarWeeks;
      }

      if (typeof calendarWeeks !== 'boolean') {
        throw new TypeError(
          'calendarWeeks() expects parameter to be a boolean value'
        );
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
        showClose: buttons.showClose || false,
      };

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
        return this._options.disabledTimeIntervals
          ? $.extend({}, this._options.disabledTimeIntervals)
          : this._options.disabledTimeIntervals; //todo jquery
      }

      if (!disabledTimeIntervals) {
        this._options.disabledTimeIntervals = false;
        this._update();
        return true;
      }
      if (!(disabledTimeIntervals instanceof Array)) {
        throw new TypeError(
          'disabledTimeIntervals() expects an array parameter'
        );
      }
      this._options.disabledTimeIntervals = disabledTimeIntervals;
      this._update();
    }

    disabledHours(hours) {
      if (arguments.length === 0) {
        return this._options.disabledHours
          ? $.extend({}, this._options.disabledHours)
          : this._options.disabledHours; //todo jquery
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
        return this._options.enabledHours
          ? $.extend({}, this._options.enabledHours)
          : this._options.enabledHours; //todo jquery
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

      if (
        typeof newDate !== 'string' &&
        !moment.isMoment(newDate) &&
        !(newDate instanceof Date)
      ) {
        //todo moment
        throw new TypeError(
          'viewDate() parameter must be one of [string, moment or Date]'
        );
      }

      this._viewDate = this._parseInputDate(newDate);
      this._update();
      this._viewUpdate(
        DatePickerModes[this._currentViewMode] &&
          DatePickerModes[this._currentViewMode].unit
      );
    }

    allowMultidate(allowMultidate) {
      if (typeof allowMultidate !== 'boolean') {
        throw new TypeError('allowMultidate() expects a boolean parameter');
      }

      this._options.multipleDates = allowMultidate;
    }

    multidateSeparator(multidateSeparator) {
      if (arguments.length === 0) {
        return this._options.multipleDatesSeparator;
      }

      if (typeof multidateSeparator !== 'string') {
        throw new TypeError('multidateSeparator expects a string parameter');
      }

      this._options.multipleDatesSeparator = multidateSeparator;
    }

    hide() {
      //todo jquery
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

      if (
        this.input !== undefined &&
        this.input.val() !== undefined &&
        this.input.val().trim().length !== 0
      ) {
        this._setValue(
          this._parseInputDate(this.input.val().trim(), {
            isPickerShow: false,
          }),
          0
        );
      }
      const lastPickedDate = this._getLastPickedDate();
      this._notifyEvent({
        type: EVENT_HIDE,
        date: this.unset
          ? null
          : lastPickedDate
          ? lastPickedDate.clone()
          : void 0,
      });

      if (this.input !== undefined) {
        this.input.blur();
      }

      this._viewDate = lastPickedDate
        ? lastPickedDate.clone()
        : this.getMoment();
    }

    show() {
      //todo jquery moment
      let currentMoment,
        shouldUseCurrentIfUnset = false;
      const useCurrentGranularity = {
        year: function (m) {
          return m.month(0).date(1).hours(0).seconds(0).minutes(0);
        },
        month: function (m) {
          return m.date(1).hours(0).seconds(0).minutes(0);
        },
        day: function (m) {
          return m.hours(0).seconds(0).minutes(0);
        },
        hour: function (m) {
          return m.seconds(0).minutes(0);
        },
        minute: function (m) {
          return m.seconds(0);
        },
      };

      if (this.input !== undefined) {
        if (
          this.input.prop('disabled') ||
          (!this._options.ignoreReadonly && this.input.prop('readonly')) ||
          this.widget
        ) {
          return;
        }
        if (
          this.input.val() !== undefined &&
          this.input.val().trim().length !== 0
        ) {
          this._setValue(
            this._parseInputDate(this.input.val().trim(), {
              isPickerShow: true,
            }),
            0
          );
        } else {
          shouldUseCurrentIfUnset = true;
        }
      } else {
        shouldUseCurrentIfUnset = true;
      }

      if (shouldUseCurrentIfUnset && this.unset && this._options.useCurrent) {
        currentMoment = this.getMoment();
        if (typeof this._options.useCurrent === 'string') {
          currentMoment =
            useCurrentGranularity[this._options.useCurrent](currentMoment);
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

      $(window).on('resize', { picker: this }, this._place);
      this.widget.on('click', '[data-action]', $.proxy(this._doAction, this)); // this handles clicks on the widget
      this.widget.on('mousedown', false);

      if (this.component && this.component.hasClass('btn')) {
        this.component.toggleClass('active');
      }
      this._place();
      this.widget.show();
      if (
        this.input !== undefined &&
        this._options.focusOnShow &&
        !this.input.is(':focus')
      ) {
        this.input.focus();
      }

      this._notifyEvent({
        type: EVENT_SHOW,
      });
    }

    destroy() {
      //todo jquery
      this.hide();
      //todo doc off?
      this._element.removeData(DATA_KEY);
      this._element.removeData('date');
    }

    disable() {
      //todo jquery
      this.hide();
      if (this.component && this.component.hasClass('btn')) {
        this.component.addClass('disabled');
      }
      if (this.input !== undefined) {
        this.input.prop('disabled', true); //todo disable this/comp if input is null
      }
    }

    enable() {
      //todo jquery
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
        throw new TypeError(
          `toolbarPlacement() parameter must be one of (${toolbarPlacements.join(
            ', '
          )}) value`
        );
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
          throw new TypeError(
            'widgetPositioning() horizontal variable must be a string'
          );
        }
        widgetPositioning.horizontal =
          widgetPositioning.horizontal.toLowerCase();
        if (horizontalModes.indexOf(widgetPositioning.horizontal) === -1) {
          throw new TypeError(
            `widgetPositioning() expects horizontal parameter to be one of (${horizontalModes.join(
              ', '
            )})`
          );
        }
        this._options.widgetPositioning.horizontal =
          widgetPositioning.horizontal;
      }
      if (widgetPositioning.vertical) {
        if (typeof widgetPositioning.vertical !== 'string') {
          throw new TypeError(
            'widgetPositioning() vertical variable must be a string'
          );
        }
        widgetPositioning.vertical = widgetPositioning.vertical.toLowerCase();
        if (verticalModes.indexOf(widgetPositioning.vertical) === -1) {
          throw new TypeError(
            `widgetPositioning() expects vertical parameter to be one of (${verticalModes.join(
              ', '
            )})`
          );
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

      if (
        widgetParent !== null &&
        typeof widgetParent !== 'string' &&
        !(widgetParent instanceof $)
      ) {
        throw new TypeError(
          'widgetParent() expects a string or a jQuery object parameter'
        );
      }

      this._options.widgetParent = widgetParent;
      if (this.widget) {
        this.hide();
        this.show();
      }
    }

    setMultiDate(multiDateArray) {
      //todo moment
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
        throw new TypeError(
          'options() this.options parameter should be an object'
        );
      }
      $.extend(true, this._options, newOptions); //todo jquery
      const self = this,
        optionsKeys = Object.keys(this._options).sort(optionsSortFn);
      $.each(optionsKeys, function (i, key) {
        //todo jquery
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
  $(document)
    .on(EVENT_CLICK_DATA_API, Selector.DATA_TOGGLE, function () {
      const $originalTarget = $(this),
        $target = getSelectorFromElement($originalTarget),
        config = $target.data(DATA_KEY);
      if ($target.length === 0) {
        return;
      }
      if (
        config._options.allowInputToggle &&
        $originalTarget.is('input[data-toggle="datetimepicker"]')
      ) {
        return;
      }
      TempusDominus._jQueryInterface.call($target, 'toggle');
    })
    .on(EVENT_CHANGE, `.${ClassName.INPUT}`, function (event) {
      const $target = getSelectorFromElement($(this));
      if ($target.length === 0 || event.isInit) {
        return;
      }
      TempusDominus._jQueryInterface.call($target, '_change', event);
    })
    .on(EVENT_BLUR, `.${ClassName.INPUT}`, function (event) {
      const $target = getSelectorFromElement($(this)),
        config = $target.data(DATA_KEY);
      if ($target.length === 0) {
        return;
      }
      if (config._options.debug || window.debug) {
        return;
      }
      TempusDominus._jQueryInterface.call($target, 'hide', event);
    })
    .on(EVENT_KEYDOWN, `.${ClassName.INPUT}`, function (event) {
      const $target = getSelectorFromElement($(this));
      if ($target.length === 0) {
        return;
      }
      TempusDominus._jQueryInterface.call($target, '_keydown', event);
    })
    .on(EVENT_KEYUP, `.${ClassName.INPUT}`, function (event) {
      const $target = getSelectorFromElement($(this));
      if ($target.length === 0) {
        return;
      }
      TempusDominus._jQueryInterface.call($target, '_keyup', event);
    })
    .on(EVENT_FOCUS, `.${ClassName.INPUT}`, function (event) {
      const $target = getSelectorFromElement($(this)),
        config = $target.data(DATA_KEY);
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
