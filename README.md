# Bootstrap v3 datetimepicker widget ![GitHub version](https://badge.fury.io/gh/Eonasdan%2Fbootstrap-datetimepicker.png)

![DateTimePicker](http://i.imgur.com/nfnvh5g.png)

### [⇢ View the manual and demos](http://eonasdan.github.io/bootstrap-datetimepicker/)

###Submitting Issues
Please test and/or fork [this jsfiddle](http://jsfiddle.net/d3wCU/) with an example of your issue before you post an issue here. 

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
gem 'bootstrap3-datetimepicker-rails', '~> 3.0.0'
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

# [Change Log](https://github.com/Eonasdan/bootstrap-datetimepicker/wiki/Change-Log)
The change log has moved to the wiki
