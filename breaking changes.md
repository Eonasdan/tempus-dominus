# General

- picker returns a `DateTime` which is an extended javascript `Date` object.
- picker no longer uses jQuery, momentjs, or bootstrap
- events now have interfaces

# Configuration

- renamed `tooltip` to `localization`

  - renamed `tooltip.prevMonth` to `localization.previousMonth`
  - renamed `tooltip.prevYear` to `localization.previousYear`
  - renamed `tooltip.prevDecade` to `localization.previousDecade`
  - renamed `tooltip.prevCentury` to `localization.previousCentury`
  - moved `dayViewHeaderFormat` to `localization.dayViewHeaderFormat`
  - `dayViewHeaderFormat` now takes a javascript `intl` month option, e.g. `long` (default)

- removed `locale`
- removed `useStrict`
- removed `timeZone`
- removed `format`
  - added `display.inputFormat` that takes `DateTimeFormatOptions`;
- removed `extraFormats`
- removed `widgetParent`
- removed `widgetPositioning`
- changed `viewMode` from `'times' | 'days'` to `'clock' | 'calendar'`

- moved the following to `restrictions`

  - minDate
  - maxDate
  - disabledDates
  - enabledDates
  - daysOfWeekDisabled
  - disabledHours
  - enabledHours
  - readonly
  - disabledTimeIntervals

- moved the following to `display`

  - sideBySide
  - calendarWeeks
  - viewMode
  - toolbarPlacement
  - buttons
  - widgetPositioning
  - icons
  - collapse
  - inline

- `disabledTimeIntervals` is now an array of `{ from: DateTime, to: DateTime } `
- removed check for `dateOptions` on the element data set. jQuery hid allowing an object by looping through the properties 

## Styles

### Tip: All new css values are in `Namespace.Css.*` in the `consts.ts` file

- renamed `bootstrap-datetimepicker-widget` to `tempus-dominus-widget`
- renamed `tempusdominus-bootstrap-datetimepicker-widget-with-calendar-weeks` to `tempus-dominus-with-calendar-weeks` (
  v5)
  - removed `.input-group [data-toggle="datetimepicker"]` setting the cursor type to pointer.

#### Date

- renamed `datepicker` to `date-container`
- renamed `datepicker-decades` to `date-container-decades`
- renamed `datepicker-years` to `date-container-years`
- renamed `datepicker-months` to `date-container-months`
- renamed `datepicker-days` to `date-container-days`
- renamed `prev` to `previous`
- renamed `data-day` to `data-value` to be consistent with other views

#### Time

- renamed `usetwentyfour` to `useTwentyfour`
- renamed `timepicker` to `time-container`
- renamed `timepicker-hour` to `time-container-hour`
- renamed `timepicker-minute` to `time-container-minute`
- renamed `timepicker-second` to `time-container-second`

### Saas

Saas file is now called `tempus-dominus.scss`. The "build" file has been deleted as it's no longer required.

# Events

- changed `isInvalid` to `isValid` and flipped the boolean (v5)
- changed event now emits `undefined` instead of false when the date is being cleared
- changed plugin.name from `datetimepicker` to `tempus-dominus`
- changed root data namespace from `datetimepicker` to `td`
