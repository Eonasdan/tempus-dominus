import { ErrorMessages } from './errorMessages';

//this is not the way I want this to stay but nested classes seemed to blown up once its compiled.
const NAME = 'tempus-dominus';
const VERSION = '6.0.0-alpha1';
const DATA_KEY = 'td';
const DATA_API_KEY = '.data-api';

class Events {
  KEY = `.${DATA_KEY}`;
  CHANGE = `change${this.KEY}`;
  UPDATE = `update${this.KEY}`;
  ERROR = `error${this.KEY}`;
  SHOW = `show${this.KEY}`;
  HIDE = `hide${this.KEY}`;
  BLUR = `blur${this.KEY}`;
  KEYUP = `keyup${this.KEY}`;
  KEYDOWN = `keydown${this.KEY}`;
  FOCUS = `focus${this.KEY}`;
  CLICK_DATA_API = `click${this.KEY}${DATA_API_KEY}`;
  clickAction = `click${this.KEY}.action`;
}

class Css {
  widget = `${NAME}-widget`;
  switch = 'picker-switch';
  // todo the next several classes are to represent states of the picker that would
  // make it wider then usual and it seems like this could be cleaned up.
  widgetCalendarWeeks = `${this.widget}-with-calendar-weeks`;
  useTwentyfour = 'useTwentyfour';
  wider = 'wider';
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
}

export default class Namespace {
  static NAME = NAME;
  static VERSION = VERSION;
  static DATA_KEY = DATA_KEY;
  static DATA_API_KEY = DATA_API_KEY;

  static Events = new Events();

  static Css = new Css();

  static ErrorMessages = new ErrorMessages();
}
