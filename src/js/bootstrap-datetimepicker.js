/*
 //! version : 4.0.0-beta
 =========================================================
 bootstrap-datetimejs
 https://github.com/Eonasdan/bootstrap-datetimepicker
 =========================================================
 The MIT License (MIT)

 Copyright (c) 2014 Jonathan Peterson

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */
/*globals define, jQuery, moment, window, document */
; (function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        // AMD is used - Register as an anonymous module.
        define(['jquery', 'moment'], factory);
    } else {
        // AMD is not used - Attempt to fetch dependencies from scope.
        if (!jQuery) {
            throw 'bootstrap-datetimepicker requires jQuery to be loaded first';
        }
        if (!moment) {
            throw 'bootstrap-datetimepicker requires Moment.js to be loaded first';
        }
        factory(jQuery, moment);
    }
}

(function ($, moment) {
    'use strict';
    if (moment === 'undefined') {
        throw new Error('Moment.js is required');
    }

    var DateTimePicker = function (element, options) {
            var picker = this,
                date = moment(),
                viewDate = date.clone(),
                unset = true,
                input,
                component = false,
                widget = false,
                use24hours,
                minViewModeNumber,
                currentViewMode,
                actions,
                datePickerModes = [
                    {
                        clsName: 'days',
                        navFnc: 'month',
                        navStep: 1
                    },
                    {
                        clsName: 'months',
                        navFnc: 'year',
                        navStep: 1
                    },
                    {
                        clsName: 'years',
                        navFnc: 'year',
                        navStep: 10
                    }
                ],
                viewModes = ['days', 'months', 'years'],
                directionModes = ['top', 'bottom', 'auto'],
                orientationModes = ['left', 'right'];

            /********************************************************************************
             *
             * Private functions
             *
             ********************************************************************************/

            function getDatePickerTemplate() {
                var headTemplate =
                        '<thead>' +
                        '<tr>' +
                            '<th class="prev" data-action="previous"><span class="' + options.icons.previous + '"></span></th>' +
                            '<th colspan="5" class="picker-switch" data-action="pickerSwitch"></th>' +
                            '<th data-action="next" class="next"><span class="' + options.icons.next + '"></span></th>' +
                        '</tr>' +
                        '</thead>',
                    contTemplate = '<tbody><tr><td colspan="7"></td></tr></tbody>';

                return '<div class="datepicker-days">' +
                    '<table class="table-condensed">' + headTemplate + '<tbody></tbody></table>' +
                    '</div>' +
                    '<div class="datepicker-months">' +
                    '<table class="table-condensed">' + headTemplate + contTemplate + '</table>' +
                    '</div>' +
                    '<div class="datepicker-years">' +
                    '<table class="table-condensed">' + headTemplate + contTemplate + '</table>' +
                    '</div>';
            }

            function getTimePickerTemplate() {
                var hourTemplate = '<span data-action="showHours" data-time-component="hours" class="timepicker-hour"></span>',
                    minuteTemplate = '<span data-action="showMinutes" data-time-component="minutes" class="timepicker-minute"></span>',
                    secondTemplate = '<span data-action="showSeconds"  data-time-component="seconds" class="timepicker-second"></span>';

                return '<div class="timepicker-picker">' +
                    '<table class="table-condensed">' +
                    '<tr>' +
                    '<td><a href="#" class="btn" data-action="incrementHours"><span class="' + options.icons.up + '"></span></a></td>' +
                    '<td class="separator"></td>' +
                    '<td>' + (options.useMinutes ? '<a href="#" class="btn" data-action="incrementMinutes"><span class="' + options.icons.up + '"></span></a>' : '') + '</td>' +
                    (options.useSeconds ?
                        '<td class="separator"></td><td><a href="#" class="btn" data-action="incrementSeconds"><span class="' + options.icons.up + '"></span></a></td>' : '') +
                    (use24hours ? '' : '<td class="separator"></td>') +
                    '</tr>' +
                    '<tr>' +
                    '<td>' + hourTemplate + '</td> ' +
                    '<td class="separator">:</td>' +
                    '<td>' + (options.useMinutes ? minuteTemplate : '<span class="timepicker-minute">00</span>') + '</td> ' +
                    (options.useSeconds ?
                        '<td class="separator">:</td><td>' + secondTemplate + '</td>' : '') +
                    (use24hours ? '' : '<td class="separator"></td>' +
                        '<td><button type="button" class="btn btn-primary" data-action="togglePeriod"></button></td>') +
                    '</tr>' +
                    '<tr>' +
                    '<td><a href="#" class="btn" data-action="decrementHours"><span class="' + options.icons.down + '"></span></a></td>' +
                    '<td class="separator"></td>' +
                    '<td>' + (options.useMinutes ? '<a href="#" class="btn" data-action="decrementMinutes"><span class="' + options.icons.down + '"></span></a>' : '') + '</td>' +
                    (options.useSeconds ?
                        '<td class="separator"></td><td><a href="#" class="btn" data-action="decrementSeconds"><span class="' + options.icons.down + '"></span></a></td>' : '') +
                    (use24hours ? '' : '<td class="separator"></td>') +
                    '</tr>' +
                    '</table>' +
                    '</div>' +
                    '<div class="timepicker-hours" data-action="selectHour">' +
                    '<table class="table-condensed"></table>' +
                    '</div>' +
                    '<div class="timepicker-minutes" data-action="selectMinute">' +
                    '<table class="table-condensed"></table>' +
                    '</div>' +
                    (options.useSeconds ? '<div class="timepicker-seconds" data-action="selectSecond"><table class="table-condensed"></table></div>' : '');
            }

            function getTemplate() {
                if (options.pickDate && options.pickTime) {
                    var ret = '<div class="bootstrap-datetimepicker-widget' + (options.sideBySide ? ' timepicker-sbs' : '') + (use24hours ? ' usetwentyfour' : '') + ' dropdown-menu">';
                    if (options.sideBySide) {
                        ret +=  '<div class="row">' +
                            '<div class="col-sm-6 datepicker">' + getDatePickerTemplate() + '</div>' +
                            '<div class="col-sm-6 timepicker">' + getTimePickerTemplate() + '</div>' +
                            '</div>';
                    } else {
                        ret +=  '<ul class="list-unstyled">' +
                            '<li' + (options.collapse ? ' class="collapse in"' : '') + '>' +
                                '<div class="datepicker">' + getDatePickerTemplate() + '</div>' +
                            '</li>' +
                            '<li class="picker-switch accordion-toggle"><a data-action="togglePicker" class="btn"><span class="' + options.icons.time + '"></span></a></li>' +
                            '<li' + (options.collapse ? ' class="collapse"' : '') + '>' +
                                '<div class="timepicker">' + getTimePickerTemplate() + '</div>' +
                            '</li>' +
                            '</ul>';
                    }
                    ret += '</div>';
                    return ret;
                }
                if (options.pickTime) {
                    return (
                        '<div class="bootstrap-datetimepicker-widget dropdown-menu">' +
                            '<div class="timepicker">' + getTimePickerTemplate() + '</div>' +
                        '</div>'
                        );
                }
                return (
                    '<div class="bootstrap-datetimepicker-widget dropdown-menu">' +
                        '<div class="datepicker">' + getDatePickerTemplate() + '</div>' +
                    '</div>'
                    );
            }

            function dataToOptions() {
                var eData = input.data(), dataOptions = {};

                $.each(options, function (key) {
                    var attributeName = 'date' + key.charAt(0).toUpperCase() + key.slice(1);
                    if (eData[attributeName] !== undefined) {
                        dataOptions[key] = eData[attributeName];
                    }
                });
                return dataOptions;
            }

            function isInFixed() {
                if (element) {
                    var parents = element.parents(),
                        inFixed = false,
                        i;
                    for (i = 0; i < parents.length; i++) {
                        if ($(parents[i]).css('position') === 'fixed') {
                            inFixed = true;
                            break;
                        }
                    }
                    return inFixed;
                }
                return false;
            }

            function place() {
                var position = 'absolute',
                    offset = component ? component.offset() : element.offset(),
                    $window = $(window),
                    placePosition,
                    width;

                if (!widget) {
                    return;
                }

                width = component ? component.outerWidth() : element.outerWidth();
                offset.top = offset.top + element.outerHeight();

                if (options.direction === 'top') {
                    placePosition = 'top';
                } else if (options.direction === 'bottom') {
                    placePosition = 'bottom';
                } else if (options.direction === 'auto') {
                    if (offset.top + widget.height() > $window.height() + $window.scrollTop() && widget.height() + element.outerHeight() < offset.top) {
                        placePosition = 'top';
                    } else {
                        placePosition = 'bottom';
                    }
                }
                if (placePosition === 'top') {
                    offset.top -= widget.height() + element.outerHeight() + 15;
                    widget.addClass('top').removeClass('bottom');
                } else {
                    offset.top += 1;
                    widget.addClass('bottom').removeClass('top');
                }

                if (options.orientation === 'left') {
                    widget.addClass('left-oriented');
                    offset.left = offset.left - widget.width() + 20;
                }

                if (isInFixed()) {
                    position = 'fixed';
                    offset.top -= $window.scrollTop();
                    offset.left -= $window.scrollLeft();
                }

                if ($window.width() < offset.left + widget.outerWidth()) {
                    offset.right = $window.width() - offset.left - width;
                    offset.left = 'auto';
                    widget.addClass('pull-right');
                } else {
                    offset.right = 'auto';
                    widget.removeClass('pull-right');
                }

                widget.css({
                    position: position,
                    top: offset.top,
                    left: offset.left,
                    right: offset.right
                });
            }

            function notifyEvent(e) {
                if (e.type === 'dp.change' && e.date && e.date.isSame(e.oldValue)) {
                    return;
                }
                element.trigger(e);
            }

            function padLeft(string) {
                string = string.toString();
                if (string.length >= 2) {
                    return string;
                }
                return '0' + string;
            }

            function showMode(dir) {
                // update widget only if it exists
                if (!widget) {
                    return;
                }
                if (dir) {
                    currentViewMode = Math.max(minViewModeNumber, Math.min(2, currentViewMode + dir));
                }
                widget.find('.datepicker > div').hide().filter('.datepicker-' + datePickerModes[currentViewMode].clsName).show();
            }

            function fillDow() {
                var html = $('<tr>'),
                    weekdaysMin = viewDate.localeData()._weekdaysMin,
                    i;
                if (viewDate.localeData()._week.dow === 0) { // starts on Sunday
                    for (i = 0; i < 7; i++) {
                        html.append('<th class="dow">' + weekdaysMin[i] + '</th>');
                    }
                } else {
                    for (i = 1; i < 8; i++) {
                        if (i === 7) {
                            html.append('<th class="dow">' + weekdaysMin[0] + '</th>');
                        } else {
                            html.append('<th class="dow">' + weekdaysMin[i] + '</th>');
                        }
                    }
                }
                widget.find('.datepicker-days thead').append(html);
            }

            function fillMonths() {
                var html = '', i, monthsShort = viewDate.localeData()._monthsShort;
                for (i = 0; i < 12; i++) {
                    html += '<span class="month" data-action="selectMonth">' + monthsShort[i] + '</span>';
                }
                widget.find('.datepicker-months td').empty().append(html);
            }

            function isInDisableDates(date) {
                var maxDate = moment(options.maxDate, options.format, options.useStrict),
                    minDate = moment(options.minDate, options.format, options.useStrict);
                if (date.isAfter(maxDate, 'day') || date.isBefore(minDate, 'day')) {
                    return true;
                }

                if (!options.disabledDates) {
                    return false;
                }
                return options.disabledDates[date.format('YYYY-MM-DD')] === true;
            }

            function isInEnableDates(date) {
                if (options.enabledDates === false) {
                    return true;
                }
                return options.enabledDates[date.format('YYYY-MM-DD')] === true;
            }

            function updateMonths() {
                var year = viewDate.year(),
                    startYear = options.minDate.year(),
                    startMonth = options.minDate.month(),
                    endYear = options.maxDate.year(),
                    endMonth = options.maxDate.month(),
                    i,
                    currentYear = date.year(),
                    months;

                widget.find('.datepicker-months').find('.disabled').removeClass('disabled');
                widget.find('.datepicker-months').find('th:eq(1)').text(year);
                months = widget.find('.datepicker-months').find('tbody').find('span').removeClass('active');
                if (currentYear === year) {
                    months.eq(date.month()).addClass('active');
                }
                if (year - 1 < startYear) {
                    widget.find('.datepicker-months th:eq(0)').addClass('disabled');
                }
                if (year + 1 > endYear) {
                    widget.find('.datepicker-months th:eq(2)').addClass('disabled');
                }
                for (i = 0; i < 12; i++) {
                    if ((year === startYear && startMonth > i) || (year < startYear)) {
                        $(months[i]).addClass('disabled');
                    } else if ((year === endYear && endMonth < i) || (year > endYear)) {
                        $(months[i]).addClass('disabled');
                    }
                }
            }

            function updateYears() {
                var year = parseInt(viewDate.year() / 10, 10) * 10,
                    startYear = options.minDate.year(),
                    endYear = options.maxDate.year(),
                    html = '',
                    i,
                    currentYear = date.year(),
                    yearCont;

                widget.find('.datepicker-years').find('.disabled').removeClass('disabled');

                yearCont = widget.find('.datepicker-years').find('th:eq(1)').text((year - 1) + '-' + (year + 10)).parents('table').find('td');
                widget.find('.datepicker-years').find('th').removeClass('disabled');
                if (startYear > year) {
                    widget.find('.datepicker-years').find('th:eq(0)').addClass('disabled');
                }
                if (endYear < year + 9) {
                    widget.find('.datepicker-years').find('th:eq(2)').addClass('disabled');
                }
                year -= 1;
                for (i = -1; i < 11; i++) {
                    html += '<span data-action="selectYear" class="year' + (currentYear === year ? ' active' : '') + ((year < startYear || year > endYear) ? ' disabled' : '') + '">' + year + '</span>';
                    year += 1;
                }
                yearCont.html(html);
            }

            function fillDate() {
                if (!options.pickDate) {
                    return;
                }
                var year = viewDate.year(),
                    month = viewDate.month(),
                    startYear = options.minDate.year(),
                    startMonth = options.minDate.month(),
                    endYear = options.maxDate.year(),
                    endMonth = options.maxDate.month(),
                    currentDate,
                    prevMonth,
                    nextMonth,
                    html = [],
                    row,
                    clsName,
                    i,
                    days;

                widget.find('.datepicker-days').find('.disabled').removeClass('disabled');

                widget.find('.datepicker-days th:eq(1)').text(viewDate.format('MMMM YYYY'));

                prevMonth = viewDate.clone().subtract(1, 'months');
                days = prevMonth.daysInMonth();
                prevMonth.date(days).startOf('week');
                if ((year === startYear && month <= startMonth) || year < startYear) {
                    widget.find('.datepicker-days th:eq(0)').addClass('disabled');
                }
                if ((year === endYear && month >= endMonth) || year > endYear) {
                    widget.find('.datepicker-days th:eq(2)').addClass('disabled');
                }

                nextMonth = prevMonth.clone().add(42, 'd');
                while (prevMonth.isBefore(nextMonth)) {
                    if (prevMonth.weekday() === moment().startOf('week').weekday()) {
                        row = $('<tr>');
                        html.push(row);
                    }
                    clsName = '';
                    if (prevMonth.year() < year || (prevMonth.year() === year && prevMonth.month() < month)) {
                        clsName += ' old';
                    } else if (prevMonth.year() > year || (prevMonth.year() === year && prevMonth.month() > month)) {
                        clsName += ' new';
                    }
                    if (prevMonth.isSame(date, 'day')) {
                        clsName += ' active';
                    }
                    if (isInDisableDates(prevMonth) || !isInEnableDates(prevMonth)) {
                        clsName += ' disabled';
                    }
                    if (options.showToday === true) {
                        if (prevMonth.isSame(moment(), 'day')) {
                            clsName += ' today';
                        }
                    }
                    if (options.daysOfWeekDisabled) {
                        for (i = 0; i < options.daysOfWeekDisabled.length; i++) {
                            if (prevMonth.day() === options.daysOfWeekDisabled[i]) {
                                clsName += ' disabled';
                                break;
                            }
                        }
                    }
                    row.append('<td data-action="selectDay" class="day' + clsName + '">' + prevMonth.date() + '</td>');

                    currentDate = prevMonth.date();
                    prevMonth.add(1, 'd');

                    if (currentDate === prevMonth.date()) {
                        console.log('check');
                        prevMonth.add(1, 'd');
                    }
                }
                widget.find('.datepicker-days tbody').empty().append(html);

                updateMonths();

                updateYears();
            }

            function fillHours() {
                var table = widget.find('.timepicker .timepicker-hours table'),
                    html = '',
                    current,
                    i,
                    j;

                table.parent().hide();
                if (use24hours) {
                    current = 0;
                    for (i = 0; i < 6; i += 1) {
                        html += '<tr>';
                        for (j = 0; j < 4; j += 1) {
                            html += '<td class="hour">' + padLeft(current.toString()) + '</td>';
                            current++;
                        }
                        html += '</tr>';
                    }
                }
                else {
                    current = 1;
                    for (i = 0; i < 3; i += 1) {
                        html += '<tr>';
                        for (j = 0; j < 4; j += 1) {
                            html += '<td class="hour">' + padLeft(current.toString()) + '</td>';
                            current++;
                        }
                        html += '</tr>';
                    }
                }
                table.html(html);
            }

            function fillMinutes() {
                var table = widget.find('.timepicker .timepicker-minutes table'),
                    html = '',
                    current = 0,
                    i,
                    j,
                    step = options.minuteStepping;

                table.parent().hide();
                if (step === 1)  {
                    step = 5;
                }
                for (i = 0; i < Math.ceil(60 / step / 4) ; i++) {
                    html += '<tr>';
                    for (j = 0; j < 4; j += 1) {
                        if (current < 60) {
                            html += '<td class="minute">' + padLeft(current.toString()) + '</td>';
                            current += step;
                        } else {
                            html += '<td></td>';
                        }
                    }
                    html += '</tr>';
                }
                table.html(html);
            }

            function fillSeconds() {
                var table = widget.find('.timepicker .timepicker-seconds table'), html = '', current = 0, i, j;
                table.parent().hide();
                for (i = 0; i < 3; i++) {
                    html += '<tr>';
                    for (j = 0; j < 4; j += 1) {
                        html += '<td class="second">' + padLeft(current.toString()) + '</td>';
                        current += 5;
                    }
                    html += '</tr>';
                }
                table.html(html);
            }

            function fillTime() {
                if (!date) {
                    return;
                }
                var timeComponents = widget.find('.timepicker span[data-time-component]'),
                    hour = date.hours(),
                    period = date.format('A');
                if (!use24hours) {
                    if (hour === 0) {
                        hour = 12;
                    } else if (hour !== 12) {
                        hour = hour % 12;
                    }
                    widget.find('.timepicker [data-action=togglePeriod]').text(period);
                }
                timeComponents.filter('[data-time-component=hours]').text(padLeft(hour));
                timeComponents.filter('[data-time-component=minutes]').text(padLeft(date.minutes()));
                timeComponents.filter('[data-time-component=seconds]').text(padLeft(date.second()));
            }

            function update() {
                viewDate = moment(date).startOf('month');
                if (!widget) {
                    return;
                }
                fillDate();
                fillTime();
                place();
            }

            function setValue(targetMoment, dontNotify) {
                var oldDate = date;

                if (!targetMoment) {
                    unset = true;
                    //input.val('');
                    element.data('date', '');
                    notifyEvent({
                        type: 'dp.change',
                        date: null,
                        oldDate: oldDate
                    });
                    return;
                }

                targetMoment = targetMoment.clone().locale(options.locale);

                if (options.minuteStepping !== 1) {
                    date.minutes((Math.round(date.minutes() / options.minuteStepping) * options.minuteStepping) % 60).seconds(0);
                }

                if ((targetMoment.isAfter(options.minDate) && targetMoment.isBefore(options.maxDate)) &&
                    (!isInDisableDates(targetMoment) && isInEnableDates(targetMoment))) {
                    unset = false;
                    date = targetMoment;
                    viewDate = date.clone().startOf('month');
                    input.val(date.format(options.format));
                    element.data('date', date.format(options.format));
                    update();
                    if (!dontNotify) {
                        notifyEvent({
                            type: 'dp.change',
                            date: picker.date(),
                            oldDate: oldDate
                        });
                    }
                } else {
                    notifyEvent({
                        type: 'dp.error',
                        date: targetMoment
                    });
                }
            }

            function stopEvent(e) {
                e.stopPropagation();
                e.preventDefault();
            }

            function parseInputDate(date) {
                if (date === undefined) {
                    return false;
                }
                if (moment.isMoment(date) || date instanceof Date) {
                    date = moment(date);
                } else {
                    date = moment(date, options.format, options.useStrict);
                }
                date.locale(options.locale);
                return (date.isValid() ? date : false);
            }

            function doAction(e) {
                stopEvent(e);
                if ($(e.currentTarget).is('.disabled')) {
                    return;
                }
                return actions[$(e.currentTarget).data('action')].apply(picker, arguments);
            }

            function keydown(e) {
                if (e.keyCode === 27) { // allow escape to hide picker
                    picker.hide();
                }
            }

            function change(e) {
                var newDate = parseInputDate($(e.target).val());
                setValue(newDate, true);
            }

            function attachDatePickerElementEvents() {
                if (element.is('input')) {
                    element.on({
                        'click': $.proxy(picker.show, picker),
                        'focus': $.proxy(picker.show, picker),
                        'change': $.proxy(change, picker),
                        'blur': $.proxy(picker.hide, picker),
                        'keydown': $.proxy(keydown, picker)
                    });
                } else {
                    element.on({
                        'change': $.proxy(change, picker)
                    }, 'input');
                    if (component) {
                        component.on('click', $.proxy(picker.toggle, picker));
                        component.on('mousedown', $.proxy(stopEvent, picker));
                    } else {
                        element.on('click', $.proxy(picker.show, picker));
                    }
                }
            }

            function detachDatePickerElementEvents() {
                if (element.is('input')) {
                    element.off({
                        'focus': picker.show,
                        'change': change,
                        'blur': picker.hide,
                        'click': picker.show,
                        'keydown': keydown
                    });
                } else {
                    element.off({
                        'change': change
                    }, 'input');
                    if (component) {
                        component.off('click', picker.show);
                        component.off('mousedown', stopEvent);
                    } else {
                        element.off('click', picker.show);
                    }
                }
            }

            function attachDatePickerWidgetEvents() {
                widget.on('click', '[data-action]', $.proxy(doAction, picker)); // this handles clicks on the widget
                widget.on('mousedown', $.proxy(stopEvent, picker));
                if (!element.is('input')) {
                    $(document).on('mousedown', $.proxy(picker.hide, picker));
                }
            }

            function detachDatePickerWidgetEvents() {
                widget.off('click', '[data-action]');
                widget.off('mousedown', stopEvent);
                if (!element.is('input')) {
                    $(document).off('mousedown', picker.hide);
                }
            }

            function indexGivenDates(givenDatesArray) {
                // Store given enabledDates and disabledDates as keys.
                // This way we can check their existence in O(1) time instead of looping through whole array.
                // (for example: options.enabledDates['2014-02-27'] === true)
                var givenDatesIndexed = {}, givenDatesCount = 0, i, dDate;
                for (i = 0; i < givenDatesArray.length; i++) {
                    if (moment.isMoment(givenDatesArray[i]) || givenDatesArray[i] instanceof Date) {
                        dDate = moment(givenDatesArray[i]);
                    } else {
                        dDate = moment(givenDatesArray[i], options.format, options.useStrict);
                    }
                    if (dDate.isValid()) {
                        givenDatesIndexed[dDate.format('YYYY-MM-DD')] = true;
                        givenDatesCount++;
                    }
                }
                if (givenDatesCount > 0) {
                    return givenDatesIndexed;
                }
                return false;
            }

            function createWidget() {
                if (widget) {
                    return;
                }
                options.widgetParent =
                    (typeof options.widgetParent === 'string' && options.widgetParent) ||
                    element.parents().filter(function () {
                        return 'scroll' === $(this).css('overflow-y');
                    }).get(0) ||
                    'body';

                widget = $(getTemplate()).appendTo(options.widgetParent);

                fillDow();
                fillMonths();
                fillHours();
                fillMinutes();
                fillSeconds();

                update();
                showMode();
                attachDatePickerWidgetEvents();
            }

            function destroyWidget() {
                if (!widget) {
                    return;
                }
                detachDatePickerWidgetEvents();
                widget.remove();
                widget = false;
            }

            function init() {
                // initializing element and component attributes
                element = $(element);
                if (element.is('input')) {
                    input = element;
                } else {
                    input = element.find('.datepickerinput');
                    if (input.size() === 0) {
                        input = element.find('input');
                    }
                    else if (!input.is('input')) {
                        throw new Error('CSS class "datepickerinput" cannot be applied to non input element');
                    }
                }

                if (element.hasClass('input-group')) {
                    // in case there is more then one 'input-group-addon' Issue #48
                    if (element.find('.datepickerbutton').size() === 0) {
                        component = element.find('[class^="input-group-"]');
                    }
                    else {
                        component = element.find('.datepickerbutton');
                    }
                }

                attachDatePickerElementEvents();

                $.extend(true, options, dataToOptions());
                if (!(options.pickTime || options.pickDate)) {
                    throw new Error('Must choose at least one picker');
                }

                if (component) {
                    component.find('span').addClass((options.pickDate ? options.icons.date : options.icons.time));
                }

                if (options.defaultDate && input.val() === '') {
                    picker.date(options.defaultDate);
                }

                picker.options(options);
            }

            /********************************************************************************
             *
             * Widget UI interaction functions
             *
             ********************************************************************************/

            actions = {
                next: function () {
                    var step = datePickerModes[currentViewMode].navStep;
                    viewDate.add(step, datePickerModes[currentViewMode].navFnc);
                    fillDate();
                },

                previous: function () {
                    var step = datePickerModes[currentViewMode].navStep * -1;
                    viewDate.add(step, datePickerModes[currentViewMode].navFnc);
                    fillDate();
                },

                pickerSwitch: function () {
                    showMode(1);
                },

                selectMonth: function (e) {
                    var month = $(e.target).closest('tbody').find('span').index($(e.target));
                    viewDate.month(month);
                    if (currentViewMode === minViewModeNumber) {
                        setValue(moment({
                            y: viewDate.year(),
                            M: viewDate.month(),
                            d: viewDate.date(),
                            h: date.hours(),
                            m: date.minutes(),
                            s: date.seconds()
                        }));
                        picker.hide();
                    }
                    showMode(-1);
                    fillDate();
                },

                selectYear: function (e) {
                    var year = parseInt($(e.target).text(), 10) || 0;
                    viewDate.year(year);
                    if (currentViewMode === minViewModeNumber) {
                        setValue(moment({
                            y: viewDate.year(),
                            M: viewDate.month(),
                            d: viewDate.date(),
                            h: date.hours(),
                            m: date.minutes(),
                            s: date.seconds()
                        }));
                        picker.hide();
                    }
                    showMode(-1);
                    fillDate();
                },

                selectDay: function (e) {
                    var day = parseInt($(e.target).text(), 10) || 1,
                        month = viewDate.month(),
                        year = viewDate.year();

                    if ($(e.target).is('.old')) {
                        if (month === 0) {
                            month = 11;
                            year -= 1;
                        } else {
                            month -= 1;
                        }
                    } else if ($(e.target).is('.new')) {
                        if (month === 11) {
                            month = 0;
                            year += 1;
                        } else {
                            month += 1;
                        }
                    }
                    setValue(moment({
                        y: year,
                        M: month,
                        d: day,
                        h: date.hours(),
                        m: date.minutes(),
                        s: date.seconds()
                    }));
                    if (!options.pickTime) {
                        picker.hide();
                    }
                },

                incrementHours: function () {
                    setValue(picker.date().add(1, 'hours'));
                },

                incrementMinutes: function () {
                    setValue(picker.date().add(options.minuteStepping, 'minutes'));
                },

                incrementSeconds: function () {
                    setValue(picker.date().add(1, 'seconds'));
                },

                decrementHours: function () {
                    setValue(picker.date().subtract(1, 'hours'));
                },

                decrementMinutes: function () {
                    setValue(picker.date().subtract(options.minuteStepping, 'minutes'));
                },

                decrementSeconds: function () {
                    setValue(picker.date().subtract(1, 'seconds'));
                },

                togglePeriod: function () {
                    setValue(picker.date().add((picker.date().hours() >= 12) ? -12 : 12, 'hours'));
                },

                togglePicker: function (e) {
                    var $this = $(e.target),
                        $parent = $this.closest('ul'),
                        expanded = $parent.find('.in'),
                        closed = $parent.find('.collapse:not(.in)'),
                        collapseData;

                    if (expanded && expanded.length) {
                        collapseData = expanded.data('collapse');
                        if (collapseData && collapseData.transitioning) {
                            return;
                        }
                        expanded.collapse('hide');
                        closed.collapse('show');
                        if ($this.is('span')) {
                            $this.toggleClass(options.icons.time + ' ' + options.icons.date);
                        } else {
                            $this.find('span').toggleClass(options.icons.time + ' ' + options.icons.date);
                        }
                        if (component) {
                            component.find('span').toggleClass(options.icons.time + ' ' + options.icons.date);
                        }
                    }
                },

                showPicker: function () {
                    widget.find('.timepicker > div:not(.timepicker-picker)').hide();
                    widget.find('.timepicker .timepicker-picker').show();
                },

                showHours: function () {
                    widget.find('.timepicker .timepicker-picker').hide();
                    widget.find('.timepicker .timepicker-hours').show();
                },

                showMinutes: function () {
                    widget.find('.timepicker .timepicker-picker').hide();
                    widget.find('.timepicker .timepicker-minutes').show();
                },

                showSeconds: function () {
                    widget.find('.timepicker .timepicker-picker').hide();
                    widget.find('.timepicker .timepicker-seconds').show();
                },

                selectHour: function (e) {
                    var hour = parseInt($(e.target).text(), 10),
                        newDate = picker.date();

                    if (!use24hours) {
                        if (newDate.hours() >= 12) {
                            if (hour !== 12) {
                                hour += 12;
                            }
                        } else {
                            if (hour === 12) {
                                hour = 0;
                            }
                        }
                    }
                    newDate.hours(hour);
                    setValue(newDate);
                    actions.showPicker.call(picker);
                },

                selectMinute: function (e) {
                    setValue(picker.date().minutes(parseInt($(e.target).text(), 10)));
                    actions.showPicker.call(picker);
                },

                selectSecond: function (e) {
                    setValue(picker.date().seconds(parseInt($(e.target).text(), 10)));
                    actions.showPicker.call(picker);
                }
            };

            /********************************************************************************
             *
             * Public API functions
             * =====================
             *
             * Important: Do not expose direct references of private objects or the options
             * object to the outer world. Always return a clone when returning values or make
             * a clone when setting a private variable.
             *
             ********************************************************************************/
            picker.destroy = function () {
                picker.hide();
                detachDatePickerElementEvents();
                element.removeData('DateTimePicker');
                element.removeData('date');
            };

            picker.toggle = function () {
                if (widget) {
                    picker.hide();
                }
                else {
                    picker.show();
                }
            };

            picker.show = function () {
                var currentMoment;
                if (input.prop('readonly') || widget) {
                    return;
                }
                if (options.useCurrent && unset) {
                    currentMoment = moment();
                    if (typeof options.useCurrent === 'string') {
                        switch (options.useCurrent) {
                            case 'year':
                                currentMoment.month(0).date(1).hours(0).seconds(0).minutes(0);
                                break;
                            case 'month':
                                currentMoment.date(1).hours(0).seconds(0).minutes(0);
                                break;
                            case 'day':
                                currentMoment.hours(0).seconds(0).minutes(0);
                                break;
                            case 'hour':
                                currentMoment.seconds(0).minutes(0);
                                break;
                            case 'minute':
                                currentMoment.seconds(0);
                                break;
                        }
                    }
                    setValue(currentMoment);
                }
                createWidget();
                widget.show();
                place();
                notifyEvent({
                    type: 'dp.show',
                    date: picker.date()
                });
            };

            picker.hide = function () {
                if (!widget) {
                    return;
                }
                // Ignore event if in the middle of a picker transition
                var collapse = widget.find('.collapse'), i, collapseData;
                for (i = 0; i < collapse.length; i++) {
                    collapseData = collapse.eq(i).data('collapse');
                    if (collapseData && collapseData.transitioning) {
                        return;
                    }
                }
                widget.hide();
                destroyWidget();
                notifyEvent({
                    type: 'dp.hide',
                    date: picker.date()
                });
            };

            picker.disable = function () {
                if (input.prop('disabled')) {
                    return;
                }
                input.prop('disabled', true);
                picker.hide();
            };

            picker.enable = function () {
                if (!input.prop('disabled')) {
                    return;
                }
                input.prop('disabled', false);
            };

            picker.options = function (newOptions) {
                if (arguments.length === 0) {
                    return $.extend(true, {}, options);
                }

                if (!(newOptions instanceof Object)) {
                    throw new TypeError('options() options parameter should be an object');
                }
                $.extend(true, options, newOptions);
                $.each(options, function (key, value) {
                    picker[key].apply(picker, [value]);
                });
            };

            picker.date = function (newDate) {
                if (arguments.length === 0) {
                    if (unset) {
                        return null;
                    }
                    return date.clone();
                }

                if (newDate === null) {
                    setValue(false);
                    return;
                }
                var parsedDate = parseInputDate(newDate);

                if (!parsedDate) {
                    throw new TypeError('setDate() could not parse given date: ' + newDate);
                }

                setValue(parsedDate);
            };

            picker.format = function (format) {
                if (arguments.length === 0) {
                    return options.format;
                }

                if (!format) {
                    format = (options.pickDate ? date.localeData().longDateFormat('L') : '');
                    if (options.pickDate && options.pickTime) {
                        format += ' ';
                    }
                    format += (options.pickTime ? date.localeData().longDateFormat('LT') : '');
                    if (options.useSeconds) {
                        if (date.localeData().longDateFormat('LT').indexOf(' A') !== -1) {
                            format = format.split(' A')[0] + ':ss A';
                        }
                        else {
                            format += ':ss';
                        }
                    }
                }
                options.format = format;
                use24hours = options.format.toLowerCase().indexOf('a') < 1;
                if (!unset) {
                    setValue(date, date);
                }
            };

            picker.disabledDates = function (dates) {
                if (arguments.length === 0) {
                    return options.disabledDates.splice(0);
                }

                if (!dates) {
                    options.disabledDates = false;
                    update();
                    return;
                }
                if (!(dates instanceof Array)) {
                    throw new TypeError('disabledDates() expects an array parameter');
                }
                options.disabledDates = indexGivenDates(dates);
                options.enabledDates = [];
                update();
            };

            picker.enabledDates = function (dates) {
                if (arguments.length === 0) {
                    return options.enabledDates.splice(0);
                }

                if (!dates) {
                    options.enabledDates = false;
                    update();
                    return;
                }
                if (!(dates instanceof Array)) {
                    throw new TypeError('enabledDates() expects an array parameter');
                }
                options.enabledDates = indexGivenDates(dates);
                options.disabledDates = [];
                update();
            };

            picker.daysOfWeekDisabled = function (daysOfWeekDisabled) {
                if (arguments.length === 0) {
                    return options.daysOfWeekDisabled.splice(0);
                }

                if (!(daysOfWeekDisabled instanceof Array)) {
                    throw new TypeError('daysOfWeekDisabled() expects an array parameter');
                }
                options.daysOfWeekDisabled = daysOfWeekDisabled.reduce(function (previousValue, currentValue) {
                    currentValue = parseInt(currentValue, 10);
                    if (currentValue > 6 || currentValue < 0 || isNaN(currentValue)) {
                        return previousValue;
                    }
                    if (previousValue.indexOf(currentValue) === -1) {
                        previousValue.push(currentValue);
                    }
                    return previousValue;
                }, []).sort();
                update();
            };

            picker.maxDate = function (date) {
                if (arguments.length === 0) {
                    return moment(options.maxDate);
                }

                var parsedDate = parseInputDate(date);
                if ((typeof date === 'boolean') && date === false) {
                    options.maxDate = false;
                    update();
                    return;
                }
                if (!parsedDate) {
                    throw new TypeError('maxDate() Could not parse date variable: ' + date);
                }
                if (parsedDate.isBefore(options.minDate)) {
                    throw new TypeError('maxDate() date variable is before options.minDate: ' + parsedDate.format(options.format));
                }
                options.maxDate = parsedDate;
                if (options.maxDate.isBefore(date)) {
                    setValue(options.maxDate);
                }
                update();
            };

            picker.minDate = function (date) {
                if (arguments.length === 0) {
                    return moment(options.minDate);
                }

                var parsedDate = parseInputDate(date);
                if ((typeof date === 'boolean') && date === false) {
                    options.minDate = false;
                    update();
                    return;
                }
                if (!parsedDate) {
                    throw new TypeError('minDate() Could not parse date variable: ' + date);
                }
                if (parsedDate.isAfter(options.maxDate)) {
                    throw new TypeError('minDate() date variable is after options.maxDate: ' + parsedDate.format(options.format));
                }
                options.minDate = parsedDate;
                if (options.minDate.isAfter(date)) {
                    setValue(options.minDate);
                }
                update();
            };

            picker.defaultDate = function (defaultDate) {
                if (arguments.length === 0) {
                    return moment(options.defaultDate);
                }
                if (!defaultDate) {
                    options.defaultDate = false;
                    return;
                }
                var parsedDate = parseInputDate(defaultDate);
                if (!parsedDate) {
                    throw new TypeError('defaultDate() Could not parse date variable: ' + defaultDate);
                }
                //*TODO: Put date validation logic in one place!!
                if ((options.maxDate && parsedDate.isAfter(options.maxDate)) || (options.minDate && parsedDate.isBefore(options.minDate))) {
                    throw new TypeError('defaultDate() date passed is invalid according to component setup validations');
                }

                options.defaultDate = parsedDate;
            };

            picker.locale = function (locale) {
                if (arguments.length === 0) {
                    return options.locale;
                }

                options.locale = locale || moment.locale();
                date.locale(options.locale);
                viewDate.locale(options.locale);
                if (widget) {
                    picker.hide();
                    picker.show();
                }
            };

            picker.useMinutes = function (useMinutes) {
                if (arguments.length === 0) {
                    return options.useMinutes;
                }

                if (typeof useMinutes !== 'boolean') {
                    throw new TypeError('useMinutes() expects a boolean parameter');
                }
                options.useMinutes = useMinutes || false;
            };

            picker.useSeconds = function (useSeconds) {
                if (arguments.length === 0) {
                    return options.useSeconds;
                }

                if (typeof useSeconds !== 'boolean') {
                    throw new TypeError('useSeconds() expects a boolean parameter');
                }
                options.useSeconds = useSeconds;
            };

            picker.useCurrent = function (useCurrent) {
                if (arguments.length === 0) {
                    return options.useCurrent;
                }

                if ((typeof useCurrent !== 'boolean') && (typeof useCurrent !== 'string')) {
                    throw new TypeError('useCurrent() expects a boolean parameter');
                }
                options.useCurrent = useCurrent;
            };

            picker.minuteStepping = function (minuteStepping) {
                if (arguments.length === 0) {
                    return options.minuteStepping;
                }

                minuteStepping = parseInt(minuteStepping, 10);
                if (isNaN(minuteStepping) || minuteStepping < 1) {
                    minuteStepping = 1;
                }
                options.minuteStepping = minuteStepping;
            };

            picker.pickDate = function (pickDate) {
                if (arguments.length === 0) {
                    return options.pickDate;
                }

                if (typeof pickDate !== 'boolean') {
                    throw new TypeError('pickDate() expects a boolean parameter');
                }
                options.pickDate = pickDate;
                if (widget) {
                    picker.hide();
                    picker.show();
                }
            };

            picker.pickTime = function (pickTime) {
                if (arguments.length === 0) {
                    return options.pickTime;
                }

                if (typeof pickTime !== 'boolean') {
                    throw new TypeError('pickTime() expects a boolean parameter');
                }
                options.pickTime = pickTime;
                if (widget) {
                    picker.hide();
                    picker.show();
                }
            };

            picker.showToday = function (showToday) {
                if (arguments.length === 0) {
                    return options.showToday;
                }

                if (typeof showToday !== 'boolean') {
                    throw new TypeError('showToday() expects a boolean parameter');
                }
                options.showToday = showToday;
                if (widget) {
                    picker.hide();
                    picker.show();
                }
            };

            picker.collapse = function (collapse) {
                if (arguments.length === 0) {
                    return options.collapse;
                }

                if (typeof collapse !== 'boolean') {
                    throw new TypeError('collapse() expects a boolean parameter');
                }
                if (options.collapse === collapse) {
                    return;
                }
                options.collapse = collapse;
                if (widget) {
                    picker.hide();
                    picker.show();
                }
            };

            picker.icons = function (icons) {
                if (arguments.length === 0) {
                    return options.icons;
                }

                if (!(icons instanceof Object)) {
                    throw new TypeError('icons() expects parameter to be an Object');
                }
                $.extend(options.icons, icons);
                if (widget) {
                    picker.hide();
                    picker.show();
                }
            };

            picker.useStrict = function (useStrict) {
                if (arguments.length === 0) {
                    return options.useStrict;
                }

                if (typeof useStrict !== 'boolean') {
                    throw new TypeError('useStrict() expects a boolean parameter');
                }
                options.useStrict = useStrict;
            };

            picker.sideBySide = function (sideBySide) {
                if (arguments.length === 0) {
                    return options.sideBySide;
                }

                if (typeof sideBySide !== 'boolean') {
                    throw new TypeError('sideBySide() expects a boolean parameter');
                }
                options.sideBySide = sideBySide;
                if (widget) {
                    picker.hide();
                    picker.show();
                }
            };

            //*TODO: is this really required?
            picker.widgetParent = function (widgetParent) {
                if (arguments.length === 0) {
                    return options.widgetParent;
                }

                options.widgetParent = widgetParent;
            };

            picker.minViewMode = function (newMinViewMode) {
                if (arguments.length === 0) {
                    return options.minViewMode;
                }

                if (typeof newMinViewMode !== 'string') {
                    throw new TypeError('minViewMode() expects a string parameter');
                }

                if (viewModes.indexOf(newMinViewMode) === -1) {
                    throw new TypeError('minViewMode() parameter must be one of (' + viewModes.join(', ') + ') value');
                }

                options.minViewMode = newMinViewMode;

                minViewModeNumber = viewModes.indexOf(newMinViewMode);
                currentViewMode = Math.max(minViewModeNumber, currentViewMode);

                showMode();
            };

            picker.viewMode = function (newViewMode) {
                if (arguments.length === 0) {
                    return options.viewMode;
                }

                if (typeof newViewMode !== 'string') {
                    throw new TypeError('viewMode() expects a string parameter');
                }

                if (viewModes.indexOf(newViewMode) === -1) {
                    throw new TypeError('viewMode() parameter must be one of (' + viewModes.join(', ') + ') value');
                }

                options.viewMode = newViewMode;
                currentViewMode = Math.max(viewModes.indexOf(newViewMode), minViewModeNumber);

                showMode();
            };

            picker.direction = function (direction) {
                if (arguments.length === 0) {
                    return options.direction;
                }

                if (typeof direction !== 'string') {
                    throw new TypeError('direction() expects a string parameter');
                }

                direction = direction.toLowerCase();

                if (directionModes.indexOf(direction) === -1) {
                    throw new TypeError('direction() expects parameter to be one of (' + directionModes.join(', ') + ')');
                }

                options.direction = direction;
                update();
            };

            picker.orientation = function (orientation) {
                if (arguments.length === 0) {
                    return options.orientation;
                }

                if (typeof orientation !== 'string') {
                    throw new TypeError('orientation() expects a string parameter');
                }

                orientation = orientation.toLowerCase();

                if (orientationModes.indexOf(orientation) === -1) {
                    throw new TypeError('orientation() expects parameter to be one of (' + orientationModes.join(', ') + ')');
                }

                options.orientation = orientation;
                update();
            };

            init();
        };

    /********************************************************************************
     *
     * jQuery plugin constructor and defaults object
     *
     ********************************************************************************/

    $.fn.datetimepicker = function (options) {
        return this.each(function () {
            var $this = $(this),
                data = $this.data('DateTimePicker');
            if (!data) {
                // create a private copy of the options object
                options = $.extend(true, {}, $.fn.datetimepicker.defaults, options);
                $this.data('DateTimePicker', new DateTimePicker(this, options));
            }
        });
    };

    $.fn.datetimepicker.defaults = {
        format: false,
        pickDate: true,
        pickTime: true,
        useMinutes: true,
        useSeconds: false,
        useCurrent: true,
        minuteStepping: 1,
        minDate: moment({y: 1900}),
        maxDate: moment().add(100, 'y'),
        showToday: true,
        collapse: true,
        locale: moment.locale(),
        defaultDate: false,
        disabledDates: false,
        enabledDates: false,
        icons: {
            time : 'glyphicon glyphicon-time',
            date : 'glyphicon glyphicon-calendar',
            up   : 'glyphicon glyphicon-chevron-up',
            down : 'glyphicon glyphicon-chevron-down',
            previous: 'glyphicon glyphicon-chevron-left',
            next : 'glyphicon glyphicon-chevron-right'
        },
        useStrict: false,
        direction: 'auto',
        sideBySide: false,
        daysOfWeekDisabled: [],
        widgetParent: false,
        minViewMode: 'days',
        viewMode: 'days',
        orientation: 'right'
    };
}));
