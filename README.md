#Comming Soon

I'm hoping to move the documentation here soon so that it reflex’s the changes for Bootstrap V3

Forked from http://www.eyecon.ro/bootstrap-datepicker/

See documentation [here](http://tarruda.github.com/bootstrap-datetimepicker/).

#Example for Bootstrap V3

```html
<div class='well'>
	<div class='input-group date' id='datetimepicker1'>
		<input type='text' class="form-control"/>
		<span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>
	</div>
</div>
```
```javascript
$('#datetimepicker1').datetimepicker();
```

If `data-format='MM/dd/yyyy hh:mm:ss'` is not included on the `input` field or the `div` the plugin will use `MM/dd/yyyy hh:mm:ss` by default or `MM/dd/yyyy` if you have `pickTime` set to false or `hh:mm:ss` if you have `pickDate` set to false. The plugin will also leave the `:ss` off if you have `pickSeconds` set to false