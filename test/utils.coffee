setupDateTimePicker = (opts) ->
  ->
    @component = $(
      """
      <div id="datetimepicker" class="input-append date">
        <input type="text" value="05/01/1905 21:52:14" data-format="MM/dd/yyyy hh:mm:ss">
        <span class="add-on">
          <i data-time-icon="icon-time" data-date-icon="icon-calendar"></i>
        </span>
      </div>
      """
    ).appendTo($ '#container').datetimepicker(opts)
    @input = @component.find 'input'
    @addon = @component.find '.add-on'
    @picker = @component.data 'datetimepicker'
    @widget = $ 'body > .datetimepicker'

teardownDateTimePicker = ->
  ->
    @picker.destroy()
    $('#container').empty()

