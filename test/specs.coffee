describe 'datetimepicker', ->

  beforeEach setupDateTimePicker()

  afterEach teardownDateTimePicker()

  it 'starts with date value parsed from input value', ->
    @dateShouldEqual 1905, 4, 1, 21, 52, 14
    expect(@dateWidget.find('.day.active').text()).to.equal '1'
    expect(@dateWidget.find('.month.active').text()).to.equal 'May'
    expect(@dateWidget.find('.year.active').text()).to.equal '1905'
    expect(@timeWidget.find('.timepicker-hour').html())
      .to.equal '21'
    expect(@timeWidget.find('.timepicker-minute').html())
      .to.equal '52'
    expect(@timeWidget.find('.timepicker-second').html())
      .to.equal '14'

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
    @dateShouldEqual 1905, 4, 25, 21, 52, 14

  it 'changes month', ->
    # switch to month view
    @dateWidget.find('.datepicker-days .switch').click()
    @dateWidget.find('.datepicker-months .month:contains(Aug)').click()
    @dateShouldEqual 1905, 7, 1, 21, 52, 14

  it 'changes year', ->
    # switch to year view
    @dateWidget.find('.datepicker-days .switch').click()
    @dateWidget.find('.datepicker-months .switch').click()
    @dateWidget.find('.datepicker-years .year:contains(1907)').click()
    @dateShouldEqual 1907, 4, 1, 21, 52, 14

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

  it 'switches to and from time picker', (done) ->
    # Clicks between a collapsible transition will be ignored by the
    # date time picker, so we need to temporarily minimize the
    # css3 transition effects to avoid waiting too much
    @widget.find('.collapse').addClass('no-transition')
    @addon.click()
    expect(@widget.find('.datepicker').closest('.collapse').height())
      .to.not.equal 0
    expect(@widget.find('.timepicker').closest('.collapse').height())
      .to.equal 0
    @widget.find('.picker-switch a').click()
    @widget.one 'shown', =>
      expect(@widget.find('.datepicker').closest('.collapse').height())
        .to.equal 0
      expect(@widget.find('.timepicker').closest('.collapse').height())
        .to.not.equal 0
      @widget.find('.picker-switch a').click()
      @widget.one 'shown', =>
        expect(@widget.find('.datepicker').closest('.collapse').height())
          .to.not.equal 0
        expect(@widget.find('.timepicker').closest('.collapse').height())
          .to.equal 0
        expect(@timeWidget.find('.timepicker-picker').is ':visible')
          .to.be.true
        expect(@timeWidget.find('.timepicker-hours').is ':hidden')
          .to.be.true
        expect(@timeWidget.find('.timepicker-minutes').is ':hidden')
          .to.be.true
        expect(@timeWidget.find('.timepicker-seconds').is ':hidden')
          .to.be.true
        done()

  it 'increments/decrements hour', ->
    @addon.click()
    @widget.find('.picker-switch a').click()
    @timeWidget.find('[data-action=incrementHours]').click()
    @dateShouldEqual 1905, 4, 1, 22, 52, 14
    @timeWidget.find('[data-action=decrementHours]').click()
    @dateShouldEqual 1905, 4, 1, 21, 52, 14

  it 'increments/decrements minutes', ->
    @addon.click()
    @widget.find('.picker-switch a').click()
    @timeWidget.find('[data-action=incrementMinutes]').click()
    # 15 minutes step is the default
    @dateShouldEqual 1905, 4, 1, 21, 53, 14
    @timeWidget.find('[data-action=decrementMinutes]').click()
    @dateShouldEqual 1905, 4, 1, 21, 52, 14

  it 'increments/decrements minutes', ->
    @addon.click()
    @widget.find('.picker-switch a').click()
    @timeWidget.find('[data-action=incrementSeconds]').click()
    # 30 seconds step is the default
    @dateShouldEqual 1905, 4, 1, 21, 52, 15
    @timeWidget.find('[data-action=decrementSeconds]').click()
    @dateShouldEqual 1905, 4, 1, 21, 52, 14

  it 'picks hour on hours view', ->
    @addon.click()
    @widget.find('.picker-switch a').click()
    @timeWidget.find('[data-action=showHours]').click()
    expect(@timeWidget.find('.timepicker-picker').is ':hidden').to.be.true
    expect(@timeWidget.find('.timepicker-hours').is ':visible').to.be.true
    @timeWidget.find('.timepicker-hours .hour:contains(09)').click()
    expect(@timeWidget.find('.timepicker-picker').is ':visible').to.be.true
    expect(@timeWidget.find('.timepicker-hours').is ':hidden').to.be.true
    @dateShouldEqual 1905, 4, 1, 9, 52, 14

  it 'picks minute on minutes view', ->
    @addon.click()
    @widget.find('.picker-switch a').click()
    @timeWidget.find('[data-action=showMinutes]').click()
    expect(@timeWidget.find('.timepicker-picker').is ':hidden').to.be.true
    expect(@timeWidget.find('.timepicker-minutes').is ':visible').to.be.true
    @timeWidget.find('.timepicker-minutes .minute:contains(15)').click()
    expect(@timeWidget.find('.timepicker-picker').is ':visible').to.be.true
    expect(@timeWidget.find('.timepicker-minutes').is ':hidden').to.be.true
    @dateShouldEqual 1905, 4, 1, 21, 15, 14

  it 'picks second on seconds view', ->
    @addon.click()
    @widget.find('.picker-switch a').click()
    @timeWidget.find('[data-action=showSeconds]').click()
    expect(@timeWidget.find('.timepicker-picker').is ':hidden').to.be.true
    expect(@timeWidget.find('.timepicker-seconds').is ':visible').to.be.true
    @timeWidget.find('.timepicker-seconds .second:contains(45)').click()
    expect(@timeWidget.find('.timepicker-picker').is ':visible').to.be.true
    expect(@timeWidget.find('.timepicker-seconds').is ':hidden').to.be.true
    @dateShouldEqual 1905, 4, 1, 21, 52, 45

  it 'updates date when correctly formatted date is set on input', ->
    @input.val '09/14/1982 01:02:03 037'
    @input.change()
    @dateShouldEqual 1982, 8, 14, 1, 2, 3, 37

  it 'ignores incorrectly formatted dates set on input', ->
    @input.val '09/14/198 01:02:03 00'
    @input.change()
    expect(@input.val()).to.equal '05/01/1905 21:52:14 0'
    @dateShouldEqual 1905, 4, 1, 21, 52, 14

  it 'unsets date when input value is erased', ->
    @input.val ''
    @input.change()
    expect(@picker.getDate()).to.be.null
    expect(@picker.getLocalDate()).to.be.null
    @input.val '09/14/1982 01:02:03 037'
    @input.change()
    @dateShouldEqual 1982, 8, 14, 1, 2, 3, 37


