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
`changeDate`
Fires when the datepicker changes or updates the date

`show`
Fires when the widget is shown

`hide`
Fires when the widget is hiden
