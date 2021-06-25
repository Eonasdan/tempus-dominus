import { ErrorMessages } from './errorMessages';

//this is not the way I want this to stay but nested classes seemed to blown up once its compiled.
const NAME = 'tempus-dominus';
const VERSION = '6.0.0-alpha1';
const DATA_KEY = 'td';

/**
 * Events
 */
class Events {
  key = `.${DATA_KEY}`;
  change = `change${this.key}`;
  update = `update${this.key}`;
  error = `error${this.key}`;
  /**
   * Show event
   * @event Events#show
   */
  show = `show${this.key}`;
  /**
   * Hide event
   * @event Events#hide
   */
  hide = `hide${this.key}`;
  blur = `blur${this.key}`;
  keyup = `keyup${this.key}`;
  keydown = `keydown${this.key}`;
  focus = `focus${this.key}`;
}

class Css {
  widget = `${NAME}-widget`;
  switch = 'picker-switch';
  sideBySide = 'timepicker-sbs';

  previous = 'previous';
  next = 'next';
  disabled = 'disabled';
  old = 'old';
  new = 'new';
  active = 'active';
  separator = 'separator';
  //#region date container
  dateContainer = 'date-container';
  decadesContainer = `${this.dateContainer}-decades`;
  decade = 'decade';
  yearsContainer = `${this.dateContainer}-years`;
  year = 'year';
  monthsContainer = `${this.dateContainer}-months`;
  month = 'month';
  daysContainer = `${this.dateContainer}-days`;
  day = 'day';
  calendarWeeks = 'cw';
  dayOfTheWeek = 'dow';
  today = 'today';
  weekend = 'weekend';
  //#endregion

  //#region time container

  timeContainer = 'time-container';
  clockContainer = `${this.timeContainer}-clock`;
  hourContainer = `${this.timeContainer}-hour`;
  minuteContainer = `${this.timeContainer}-minute`;
  secondContainer = `${this.timeContainer}-second`;

  hour = 'hour';
  minute = 'minute';
  second = 'second';

  //#endregion

  //#region collapse

  show = 'show';
  collapsing = 'td-collapsing';
  collapse = 'td-collapse';

  //#endregion
  inline = 'inline';
}

export default class Namespace {
  static NAME = NAME;
  static VERSION = VERSION;
  static DATA_KEY = DATA_KEY;

  static Events = new Events();

  static Css = new Css();

  static ErrorMessages = new ErrorMessages();
}
