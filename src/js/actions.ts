import { DatePickerModes } from './conts.js';
import { DateTime, Unit } from './datetime';
import { TempusDominus } from './tempus-dominus';
import Collapse from './display/collapse';
import Namespace from './namespace';

export default class Actions {
  private context: TempusDominus;
  private collapse: Collapse;

  constructor(context: TempusDominus) {
    this.context = context;
    this.collapse = new Collapse();
  }

  do(e, action?) {
    const currentTarget = e.currentTarget;
    if (currentTarget.classList.contains(Namespace.Css.disabled)) return false;
    action = action || currentTarget.dataset.action;
    const lastPicked = (this.context.dates.lastPicked || this.context.viewDate)
      .clone;
    console.log('action', action);

    const modifyTime = (unit: Unit, value = 1) => {
      const newDate = lastPicked.manipulate(value, unit);
      if (this.context.validation.isValid(newDate, unit)) {
        /*if (this.context.dates.lastPickedIndex < 0) {
                    this.date(newDate);
                }*/
        this.context.dates._setValue(
          newDate,
          this.context.dates.lastPickedIndex
        );
      }
    };

    switch (action) {
      case ActionTypes.next:
      case ActionTypes.previous:
        const { NAV_FUNCTION, NAV_STEP } = DatePickerModes[
          this.context.currentViewMode
        ];
        if (action === ActionTypes.next)
          this.context.viewDate.manipulate(NAV_STEP, NAV_FUNCTION);
        else this.context.viewDate.manipulate(NAV_STEP * -1, NAV_FUNCTION);
        this.context.display.update('calendar');
        this.context._viewUpdate(NAV_FUNCTION);
        break;
      case ActionTypes.pickerSwitch:
        this.context.display._showMode(1);
        break;
      case ActionTypes.selectMonth:
      case ActionTypes.selectYear:
      case ActionTypes.selectDecade:
        const value = +currentTarget.getAttribute('data-value');
        switch (action) {
          case ActionTypes.selectMonth:
            this.context.viewDate.month = value;
            this.context._viewUpdate(Unit.month);
            break;
          case ActionTypes.selectYear:
            this.context.viewDate.year = value;
            this.context._viewUpdate(Unit.year);
            break;
          case ActionTypes.selectDecade:
            this.context.viewDate.year = value;
            this.context._viewUpdate(Unit.year);
            break;
        }

        if (this.context.currentViewMode === this.context.minViewModeNumber) {
          this.context.dates._setValue(
            this.context.viewDate,
            this.context.dates.lastPickedIndex
          );
          if (!this.context.options.inline) {
            this.context.display.hide();
          }
        } else {
          this.context.display._showMode(-1);
        }
        break;
      case ActionTypes.selectDay:
        const day = this.context.viewDate.clone;
        if (currentTarget.classList.contains(Namespace.Css.old)) {
          day.manipulate(-1, Unit.month);
        }
        if (currentTarget.classList.contains(Namespace.Css.new)) {
          day.manipulate(1, Unit.month);
        }

        day.date = +currentTarget.innerText;
        let index = 0;
        if (this.context.options.allowMultidate) {
          index = this.context.dates.pickedIndex(day, Unit.date);
          if (index !== -1) {
            this.context.dates._setValue(null, index); //deselect multidate
          } else {
            this.context.dates._setValue(
              day,
              this.context.dates.lastPickedIndex + 1
            );
          }
        } else {
          this.context.dates._setValue(day, this.context.dates.lastPickedIndex);
        }

        if (
          !this.context.display._hasTime &&
          !this.context.options.keepOpen &&
          !this.context.options.inline &&
          !this.context.options.allowMultidate
        ) {
          this.context.display.hide();
        }
        break;
      case ActionTypes.selectHour:
        let hour = +currentTarget.getAttribute('data-value');
        lastPicked.hours = hour;
        this.context.dates._setValue(
          lastPicked,
          this.context.dates.lastPickedIndex
        );
        if (
          this.context.options.display.components.useTwentyfourHour &&
          !this.context.options.display.components.minutes &&
          !this.context.options.keepOpen &&
          !this.context.options.inline
        ) {
          this.context.display.hide();
        } else {
          this.do(e, ActionTypes.showClock);
        }
        break;
      case ActionTypes.selectMinute:
        lastPicked.minutes = +currentTarget.innerText;
        this.context.dates._setValue(
          lastPicked,
          this.context.dates.lastPickedIndex
        );
        if (
          this.context.options.display.components.useTwentyfourHour &&
          !this.context.options.display.components.seconds &&
          !this.context.options.keepOpen &&
          !this.context.options.inline
        ) {
          this.context.display.hide();
        } else {
          this.do(e, ActionTypes.showClock);
        }
        break;
      case ActionTypes.selectSecond:
        lastPicked.seconds = +currentTarget.innerText;
        this.context.dates._setValue(
          lastPicked,
          this.context.dates.lastPickedIndex
        );
        if (
          this.context.options.display.components.useTwentyfourHour &&
          !this.context.options.keepOpen &&
          !this.context.options.inline
        ) {
          this.context.display.hide();
        } else {
          this.do(e, ActionTypes.showClock);
        }
        break;
      case ActionTypes.incrementHours:
        modifyTime(Unit.hours);
        break;
      case ActionTypes.incrementMinutes:
        modifyTime(Unit.minutes, this.context.options.stepping);
        break;
      case ActionTypes.incrementSeconds:
        modifyTime(Unit.seconds);
        break;
      case ActionTypes.decrementHours:
        modifyTime(Unit.hours, -1);
        break;
      case ActionTypes.decrementMinutes:
        modifyTime(Unit.minutes, this.context.options.stepping * -1);
        break;
      case ActionTypes.decrementSeconds:
        modifyTime(Unit.seconds, -1);
        break;
      case ActionTypes.togglePeriod:
        modifyTime(
          Unit.hours,
          this.context.dates.lastPicked.hours >= 12 ? -12 : 12
        );
        break;
      case ActionTypes.togglePicker:
        this.context.display.widget
          .querySelectorAll(
            `.${Namespace.Css.dateContainer}, .${Namespace.Css.timeContainer}`
          )
          .forEach((e: HTMLElement) => this.collapse.toggle(e));

        if (
          currentTarget.getAttribute('title') ===
          this.context.options.localization.selectDate
        ) {
          currentTarget.setAttribute(
            'title',
            this.context.options.localization.selectTime
          );
          currentTarget.innerHTML = this.context.display.iconTag(
            this.context.options.display.icons.time
          ).outerHTML;
          this.context.display.update('calendar');
        } else {
          currentTarget.setAttribute(
            'title',
            this.context.options.localization.selectDate
          );
          currentTarget.innerHTML = this.context.display.iconTag(
            this.context.options.display.icons.date
          ).outerHTML;
          this.do(e, ActionTypes.showClock);
          this.context.display.update('clock');
        }
        break;
      case ActionTypes.showClock:
      case ActionTypes.showHours:
      case ActionTypes.showMinutes:
      case ActionTypes.showSeconds:
        this.context.display.widget
          .querySelectorAll(`.${Namespace.Css.timeContainer} > div`)
          .forEach((e: HTMLElement) => (e.style.display = 'none'));

        let classToUse = '';
        switch (action) {
          case ActionTypes.showClock:
            classToUse = Namespace.Css.clockContainer;
            this.context.display.update('clock');
            break;
          case ActionTypes.showHours:
            classToUse = Namespace.Css.hourContainer;
            this.context.display.update(Unit.hours);
            break;
          case ActionTypes.showMinutes:
            classToUse = Namespace.Css.minuteContainer;
            this.context.display.update(Unit.minutes);
            break;
          case ActionTypes.showSeconds:
            classToUse = Namespace.Css.secondContainer;
            this.context.display.update(Unit.seconds);
            break;
        }

        (<HTMLElement>(
          this.context.display.widget.getElementsByClassName(classToUse)[0]
        )).style.display = 'block';
        break;
      case ActionTypes.clear:
        this.context.dates._setValue(null);
        break;
      case ActionTypes.close:
        this.context.display.hide();
        break;
      case ActionTypes.today:
        const today = new DateTime();
        this.context.viewDate = today;
        if (this.context.validation.isValid(today, Unit.date))
          this.context.dates._setValue(
            today,
            this.context.dates.lastPickedIndex
          );
        break;
    }
  }
}

export enum ActionTypes {
  next = 'next',
  previous = 'previous',
  pickerSwitch = 'pickerSwitch',
  selectMonth = 'selectMonth',
  selectYear = 'selectYear',
  selectDecade = 'selectDecade',
  selectDay = 'selectDay',
  selectHour = 'selectHour',
  selectMinute = 'selectMinute',
  selectSecond = 'selectSecond',
  incrementHours = 'incrementHours',
  incrementMinutes = 'incrementMinutes',
  incrementSeconds = 'incrementSeconds',
  decrementHours = 'decrementHours',
  decrementMinutes = 'decrementMinutes',
  decrementSeconds = 'decrementSeconds',
  togglePeriod = 'togglePeriod',
  togglePicker = 'togglePicker',
  showClock = 'showClock',
  showHours = 'showHours',
  showMinutes = 'showMinutes',
  showSeconds = 'showSeconds',
  clear = 'clear',
  close = 'close',
  today = 'today',
}