describe 'datetimepicker with 12-hour clock format', ->

  beforeEach setupDateTimePicker({
    format: 'MM/dd/yyyy HH:mm PP'
    value: '05/01/1905 09:52 PM'
    pick12HourFormat: true
  })

  afterEach teardownDateTimePicker()

  it 'parses correctly', ->
    @dateShouldEqual 1905, 4, 1, 21, 52
    expect(@timeWidget.find('.timepicker-hour').text()).to.equal '09'
    expect(@timeWidget.find('.timepicker-minute').text()).to.equal '52'
    expect(@timeWidget.find('.timepicker-second').text()).to.equal '00'
    expect(@timeWidget.find('[data-action=togglePeriod]').text())
      .to.equal 'PM'
    @input.val '05/01/1905 12:52 AM'
    @input.change()
    @dateShouldEqual 1905, 4, 1, 0, 52
    expect(@timeWidget.find('.timepicker-hour').text()).to.equal '12'
    expect(@timeWidget.find('.timepicker-minute').text()).to.equal '52'
    expect(@timeWidget.find('.timepicker-second').text()).to.equal '00'
    expect(@timeWidget.find('[data-action=togglePeriod]').text())
      .to.equal 'AM'
    # Incorrectly formatted date
    @input.val '05/01/1905 13:52 AM'
    @input.change()
    @dateShouldEqual 1905, 4, 1, 0, 52
    @input.val '05/01/1905 12:52 PM'
    @input.change()
    @dateShouldEqual 1905, 4, 1, 12, 52
    expect(@timeWidget.find('.timepicker-hour').text()).to.equal '12'
    expect(@timeWidget.find('.timepicker-minute').text()).to.equal '52'
    expect(@timeWidget.find('.timepicker-second').text()).to.equal '00'
    expect(@timeWidget.find('[data-action=togglePeriod]').text())
      .to.equal 'PM'

  it 'formats correctly', ->
    @picker.setValue Date.UTC(1905, 4, 1, 10)
    expect(@input.val()).to.equal '05/01/1905 10:00 AM'
    @picker.setValue Date.UTC(1905, 4, 1, 0, 1)
    expect(@input.val()).to.equal '05/01/1905 12:01 AM'
    @picker.setValue Date.UTC(1905, 4, 1, 12, 1)
    expect(@input.val()).to.equal '05/01/1905 12:01 PM'

  it 'picks hour on hours view', ->
    @addon.click()
    @widget.find('.picker-switch a').click()
    @timeWidget.find('[data-action=showHours]').click()
    expect(@timeWidget.find('.timepicker-picker').is ':hidden').to.be.true
    expect(@timeWidget.find('.timepicker-hours').is ':visible').to.be.true
    @timeWidget.find('.timepicker-hours .hour:contains(08)').click()
    expect(@timeWidget.find('.timepicker-picker').is ':visible').to.be.true
    expect(@timeWidget.find('.timepicker-hours').is ':hidden').to.be.true
    @dateShouldEqual 1905, 4, 1, 20, 52
    @timeWidget.find('[data-action=togglePeriod]').click()
    @dateShouldEqual 1905, 4, 1, 8, 52
    expect(@timeWidget.find('.timepicker-hours .hour').length).to.equal(12)
    @timeWidget.find('.timepicker-hours .hour:contains(07)').click()
    @dateShouldEqual 1905, 4, 1, 7, 52
    @timeWidget.find('[data-action=togglePeriod]').click()
    @dateShouldEqual 1905, 4, 1, 19, 52
    @timeWidget.find('.timepicker-hours .hour:contains(12)').click()
    @dateShouldEqual 1905, 4, 1, 12, 52
    @timeWidget.find('[data-action=togglePeriod]').click()
    @timeWidget.find('.timepicker-hours .hour:contains(11)').click()
    @dateShouldEqual 1905, 4, 1, 11, 52
    @timeWidget.find('.timepicker-hours .hour:contains(12)').click()
    @dateShouldEqual 1905, 4, 1, 0, 52


