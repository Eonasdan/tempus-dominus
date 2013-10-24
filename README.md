#Bootstrap v3 datetimepicker widget

##Using [Moment.js](https://github.com/moment/moment)
Version 2 now requires Momentjs. Version 1 can still be found [here](https://github.com/Eonasdan/bootstrap-datetimepicker/tree/version1). Version 2 has better support for date formats and mutilanguage. See [documentation](http://eonasdan.github.io/bootstrap-datetimepicker/) for examples.

####New feature (2.0.1)!
* New event `error.dp` fires when plugin cannot parse date or when increase/descreasing hours/minutes to a disabled date.  See [Example#7](http://eonasdan.github.io/bootstrap-datetimepicker/#example7)
* Minor fixes

####New feature (2.0.0)!
* `disabledDates` is now an option to set the disabled dates. It accepts date objects like `new Date("November 12, 2013 00:00:00")` and `12/25/2013' and `moment` date objects. See [Example#7](http://eonasdan.github.io/bootstrap-datetimepicker/#example7) for usage.
* Events are easier to use; see [Example#8](http://eonasdan.github.io/bootstrap-datetimepicker/#example8)

###Removed features
* pickSeconds
* pick12HourFormat
* maskInput


Documentation is [here](http://eonasdan.github.io/bootstrap-datetimepicker/) with examples and usage.
