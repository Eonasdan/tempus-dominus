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
    @widget = $ 'body > .bootstrap-datetimepicker-widget'
    @dateWidget = @widget.find('.datepicker')
    @timeWidget = @widget.find('.timepicker')
    @dateShouldEqual = =>
      expect(@picker.getDate().getTime()).to.equal(
        Date.UTC.apply(Date, arguments))
      ld = @picker.getLocalDate()
      offset = ld.getTimezoneOffset()
      offset = offset * 60 * 1000 # in ms
      expect(@picker.getLocalDate().getTime()).to.equal(
        Date.UTC.apply(Date, arguments) + offset)

teardownDateTimePicker = ->
  ->
    @picker.destroy()
    $('#container').empty()
