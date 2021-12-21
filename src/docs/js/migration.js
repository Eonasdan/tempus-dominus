document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('migration')) {
    return;
  }

  const alertBox = document.getElementById('alert');
  const createAlert = (message, style) => {
    const div = document.createElement('div');
    div.className = `alert alert-${style} alert-dismissible fade show`;
    div.innerHTML = `${message}<button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button>`;
    alertBox.appendChild(div);
  };

  class JsConvert {
    constructor() {
      this.input = document.getElementById('from');
      this.output = document.getElementById('to');
      this.convertButton = document.getElementById('convertButton');
      this.datetimepicker1 = new tempusDominus.TempusDominus(document.getElementById('datetimepicker1'));
      this.convertedConfiguration = undefined;
      this.convertButton.addEventListener('click', this.convert.bind(this));
      this.input.addEventListener('change', this.convert.bind(this));

      document.getElementById('tryIt').addEventListener('click', () => {
        // run if it hasn't been for some reason
        if (!this.convertedConfiguration) this.convert();
        // if still no config, then there was an error.
        if (!this.convertedConfiguration) return;

        this.datetimepicker1.updateOptions(this.convertedConfiguration);
      });
    }

    convert() {
      this.convertedConfiguration = undefined;
      alertBox.innerHTML = '';
      this.output.value = '';
      const value = this.input.value;

      if (!value) {
        this.output.value = 'No configuration was provided.';
        return;
      }

      if (value.includes('moment')) {
        createAlert(
          'I can\'t convert moment objects. See Exception 1.',
          'danger'
        );
        return;
      }

      if (value.match(/[()<>]/gi)) {
        createAlert(
          'Can\'t parse functions or object initializations like new Date(). See Exception 2.',
          'danger'
        );
        return;
      }

      try {
        let config = Function('"use strict";return (' + value + ')')();
        const newOptions = {};

        const prop = prop => obj => {
          const value = obj[prop];
          if (value) return value;
          else {
            obj[prop] = {};
            return obj[prop];
          }
        };

        const ensurePath = (paths, obj) => paths.split('.').reduce((value, key) => prop(key)(value), obj);

        const differentAccepts = (key) => {
          if (['viewMode', 'toolbarPlacement'].includes(key))
            createAlert(`${key} takes a different set of values. Verify this option.`, 'warning');
        };

        Object.entries(config).forEach(([key, value]) => {
          differentAccepts(key);
          switch (key) {
            case 'format':
              createAlert('Format is no longer used to determine component display. See <a href="options.html#displayComponents" target="_blank">component usage</a> and <a href="options.html#hooksInputFormat" target="_blank">input formatting</a>.', 'warning');
              ensurePath('display', newOptions);
              newOptions.display.components = {
                calendar: true,
                date: true,
                month: true,
                year: true,
                decades: true,
                clock: true,
                hours: true,
                minutes: true,
                seconds: false,
                useTwentyfourHour: false
              };
              break;
            case 'icons':
            case 'sideBySide':
            case 'calendarWeeks':
            case 'viewMode':
            case 'toolbarPlacement':
            case 'inline':
              ensurePath('display', newOptions);
              newOptions.display[key] = value;
              break;
            case 'dayViewHeaderFormat':
              createAlert('Moment is no longer supported. This "dayViewHeaderFormat" now accepts Intl formats. See <a href="options.html#localizationDayViewHeaderFormat" target="_blank">localization usage</a>', 'warning');
              ensurePath('localization', newOptions);
              newOptions.localization.dayViewHeaderFormat = { month: 'long', year: '2-digit' };
              break;
            case 'extraFormats':
            case 'collapse':
            case 'useStrict':
            case 'widgetPositioning':
            case 'widgetParent':
            case 'keyBinds':
            case 'ignoreReadonly':
            case 'focusOnShow':
            case 'timeZone':
              createAlert(`${key} is no longer supported and was ignored.`, 'danger');
              break;
            case 'minDate':
            case 'maxDate':
            case 'enabledDates':
            case 'disabledDates':
            case 'enabledHours':
            case 'disabledHours':
            case 'daysOfWeekDisabled':
              ensurePath('restrictions', newOptions);
              newOptions.restrictions[key] = value;
              break;
            case 'disabledTimeIntervals':
              ensurePath('restrictions', newOptions);
              createAlert('The "disabledTimeIntervals" option now expects an array of <code>{ from: x, to: y}</code> See <a href="options.html#restrictionsDisabledTimeIntervals" target="_blank">usage</a>', 'warning');
              newOptions.restrictions.restrictions = [{ from: new Date(), to: new Date() }];
              break;
            case 'useCurrent':
            case 'stepping':
            case 'defaultDate':
            case 'keepOpen':
            case 'keepInvalid':
            case 'debug':
            case 'allowInputToggle':
            case 'viewDate':
              newOptions[key] = value;
              break;
            case 'locale':
              createAlert('Moment is no longer supported. This "locale" now accepts Intl languages. See <a href="options.html#localizationLocale" target="_blank">localization usage</a>', 'warning');
              ensurePath('localization', newOptions);
              newOptions.localization.locale = value;
              break;
            case 'showTodayButton':
            case 'showClear':
            case 'showClose':
            case 'buttons':
              ensurePath('display.buttons', newOptions);
              const handleButton = (k, v) => {
                newOptions.display.buttons[k.replace('show', '').replace('Button', '').toLowerCase()] = v;
              };
              if (key === 'buttons') {
                //v5
                Object.entries(value).forEach(([k, v]) => handleButton(k, v));
              } else {
                //v4
                handleButton(key, value);
              }
              break;
            case 'tooltips':
              ensurePath('localization', newOptions);
              Object.entries(value).forEach(([k, v]) => {
                if (k.startsWith('prev')) k = k.replace('prev', 'previous');
                if (k === 'togglePeriod') k = 'toggleMeridiem';
                newOptions.localization[k] = v;
              });
              break;
            case 'allowMultidate':
              newOptions.multipleDates = value;
              break;
            case 'multidateSeparator':
              newOptions.multipleDatesSeparator = value;
              break;
            case 'parseInputDate':
              createAlert(`"parseInputDate" is now <a href='options.html#hooksInputFormat' target='_blank'><code>hooks.inputParse</code></a> and takes a function that must return a <code>DateTime</code> object.`, 'danger');
              ensurePath('hooks.inputParse', newOptions);
              newOptions.hooks.inputParse = undefined;
              break;
          }
        });

        let outputValue = '{\n';
        let spacing = 0;

        const readme = (obj) => {
          Object.entries(obj).forEach(([key, value]) => {
            if (!Array.isArray(value) && typeof value === 'object') {
              spacing += 2;
              outputValue += `${Array(spacing).fill(' ').join(' ')}${key}: {\n`;
              spacing += 2;
              readme(value);
              spacing -= 2;
              outputValue += `${Array(spacing).fill(' ').join(' ')}}\n`;
              spacing -= 2;
              return;
            }
            if (Array.isArray(value)) {
              outputValue += `${Array(spacing).fill(' ').join(' ')}${key}: [${value}],\n`;
              return;
            }
            outputValue += `${Array(spacing).fill(' ').join(' ')}${key}: ${typeof value === 'string' ? `'${value}'` : value},\n`;
          });
        };

        readme(newOptions);
        this.convertedConfiguration = newOptions;
        this.output.value = `${outputValue}}`;
      } catch (e) {
        createAlert(`Something went wrong trying to perform a conversion. Please report your configuration settings.<br/>${e}`, 'danger');
      }
    }
  }

  class HtmlConvert {
    constructor() {
      this.input = document.getElementById('fromHtml');
      this.output = document.getElementById('toHtml');
      this.convertButton = document.getElementById('convertButtonHtml');
      /*this.datetimepicker1 = new tempusDominus.TempusDominus(document.getElementById('datetimepicker1'));
      this.convertedConfiguration = undefined;*/
      this.convertButton.addEventListener('click', this.convert.bind(this));
      this.input.addEventListener('change', this.convert.bind(this));

      /*document.getElementById('tryIt').addEventListener('click', () => {
        // run if it hasn't been for some reason
        if (!this.convertedConfiguration) this.convert();
        // if still no config, then there was an error.
        if (!this.convertedConfiguration) return;

        this.datetimepicker1.updateOptions(this.convertedConfiguration);
      });*/
    }

    convert() {
      this.convertedConfiguration = undefined;
      alertBox.innerHTML = '';
      this.output.value = '';
      let value = this.input.value;

      if (!value) {
        this.output.value = 'No configuration was provided.';
        return;
      }

      value = value.replace('data-target', 'data-td-target')
        .replace('data-toggle', 'data-td-toggle');

      this.output.value = value;
    }
  }

  new JsConvert();
  new HtmlConvert();
});