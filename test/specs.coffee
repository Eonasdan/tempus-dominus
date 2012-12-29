newComponent = -> $(
  """
  <div id="datetimepicker" class="input-append date">
    <input type="text"></input>
    <span class="add-on">
      <i data-time-icon="icon-time" data-date-icon="icon-calendar"></i>
    </span>
  </div>
  """
)

describe 'datetimepicker with default options', ->

  beforeEach ->
    @component = newComponent().appendTo($ '#mocha').datetimepicker()
    @input = @component.find 'input'
    @addon = @component.find '.add-on'
    @picker = @component.data 'datetimepicker'
    @widget = $ 'body > .datetimepicker'

  afterEach ->
    @picker.destroy()

  it 'popups calendar when clicking the icon', ->
    expect(@widget.length).to.equal 1
    expect(@widget.is ':hidden').to.be.ok
    @addon.click()
    expect(@widget.is ':visible').to.be.ok
