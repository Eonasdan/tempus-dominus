import {
  createElementWithClasses,
  loadFixtures,
  newDate,
  reset,
  store,
} from './test-utilities';
import { afterAll, beforeAll, beforeEach, expect, test, vi } from 'vitest';
import Actions from '../src/js/actions';
import { FixtureValidation } from './fixtures/validation.fixture';
import { FixtureDates } from './fixtures/dates.fixture';
import { FixtureDisplay } from './fixtures/display.fixture';
import Namespace from '../src/js/utilities/namespace';
import ActionTypes from '../src/js/utilities/action-types';
import { Unit } from '../src/js/datetime';
import { EventEmitters } from '../src/js/utilities/event-emitter';
import Display from '../src/js/display';
import Dates from '../src/js/dates';
import Collapse from '../src/js/display/collapse';
import Validation from '../src/js/validation';
import { serviceLocator } from '../src/js/utilities/service-locator';

let validation: Validation;
let emitters: EventEmitters;
let display: Display;
let dates: Dates;

let actions: Actions;
let event;
let element: HTMLElement;

let isValidSpy;
vi.spyOn(Collapse, 'hideImmediately').mockImplementation(vi.fn());
vi.spyOn(Collapse, 'showImmediately').mockImplementation(vi.fn());
vi.spyOn(Collapse, 'toggle').mockImplementation(vi.fn());

beforeAll(() => {
  loadFixtures({
    Validation: FixtureValidation,
    Dates: FixtureDates,
    Display: FixtureDisplay,
  });
  reset();
  const ee = serviceLocator.locate(EventEmitters);
  let callback;
  ee.action.subscribe = (cb) => {
    callback = cb;
  };
  ee.action.emit = (value) => {
    callback(value);
  };
});

beforeEach(() => {
  reset();
  element = document.createElement('div');
  event = { currentTarget: element };
  actions = new Actions();
  store.viewDate = newDate();
  // @ts-ignore
  validation = actions.validation;
  // @ts-ignore
  emitters = actions._eventEmitters;
  // @ts-ignore
  display = actions.display;
  // @ts-ignore
  dates = actions.dates;
  dates.clear();

  isValidSpy = vi.spyOn(validation, 'isValid');
  isValidSpy.mockImplementation(() => true);

  // @ts-ignore
  display._widget = document.createElement('div');
});

afterAll(() => {
  vi.restoreAllMocks();
});

test('disabled', () => {
  element.classList.add(Namespace.css.disabled);
  actions.do(event);
  //what else could be done here?
});

test('next or previous', () => {
  const viewUpdateSpy = vi.spyOn(emitters.viewUpdate, 'emit');
  const showModeSpy = vi.spyOn(display, '_showMode');

  expect(store.viewDate).toEqual(newDate());

  //test from dataset
  element.dataset.action = 'next';
  actions.do(event);
  expect(store.viewDate).toEqual(newDate().manipulate(1, Unit.month));
  expect(viewUpdateSpy).toHaveBeenCalled();
  expect(showModeSpy).toHaveBeenCalled();

  store.viewDate = newDate();
  actions.do(event, ActionTypes.previous);
  expect(store.viewDate).toEqual(newDate().manipulate(-1, Unit.month));
  expect(viewUpdateSpy).toHaveBeenCalled();
  expect(showModeSpy).toHaveBeenCalled();
});

test('changeCalendarView', () => {
  const updateCalendarHeaderSpy = vi.spyOn(display, '_updateCalendarHeader');
  const showModeSpy = vi.spyOn(display, '_showMode');

  actions.do(event, ActionTypes.changeCalendarView);
  expect(updateCalendarHeaderSpy).toHaveBeenCalled();
  expect(showModeSpy).toHaveBeenCalled();
});

test('handleSelectCalendarMode', () => {
  const showModeSpy = vi.spyOn(display, '_showMode');
  const hideSpy = vi.spyOn(display, 'hide');
  const setValueSpy = vi.spyOn(dates, 'setValue');

  //test selecting month
  element.dataset.value = '1';
  actions.do(event, ActionTypes.selectMonth);
  expect(store.viewDate.month).toBe(1);
  expect(hideSpy).toHaveBeenCalled();
  expect(setValueSpy).toHaveBeenCalled();

  //test selecting year
  store.currentCalendarViewMode = 1;
  element.dataset.value = '2022';
  actions.do(event, ActionTypes.selectYear);
  expect(store.viewDate.year).toBe(2022);
  expect(showModeSpy).toHaveBeenCalled();
});

