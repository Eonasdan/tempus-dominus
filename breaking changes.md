# General

* picker no longer set text field - this might be restored.
* picker returns a `DateTime` which is an extended javascript `Date` object.
* picker no longer uses jQuery, momentjs, or bootstrap

# Configuration

* renamed `tooltip` to `localization`
* renamed `tooltip.prevMonth` to `localization.previousMonth`
* renamed `tooltip.prevYear` to `localization.previousYear`
* renamed `tooltip.prevDecade` to `localization.previousDecade`
* renamed `tooltip.prevCentury` to `localization.previousCentury`
* moved `dayViewHeaderFormat` to `localization.dayViewHeaderFormat`
    * `dayViewHeaderFormat` now takes a javascript `intl` month option, e.g. `long` (default)

* removed `locale`
* removed `useStrict`
* removed `timeZone`
* removed `format`
* removed `extraFormats`

* moved the following to `restrictions`
    * minDate
    * maxDate
    * disabledDates
    * enabledDates
    * daysOfWeekDisabled
    * disabledHours
    * enabledHours
    * readonly
    * disabledTimeIntervals

* moved the following to `display`
    * sideBySide
    * calendarWeeks
    * viewMode
    * toolbarPlacement
    * buttons
    * widgetPositioning
    * icons
    * collapse

## Styles
### Tip: All new css values are in `Namespace.Css.*` in the `consts.ts` file
* renamed `bootstrap-datetimepicker-widget` to `tempus-dominus-widget`
* renamed `tempusdominus-bootstrap-datetimepicker-widget-with-calendar-weeks` to `tempus-dominus-with-calendar-weeks`  (
  v5)
* renamed `usetwentyfour` to `useTwentyfour`
* renamed `datepicker` to `date-container`
* renamed `datepicker-decades` to `date-container-decades`
* renamed `datepicker-years` to `date-container-years`
* renamed `datepicker-months` to `date-container-months`
* renamed `datepicker-days` to `date-container-days`
* renamed `prev` to `previous` 
* removed `.input-group [data-toggle="datetimepicker"]` setting the cursor type to pointer.

### Saas

Saas file is now called `tempus-dominus.scss`. The "build" file has been deleted as it's no longer required.

# Events

* changed `isInvalid` to `isValid` and flipped the boolean (v5)
* changed event now emits `undefined` instead of false when the date is being cleared
* changed plugin.name from `datetimepicker` to `tempus-dominus`
* changed root data namespace from `datetimepicker` to `td`