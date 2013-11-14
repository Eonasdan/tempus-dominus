#Bootstrap datetimepicker
###Date/time picker widget for Twitter Bootstrap v3

Documentation is now [here](http://eonasdan.github.io/bootstrap-datetimepicker/) and updated for Bootstrap v3

Options (updated)
=================

```js
$.fn.datetimepicker.defaults = {
    pickDate: true,             // disables the date picker
    pickTime: true,             // disables de time picker
    pick12HourFormat: false,    // Enable 12 hour format
    pickSeconds: false,         // Show a seconds picker
    startDate:  -Infinity,      // set a minimum date
    endDate: Infinity,          // set a maximum date
    useStrict: false,           //use "strict" when validating dates
    collapse: true,             // Collapse the time picker
    icons: {
        time: 'glyphicon glyphicon-time',
        date: 'glyphicon glyphicon-calendar',
        up:   'glyphicon glyphicon-chevron-up',
        down: 'glyphicon glyphicon-chevron-down'
    }
};
```

Events
======
`change.dp`
Fires when the datepicker changes or updates the date

`show.dp`
Fires when the widget is shown

`hide.dp`
Fires when the widget is hiden

`error.dp`
Fires when Moment cannot parse the date or when the timepicker cannot change because of a `disabledDates` setting. Returns a Moment date object. The specific error can be found be using invalidAt(). For more information see Moment's docs
