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

  const KeyMap = {
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
    _parseInputDate(inputDate, { isPickerShow = false } = {}) {
      if (this.options.parseInputDate === undefined || isPickerShow) {
        if (!moment.isMoment(inputDate)) {
          //todo moment
          inputDate = this.getMoment(inputDate);
        }
      } else {
        inputDate = this.options.parseInputDate(inputDate);
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

      for (index in this.options.keyBinds) {
        if (
          this.options.keyBinds.hasOwnProperty(index) &&
          typeof this.options.keyBinds[index] === 'function'
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
              handler = this.options.keyBinds[index];
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

    _place(e) {
      //todo replace with popper2
      let self = (e && e.data && e.data.picker) || this,
        vertical = self._options.widgetPositioning.vertical,
        horizontal = self._options.widgetPositioning.horizontal,
        parent;
      const position = (self.component && self.component.length
          ? self.component
          : self._element
        ).position(), //todo jquery
        offset = (self.component && self.component.length
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

    //#endregion

    //#region Public

    date(newDate, index) {
      index = index || 0;
      if (arguments.length === 0) {
        if (this._unset) {
          return null;
        }
        if (this.options.allowMultidate) {
          return this._dates.join(this.options.multidateSeparator);
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
        this._input !== undefined &&
        this._input.val() !== undefined &&
        this._input.val().trim().length !== 0
      ) {
        this._setValue(
          this._parseInputDate(this._input.val().trim(), {
            isPickerShow: false,
          }),
          0
        );
      }
      const lastPickedDate = this._getLastPickedDate();
      this._triggerEvent({
        type: EVENT_HIDE,
        date: this._unset
          ? null
          : lastPickedDate
          ? lastPickedDate.clone()
          : void 0,
      });

      if (this._input !== undefined) {
        this._input.blur();
      }

      this.viewDate = lastPickedDate
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

      if (this._input !== undefined) {
        if (
          this._input.prop('disabled') ||
          (!this.options.ignoreReadonly && this._input.prop('readonly')) ||
          this.widget
        ) {
          return;
        }
        if (
          this._input.val() !== undefined &&
          this._input.val().trim().length !== 0
        ) {
          this._setValue(
            this._parseInputDate(this._input.val().trim(), {
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

      if (shouldUseCurrentIfUnset && this._unset && this.options.useCurrent) {
        currentMoment = this.getMoment();
        if (typeof this.options.useCurrent === 'string') {
          currentMoment = useCurrentGranularity[this.options.useCurrent](
            currentMoment
          );
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
        this._input !== undefined &&
        this.options.focusOnShow &&
        !this._input.is(':focus')
      ) {
        this._input.focus();
      }

      this._triggerEvent({
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