test('selectDay', () => {
  const hideSpy = vi.spyOn(display, 'hide');
  const setValueSpy = vi.spyOn(dates, 'setValue');

  let shouldBe = newDate();
  shouldBe.date = 21;

  element.dataset.day = `${shouldBe.date}`;

  //test select date without time
  // @ts-ignore
  display._hasTime = false;
  actions.do(event, ActionTypes.selectDay);
  expect(setValueSpy).toHaveBeenCalled();
  expect(hideSpy).toHaveBeenCalled();
  expect(dates.picked).toEqual([shouldBe]);

  //test previous month
  element.classList.add(Namespace.css.old);
  actions.do(event, ActionTypes.selectDay);
  shouldBe.manipulate(-1, Unit.month);
  expect(dates.picked).toEqual([shouldBe]);
  expect(hideSpy).toHaveBeenCalled();
  expect(setValueSpy).toHaveBeenCalled();
  element.classList.remove(Namespace.css.old);
  shouldBe.manipulate(1, Unit.month);

  //test next month
  element.classList.add(Namespace.css.new);
  actions.do(event, ActionTypes.selectDay);
  shouldBe.manipulate(1, Unit.month);
  expect(dates.picked).toEqual([shouldBe]);
  expect(hideSpy).toHaveBeenCalled();
  expect(setValueSpy).toHaveBeenCalled();
  element.classList.remove(Namespace.css.new);
});

test('selectDay - range', () => {
  const setValueSpy = vi.spyOn(dates, 'setValue');
  const hideSpy = vi.spyOn(display, 'hide');
  const clearSpy = vi.spyOn(dates, 'clear');
  const one = newDate().manipulate(1, Unit.date);
  const two = newDate().manipulate(2, Unit.date);

  let shouldBe = newDate();
  shouldBe.date = 21;

  element.dataset.day = `${shouldBe.date}`;
  store.options.dateRange = true;

  //test zero length selection
  actions.do(event, ActionTypes.selectDay);
  expect(setValueSpy).toHaveBeenCalled();
  expect(dates.picked).toEqual([shouldBe]);
  expect(hideSpy).not.toHaveBeenCalled();

  dates.clear();

  //test already have two selected
  dates.setValue(one, 0);
  dates.setValue(two, 1);
  expect(dates.picked).toEqual([one, two]);
  actions.do(event, ActionTypes.selectDay);
  expect(clearSpy).toHaveBeenCalled();
  expect(setValueSpy).toHaveBeenCalled();
  expect(dates.picked).toEqual([shouldBe]);

  dates.clear();

  //test one selected
  dates.setValue(one, 0);
  expect(dates.picked).toEqual([one]);
  actions.do(event, ActionTypes.selectDay);
  expect(dates.picked).toEqual([one, shouldBe]);
  expect(setValueSpy).toHaveBeenCalled();

  dates.clear();

  //test one selected and new date is the same
  element.dataset.date = `${shouldBe.date}`;
  dates.setValue(shouldBe, 0);
  expect(dates.picked).toEqual([shouldBe]);
  actions.do(event, ActionTypes.selectDay);
  expect(clearSpy).toHaveBeenCalled();
  expect(setValueSpy).toHaveBeenCalled();

  element.dataset.date = `${shouldBe.date}`;

  dates.clear();

  //test new selected date is before currently selected
  const before = shouldBe.clone.manipulate(14, Unit.date);
  dates.add(before);
  expect(dates.picked).toEqual([before]);
  actions.do(event, ActionTypes.selectDay);
  expect(dates.picked).toEqual([shouldBe, before]);
});

