suite 'issue', ->

  beforeEach setupDateTimePicker()

  afterEach teardownDateTimePicker()

  # Helper to debug in browser
  # after setupDateTimePicker()
  
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
    @input.val('05/01/1905 00:00:00')
    @input.change()
    expect(@widget.find('.datepicker-days .switch').text())
      .to.equal 'May 1905'
    @widget.find('.datepicker-days .next').click()
    expect(@widget.find('.datepicker-days .switch').text())
      .to.equal 'June 1905'

  test '7 - Picking a date from January while viewing December yields a November date', ->
    # https://github.com/tarruda/bootstrap-datetimepicker/issues/7
    # first set it to a december date
    @input.val('12/25/2012 01:01:01')
    @input.change()
    # Click on 2 january
    @dateWidget.find('.datepicker-days .day.new:contains(2)').click()
    @dateShouldEqual(2013, 0, 2, 1, 1, 1)



