# Bootstrap v3 datetimepicker widget ![GitHub version](https://badge.fury.io/gh/Eonasdan%2Fbootstrap-datetimepicker.png)

![DateTimePicker](http://i.imgur.com/nfnvh5g.png)

### [⇢ View the manual and demos](http://eonasdan.github.io/bootstrap-datetimepicker/)

##Where do you use this?
I'd love to know if your public site is using this plugin and list your logo on the documentation site. Please email me `eonasdan at outlook dot com`. Do not submit issue/feature request to this email, they will be ignored.

## See the [Change Log](#change-log) for important changes and updates.

## Quick installation using

## [bower](http://bower.io): ![Bower version](https://badge.fury.io/bo/eonasdan-bootstrap-datetimepicker.png)

Run the following command:
```
bower install eonasdan-bootstrap-datetimepicker#latest --save
```

Include necessary scripts and styles:
```html
<head>
  <!-- ... -->
  <script type="text/javascript" src="/bower_components/jquery/jquery.min.js"></script>
  <script type="text/javascript" src="/bower_components/moment/min/moment.min.js"></script>
  <script type="text/javascript" src="/bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
  <script type="text/javascript" src="/bower_components/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js"></script>
  <link rel="stylesheet" href="/bower_components/bootstrap/dist/css/bootstrap.min.css" />
  <link rel="stylesheet" href="/bower_components/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css" />
</head>
```

## [Nuget (LESS)](https://www.nuget.org/packages/Bootstrap.v3.Datetimepicker/): ![NuGet version](https://badge.fury.io/nu/Bootstrap.v3.Datetimepicker.png)
```
PM> Install-Package Bootstrap.v3.Datetimepicker
```

## [Nuget (CSS)](https://www.nuget.org/packages/Bootstrap.v3.Datetimepicker.CSS/): ![NuGet version](https://badge.fury.io/nu/Bootstrap.v3.Datetimepicker.CSS.png)
```
PM> Install-Package Bootstrap.v3.Datetimepicker.CSS
```

```html
<head>
  <script type="text/javascript" src="/scripts/jquery.min.js"></script>
  <script type="text/javascript" src="/scripts/moment.min.js"></script>
  <script type="text/javascript" src="/scripts/bootstrap.min.js"></script>
  <script type="text/javascript" src="/scripts/bootstrap-datetimepicker.min.js"></script>
  <!-- include your less or built css files  -->
  <!-- 
  bootstrap-datetimepicker-build.less will pull in "../bootstrap/variables.less" and "bootstrap-datetimepicker.less";
  or
  <link rel="stylesheet" href="/Content/bootstrap-datetimepicker.css" />
  -->
</head>
```

## [Rails](http://rubygems.org/gems/bootstrap3-datetimepicker-rails) ![Gem Version](https://badge.fury.io/rb/bootstrap3-datetimepicker-rails.png)

Add the following to your `Gemfile`:
```
gem 'momentjs-rails', '~> 2.5.0'
gem 'bootstrap3-datetimepicker-rails', '~> 2.1.30'
```
Read the rest of the install instructions @ 
[TrevorS/bootstrap3-datetimepicker-rails](https://github.com/TrevorS/bootstrap3-datetimepicker-rails)

Done! [Now take a look at the manual](http://eonasdan.github.io/bootstrap-datetimepicker/) for examples and available options.


## Manual installation

### [Moment.js](https://github.com/moment/moment)
Datetimepicker requires moment.js. This allows for better support for various date formats and locales. See [documentation](http://eonasdan.github.io/bootstrap-datetimepicker/) for examples. Check [Momentjs' homepage](http://momentjs.com/) for documentation on date formats. If you can't use moment.js there's still older version of datetimewidget [available here](https://github.com/Eonasdan/bootstrap-datetimepicker/tree/version1). 

```html
<script type="text/javascript" src="/path/to/moment.js"></script>
```

### Bootstrap 3 collapse and transition plugins
Make sure to include *.JS files for plugins [collapse](http://getbootstrap.com/javascript/#collapse) and [transitions](http://getbootstrap.com/javascript/#transitions). They are included with [bootstrap in js/ directory](https://github.com/twbs/bootstrap/tree/master/js)

```html
<script type="text/javascript" src="/path/to/bootstrap/js/transition.js"></script>
<script type="text/javascript" src="/path/to/bootstrap/js/collapse.js"></script>
```

Alternatively you could include the whole bundle of bootstrap plugins from [bootstrap.js](https://github.com/twbs/bootstrap/tree/master/dist/js)

```html
<script type="text/javascript" src="/path/to/bootstrap/dist/bootstrap.min.js"></script>
```


### CSS styles

#### Using LESS
```css
@import "/path/to/bootstrap/less/variables";
@import "/path/to/bootstrap-datetimepicker/src/less/bootstrap-datetimepicker";

// [...] your custom styles and variables
```

#### Using CSS (default color palette)
```html
<link rel="stylesheet" href="/path/to/bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css" />
```

### Main JS file

Finally include the main javascript file.
```html
<script type="text/javascript" src="/path/to/bootstrap-datetimepicker.min.js"></script>
```

# Change Log
## 3.0.0
## **Breaking changes in this update! Pay attention!!**
* Fix for #170, #179, #183: Changed event to `dp.-` options load as `data-date-OPTION` instead of `data-OPTION`. This should fix the double change event firing.
* Fix for #192: `setDate` now fires `dp.change`
* Fix for #182: Picker will **not** set the default date if the input field has a value
* Fix for #169: Seconds doesn't get reset when changing the date (Thanks to PR #174)
* Fix for #168 z-index fix for BS modal
* Fix for #155 Picker properly displays the active year and month
* Fix for #154 CSS update to fix the collapse jump
* Fix for #150 and #75 `minViewMode` and `viewMode` work properly
* Fix for #147 AM/PM won't toggle when selecting a value from the hours grid
* Fix for #44 Finally! It's here!! Thanks to @ruiwei and his code on #210 picker will adjust the positioning of the widget.

#### **Manually merged PR**
* #178 When using `minuteStepping` the minute select grid will only show available steppings
* #195, #197 Using the `data-OPTION` has been changed to `data-date-OPTION`. These options are expected to be on the `input-group` if you're using the `form-group` **or** the input field
* #184 The option `sideBySide` change be used to display both the d and the timepicker side by side
* #143 Added option `daysOfWeekDisabled: []`. For example, use `daysOfWeekDisabled: [0,6]` to disable Sunday and Saturday

#### **Other Changes**
* Changed picker width to 300px if using seconds and am/pm
* Added option `useCurrent`, thanks to @ruiwei. When true, picker will set the value to the current date/time (respects picker's format)
* Added option `showToday`, thanks to @ruiwei. When true, picker will display a small arrow to indicate today's date.
* Changed `startDate` to `minDate` and `endDate` to `maxDate` to make it more clear what these options do.

## 2.1.32 (Hotfix)

* Fix for #151: When a bad date value or the picker is cleared, the plugin will not longer attempt to reset it back to the previous date
* Fix for #140: `setDate` can be given `null` to force clear the picker

## 2.1.30
#### Important! `build.less` file name has been been changed to `bootstrap-datetimepicker-build.less` to prevent collisions

* Fix for #135: `setStartDate` and `setEndDate` should now properly set.
* Fix for #133: Typed in date now respects en/disabled dates
* Fix for #132: En/disable picker function works again
* Fix for #117, #119, #128, #121: double event `change` event issues should be fixed
* Fix for #112: `change` function no longer sets the input to a blank value if the passed in date is invalid

* Enhancement for #103: Increated the `z-index` of the widget

## 2.1.20
* Fix for #83: Changes to the picker should fire native `change` event for knockout and the like as well as `change.dp` which contains the old date and the new date
* Fix for #78: Script has been update for breaking changes in Moment 2.4.0
* Fix for #73: IE8 should be working now

* Enhancement for #79: `minuteStepping` option takes a number (default is 1). Changing the minutes in the time picker will step by this number.
* Enhancement for #74 and #65: `useMinutes` and `useSeconds` are now options. Disabling seconds will hide the seconds spinner. Disabling minutes will display `00` and hide the arrows
* Enhancement for #67: Picker will now attempt to convert all `data-OPTION` into its appropriate option

## 2.1.11
* Fix for #51, #60
* Fix for #52: Picker has its own `moment` object since moment 2.4.0 has removed global reference
* Fix for #57: New option for `useStrict`. When validating dates in `update` and `change`, the picker can use a stricter formatting validation
* Fix for #61: Picker should now properly take formatted date. Should also have correct start of the week for locales.
* Fix for #62: Default format will properly validate time picker only.

## 2.1.5
* Custom icons, such as Font Awesome, are now supported. (#49)  See [Example#9](http://eonasdan.github.io/bootstrap-datetimepicker/#example9)
* If more then one `input-group-addon` is present use `datepickerbutton` to identify where the picker should popup from. (#48)
* New Event: `error.dp`. Fires when Moment cannot parse the date or when the timepicker cannot change because of a `disabledDates` setting. Returns a Moment date object. The specific error can be found be using `invalidAt()`. For more information see [Moment's docs](http://momentjs.com/docs/#/parsing/is-valid/)
* Fix for #42, plugin will now check for `A` or `a` in the format string to determine if the AM/PM selector should display.
* Fix for #45, fixed null/empty and invalid dates
* Fix for #46, fixed active date highlighting
* Fix for #47, `change.dp` event to also include the previous date.

####2.0.1
* New event `error.dp` fires when plugin cannot parse date or when increase/descreasing hours/minutes to a disabled date.  See [Example#7](http://eonasdan.github.io/bootstrap-datetimepicker/#example7)
* Minor fixes

####2.0.0
* `disabledDates` is now an option to set the disabled dates. It accepts date objects like `new Date("November 12, 2013 00:00:00")` and `12/25/2013' and `moment` date objects. See [Example#7](http://eonasdan.github.io/bootstrap-datetimepicker/#example7) for usage.
* Events are easier to use; see [Example#8](http://eonasdan.github.io/bootstrap-datetimepicker/#example8)

