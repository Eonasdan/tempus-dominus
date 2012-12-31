suite 'issue', ->

  beforeEach setupDateTimePicker()

  afterEach teardownDateTimePicker()

  after setupDateTimePicker()

  test '5', ->
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


    

