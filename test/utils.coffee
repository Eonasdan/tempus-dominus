setupDateTimePicker = (opts) ->
  ->
    @component = $(
      """
      <div id="datetimepicker" class="input-append date">
        <input type="text" value="05/01/1905 21:52:14 0" data-format="MM/dd/yyyy hh:mm:ss ms">
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
    @dateWidget = @widget.find('.datepicker')
    @timeWidget = @widget.find('.timepicker')
    @date = @picker.date
    @component.on 'changeDate', (e) =>
      @date = e.date
    @dateShouldEqual = =>
      expect(@date.getTime()).to.equal Date.UTC.apply(Date, arguments)

teardownDateTimePicker = ->
  ->
    @picker.destroy()
    $('#container').empty()

