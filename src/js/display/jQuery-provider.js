import Namespace from '../namespace';
import { DefaultOptions } from '../conts';

static _jQueryInterface(option, argument) {
  const _jQueryHandleThis = (me, option, argument) => {
    let data = $(me).data(Namespace.DATA_KEY);
    if (typeof option === 'object') {
      // noinspection TypeScriptValidateJSTypes
      $.jQuery.extend({}, DefaultOptions, option);
    }

    if (!data) {
      data = new TempusDominus($(me)[0], option);
      $(me).data(Namespace.DATA_KEY, data);
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
  };

  if (this.length === 1) {
    return _jQueryHandleThis(this[0], option, argument);
  }
  // "this" is jquery here
  return (this as any).each(function () {
    _jQueryHandleThis(this, option, argument);
  });
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