test('select day - multiple dates', () => {
  const setValueSpy = vi.spyOn(dates, 'setValue');
  const hideSpy = vi.spyOn(display, 'hide');
  const pickedIndexSpy = vi.spyOn(dates, 'pickedIndex');
  const one = newDate().manipulate(1, Unit.date);

  let shouldBe = newDate();
  shouldBe.date = 21;

  element.dataset.day = `${shouldBe.date}`;
  store.options.multipleDates = true;

  //test zero length selection
  pickedIndexSpy.mockImplementationOnce(() => -1);
  actions.do(event, ActionTypes.selectDay);
  expect(setValueSpy).toHaveBeenCalled();
  expect(dates.picked).toEqual([shouldBe]);
  expect(hideSpy).not.toHaveBeenCalled();

  //test additional date
  element.dataset.day = `${one.date}`;
  pickedIndexSpy.mockImplementationOnce(() => -1);
  actions.do(event, ActionTypes.selectDay);
  expect(setValueSpy).toHaveBeenCalled();
  expect(dates.picked).toEqual([shouldBe, one]);
  expect(hideSpy).not.toHaveBeenCalled();

  //test removing selected date
  element.dataset.day = `${one.date}`;
  pickedIndexSpy.mockImplementationOnce(() => 1);
  actions.do(event, ActionTypes.selectDay);
  expect(setValueSpy).toHaveBeenCalled();
  expect(dates.picked).toEqual([shouldBe]);
  expect(hideSpy).not.toHaveBeenCalled();
});

test('select hour', () => {
  const setValueSpy = vi.spyOn(dates, 'setValue');
  const hideSpy = vi.spyOn(display, 'hide');
  // @ts-ignore
  const hideOrClockSpy = vi.spyOn(actions, 'hideOrClock');
  hideOrClockSpy.mockImplementation(vi.fn());

  let shouldBe = newDate();
  element.dataset.value = `1`;
  actions.do(event, ActionTypes.selectHour);
  expect(setValueSpy).toHaveBeenCalled();
  expect(dates.picked).toEqual([shouldBe]);
  expect(hideSpy).not.toHaveBeenCalled();
  expect(hideOrClockSpy).toHaveBeenCalled();
});

test('select minute', () => {
  const setValueSpy = vi.spyOn(dates, 'setValue');
  const hideSpy = vi.spyOn(display, 'hide');
  // @ts-ignore
  const hideOrClockSpy = vi.spyOn(actions, 'hideOrClock');
  hideOrClockSpy.mockImplementation(vi.fn());

  let shouldBe = newDate();
  element.dataset.value = `25`;
  actions.do(event, ActionTypes.selectMinute);
  expect(setValueSpy).toHaveBeenCalled();
  expect(dates.picked).toEqual([shouldBe]);
  expect(hideSpy).not.toHaveBeenCalled();
  expect(hideOrClockSpy).toHaveBeenCalled();
});

test('select second', () => {
  const setValueSpy = vi.spyOn(dates, 'setValue');
  const hideSpy = vi.spyOn(display, 'hide');
  // @ts-ignore
  const hideOrClockSpy = vi.spyOn(actions, 'hideOrClock');
  hideOrClockSpy.mockImplementation(vi.fn());

  let shouldBe = newDate();
  element.dataset.value = `42`;
  actions.do(event, ActionTypes.selectSecond);
  expect(setValueSpy).toHaveBeenCalled();
  expect(dates.picked).toEqual([shouldBe]);
  expect(hideSpy).not.toHaveBeenCalled();
  expect(hideOrClockSpy).toHaveBeenCalled();
});

test('increment/decrement hour', () => {
  const setValueSpy = vi.spyOn(dates, 'setValue');
  const hideSpy = vi.spyOn(display, 'hide');
  // @ts-ignore
  const hideOrClockSpy = vi.spyOn(actions, 'hideOrClock');
  hideOrClockSpy.mockImplementation(vi.fn());

  let shouldBe = newDate();
  shouldBe.manipulate(1, Unit.hours);

  actions.do(event, ActionTypes.incrementHours);
  expect(setValueSpy).toHaveBeenCalled();
  expect(dates.picked).toEqual([shouldBe]);
  expect(hideSpy).not.toHaveBeenCalled();
  expect(isValidSpy).toHaveBeenCalled();

  shouldBe.manipulate(-1, Unit.hours);
  actions.do(event, ActionTypes.decrementHours);
  expect(setValueSpy).toHaveBeenCalled();
  expect(dates.picked).toEqual([shouldBe]);
  expect(hideSpy).not.toHaveBeenCalled();
  expect(isValidSpy).toHaveBeenCalled();
});