describe 'datetimepicker api', ->

  beforeEach setupDateTimePicker()

  afterEach teardownDateTimePicker()

  it 'supports local dates', ->
    d = new Date(2000, 1, 15, 8, 8, 8, 743)
    @picker.setLocalDate(d)
    @dateShouldEqual(2000, 1, 15, 8, 8, 8, 743)

  it 'supports utc dates', ->
    d = Date.UTC(2000, 1, 15, 8, 8, 8, 743)
    @picker.setDate(new Date(d))
    @dateShouldEqual(2000, 1, 15, 8, 8, 8, 743)

  it 'unsets value by passing null', ->
    @picker.setDate(null)
    expect(@input.val()).to.equal ''

  it 'supports start date', ->
    @picker.setDate(new Date(Date.UTC(2002, 2, 15, 0, 0, 0, 0)))
    @picker.setStartDate(new Date(Date.UTC(2002, 2, 14, 0, 0, 0, 0)))
    expect(@dateWidget.find('.datepicker-days .day:contains(13)').is '.disabled').to.be.true
    expect(@dateWidget.find('.datepicker-days .day:contains(14)').is '.disabled').to.be.false
    expect(@dateWidget.find('.datepicker-days .prev').is '.disabled').to.be.true
    expect(@dateWidget.find('.datepicker-days .next').is '.disabled').to.be.false
    @dateWidget.find('.datepicker-days .switch').click()
    expect(@dateWidget.find('.datepicker-months .month:contains(Feb)').is '.disabled').to.be.true
    expect(@dateWidget.find('.datepicker-months .month:contains(Mar)').is '.disabled').to.be.false
    expect(@dateWidget.find('.datepicker-months .prev').is '.disabled').to.be.true
    expect(@dateWidget.find('.datepicker-months .next').is '.disabled').to.be.false
    @dateWidget.find('.datepicker-months .switch').click()
    expect(@dateWidget.find('.datepicker-years .year:contains(2001)').is '.disabled').to.be.true
    expect(@dateWidget.find('.datepicker-years .year:contains(2002)').is '.disabled').to.be.false
    expect(@dateWidget.find('.datepicker-years .prev').is '.disabled').to.be.true
    expect(@dateWidget.find('.datepicker-years .next').is '.disabled').to.be.false

  it 'supports end date', ->
    @picker.setDate(new Date(Date.UTC(2002, 2, 15, 0, 0, 0, 0)))
    @picker.setEndDate(new Date(Date.UTC(2002, 2, 16, 0, 0, 0, 0)))
    expect(@dateWidget.find('.datepicker-days .day:contains(17)').is '.disabled').to.be.true
    expect(@dateWidget.find('.datepicker-days .day:contains(16)').is '.disabled').to.be.false
    expect(@dateWidget.find('.datepicker-days .next').is '.disabled').to.be.true
    expect(@dateWidget.find('.datepicker-days .prev').is '.disabled').to.be.false
    @dateWidget.find('.datepicker-days .switch').click()
    expect(@dateWidget.find('.datepicker-months .month:contains(Apr)').is '.disabled').to.be.true
    expect(@dateWidget.find('.datepicker-months .month:contains(Mar)').is '.disabled').to.be.false
    expect(@dateWidget.find('.datepicker-months .next').is '.disabled').to.be.true
    expect(@dateWidget.find('.datepicker-months .prev').is '.disabled').to.be.false
    @dateWidget.find('.datepicker-months .switch').click()
    expect(@dateWidget.find('.datepicker-years .year:contains(2003)').is '.disabled').to.be.true
    expect(@dateWidget.find('.datepicker-years .year:contains(2002)').is '.disabled').to.be.false
    expect(@dateWidget.find('.datepicker-years .next').is '.disabled').to.be.true
    expect(@dateWidget.find('.datepicker-years .prev').is '.disabled').to.be.false


describe 'datetimepicker with pickSeconds = false', ->

  beforeEach setupDateTimePicker({
    value: '09/14/1982 01:02:03 037'
    pickSeconds: false
  })

  afterEach teardownDateTimePicker()

  it 'hides seconds selector from time widget', ->
    expect(@timeWidget.find('[data-action=incrementSeconds]').length).to.equal 0
    expect(@timeWidget.find('[data-action=decrementSeconds]').length).to.equal 0
    expect(@timeWidget.find('.timepicker-second').length) .to.equal 0

