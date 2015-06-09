## Events

### dp.hide

Fired when the widget is hidden.

Emitted from:

* toggle()
* hide()
* disable()

----------------------

### dp.show

Fired when the widget is shown

Emitted from:

* toggle()
* show()

----------------------

### dp.change

Fired when the date is changed

Emitted from:

* toggle() **Note**: Only fired when using `useCurrent`
* show() **Note**: Only fired when using `useCurrent` or when or the date is changed to comply with date rules (min/max etc)
* date(newDate)
* minDate(minDate)
* maxDate(maxDate)
* daysOfWeekDisabled()

----------------------

### dp.error

Fired when a selected date fails to pass validation

Emmited from:

* minDate(minDate)
* maxDate(maxDate)
* daysOfWeekDisabled()
* setValue() *private function*

----------------------

### dp.update

Fired (in most cases) when the `viewDate` changes. E.g. Next and Previous buttons, selecting a year.

Includes the new `viewDate` and a change type, e.g `YYYY` and `M` for year and month.