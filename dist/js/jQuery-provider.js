/*global $ */

//window.tempusdominus.Namespace.Events

tempusdominus.jQueryInterface = function (option, argument) {
  const _jQueryHandleThis = (me, option, argument) => {
    let data = $(me).data(tempusdominus.Namespace.DATA_KEY);
    if (typeof option === 'object') {
      // noinspection TypeScriptValidateJSTypes
      $.jQuery.extend({}, tempusdominus.DefaultOptions, option);
    }

    if (!data) {
      data = new tempusdominus.TempusDominus($(me)[0], option);
      $(me).data(tempusdominus.Namespace.DATA_KEY, data);
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
    return tempusdominus.jQueryHandleThis(this, option, argument);
  }
  // "this" is jquery here
  return this.each(function () {
    tempusdominus.jQueryHandleThis(this, option, argument);
  });
};

tempusdominus.jQueryHandleThis = function (me, option, argument) {
  let data = $(me).data(tempusdominus.Namespace.DATA_KEY);
  if (typeof option === 'object') {
    $.extend({}, tempusdominus.DefaultOptions, option);
  }

  if (!data) {
    data = new tempusdominus.TempusDominus($(me)[0], option);
    $(me).data(tempusdominus.Namespace.DATA_KEY, data);
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

tempusdominus.getSelectorFromElement = function ($element) {
  let selector = $element.data('target'),
    $selector;

  if (!selector) {
    selector = $element.attr('href') || '';
    selector = /^#[a-z]/i.test(selector) ? selector : null;
  }
  $selector = $(selector);
  if ($selector.length === 0) {
    return $element;
  }

  if (!$selector.data(tempusdominus.Namespace.DATA_KEY)) {
    $.extend({}, $selector.data(), $(this).data());
  }

  return $selector;
};

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 */
$(document)
  .on(
    `click${tempusdominus.Namespace.Events.key}.data-api`,
    `[data-toggle="${tempusdominus.Namespace.DATA_KEY}"]`,
    function () {
      const $originalTarget = $(this),
        $target = tempusdominus.getSelectorFromElement($originalTarget),
        config = $target.data(tempusdominus.Namespace.DATA_KEY);
      if ($target.length === 0) {
        return;
      }
      if (
        config._options.allowInputToggle &&
        $originalTarget.is('input[data-toggle="datetimepicker"]')
      ) {
        return;
      }
      tempusdominus.jQueryInterface.call($target, 'toggle');
    }
  )
  .on(
    tempusdominus.Namespace.Events.change,
    `.${tempusdominus.Namespace.NAME}-input`,
    function (event) {
      const $target = tempusdominus.getSelectorFromElement($(this));
      if ($target.length === 0 || event.isInit) {
        return;
      }
      tempusdominus.jQueryInterface.call($target, '_change', event);
    }
  )
  .on(
    tempusdominus.Namespace.Events.blur,
    `.${tempusdominus.Namespace.NAME}-input`,
    function (event) {
      const $target = tempusdominus.getSelectorFromElement($(this)),
        config = $target.data(tempusdominus.Namespace.DATA_KEY);
      if ($target.length === 0) {
        return;
      }
      if (config._options.debug || window.debug) {
        return;
      }
      tempusdominus.jQueryInterface.call($target, 'hide', event);
    }
  )
  /*.on(tempusdominus.Namespace.Events.keydown, `.${tempusdominus.Namespace.NAME}-input`, function (event) {
    const $target = tempusdominus.getSelectorFromElement($(this));
    if ($target.length === 0) {
      return;
    }
    tempusdominus.jQueryInterface.call($target, '_keydown', event);
  })
  .on(tempusdominus.Namespace.Events.keyup, `.${tempusdominus.Namespace.NAME}-input`, function (event) {
    const $target = tempusdominus.getSelectorFromElement($(this));
    if ($target.length === 0) {
      return;
    }
    tempusdominus.jQueryInterface.call($target, '_keyup', event);
  })*/
  .on(
    tempusdominus.Namespace.Events.focus,
    `.${tempusdominus.Namespace.NAME}-input`,
    function (event) {
      const $target = tempusdominus.getSelectorFromElement($(this)),
        config = $target.data(tempusdominus.Namespace.DATA_KEY);
      if ($target.length === 0) {
        return;
      }
      if (!config._options.allowInputToggle) {
        return;
      }
      tempusdominus.jQueryInterface.call($target, 'show', event);
    }
  );
const name = tempusdominus.Namespace.NAME.replace('-', '');
$.fn[name] = tempusdominus.jQueryInterface;
$.fn[name].Constructor = tempusdominus.TempusDominus;
$.fn[name].noConflict = function () {
  $.fn[name] = $.fn[name];
  return tempusdominus.jQueryInterface;
};
