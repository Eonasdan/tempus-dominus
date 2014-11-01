**Status of this document**: DRAFT

**NOTE:** This guide refers to v4 of the component which is currently in beta stage

## Functions

###destroy()

Destroys the widget and removes all attached event listeners

----------------------

### toggle()

Shows or hides the widget

#### Emits

* ```dp.hide``` - if the widget is hidden after the toggle call

* ```dp.show``` - if the widget is show after the toggle call

* ```dp.change``` - if the widget is opened for the first time and the input element is empty and ```options.useCurrent != false```

----------------------

### show()

Shows the widget

#### Emits

* ```dp.show``` - if the widget was hidden before that call

* ```dp.change``` - if the widget is opened for the first time and the useCurrent is set to true or to a granularity value and the input element the component is attached to has an empty value

----------------------

### hide()

Hides the widget

#### Emits

* ```dp.hide``` - if the widget was visible before that call

----------------------

### disable()

Disables the input element, the component is attached to, by adding a ```disabled="true"``` attribute to it. If the widget was visible before that call it is hidden.

#### Emits

* ```dp.hide``` - if the widget was visible before that call

----------------------

### enable()

Enables the input element, the component is attached to, by removing ```disabled``` attribute from it.

----------------------

### date()

Returns the component's model current date, a ```moment``` object or ```null``` if not set.

----------------------

### date(newDate)

Takes a newDate ```string, Date, moment, null``` parameter and sets the components model current moment to it. Passing a ```null``` value unsets the components model current moment. Parsing of the newDate parameter is made using moment library with the ```options.format``` and ```options.useStrict``` components configuration.

#### Throws

* ```TypeError``` - in case the ```newDate``` cannot be parsed

#### Emits

* ```dp.change``` - In case ```newDate``` is different from current moment

----------------------

### options()

Returns the components current options object. Note that the changing the values of the returned object does not change the components actual configuration. Use ```options(options)``` to set the components options massively or the other methods for setting config options individually.

----------------------

### options(options)

Takes an object variable with option key:value properties and configures the component. Use this to update multiple options on the component.

----------------------

### format()

Returns the component's ```options.format``` ```string```

----------------------

### format(format)

