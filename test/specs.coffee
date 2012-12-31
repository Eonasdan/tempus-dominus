describe 'datetimepicker', ->

  beforeEach setupDateTimePicker()

  afterEach teardownDateTimePicker()

  # Helper to debug in browser
  # after setupDateTimePicker()

  it 'starts with date value parsed from input value', ->
    @dateShouldEqual(1905, 4, 1, 21, 52, 14)
    expect(@dateWidget.find('.day.active').html()).to.equal '1'
    expect(@dateWidget.find('.month.active').html()).to.equal 'May'
    expect(@dateWidget.find('.year.active').html()).to.equal '1905'
    expect(@timeWidget.find('.timepicker-hour').html()).to.equal '21'
    expect(@timeWidget.find('.timepicker-minute').html()).to.equal '52'
    expect(@timeWidget.find('.timepicker-second').html()).to.equal '14'

  it 'creates an invisible widget on body', ->
    expect(@widget.length).to.equal 1
    expect(@widget.is ':hidden').to.be.true

  it 'pops up the widget when icon is clicked', ->
    @addon.click()
    expect(@widget.is ':visible').to.be.true

  it 'hides the widget when clicking outside it', ->
    @addon.click()
    $('#mocha').mousedown()
    expect(@widget.is ':hidden').to.be.true

  it 'does not hide widget when clicking inside it', ->
    @addon.click()
    @widget.find('.datepicker .day:contains(18)').click()
    expect(@widget.find('.datepicker .day:contains(18)').is '.active')
      .to.be.true
    expect(@widget.is ':visible').to.be.true

  it 'changes day of month', ->
    @dateWidget.find('.datepicker-days .day:contains(25)').click()
    @dateShouldEqual(1905, 4, 25, 21, 52, 14)

  it 'changes month', ->
    # switch to month view
    @dateWidget.find('.datepicker-days .switch').click()
    @dateWidget.find('.datepicker-months .month:contains(Aug)').click()
    @dateShouldEqual(1905, 7, 1, 21, 52, 14)

  it 'changes year', ->
    # switch to year view
    @dateWidget.find('.datepicker-days .switch').click()
    @dateWidget.find('.datepicker-months .switch').click()
    @dateWidget.find('.datepicker-years .year:contains(1907)').click()
    @dateShouldEqual(1907, 4, 1, 21, 52, 14)

  it 'changes displayed month using arrows', ->
    expect(@dateWidget.find('.datepicker-days .switch').text())
      .to.equal 'May 1905'
    @dateWidget.find('.datepicker-days .next').click()
    expect(@dateWidget.find('.datepicker-days .switch').text())
      .to.equal 'June 1905'
    @dateWidget.find('.datepicker-days .prev').click()
    expect(@dateWidget.find('.datepicker-days .switch').text())
      .to.equal 'May 1905'

  it 'changes displayed year using arrows', ->
    @dateWidget.find('.datepicker-days .switch').click()
    expect(@dateWidget.find('.datepicker-months .switch').text())
      .to.equal '1905'
    @dateWidget.find('.datepicker-months .next').click()
    expect(@dateWidget.find('.datepicker-months .switch').text())
      .to.equal '1906'
    @dateWidget.find('.datepicker-months .prev').click()
    expect(@dateWidget.find('.datepicker-months .switch').text())
      .to.equal '1905'

  it 'changes displayed year range using arrows', ->
    @dateWidget.find('.datepicker-days .switch').click()
    @dateWidget.find('.datepicker-months .switch').click()
    expect(@dateWidget.find('.datepicker-years .switch').text())
      .to.equal '1900-1909'
    @dateWidget.find('.datepicker-years .next').click()
    expect(@dateWidget.find('.datepicker-years .switch').text())
      .to.equal '1910-1919'
    @dateWidget.find('.datepicker-years .prev').click()
    expect(@dateWidget.find('.datepicker-years .switch').text())
      .to.equal '1900-1909'

  it 'switches to time picker', ->
    @addon.click()
    expect(@widget.find('.collapse.in .datepicker').length).to.equal 1
    expect(@widget.find('.collapse:not(.in) .timepicker').length).to.equal 1
    @widget.find('.picker-switch a').click()
    expect(@widget.find('.collapse:not(.in) .datepicker').length).to.equal 1
    expect(@widget.find('.collapse.in .timepicker').length).to.equal 1

  it 'increments/decrements hour', ->
    @addon.click()
    @widget.find('.picker-switch a').click()
    @timeWidget.find('[data-action=incrementHours]').click()
    @dateShouldEqual(1905, 4, 1, 22, 52, 14)
    @timeWidget.find('[data-action=decrementHours]').click()
    @dateShouldEqual(1905, 4, 1, 21, 52, 14)

  it 'increments/decrements minutes', ->
    @addon.click()
    @widget.find('.picker-switch a').click()
    @timeWidget.find('[data-action=incrementMinutes]').click()
    # 15 minutes step is the default
    @dateShouldEqual(1905, 4, 1, 22, 7, 14)
    @timeWidget.find('[data-action=decrementMinutes]').click()
    @dateShouldEqual(1905, 4, 1, 21, 52, 14)

  it 'increments/decrements minutes', ->
    @addon.click()
    @widget.find('.picker-switch a').click()
    @timeWidget.find('[data-action=incrementSeconds]').click()
    # 30 seconds step is the default
    @dateShouldEqual(1905, 4, 1, 21, 52, 44)
    @timeWidget.find('[data-action=decrementSeconds]').click()
    @dateShouldEqual(1905, 4, 1, 21, 52, 14)
