newComponent = -> $(
  """
  <div id="datetimepicker" class="input-append date">
    <input type="text" value="05/01/1905 21:52:14">
    <span class="add-on">
      <i data-time-icon="icon-time" data-date-icon="icon-calendar"></i>
    </span>
  </div>
  """
)

describe 'datetimepicker with default options', ->

  beforeEach ->
    @component = newComponent().appendTo($ '#mocha')
    @component.data('date-format', 'MM/dd/yyyy hh:mm:ss')
    @component.datetimepicker()
    @input = @component.find 'input'
    @addon = @component.find '.add-on'
    @picker = @component.data 'datetimepicker'
    @widget = $ 'body > .datetimepicker'

  afterEach ->
    @picker.destroy()

  it 'starts with date value parsed from input value', ->
    expect(@picker.date.getTime()).to.equal Date.UTC(1905, 4, 1, 21, 52, 14)
    expect(@widget.find('.datepicker .day.active').html()).to.equal('1')
    expect(@widget.find('.datepicker .month.active').html()).to.equal('May')
    expect(@widget.find('.datepicker .year.active').html()).to.equal('1905')
    expect(@widget.find('.timepicker .timepicker-hour').html()).to.equal('21')
    expect(@widget.find('.timepicker .timepicker-minute').html()).to.equal('52')
    expect(@widget.find('.timepicker .timepicker-second').html()).to.equal('14')

  it 'creates an invisible widget on body', ->
    expect(@widget.length).to.equal 1
    expect(@widget.is ':hidden').to.be.true

  it 'should popup widget when icon is clicked', ->
    @addon.click()
    expect(@widget.is ':visible').to.be.true


