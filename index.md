---
title: Bootstrap Date/Time Picker
layout: default
author: Thiago de Arruda
authorUrl: https://github.com/tarruda
projectName: bootstrap-datetimepicker
projectDescription: Date/Time Picker for Twitter Boostrap 
downloadUrl: assets/dist/bootstrap-datetimepicker-0.0.1.zip
css:
  - //netdna.bootstrapcdn.com/font-awesome/2.0/css/font-awesome.css
  - //netdna.bootstrapcdn.com/twitter-bootstrap/2.2.2/css/bootstrap.no-icons.min.css
  - assets/css/bootstrap-datetimepicker.min.css
  - assets/css/default.css
js:
  - //cdnjs.cloudflare.com/ajax/libs/jquery/1.8.3/jquery.min.js
  - //netdna.bootstrapcdn.com/twitter-bootstrap/2.2.2/js/bootstrap.min.js
  - assets/js/bootstrap-datetimepicker.min.js
  - assets/js/index.js
---
### Introduction
Simple date/time picker component based on the work of [Stefan Petre](http://www.eyecon.ro/bootstrap-datepicker/),
with contributions taken from [Andrew Rowls](https://github.com/eternicode) and
[jdewit](https://github.com/jdewit).

### Demo
{% include demo.html %}

### Usage
The following html will produce a widget similar to the demo above:
{% highlight html %}
<html>
  <head>
    <link rel="stylesheet" type="text/css" media="screen"
     href="http://tarruda.github.com/bootstrap-datetimepicker/stylesheets/bootstrap-datetimepicker.min.css">
  </head>
  <body>
    <div id="datetimepicker" class="input-append date">
      <input type="text"></input>
      <span class="add-on">
        <i data-time-icon="icon-time" data-date-icon="icon-calendar"></i>
      </span>
    </div>
    <script type="text/javascript"
     src="//cdnjs.cloudflare.com/ajax/libs/jquery/1.8.3/jquery.min.js">
    </script> 
    <script type="text/javascript"
     src="//netdna.bootstrapcdn.com/twitter-bootstrap/2.2.2/js/bootstrap.min.js">
    </script>
    <script type="text/javascript"
     src="http://tarruda.github.com/bootstrap-datetimepicker/javascripts/bootstrap-datetimepicker.min.js">
    </script>
    <script type="text/javascript">
      $('#datetimepicker').datetimepicker({
        format: 'MM/dd/yyyy hh:mm',
        language: 'en',
        pickDate: true,
        pickTime: true,
        hourStep: 1,
        minuteStep: 15,
        secondStep: 30,
        inputMask: true
      });
    </script>
  </body>
{% endhighlight %}
The element also has the bootstrap-datepicker 'changeDate' event and 'setValue' method.

### Compilation
To compile/minify you need to have make, node.js and npm on your $PATH

{% highlight sh %}
$ git clone git://github.com/tarruda/bootstrap-datetimepicker.git
$ cd bootstrap-datetimepicker
$ make deps
$ make build
{% endhighlight %}
