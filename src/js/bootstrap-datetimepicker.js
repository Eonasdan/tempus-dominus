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
;(function (factory) {
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
                format,
                errored = false,
                currentViewMode,
                actions,
                datePickerModes = [
                    {
                        clsName: 'days',
                        navFnc: 'M',
                        navStep: 1
                    },
                    {
                        clsName: 'months',
                        navFnc: 'y',
                        navStep: 1
                    },
                    {
                        clsName: 'years',
                        navFnc: 'y',
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
                var headTemplate = $('<thead>')
                        .append($('<tr>')
                            .append($('<th>').addClass('prev').attr('data-action', 'previous')
                                .append($('<span>').addClass(options.icons.previous))
                            )
                            .append($('<th>').addClass('picker-switch').attr('data-action', 'pickerSwitch').attr('colspan', (options.calendarWeeks ? '6' : '5')))
                            .append($('<th>').addClass('next').attr('data-action', 'next')
                                .append($('<span>').addClass(options.icons.next))
                            )
                        ),
                    contTemplate = $('<tbody>')
                        .append($('<tr>')
                            .append($('<td>').attr('colspan', (options.calendarWeeks ? '8' : '7')))
                        );

                return [
                    $('<div>').addClass('datepicker-days')
                        .append($('<table>').addClass('table-condensed')
                            .append(headTemplate)
                            .append($('<tbody>'))
                        ),
                    $('<div>').addClass('datepicker-months')
                        .append($('<table>').addClass('table-condensed')
                            .append(headTemplate.clone())
                            .append(contTemplate.clone())
                        ),
                    $('<div>').addClass('datepicker-years')
                        .append($('<table>').addClass('table-condensed')
                            .append(headTemplate.clone())
                            .append(contTemplate.clone())
                        )
                ];
            }

            function getTimePickerMainTemplate() {
                var topRow = $('<tr>'),
                    middleRow = $('<tr>'),
                    bottomRow = $('<tr>');

                if (true) { // should be (options.useHours)
                    topRow.append($('<td>')
                        .append($('<a>').attr('href', '#').addClass('btn').attr('data-action', 'incrementHours')
                            .append($('<span>').addClass(options.icons.up))));
                    middleRow.append($('<td>')
                        .append($('<span>').addClass('timepicker-hour').attr('data-time-component', 'hours').attr('data-action', 'showHours')));
                    bottomRow.append($('<td>')
                        .append($('<a>').attr('href', '#').addClass('btn').attr('data-action', 'decrementHours')
                            .append($('<span>').addClass(options.icons.down))));
                }
                if (options.useMinutes) {
                    if (true) { // should be (options.useHours)
                        topRow.append($('<td>').addClass('separator'));
                        middleRow.append($('<td>').addClass('separator').html(':'));
                        bottomRow.append($('<td>').addClass('separator'));
                    }
                    topRow.append($('<td>')
                        .append($('<a>').attr('href', '#').addClass('btn').attr('data-action', 'incrementMinutes')
                            .append($('<span>').addClass(options.icons.up))));
                    middleRow.append($('<td>')
                        .append($('<span>').addClass('timepicker-minute').attr('data-time-component', 'minutes').attr('data-action', 'showMinutes')));
                    bottomRow.append($('<td>')
                        .append($('<a>').attr('href', '#').addClass('btn').attr('data-action', 'decrementMinutes')
                            .append($('<span>').addClass(options.icons.down))));
                }
                if (options.useSeconds) {
                    if (options.useMinutes) {
                        topRow.append($('<td>').addClass('separator'));
                        middleRow.append($('<td>').addClass('separator').html(':'));
                        bottomRow.append($('<td>').addClass('separator'));
                    }
                    topRow.append($('<td>')
                        .append($('<a>').attr('href', '#').addClass('btn').attr('data-action', 'incrementSeconds')
                            .append($('<span>').addClass(options.icons.up))));
                    middleRow.append($('<td>')
                        .append($('<span>').addClass('timepicker-second').attr('data-time-component', 'seconds').attr('data-action', 'showSeconds')));
                    bottomRow.append($('<td>')
                        .append($('<a>').attr('href', '#').addClass('btn').attr('data-action', 'decrementSeconds')
                            .append($('<span>').addClass(options.icons.down))));
                }

                if (!use24hours) {
                    topRow.append($('<td>').addClass('separator'));
                    middleRow.append($('<td>')
                        .append($('<button>').addClass('btn btn-primary').attr('data-action', 'togglePeriod')));
                    bottomRow.append($('<td>').addClass('separator'));
                }

                return $('<div>').addClass('timepicker-picker')
                    .append($('<table>').addClass('table-condensed')
                        .append([topRow, middleRow, bottomRow]));
            }

            function getTimePickerTemplate() {
                var hoursView = $('<div>').addClass('timepicker-hours')
                        .append($('<table>').addClass('table-condensed')),
                    minutesView = $('<div>').addClass('timepicker-minutes')
                        .append($('<table>').addClass('table-condensed')),
                    secondsView = $('<div>').addClass('timepicker-seconds')
                        .append($('<table>').addClass('table-condensed')),
                    ret = [getTimePickerMainTemplate()];


                if (true) { // should be (options.useHours)
                    ret.push(hoursView);
                }
                if (options.useMinutes) {
                    ret.push(minutesView);
                }
                if (options.useSeconds) {
                    ret.push(secondsView);
                }

                return ret;
            }

            function getToolbar() {
                var row = [];
                if (options.showTodayButton) {
                    row.push($('<td>').append($('<a>').attr('data-action', 'today').append($('<span>').addClass(options.icons.today))));
                }
                if (options.pickDate && options.pickTime) {
                    row.push($('<td>').append($('<a>').attr('data-action', 'togglePicker').append($('<span>').addClass(options.icons.time))));
                }
                if (options.showClear) {
                    row.push($('<td>').append($('<a>').attr('data-action', 'clear').append($('<span>').addClass(options.icons.clear))));
                }
                return $('<table>').addClass('table-condensed').append($('<tbody>').append($('<tr>').append(row)));
            }

            function getTemplate() {
                var template = $('<div>').addClass('bootstrap-datetimepicker-widget dropdown-menu'),
                    dateView = $('<div>').addClass('datepicker').append(getDatePickerTemplate()),
                    timeView = $('<div>').addClass('timepicker').append(getTimePickerTemplate()),
                    content = $('<ul>').addClass('list-unstyled');

                if (options.sideBySide && options.pickDate && options.pickTime) {
                    template.addClass('timepicker-sbs');
                    if (use24hours) {
                        template.addClass('usetwentyfour');
                    }
                    template.append(
                        $('<div>').addClass('row')
                            .append(dateView.addClass('col-sm-6'))
                            .append(timeView.addClass('col-sm-6'))
                    );
                    return template;
                }

                if (options.pickDate) {
                    content.append($('<li>').addClass((options.collapse && options.pickTime ? 'collapse in' : '')).append(dateView));
                }
                content.append($('<li>').addClass('picker-switch accordion-toggle').append(getToolbar()));
                if (options.pickTime) {
                    content.append($('<li>').addClass((options.collapse && options.pickDate ? 'collapse' : '')).append(timeView));
                }
                return template.append(content);
            }

            function dataToOptions() {
                var eData = input.data(), dataOptions = {};

                if (eData.dateOptions && eData.dateOptions instanceof Object) {
                    dataOptions = $.extend(true, dataOptions, eData.dateOptions);
                }

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
                    for (i = 0; i < parents.length; i += 1) {
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

                placePosition = options.direction;
                if (placePosition === 'auto') {
                    if (offset.top + widget.height() > $window.height() + $window.scrollTop() && widget.height() + element.outerHeight() < offset.top) {
                        placePosition = 'top';
                    } else {
                        placePosition = 'bottom';
                    }
                }
                if (placePosition === 'top') {
                    offset.bottom = $window.height() - offset.top + element.outerHeight() + 3;
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

                if (placePosition === 'top') {
                    widget.css({
                        position: position,
                        bottom: offset.bottom,
                        top: 'auto',
                        left: offset.left,
                        right: offset.right
                    });
                } else {
                    widget.css({
                        position: position,
                        top: offset.top,
                        left: offset.left,
                        right: offset.right
                    });
                }
            }

            function notifyEvent(e) {
                if (e.type === 'dp.change' && e.date && e.date.isSame(e.oldDate) && !errored && !unset) {
                    return;
                }
                element.trigger(e);
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
                place();
            }

            function fillDow() {
                var html = $('<tr>'),
                    currentDate = viewDate.clone().startOf('w');

                if (options.calendarWeeks === true) {
                    html.append('<th class="cw">#</th>');
                }

                while (currentDate.isBefore(viewDate.clone().endOf('w'))) {
                    html.append('<th class="dow">' + currentDate.format('dd') + '</th>');
                    currentDate.add(1, 'd');
                }
                widget.find('.datepicker-days thead').append(html);
            }

            function fillMonths() {
                var html = '',
                    monthsShort = viewDate.clone().startOf('y');
                while (monthsShort.isSame(viewDate, 'y')) {
                    html += '<span class="month" data-action="selectMonth">' + monthsShort.format('MMM') + '</span>';
                    monthsShort.add(1, 'M');
                }
                widget.find('.datepicker-months td').empty().append(html);
            }

            function isInDisabledDates(date) {
                if (!options.disabledDates) {
                    return false;
                }
                return options.disabledDates[date.format('YYYY-MM-DD')] === true;
            }

            function isInEnabledDates(date) {
                if (options.enabledDates === false) {
                    return true;
                }
                return options.enabledDates[date.format('YYYY-MM-DD')] === true;
            }

            function isValid(targetMoment, granularity) {
                if (!targetMoment.isValid()) {
                    return false;
                }
                if (options.minDate && targetMoment.isBefore(options.minDate, granularity)) {
                    return false;
                }
                if (options.maxDate && targetMoment.isAfter(options.maxDate, granularity)) {
                    return false;
                }
                if (options.disabledDates && isInDisabledDates(targetMoment)) {
                    return false;
                }
                if (options.enabledDates && !isInEnabledDates(targetMoment)) {
                    return false;
                }
                if (options.daysOfWeekDisabled.indexOf(targetMoment.day()) !== -1) {
                    return false;
                }
                return true;
            }

            function updateMonths() {
                var i,
                    monthsView = widget.find('.datepicker-months'),
                    monthsViewHeader = monthsView.find('th'),
                    months = monthsView.find('tbody').find('span');

                monthsView.find('.disabled').removeClass('disabled');

                if (!isValid(viewDate.clone().subtract(1, 'y'), 'y')) {
                    monthsViewHeader.eq(0).addClass('disabled');
                }

                monthsViewHeader.eq(1).text(viewDate.year());

                if (!isValid(viewDate.clone().add(1, 'y'), 'y')) {
                    monthsViewHeader.eq(2).addClass('disabled');
                }

                months.removeClass('active');
                if (date.isSame(viewDate, 'y')) {
                    months.eq(date.month()).addClass('active');
                }

                for (i = 0; i < 12; i += 1) {
                    if (!isValid(viewDate.clone().month(i), 'M')) {
                        months.eq(i).addClass('disabled');
                    }
                }
            }

            function updateYears() {
                var yearsView = widget.find('.datepicker-years'),
                    yearsViewHeader = yearsView.find('th'),
                    startYear = viewDate.clone().subtract(5, 'y'),
                    endYear = viewDate.clone().add(6, 'y'),
                    html = '';

                yearsView.find('.disabled').removeClass('disabled');

                if (options.minDate && options.minDate.isAfter(startYear, 'y')) {
                    yearsViewHeader.eq(0).addClass('disabled');
                }

                yearsViewHeader.eq(1).text(startYear.year() + '-' + endYear.year());

                if (options.maxDate && options.maxDate.isBefore(endYear, 'y')) {
                    yearsViewHeader.eq(2).addClass('disabled');
                }

                while (!startYear.isAfter(endYear, 'y')) {
                    html += '<span data-action="selectYear" class="year' + (startYear.isSame(date, 'y') ? ' active' : '') + (!isValid(startYear, 'y') ? ' disabled' : '') + '">' + startYear.year() + '</span>';
                    startYear.add(1, 'y');
                }

                yearsView.find('td').html(html);
            }

            function fillDate() {
                var daysView = widget.find('.datepicker-days'),
                    daysViewHeader = daysView.find('th'),
                    currentDate,
                    html = [],
                    row,
                    clsName;

                if (!options.pickDate) {
                    return;
                }

                daysView.find('.disabled').removeClass('disabled');

                daysViewHeader.eq(1).text(viewDate.format('MMMM YYYY'));

                if (!isValid(viewDate.clone().subtract(1, 'M'), 'M')) {
                    daysViewHeader.eq(0).addClass('disabled');
                }
                if (!isValid(viewDate.clone().add(1, 'M'), 'M')) {
                    daysViewHeader.eq(2).addClass('disabled');
                }

                currentDate = viewDate.clone().startOf('M').startOf('week');

                while (!viewDate.clone().endOf('M').endOf('w').isBefore(currentDate, 'd')) {
                    if (currentDate.weekday() === 0) {
                        row = $('<tr>');
                        if (options.calendarWeeks) {
                            row.append('<td class="cw">' + currentDate.week() + '</td>');
                        }
                        html.push(row);
                    }
                    clsName = '';
                    if (currentDate.isBefore(viewDate, 'M')) {
                        clsName += ' old';
                    }
                    if (currentDate.isAfter(viewDate, 'M')) {
                        clsName += ' new';
                    }
                    if (currentDate.isSame(date, 'd') && !unset) {
                        clsName += ' active';
                    }
                    if (!isValid(currentDate, 'd')) {
                        clsName += ' disabled';
                    }
                    if (options.showToday && currentDate.isSame(moment(), 'd')) {
                        clsName += ' today';
                    }
                    row.append('<td data-action="selectDay" class="day' + clsName + '">' + currentDate.date() + '</td>');
                    currentDate.add(1, 'd');
                }

                daysView.find('tbody').empty().append(html);

                updateMonths();

                updateYears();
            }

            function fillHours() {
                var table = widget.find('.timepicker-hours table'),
                    currentHour = viewDate.clone().startOf('d'),
                    html = [],
                    row;

                while (currentHour.isSame(viewDate, 'd') && (use24hours || currentHour.hour() < 12)) {
                    if (currentHour.hour() % 4 === 0) {
                        row = $('<tr>');
                        html.push(row);
                    }
                    row.append('<td data-action="selectHour" class="hour' + (!isValid(currentHour, 'h') ? ' disabled' : '') + '">' + currentHour.format(use24hours ? 'HH' : 'hh') + '</td>');
                    currentHour.add(1, 'h');
                }
                table.empty().append(html);
            }

            function fillMinutes() {
                var table = widget.find('.timepicker-minutes table'),
                    currentMinute = viewDate.clone().startOf('h'),
                    html = [],
                    row,
                    step = options.minuteStepping === 1 ? 5 : options.minuteStepping;

                while (viewDate.isSame(currentMinute, 'h')) {
                    if (currentMinute.minute() % (step * 4) === 0) {
                        row = $('<tr>');
                        html.push(row);
                    }
                    row.append('<td data-action="selectMinute" class="minute' + (!isValid(currentMinute, 'm') ? ' disabled' : '') + '">' + currentMinute.format('mm') + '</td>');
                    currentMinute.add(step, 'm');
                }
                table.empty().append(html);
            }

            function fillSeconds() {
                var table = widget.find('.timepicker-seconds table'),
                    currentSecond = viewDate.clone().startOf('m'),
                    html = [],
                    row;

                while (viewDate.isSame(currentSecond, 'm')) {
                    if (currentSecond.second() % 20 === 0) {
                        row = $('<tr>');
                        html.push(row);
                    }
                    row.append('<td data-action="selectSecond" class="second' + (!isValid(currentSecond, 's') ? ' disabled' : '') + '">' + currentSecond.format('ss') + '</td>');
                    currentSecond.add(5, 's');
                }

                table.empty().append(html);
            }

            function fillTime() {
                var timeComponents = widget.find('.timepicker span[data-time-component]');
                if (!use24hours) {
                    widget.find('.timepicker [data-action=togglePeriod]').text(date.format('A'));
                }
                timeComponents.filter('[data-time-component=hours]').text(date.format(use24hours ? 'HH' : 'hh'));
                timeComponents.filter('[data-time-component=minutes]').text(date.format('mm'));
                timeComponents.filter('[data-time-component=seconds]').text(date.format('ss'));

                fillHours();
                fillMinutes();
                fillSeconds();
            }

            function update() {
                if (!widget) {
                    return;
                }
                fillDate();
                fillTime();
                place();
            }

            function setValue(targetMoment) {
                var oldDate = date;

                // case of calling setValue(null or false)
                if (!targetMoment) {
                    unset = true;
                    input.val('');
                    element.data('date', '');
                    notifyEvent({
                        type: 'dp.change',
                        date: null,
                        oldDate: oldDate
                    });
                    update();
                    return;
                }

                targetMoment = targetMoment.clone().locale(options.locale);

                if (options.minuteStepping !== 1) {
                    targetMoment.minutes((Math.round(targetMoment.minutes() / options.minuteStepping) * options.minuteStepping) % 60).seconds(0);
                }

                if (isValid(targetMoment)) {
                    date = targetMoment;
                    viewDate = date.clone();
                    input.val(date.format(format));
                    element.data('date', date.format(format));
                    update();
                    notifyEvent({
                        type: 'dp.change',
                        date: picker.date(),
                        oldDate: oldDate
                    });
                    errored = false;
                    unset = false;
                } else {
                    //*TODO depending on behaviour we might want to bump the value and/or update the input.val or not
                    errored = true;
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
                if (moment.isMoment(date) || date instanceof Date) {
                    date = moment(date);
                } else {
                    date = moment(date, format, options.useStrict);
                }
                date.locale(options.locale);
                return date;
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
                picker.date($(e.target).val());
            }

            function attachDatePickerElementEvents() {
                if (element.is('input')) {
                    element.on({
                        'click': picker.show,
                        'focus': picker.show,
                        'change': change,
                        'blur': picker.hide,
                        'keydown': keydown
                    });
                } else {
                    element.on({
                        'change': change
                    }, 'input');
                    if (component) {
                        component.on('click', picker.toggle);
                        component.on('mousedown', stopEvent);
                    } else {
                        element.on('click', picker.show);
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
                $(window).on('resize', place);
                widget.on('click', '[data-action]', doAction); // this handles clicks on the widget
                widget.on('mousedown', stopEvent);
                if (!element.is('input')) {
                    $(document).on('mousedown', picker.hide);
                }
            }

            function detachDatePickerWidgetEvents() {
                $(window).off('resize', place);
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
                for (i = 0; i < givenDatesArray.length; i += 1) {
                    if (moment.isMoment(givenDatesArray[i]) || givenDatesArray[i] instanceof Date) {
                        dDate = moment(givenDatesArray[i]);
                    } else {
                        dDate = moment(givenDatesArray[i], options.format, options.useStrict);
                    }
                    if (dDate.isValid()) {
                        givenDatesIndexed[dDate.format('YYYY-MM-DD')] = true;
                        givenDatesCount += 1;
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

                widget.find('.timepicker-hours').hide();
                widget.find('.timepicker-minutes').hide();
                widget.find('.timepicker-seconds').hide();

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
                    } else if (!input.is('input')) {
                        throw new Error('CSS class "datepickerinput" cannot be applied to non input element');
                    }
                }

                if (element.hasClass('input-group')) {
                    // in case there is more then one 'input-group-addon' Issue #48
                    if (element.find('.datepickerbutton').size() === 0) {
                        component = element.find('[class^="input-group-"]');
                    } else {
                        component = element.find('.datepickerbutton');
                    }
                }

                if (!input.is('input')) {
                    throw new Error('Could not initialize DateTimePicker without an input element');
                }

                $.extend(true, options, dataToOptions());

                picker.options(options);

                attachDatePickerElementEvents();

                if (input.val().trim().length !== 0) {
                    picker.date(null);
                } else if (options.defaultDate) {
                    picker.date(options.defaultDate);
                }
            }

            /********************************************************************************
             *
             * Widget UI interaction functions
             *
             ********************************************************************************/

            actions = {
                next: function () {
                    viewDate.add(datePickerModes[currentViewMode].navStep, datePickerModes[currentViewMode].navFnc);
                    fillDate();
                },

                previous: function () {
                    viewDate.subtract(datePickerModes[currentViewMode].navStep, datePickerModes[currentViewMode].navFnc);
                    fillDate();
                },

                pickerSwitch: function () {
                    showMode(1);
                },

                selectMonth: function (e) {
                    var month = $(e.target).closest('tbody').find('span').index($(e.target));
                    viewDate.month(month);
                    if (currentViewMode === minViewModeNumber) {
                        setValue(date.clone().year(viewDate.year()).month(viewDate.month()));
                        picker.hide();
                    }
                    showMode(-1);
                    fillDate();
                },

                selectYear: function (e) {
                    var year = parseInt($(e.target).text(), 10) || 0;
                    viewDate.year(year);
                    if (currentViewMode === minViewModeNumber) {
                        setValue(date.clone().year(viewDate.year()));
                        picker.hide();
                    }
                    showMode(-1);
                    fillDate();
                },

                selectDay: function (e) {
                    var day = viewDate.clone();
                    if ($(e.target).is('.old')) {
                        day.subtract(1, 'M');
                    }
                    if ($(e.target).is('.new')) {
                        day.add(1, 'M');
                    }
                    setValue(day.date(parseInt($(e.target).text(), 10)));
                    if (!options.pickTime) {
                        picker.hide();
                    }
                },

                incrementHours: function () {
                    setValue(date.clone().add(1, 'h'));
                },

                incrementMinutes: function () {
                    setValue(date.clone().add(options.minuteStepping, 'm'));
                },

                incrementSeconds: function () {
                    setValue(date.clone().add(1, 's'));
                },

                decrementHours: function () {
                    setValue(date.clone().subtract(1, 'h'));
                },

                decrementMinutes: function () {
                    setValue(date.clone().subtract(options.minuteStepping, 'm'));
                },

                decrementSeconds: function () {
                    setValue(date.clone().subtract(1, 's'));
                },

                togglePeriod: function () {
                    setValue(date.clone().add((picker.date().hours() >= 12) ? -12 : 12, 'h'));
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
                    var hour = parseInt($(e.target).text(), 10);

                    if (!use24hours) {
                        if (date.hours() >= 12) {
                            if (hour !== 12) {
                                hour += 12;
                            }
                        } else {
                            if (hour === 12) {
                                hour = 0;
                            }
                        }
                    }
                    setValue(date.clone().hours(hour));
                    actions.showPicker.call(picker);
                },

                selectMinute: function (e) {
                    setValue(date.clone().minutes(parseInt($(e.target).text(), 10)));
                    actions.showPicker.call(picker);
                },

                selectSecond: function (e) {
                    setValue(date.clone().seconds(parseInt($(e.target).text(), 10)));
                    actions.showPicker.call(picker);
                },

                clear: function () {
                    picker.date(null);
                },

                today: function () {
                    picker.date(moment());
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
                } else {
                    picker.show();
                }
                return picker;
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
                if (component && component.hasClass('btn')) {
                    component.toggleClass('active');
                }
                widget.show();
                place();
                notifyEvent({
                    type: 'dp.show',
                    date: picker.date()
                });
                return picker;
            };

            picker.hide = function () {
                if (!widget) {
                    return;
                }
                // Ignore event if in the middle of a picker transition
                var collapse = widget.find('.collapse'), i, collapseData;
                for (i = 0; i < collapse.length; i += 1) {
                    collapseData = collapse.eq(i).data('collapse');
                    if (collapseData && collapseData.transitioning) {
                        return;
                    }
                }
                if (component && component.hasClass('btn')) {
                    component.toggleClass('active');
                }
                widget.hide();
                destroyWidget();
                notifyEvent({
                    type: 'dp.hide',
                    date: picker.date()
                });
                return picker;
            };

            picker.disable = function () {
                if (input.prop('disabled')) {
                    return;
                }
                input.prop('disabled', true);
                picker.hide();
                return picker;
            };

            picker.enable = function () {
                if (!input.prop('disabled')) {
                    return;
                }
                input.prop('disabled', false);
                return picker;
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
                    if (picker[key] !== undefined) {
                        picker[key](value);
                    }
                });
                return picker;
            };

            picker.date = function (newDate) {
                if (arguments.length === 0) {
                    if (unset) {
                        return null;
                    }
                    return date.clone();
                }

                if (newDate !== null && typeof newDate !== 'string' && !moment.isMoment(newDate) && !(newDate instanceof Date)) {
                    throw new TypeError('date() parameter must be one of [null, string, moment or Date]');
                }

                setValue(newDate === null ? null : parseInputDate(newDate));
                return picker;
            };

            picker.format = function (newFormat) {
                if (arguments.length === 0) {
                    return options.format;
                }

                if ((typeof newFormat !== 'string') && ((typeof newFormat !== 'boolean') || (newFormat !== false))) {
                    throw new TypeError('format() expects a sting or boolean:false variable ' + newFormat);
                }

                options.format = newFormat;

                if (newFormat === false) {
                    newFormat = (options.pickDate ? date.localeData().longDateFormat('L') : '');
                    if (options.pickDate && options.pickTime) {
                        newFormat += ' ';
                    }
                    newFormat += (options.pickTime ? date.localeData().longDateFormat('LT') : '');
                    if (options.useSeconds) {
                        if (date.localeData().longDateFormat('LT').indexOf(' A') !== -1) {
                            newFormat = newFormat.split(' A')[0] + ':ss A';
                        } else {
                            newFormat += ':ss';
                        }
                    }
                }

                format = newFormat;
                use24hours = (format.toLowerCase().indexOf('a') < 1 && format.indexOf('h') < 1);
                if (!unset) {
                    setValue(date);
                }
                return picker;
            };

            picker.disabledDates = function (dates) {
                if (arguments.length === 0) {
                    return options.disabledDates.splice(0);
                }

                if (!dates) {
                    options.disabledDates = false;
                    update();
                    return picker;
                }
                if (!(dates instanceof Array)) {
                    throw new TypeError('disabledDates() expects an array parameter');
                }
                options.disabledDates = indexGivenDates(dates);
                options.enabledDates = false;
                update();
                return picker;
            };

            picker.enabledDates = function (dates) {
                if (arguments.length === 0) {
                    return options.enabledDates.splice(0);
                }

                if (!dates) {
                    options.enabledDates = false;
                    update();
                    return picker;
                }
                if (!(dates instanceof Array)) {
                    throw new TypeError('enabledDates() expects an array parameter');
                }
                options.enabledDates = indexGivenDates(dates);
                options.disabledDates = false;
                update();
                return picker;
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
                return picker;
            };

            picker.maxDate = function (date) {
                if (arguments.length === 0) {
                    return moment(options.maxDate);
                }

                if ((typeof date === 'boolean') && date === false) {
                    options.maxDate = false;
                    update();
                    return picker;
                }

                var parsedDate = parseInputDate(date);

                if (!parsedDate.isValid()) {
                    throw new TypeError('maxDate() Could not parse date variable: ' + date);
                }
                if (options.minDate && parsedDate.isBefore(options.minDate)) {
                    throw new TypeError('maxDate() date variable is before options.minDate: ' + parsedDate.format(options.format));
                }
                options.maxDate = parsedDate;
                if (options.maxDate.isBefore(date)) {
                    setValue(options.maxDate);
                }
                update();
                return picker;
            };

            picker.minDate = function (date) {
                if (arguments.length === 0) {
                    return moment(options.minDate);
                }

                if ((typeof date === 'boolean') && date === false) {
                    options.minDate = false;
                    update();
                    return picker;
                }

                var parsedDate = parseInputDate(date);

                if (!parsedDate.isValid()) {
                    throw new TypeError('minDate() Could not parse date variable: ' + date);
                }
                if (options.maxDate && parsedDate.isAfter(options.maxDate)) {
                    throw new TypeError('minDate() date variable is after options.maxDate: ' + parsedDate.format(options.format));
                }
                options.minDate = parsedDate;
                if (options.minDate.isAfter(date)) {
                    setValue(options.minDate);
                }
                update();
                return picker;
            };

            picker.defaultDate = function (defaultDate) {
                if (arguments.length === 0) {
                    return options.defaultDate ? moment(options.defaultDate) : options.defaultDate;
                }
                if (!defaultDate) {
                    options.defaultDate = false;
                    return picker;
                }
                var parsedDate = parseInputDate(defaultDate);
                if (!parsedDate.isValid()) {
                    throw new TypeError('defaultDate() Could not parse date variable: ' + defaultDate);
                }
                if (!isValid(parsedDate)) {
                    throw new TypeError('defaultDate() date passed is invalid according to component setup validations');
                }

                options.defaultDate = parsedDate;

                if (options.defaultDate && input.val().trim() === '') {
                    picker.date(options.defaultDate);
                }
                return picker;
            };

            picker.locale = function (locale) {
                if (arguments.length === 0) {
                    return options.locale;
                }

                if (!moment.localeData(locale)) {
                    throw new TypeError('locale() locale ' + locale + ' is not loaded from moment locales!');
                }

                options.locale = locale;
                date.locale(options.locale);
                viewDate.locale(options.locale);
                picker.format(options.format); // re-evaluate format variable in case options.format is not set
                if (widget) {
                    picker.hide();
                    picker.show();
                }
                return picker;
            };

            picker.useMinutes = function (useMinutes) {
                if (arguments.length === 0) {
                    return options.useMinutes;
                }

                if (typeof useMinutes !== 'boolean') {
                    throw new TypeError('useMinutes() expects a boolean parameter');
                }
                options.useMinutes = useMinutes || false;
                return picker;
            };

            picker.useSeconds = function (useSeconds) {
                if (arguments.length === 0) {
                    return options.useSeconds;
                }

                if (typeof useSeconds !== 'boolean') {
                    throw new TypeError('useSeconds() expects a boolean parameter');
                }
                options.useSeconds = useSeconds;
                return picker;
            };

            picker.useCurrent = function (useCurrent) {
                if (arguments.length === 0) {
                    return options.useCurrent;
                }

                if ((typeof useCurrent !== 'boolean') && (typeof useCurrent !== 'string')) {
                    throw new TypeError('useCurrent() expects a boolean parameter');
                }
                options.useCurrent = useCurrent;
                return picker;
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
                return picker;
            };

            picker.pickDate = function (pickDate) {
                if (arguments.length === 0) {
                    return options.pickDate;
                }

                if (typeof pickDate !== 'boolean') {
                    throw new TypeError('pickDate() expects a boolean parameter');
                }
                if (!(options.pickTime || pickDate)) {
                    throw new Error('Must choose at least one picker');
                }

                options.pickDate = pickDate;

                if (component) {
                    component.find('span').addClass((options.pickDate ? options.icons.date : options.icons.time));
                }

                picker.format(options.format); // re-evaluate format variable in case options.format is not set

                if (widget) {
                    picker.hide();
                    picker.show();
                }
                return picker;
            };

            picker.pickTime = function (pickTime) {
                if (arguments.length === 0) {
                    return options.pickTime;
                }

                if (typeof pickTime !== 'boolean') {
                    throw new TypeError('pickTime() expects a boolean parameter');
                }
                if (!(pickTime || options.pickDate)) {
                    throw new Error('Must choose at least one picker');
                }
                options.pickTime = pickTime;

                if (component) {
                    component.find('span').addClass((options.pickDate ? options.icons.date : options.icons.time));
                }

                picker.format(options.format); // re-evaluate format variable in case options.format is not set

                if (widget) {
                    picker.hide();
                    picker.show();
                }
                return picker;
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
                return picker;
            };

            picker.collapse = function (collapse) {
                if (arguments.length === 0) {
                    return options.collapse;
                }

                if (typeof collapse !== 'boolean') {
                    throw new TypeError('collapse() expects a boolean parameter');
                }
                if (options.collapse === collapse) {
                    return picker;
                }
                options.collapse = collapse;
                if (widget) {
                    picker.hide();
                    picker.show();
                }
                return picker;
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
                return picker;
            };

            picker.useStrict = function (useStrict) {
                if (arguments.length === 0) {
                    return options.useStrict;
                }

                if (typeof useStrict !== 'boolean') {
                    throw new TypeError('useStrict() expects a boolean parameter');
                }
                options.useStrict = useStrict;
                return picker;
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
                return picker;
            };

            picker.widgetParent = function (widgetParent) {
                if (arguments.length === 0) {
                    return options.widgetParent;
                }

                if ((typeof widgetParent !== 'string') && ((typeof widgetParent !== 'boolean') && (widgetParent !== false))) {
                    throw new TypeError('widgetParent() expects a sting or boolean:false variable ' + widgetParent);
                }

                options.widgetParent = widgetParent;
                return picker;
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
                return picker;
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
                return picker;
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
                return picker;
            };

            picker.calendarWeeks = function (showCalendarWeeks) {
                if (arguments.length === 0) {
                    return options.calendarWeeks;
                }

                if (typeof showCalendarWeeks !== 'boolean') {
                    throw new TypeError('calendarWeeks() expects parameter to be a boolean value');
                }

                options.calendarWeeks = showCalendarWeeks;
                update();
                return picker;
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
                return picker;
            };

            picker.showTodayButton = function (showTodayButton) {
                if (arguments.length === 0) {
                    return options.showTodayButton;
                }

                if (typeof showTodayButton !== 'boolean') {
                    throw new TypeError('showTodayButton() expects a boolean parameter');
                }

                options.showTodayButton = showTodayButton;
                if (widget) {
                    picker.hide();
                    picker.show();
                }
                return picker;
            };

            picker.showClear = function (showClear) {
                if (arguments.length === 0) {
                    return options.showClear;
                }

                if (typeof showClear !== 'boolean') {
                    throw new TypeError('showClear() expects a boolean parameter');
                }

                options.showClear = showClear;
                if (widget) {
                    picker.hide();
                    picker.show();
                }
                return picker;
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
                // create a private copy of the defaults object
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
        minDate: false,
        maxDate: false,
        showToday: true,
        collapse: true,
        locale: moment.locale(),
        defaultDate: false,
        disabledDates: false,
        enabledDates: false,
        icons: {
            time :    'glyphicon glyphicon-time',
            date :    'glyphicon glyphicon-calendar',
            up   :    'glyphicon glyphicon-chevron-up',
            down :    'glyphicon glyphicon-chevron-down',
            previous: 'glyphicon glyphicon-chevron-left',
            next :    'glyphicon glyphicon-chevron-right',
            today:    'glyphicon glyphicon-screenshot',
            clear:    'glyphicon glyphicon-trash'
        },
        useStrict: false,
        direction: 'auto',
        sideBySide: false,
        daysOfWeekDisabled: [],
        widgetParent: false,
        calendarWeeks: false,
        minViewMode: 'days',
        viewMode: 'days',
        orientation: 'right',
        showTodayButton: false,
        showClear: false
    };
}));