Takes a [moment.js](http://momentjs.com/docs/#/displaying/format/) format ```string``` and sets the components  ```options.format```. This is used for displaying and also for parsing input strings either from the input element the component is attached to or the `date()` function.
The parameter can also be a ```boolean:false``` in which case the format is set to the locale's `L LT`.

**Note:** this is also used to determine if the TimePicker sub component will display the hours in 12 or 24 format. (if 'a' or 'h' exists in the passed string then a 12 hour mode is set)

----------------------

### disabledDates()

Returns an array with the currently set disabled dates on the component.

----------------------

### disabledDates(dates)

Takes an ```[``` ```string``` or ```Date``` or ```moment``` ```]``` of values and disallows the user to select those days. Setting this takes precedence over ```options.minDate```, ```options.maxDate``` configuration. Also calling this function removes the configuration of options.enabledDates if such exist.

**Note:** These values are matched with ```Day``` granularity.

----------------------

### enabledDates()

Returns an array with the currently set enabled dates on the component.

----------------------

### enabledDates(dates)

Takes an ```[``` ```string``` or ```Date``` or ```moment``` ```]``` of values and allows the user to select only from those days. Setting this takes precedence over ```options.minDate```, ```options.maxDate``` configuration. Also calling this function removes the configuration of options.disabledDates if such exist.

**Note:** These values are matched with ```Day``` granularity.

----------------------

### maxDate()

Returns the currently set moment of the ```options.maxDate``` or ```false``` if not set

----------------------

### maxDate(maxDate)

Takes a maxDate ```string, Date, moment, boolean:false``` parameter and disallows the user to select a moment that is after that moment. If a ```boolean:false``` value is passed ```options.maxDate``` is cleared and there is no restriction to the maximum moment the user can select.

**Note:** If maxDate is before the currently selected moment the currently selected moment changes to maxDate

#### Throws

* ```TypeError``` - if maxDate parameter cannot be parsed using the ```options.format``` and ```options.useStrict``` configuration settings

* ```TypeError``` - if maxDate parameter is before ```options.minDate```

#### Emits

* ```dp.change``` - if the new maxDate is after currently selected moment  (waiting for #472 to close in order to finalize this part)

* ```dp.error``` - if the new maxDate is after currently selected moment  (waiting for #472 to close in order to finalize this part)

----------------------

### minDate()

Returns the currently set moment of the ```options.minDate``` or ```false``` if not set

----------------------

### minDate(minDate)

Takes a minDate ```string, Date, moment, boolean:false``` parameter and disallows the user to select a moment that is before that moment. If a ```boolean:false``` value is passed the ```options.minDate``` parameter is cleared and there is no restriction to the miminum moment the user can select. 

**Note:** If the minDate parameter is after the currently selected moment the currently selected moment changes to minDate parameter

#### Throws

* ```TypeError``` - if minDate parameter cannot be parsed using the ```options.format``` and ```options.useStrict``` configuration settings

* ```TypeError``` - if minDate parameter is after ```options.maxDate```

#### Emits

* ```dp.change``` - if the new minDate is after currently selected moment (waiting for #472 to close in order to finalize this part)

* ```dp.error``` - if the new minDate is after currently selected moment (waiting for #472 to close in order to finalize this part)

----------------------

### daysOfWeekDisabled()

Returns an array with the ```options.daysOfWeekDisabled``` configuration setting of the component.

----------------------

### daysOfWeekDisabled(daysOfWeek)

Takes an ```[``` ```Number```:```0``` to ```6``` ```]``` and disallow the user to select weekdays that exist in this array. This has lower priority over the ```options.minDate```, ```options.maxDate```, ```options.disabledDates``` and ```options.enabledDates``` configuration settings.

#### Emits

* ```dp.change``` - if the currently selected moment falls in the values passed on the daysOfWeek parameter. (waiting for #472 to close in order to finalize this part)

* ```dp.error``` - if the currently selected moment falls in the values passed on the daysOfWeek parameter. (waiting for #472 to close in order to finalize this part)

----------------------

### locale()

----------------------

### locale(newLocale)

----------------------

### useCurrent()

Returns a boolean or string with the ```options.useCurrent``` option configuration

----------------------

### useCurrent(boolean or string)

Takes a ```boolean``` or ```string```. If a boolean true is passed and the components model moment is not set (either through ```setDate``` or through a valid value on the input element the component is attached to) then the first time the user opens the datetimepicker widget the value is initialized to the current moment of the action. If a false boolean is passed then no initialization happens on the input element. You can select the granularity on the initialized moment by passing one of the following strings (```'year', 'month', 'day', 'hour', 'minute'```) in the variable.

If for example you pass ```'day'``` to the ```setUseCurrent``` function and the input field is empty the first time the user opens the datetimepicker widget the input text will be initialized to the current datetime with day granularity (ie if currentTime = ```2014-08-10 13:32:33``` the input value will be initialized to ```2014-08-10 00:00:00```)

**Note:** If the ```options.defaultDate``` is set or the input element the component is attached to has already a value that takes precedence and the functionality of ```useCurrent``` is not triggered!

----------------------

### stepping()

----------------------

### stepping(number)

----------------------

### collapse()

----------------------

### collapse(collapse)

----------------------

### defaultDate()

----------------------

### defaultDate(defaultDate)

----------------------

### icons()

----------------------

### icons(icons)

----------------------

### useStrict()

----------------------

### useStrict(useStrict)

----------------------

### widgetPositioning()

Returns the currently set `options.widgetPositioning` object containing two keys `horizontal` and `vertical`

----------------------

### widgetPositioning(positioningObject)

Takes an object parameter that can contain two keys `vertical` and `horizontal` each having a value of `'auto', 'top', 'bottom'` for `vertical` and `'auto', 'left', 'right'` for `horizontal` which defines where the dropdown with the widget will appear relative to the input element the component is attached to.

`'auto'` is the default value for both `horizontal` and `vertical` keys and it tries to automatically place the dropdown in a position that is visible to the user. Usually you should not override those options unless you have a special need in your layout.

----------------------

### sideBySide()

----------------------

### sideBySide(sideBySide)

----------------------

### viewMode()

----------------------

### viewMode(newViewMode)

----------------------

### calendarWeeks()

Returns a boolean with the current ```options.calendarWeeks``` option configuration

----------------------

### calendarWeeks(boolean)

Takes a boolean variable to set if the week numbers will appear to the left on the days view

----------------------

### showClear()

Returns a boolean variable with the currently set `options.showClear` option.

----------------------

### showClear(boolean)

Takes a boolean variable to set if the clear date button will appear on the widget

----------------------

### showTodayButton()

Returns a boolean variable with the currently set `options.showTodayButton` option.

----------------------

### showTodayButton(boolean)

Takes a boolean variable to set if the Today button will appear on the widget