test('increment/decrement minute', () => {
  const setValueSpy = vi.spyOn(dates, 'setValue');
  const hideSpy = vi.spyOn(display, 'hide');
  // @ts-ignore
  const hideOrClockSpy = vi.spyOn(actions, 'hideOrClock');
  hideOrClockSpy.mockImplementation(vi.fn());

  let shouldBe = newDate();
  shouldBe.manipulate(1, Unit.minutes);

  actions.do(event, ActionTypes.incrementMinutes);
  expect(setValueSpy).toHaveBeenCalled();
  expect(dates.picked).toEqual([shouldBe]);
  expect(hideSpy).not.toHaveBeenCalled();
  expect(isValidSpy).toHaveBeenCalled();

  shouldBe.manipulate(-1, Unit.minutes);
  actions.do(event, ActionTypes.decrementMinutes);
  expect(setValueSpy).toHaveBeenCalled();
  expect(dates.picked).toEqual([shouldBe]);
  expect(hideSpy).not.toHaveBeenCalled();
  expect(isValidSpy).toHaveBeenCalled();
});

test('increment/decrement second', () => {
  const setValueSpy = vi.spyOn(dates, 'setValue');
  const hideSpy = vi.spyOn(display, 'hide');
  // @ts-ignore
  const hideOrClockSpy = vi.spyOn(actions, 'hideOrClock');
  hideOrClockSpy.mockImplementation(vi.fn());

  let shouldBe = newDate();
  shouldBe.manipulate(1, Unit.seconds);

  actions.do(event, ActionTypes.incrementSeconds);
  expect(setValueSpy).toHaveBeenCalled();
  expect(dates.picked).toEqual([shouldBe]);
  expect(hideSpy).not.toHaveBeenCalled();
  expect(isValidSpy).toHaveBeenCalled();

  shouldBe.manipulate(-1, Unit.seconds);
  actions.do(event, ActionTypes.decrementSeconds);
  expect(setValueSpy).toHaveBeenCalled();
  expect(dates.picked).toEqual([shouldBe]);
  expect(hideSpy).not.toHaveBeenCalled();
  expect(isValidSpy).toHaveBeenCalled();
});

test('toggleMeridiem', () => {
  const setValueSpy = vi.spyOn(dates, 'setValue');
  const hideSpy = vi.spyOn(display, 'hide');
  // @ts-ignore
  const hideOrClockSpy = vi.spyOn(actions, 'hideOrClock');
  hideOrClockSpy.mockImplementation(vi.fn());

  let shouldBe = newDate();
  dates.add(shouldBe);

  //from PM to AM
  actions.do(event, ActionTypes.toggleMeridiem);
  expect(setValueSpy).toHaveBeenCalled();
  expect(dates.picked).toEqual([shouldBe.manipulate(-12, Unit.hours)]);
  expect(hideSpy).not.toHaveBeenCalled();
  expect(isValidSpy).toHaveBeenCalled();

  //from AM to PM
  actions.do(event, ActionTypes.toggleMeridiem);
  expect(setValueSpy).toHaveBeenCalled();
  expect(dates.picked).toEqual([shouldBe.manipulate(12, Unit.hours)]);
  expect(hideSpy).not.toHaveBeenCalled();
  expect(isValidSpy).toHaveBeenCalled();
});

test('togglePicker', () => {
  const iconTagSpy = vi.spyOn(display, '_iconTag');
  const updateCalendarHeaderSpy = vi.spyOn(display, '_updateCalendarHeader');
  const updateSpy = vi.spyOn(display, '_update');
  const refreshCurrentViewSpy = vi.spyOn(store, 'refreshCurrentView');
  const viewUpdateSpy = vi.spyOn(emitters.viewUpdate, 'emit');

  const handleShowClockContainersSpy = vi.spyOn(
    actions,
    // @ts-ignore
    'handleShowClockContainers'
  );
  handleShowClockContainersSpy.mockImplementation(vi.fn());

  //toggle date to time
  element.setAttribute('title', store.options.localization.selectDate);
  actions.do(event, ActionTypes.togglePicker);
  expect(iconTagSpy).toHaveBeenCalled();
  expect(updateCalendarHeaderSpy).toHaveBeenCalled();
  expect(refreshCurrentViewSpy).toHaveBeenCalled();
  expect(viewUpdateSpy).toHaveBeenCalled();

  //toggle time to date
  // @ts-ignore
  display._hasTime = true;
  element.setAttribute('title', store.options.localization.selectTime);
  const dateContainer = document.createElement('div');
  dateContainer.classList.add(Namespace.css.dateContainer);
  display.widget.appendChild(dateContainer);

  actions.do(event, ActionTypes.togglePicker);
  expect(iconTagSpy).toHaveBeenCalled();
  expect(updateCalendarHeaderSpy).toHaveBeenCalled();
  expect(refreshCurrentViewSpy).toHaveBeenCalled();
  expect(viewUpdateSpy).toHaveBeenCalled();
  expect(handleShowClockContainersSpy).toHaveBeenCalled();
  expect(updateSpy).toHaveBeenCalled();
});

