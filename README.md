# Bootstrap v3 datetimepicker widget

![DateTimePicker](http://i.imgur.com/nfnvh5g.png)

### [⇢ Manual and demo](http://eonasdan.github.io/bootstrap-datetimepicker/)


## Quick installation using [bower](http://bower.io):

Run the following command:
````
bower install eonasdan-bootstrap-datetimepicker#latest --save
````

Include necessary scripts and styles:
````html
<head>
  <!-- ... -->
  <script type="text/javascript" src="/bower_components/jquery/jquery.min.js"></script>
  <script type="text/javascript" src="/bower_components/moment/min/moment.min.js"></script>
  <script type="text/javascript" src="/bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
  <script type="text/javascript" src="/bower_components/eonasdan-bootstrap-datetimepicker/build/bootstrap-datetimepicker.min.js"></script>
  <link rel="stylesheet" href="/bower_components/bootstrap/dist/css/boostrap.min.css" />
  <link rel="stylesheet" href="/bower_components/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css" />
</head>
````

Done! [Now take a look at the manual](http://eonasdan.github.io/bootstrap-datetimepicker/) for examples and available options.



## Manual installation

### [Moment.js](https://github.com/moment/moment)
Datetimepicker requires moment.js in version 2.3.1 (we're working on supporting higher versions). This allows for better support for various date formats and locales. See [documentation](http://eonasdan.github.io/bootstrap-datetimepicker/) for examples. Check [Momentjs' homepage](http://momentjs.com/) for documentation on date formats. If you can't use moment.js there's still older version of datetimewidget [available here](https://github.com/Eonasdan/bootstrap-datetimepicker/tree/version1). 

````html
<script type="text/javascript" src="/path/to/moment.js"></script>
````

### Bootstrap 3 collapse and transition plugins
Make sure to include *.JS files for plugins [collapse](http://getbootstrap.com/javascript/#collapse) and [transitions](http://getbootstrap.com/javascript/#transitions). They are included with [bootstrap in js/ directory](https://github.com/twbs/bootstrap/tree/master/js)

````html
<script type="text/javascript" src="/path/to/bootstrap/js/transition.js"></script>
<script type="text/javascript" src="/path/to/bootstrap/js/collapse.js"></script>
````

Alternatively you could include the whole bundle of bootstrap plugins from [bootstrap.js](https://github.com/twbs/bootstrap/tree/master/dist/js)

````html
<script type="text/javascript" src="/path/to/bootstrap/dist/bootstrap.min.js"></script>
````


### CSS styles

#### Using LESS
````css
@import "/path/to/bootstrap/less/variables";
@import "/path/to/bootstrap-datetimepicker/src/less/bootstrap-datetimepicker";

// [...] your custom styles and variables
````

#### Using CSS (default color palette)
````html
<link rel="stylesheet" href="/path/to/bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css" />
````

### Main JS file

Finally include the main javascript file.
````html
<script type="text/javascript" src="/path/to/bootstrap-datetimepicker.min.js"></script>
````

#### Installation using Nuget

`````
PM> Install-Package Bootstrap.v3.Datetimepicker
`````
More information: https://www.nuget.org/packages/Bootstrap.v3.Datetimepicker/


## New features (2.1.11)!
* Fix for #51, #60
* Fix for #52: Picker has its own `moment` object since moment 2.4.0 has removed global reference
* Fix for #57: New option for `useStrict`. When validating dates in `update` and `change`, the picker can use a stricter formatting validation
* Fix for #61: Picker should now properly take formatted date. Should also have correct start of the week for locales.
* Fix for #62: Default format will properly validate time picker only.

## New features (2.1.5)!
* Custom icons, such as Font Awesome, are now supported. (#49)  See [Example#9](http://eonasdan.github.io/bootstrap-datetimepicker/#example9)
* If more then one `input-group-addon` is present use `datepickerbutton` to identify where the picker should popup from. (#48)
* New Event: `error.dp`. Fires when Moment cannot parse the date or when the timepicker cannot change because of a `disabledDates` setting. Returns a Moment date object. The specific error can be found be using `invalidAt()`. For more information see [Moment's docs](http://momentjs.com/docs/#/parsing/is-valid/)
* Fix for #42, plugin will now check for `A` or `a` in the format string to determine if the AM/PM selector should display.
* Fix for #45, fixed null/empty and invalid dates
* Fix for #46, fixed active date highlighting
* Fix for #47, `change.dp` event to also include the previous date.

####New features (2.0.1)!
* New event `error.dp` fires when plugin cannot parse date or when increase/descreasing hours/minutes to a disabled date.  See [Example#7](http://eonasdan.github.io/bootstrap-datetimepicker/#example7)
* Minor fixes

####New features (2.0.0)!
* `disabledDates` is now an option to set the disabled dates. It accepts date objects like `new Date("November 12, 2013 00:00:00")` and `12/25/2013' and `moment` date objects. See [Example#7](http://eonasdan.github.io/bootstrap-datetimepicker/#example7) for usage.
* Events are easier to use; see [Example#8](http://eonasdan.github.io/bootstrap-datetimepicker/#example8)

###Removed features
* pickSeconds
* pick12HourFormat
* maskInput

