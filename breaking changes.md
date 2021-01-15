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
* renamed `usetwentyfour` to `useTwentyfour`