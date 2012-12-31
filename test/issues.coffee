suite 'issue', ->

  beforeEach setupDateTimePicker()

  afterEach teardownDateTimePicker()

  test '5', ->
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

  test '6', ->
    # https://github.com/tarruda/bootstrap-datetimepicker/issues/6
    @input.val('05/01/1905 00:00:00')
    @input.change()
    expect(@widget.find('.datepicker-days .switch').text())
      .to.equal 'May 1905'
    @widget.find('.datepicker-days .next').click()
    expect(@widget.find('.datepicker-days .switch').text())
      .to.equal 'June 1905'
