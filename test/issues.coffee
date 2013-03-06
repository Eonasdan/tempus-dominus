suite 'issue', ->

  beforeEach setupDateTimePicker()

  afterEach teardownDateTimePicker()

  # Helper to debug in browser
  # after setupDateTimePicker({
  #   format: 'MM/dd/yyyy HH:mm:ss PP'
  #   value: '05/01/1905 09:52:00 PM'
  #   pick12HourFormat: true
  # })
  
  test "4 - TypeError: Cannot call method 'data' of undefined", ->
    teardownDateTimePicker().call @
    setupDateTimePicker({
      markup:
        """
        <div class="input-append datetimepicker"
            style="display:inline-block">
          <input type="text" class="" name="start_time" id="start_time"
                     value="2012-12-30 08:00:00" original-value="2012-12-30
                     08:00:00" size="30">
          <span class="add-on"><i class="glyph-icon-calendar"></i></span>
        </div>
        """
      format: 'yyyy-MM-dd hh:mm:ss'
      language: 'en'
      pickDate: true
      pickTime: true
      hourStep: 1
      minuteStep: 15
      secondStep: 30
      inputMask: true
    }).call @
    @dateShouldEqual(2012, 11, 30, 8)

  test '5 - Date value problem when click on time', ->
    # https://github.com/tarruda/bootstrap-datetimepicker/issues/5
    # open datetimepicker
    @addon.click()
    # select a date
    @widget.find('.datepicker .day:contains(25)').click()
    # switch to time picker
    @widget.find('.picker-switch').click()
    # click on the selected 'minutes' span
    @widget.find('[data-time-component=minutes]').click()
    # the viewDate year value should not be modified
    expect(@picker.viewDate.getUTCFullYear()).to.equal(1905)

  test "6 - Doesn't always change month view", ->
    # https://github.com/tarruda/bootstrap-datetimepicker/issues/6
    @input.val '05/01/1905 00:00:00 000'
    @input.change()
    expect(@widget.find('.datepicker-days .switch').text())
      .to.equal 'May 1905'
    @widget.find('.datepicker-days .next').click()
    expect(@widget.find('.datepicker-days .switch').text())
      .to.equal 'June 1905'

  test '7 - Picking a date from January while viewing December yields a November date', ->
    # https://github.com/tarruda/bootstrap-datetimepicker/issues/7
    # first set it to a december date
    @input.val '12/25/2012 01:01:01 000'
    @input.change()
    # Click on 2 january
    @dateWidget.find('.datepicker-days .day.new:contains(2)').click()
    @dateShouldEqual(2013, 0, 2, 1, 1, 1)

  test '61 - Delete date string and then select date by click the icon does not work', ->
    # https://github.com/tarruda/bootstrap-datetimepicker/issues/61
    # erase input box
    @input.val('')
    @input.change()
    # open datetimepicker
    @addon.click()
    # select a date
    @widget.find('.datepicker .day:contains(25)').click()
    expect(@input.val()).to.equal('05/25/1905 21:52:14 0')