test('handleShowClockContainers', () => {
  const updateSpy = vi.spyOn(display, '_update');
  store.currentView = 'calendar';

  const timeContainer = createElementWithClasses(
    'div',
    Namespace.css.timeContainer
  );
  const clockContainer = createElementWithClasses(
    'div',
    Namespace.css.clockContainer
  );
  const hourContainer = createElementWithClasses(
    'div',
    Namespace.css.hourContainer
  );
  const minuteContainer = createElementWithClasses(
    'div',
    Namespace.css.minuteContainer
  );
  const secondContainer = createElementWithClasses(
    'div',
    Namespace.css.secondContainer
  );
  timeContainer.appendChild(clockContainer);
  timeContainer.appendChild(hourContainer);
  timeContainer.appendChild(minuteContainer);
  timeContainer.appendChild(secondContainer);
  display.widget.appendChild(timeContainer);

  //test no time
  // @ts-ignore
  display._hasTime = false;
  expect(() => actions.do(event, ActionTypes.showClock)).toThrow(
    'TD: Cannot show clock containers when time is disabled.'
  );

  // @ts-ignore
  display._hasTime = true;

  //test clock
  actions.do(event, ActionTypes.showClock);
  expect(updateSpy).toHaveBeenCalled();
  expect(clockContainer.style.display).toBe('grid');
  expect(hourContainer.style.display).toBe('none');

  //test hour
  actions.do(event, ActionTypes.showHours);
  expect(updateSpy).toHaveBeenCalled();
  expect(clockContainer.style.display).toBe('none');
  expect(hourContainer.style.display).toBe('grid');

  //test minute
  actions.do(event, ActionTypes.showMinutes);
  expect(updateSpy).toHaveBeenCalled();
  expect(clockContainer.style.display).toBe('none');
  expect(minuteContainer.style.display).toBe('grid');

  //test seconds
  actions.do(event, ActionTypes.showSeconds);
  expect(updateSpy).toHaveBeenCalled();
  expect(clockContainer.style.display).toBe('none');
  expect(secondContainer.style.display).toBe('grid');
});

test('clear', () => {
  const updateCalendarHeaderSpy = vi.spyOn(display, '_updateCalendarHeader');
  const setValueSpy = vi.spyOn(dates, 'setValue');

  dates.add(newDate());
  expect(dates.picked).toEqual([newDate()]);

  actions.do(event, ActionTypes.clear);
  expect(updateCalendarHeaderSpy).toHaveBeenCalled();
  expect(setValueSpy).toHaveBeenCalled();
  expect(dates.picked).toEqual([]);
});

test('close', () => {
  const hideSpy = vi.spyOn(display, 'hide');

  actions.do(event, ActionTypes.close);
  expect(hideSpy).toHaveBeenCalled();
});

test('today', () => {
  const setValueSpy = vi.spyOn(dates, 'setValue');
  const viewUpdateSpy = vi.spyOn(emitters.updateViewDate, 'emit');

  expect(dates.picked).toEqual([]);
  actions.do(event, ActionTypes.today);
  expect(setValueSpy).toHaveBeenCalled();
  expect(viewUpdateSpy).toHaveBeenCalled();
});

test('hideOrClock', () => {
  const hideSpy = vi.spyOn(display, 'hide');
  // @ts-ignore
  const method = actions.hideOrClock.bind(actions);
  const doSpy = vi.spyOn(actions, 'do');
  doSpy.mockImplementation(vi.fn());

  //test showClock;
  method(event);
  expect(doSpy).toHaveBeenCalled();

  //test should hide
  // @ts-ignore
  store.isTwelveHour = false;
  store.options.display.components.minutes = false;
  method(event);
  expect(hideSpy).toHaveBeenCalled();
});

test('action emitter', () => {
  const actionSpy = vi.spyOn(emitters.action, 'emit');
  const doSpy = vi.spyOn(actions, 'do');
  doSpy.mockImplementation(vi.fn());

  emitters.action.emit({ e: {}, action: ActionTypes.close });
  expect(actionSpy).toHaveBeenCalled();
});
