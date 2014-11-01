### V4 Changelog

#### Changes for using the component

* Defined a [Public API](https://github.com/Eonasdan/bootstrap-datetimepicker/wiki/Version-4-Public-API) and hidden rest of functions, variables so that all configuration options can be changed dynamically.

* `set/getDate()` is now replaced with an overloaded `date()` function. Use it without a parameter to get the currently set date or with a parameter to set the date.

* `hide()`, `show()`, `toggle()`, `enable()`, `disable()` and the rest of setter functions now support chaining. ie `$('#id').data('DateTimePicker').format('DD-MM-YYYY').minDate(moment()).defaultDate(moment()).show()` works

* Replaced previous - next buttons in Date subviews with configurable icons

* Changed `language` option name to `locale` to be inline with moment naming

* Implemented #402 all data-date-* variables are more readable and also match with the ones in the configuration object

* `options.direction` and `options.orientation` were merged into a single object `options.widgetPositioning` with `vertical` and `horizontal` keys that take a string value of `'auto', 'top', 'bottom'` and `'auto', 'left', 'right'` respectively. Note that the `'up'` option was renamed to `'top'`

#### Added functionality

* added a second way to define options as data attributes. Instead of adding distinct `data-date-*` config options you can now also pass a `data-date-options` attribute containing an object just the same as the options object that `element.datetimepicker` constructor call takes

* also added a `options()` public api function to get/set that takes an option object and applies it to the component in one call

* Implemented [#130](https://github.com/Eonasdan/bootstrap-datetimepicker/issues/130) by introducing a boolean `options.calendarWeeks` and `calendarWeeks()` api function

* Implemented [#328](https://github.com/Eonasdan/bootstrap-datetimepicker/issues/328), [#426](https://github.com/Eonasdan/bootstrap-datetimepicker/issues/426)

* Implemented [#432](https://github.com/Eonasdan/bootstrap-datetimepicker/issues/432). Widget DOM element is now lazily added only when shown and removed from the document when hidden.

* Implemented [#141](https://github.com/Eonasdan/bootstrap-datetimepicker/issues/141) and [#283](https://github.com/Eonasdan/bootstrap-datetimepicker/issues/283)


#### Contributors related internal code changes

* Refactor all UI click functions and put them as functions in the actions array private variable

* Refactor template building process to seperate functions according to what they do

* Remove some styles that where hardcoded in the javascript code

* Refactor all code that changes the picker.date to change it through the setValue function to allow one place for validation logic (min/max/weekdaysenabled etc) and also one place for emmiting dp.change events

* The v4beta branch code includes all fixes up to v.3.1.2

* Added `toggle()` to the public API which toggles the visibility of the DateTimePicker

* Refactored set function to be included in the setValue function

* Added a testing framework using jasmine and phantom.js


 