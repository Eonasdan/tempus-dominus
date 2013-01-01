setupDateTimePicker = (opts) ->
  value = '05/01/1905 21:52:14 0'
  if opts?.value
    value = opts.value
    delete opts.value
  markup =
    """
    <div id="datetimepicker" class="input-append date">
      <input type="text" value="#{value}" data-format="MM/dd/yyyy hh:mm:ss ms">
      <span class="add-on">
        <i data-time-icon="icon-time" data-date-icon="icon-calendar"></i>
      </span>
    </div>
    """
  if opts?.markup
    markup = opts.markup
    delete opts.markup
  return ->
    @component = $(markup).appendTo($ '#container').datetimepicker(opts)
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

