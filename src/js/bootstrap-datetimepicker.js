/**
 * version 2.1.11
 * @license
 * =========================================================
 * bootstrap-datetimepicker.js
 * http://www.eyecon.ro/bootstrap-datepicker
 * =========================================================
 * Copyright 2012 Stefan Petre
 *
 * Contributions:
 * - updated for Bootstrap v3 by Jonathan Peterson (@Eonasdan) and (almost)
 *    completely rewritten to use Momentjs
 * - based on tarruda's bootstrap-datepicker
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =========================================================
 */
; (function (factory) {
    if (typeof define === 'function' && define.amd) {
    // AMD is used - Register as an anonymous module.
        define(['jquery', 'moment'], factory);
    } else {
        // AMD is not used - Attempt to fetch dependencies from scope.
        if(!jQuery){
            throw 'bootstrap-datetimepicker requires jQuery to be loaded first';
        }else if(!moment) {
            throw 'bootstrap-datetimepicker requires moment.js to be loaded first';
        }else{
            factory(jQuery, moment);
        }
    }
}(function ($, moment) {
    if (typeof moment === 'undefined') { 
        alert("momentjs is requried");
        throw new Error('momentjs is requried');
    };
	
    var dpgId = 0,
        
    pMoment = moment,

// ReSharper disable once InconsistentNaming
    DateTimePicker = function (element, options) {
        var defaults = {
            pickDate: true,
            pickTime: true,
            startDate: new pMoment({ y: 1970 }),
            endDate: new pMoment().add(50, "y"),
            collapse: true,
            language: "en",
            defaultDate: "",
            disabledDates: [],
            enabledDates: false, // array
            icons: {},
            useStrict: false
        },

		icons = {
		    time: 'glyphicon glyphicon-time',
		    date: 'glyphicon glyphicon-calendar',
		    up: 'glyphicon glyphicon-chevron-up',
		    down: 'glyphicon glyphicon-chevron-down'
		},

        picker = this,

        init = function () {

            var icon = false, i, dDate, longDateFormat;
            picker.options = $.extend({}, defaults, options);
            picker.options.icons = $.extend({}, icons, picker.options.icons);

            if (!(picker.options.pickTime || picker.options.pickDate))
                throw new Error('Must choose at least one picker');

            picker.id = dpgId++;
            pMoment.lang(picker.options.language);
            picker.date = pMoment();
            picker.element = $(element);
            picker.unset = false;
            picker.isInput = picker.element.is('input');
            picker.component = false;

            if (picker.element.hasClass('input-group')) {
                if (picker.element.find('.datepickerbutton').size() == 0) {//in case there is more then one 'input-group-addon` #48
                    picker.component = picker.element.find("[class^='input-group-']");
                }
                else {
                    picker.component = picker.element.find('.datepickerbutton');
                }
            }
            picker.format = picker.options.format;

            longDateFormat = pMoment()._lang._longDateFormat;

            if (!picker.format) {
                if (picker.isInput) picker.format = picker.element.data('format');
                else picker.format = picker.element.find('input').data('format');
                if (!picker.format) {
                    picker.format = (picker.options.pickDate ? longDateFormat.L : '');
                    if (picker.options.pickDate && picker.options.pickTime) picker.format += ' ';
                    picker.format += (picker.options.pickTime ? longDateFormat.LT : '');
                }
            }

            picker.use24hours = picker.format.toLowerCase().indexOf("a") < 1;

            if (picker.component) icon = picker.component.find('span');

            if (picker.options.pickTime) {
                if (icon) icon.addClass(picker.options.icons.time);
            }
            if (picker.options.pickDate) {
                if (icon) {
                    icon.removeClass(picker.options.icons.time);
                    icon.addClass(picker.options.icons.date);
                }
            }

            picker.widget = $(getTemplate(picker.options.pickDate, picker.options.pickTime, picker.options.collapse)).appendTo('body');
            picker.minViewMode = picker.options.minViewMode || picker.element.data('date-minviewmode') || 0;
            if (typeof picker.minViewMode === 'string') {
                switch (picker.minViewMode) {
                    case 'months':
                        picker.minViewMode = 1;
                        break;
                    case 'years':
                        picker.minViewMode = 2;
                        break;
                    default:
                        picker.minViewMode = 0;
                        break;
                }
            }
            picker.viewMode = picker.options.viewMode || picker.element.data('date-viewmode') || 0;
            if (typeof picker.viewMode === 'string') {
                switch (picker.viewMode) {
                    case 'months':
                        picker.viewMode = 1;
                        break;
                    case 'years':
                        picker.viewMode = 2;
                        break;
                    default:
                        picker.viewMode = 0;
                        break;
                }
            }

            for (i = 0; i < picker.options.disabledDates.length; i++) {
                dDate = picker.options.disabledDates[i];
                dDate = pMoment(dDate);
                //if this is not a valid date then set it to the startdate -1 day so it's disabled.
                if (!dDate.isValid()) dDate = pMoment(picker.options.startDate).subtract(1, "day");
                picker.options.disabledDates[i] = dDate.format("L");
            }

            for (i = 0; i < picker.options.enabledDates.length; i++) {
                dDate = picker.options.enabledDates[i];
                dDate = pMoment(dDate);
                //if this is not a valid date then set it to the startdate -1 day so it's disabled.
                if (!dDate.isValid()) dDate = pMoment(picker.options.startDate).subtract(1, "day");
                picker.options.enabledDates[i] = dDate.format("L");
            }

            picker.startViewMode = picker.viewMode;
            picker.setStartDate(picker.options.startDate || picker.element.data('date-startdate'));
            picker.setEndDate(picker.options.endDate || picker.element.data('date-enddate'));
            fillDow();
            fillMonths();
            fillHours();
            fillMinutes();
            update();
            showMode();
            attachDatePickerEvents();
            if (picker.options.defaultDate !== "") picker.setValue(picker.options.defaultDate);
        },

        place = function () {
            var position = 'absolute',
            offset = picker.component ? picker.component.offset() : picker.element.offset(), $window = $(window);
            picker.width = picker.component ? picker.component.outerWidth() : picker.element.outerWidth();
            offset.top = offset.top + picker.element.outerHeight();

            //if (offset.top + picker.widget.height() > $window.height()) offset.top = offset.top - (picker.widget.height() + picker.height + 10);

            if (picker.options.width !== undefined) {
                picker.widget.width(picker.options.width);
            }

            if (picker.options.orientation === 'left') {
                picker.widget.addClass('left-oriented');
                offset.left = offset.left - picker.widget.width() + 20;
            }

            if (isInFixed()) {
                position = 'fixed';
                offset.top -= $window.scrollTop();
                offset.left -= $window.scrollLeft();
            }

            if ($window.width() < offset.left + picker.widget.outerWidth()) {
                offset.right = $window.width() - offset.left - picker.width;
                offset.left = 'auto';
                picker.widget.addClass('pull-right');
            } else {
                offset.right = 'auto';
                picker.widget.removeClass('pull-right');
            }

            picker.widget.css({
                position: position,
                top: offset.top,
                left: offset.left,
                right: offset.right
            });
        },

        notifyChange = function (oldDate) {
            picker.element.trigger({
                type: 'change.dp',
                date: picker.getDate(),
                oldDate: oldDate
            });
        },

		notifyError = function (date) {
		    picker.element.trigger({
		        type: 'error.dp',
		        date: date
		    });
		},

        update = function (newDate) {
            pMoment.lang(picker.options.language);
            var dateStr = newDate;
            if (!dateStr) {
                if (picker.isInput) {
                    dateStr = picker.element.val();
                } else {
                    dateStr = picker.element.find('input').val();
                }
                if (dateStr) picker.date = pMoment(dateStr, picker.format, picker.options.useStrict);
                if (!picker.date) picker.date = pMoment();
            }
            picker.viewDate = pMoment(picker.date).startOf("month");
            fillDate();
            fillTime();
        },

		fillDow = function () {
		    pMoment.lang(picker.options.language);
		    var html = $('<tr>'), weekdaysMin = pMoment.weekdaysMin(), i;
		    if (pMoment()._lang._week.dow == 0) { // starts on Sunday
		        for(i = 0; i < 7; i++) {
		            html.append('<th class="dow">' + weekdaysMin[i] + '</th>');
		        }
		    } else {
		        for (i = 1; i < 8; i++) {
		            if (i == 7) {
		                html.append('<th class="dow">' + weekdaysMin[0] + '</th>');
		            } else {
		                html.append('<th class="dow">' + weekdaysMin[i] + '</th>');
		            }
		        }
		    }
		    picker.widget.find('.datepicker-days thead').append(html);
		},

        fillMonths = function () {
            pMoment.lang(picker.options.language);
            var html = '', i = 0, monthsShort = pMoment.monthsShort();
            while (i < 12) {
                html += '<span class="month">' + monthsShort[i++] + '</span>';
            }
            picker.widget.find('.datepicker-months td').append(html);
        },

        fillDate = function () {
            pMoment.lang(picker.options.language);
            var year = picker.viewDate.year(),
                month = picker.viewDate.month(),
                startYear = picker.options.startDate.year(),
                startMonth = picker.options.startDate.month(),
                endYear = picker.options.endDate.year(),
                endMonth = picker.options.endDate.month(),
                prevMonth, nextMonth, html = [], row, clsName, i, days, yearCont, currentYear, months = pMoment.months();

            picker.widget.find('.datepicker-days').find('.disabled').removeClass('disabled');
            picker.widget.find('.datepicker-months').find('.disabled').removeClass('disabled');
            picker.widget.find('.datepicker-years').find('.disabled').removeClass('disabled');

            picker.widget.find('.datepicker-days th:eq(1)').text(
                months[month] + ' ' + year);

            prevMonth = pMoment(picker.viewDate).subtract("months", 1);
            days = prevMonth.daysInMonth();
            prevMonth.date(days).startOf('week');
            if ((year == startYear && month <= startMonth) || year < startYear) {
                picker.widget.find('.datepicker-days th:eq(0)').addClass('disabled');
            }
            if ((year == endYear && month >= endMonth) || year > endYear) {
                picker.widget.find('.datepicker-days th:eq(2)').addClass('disabled');
            }

            nextMonth = pMoment(prevMonth).add(42, "d");
            while (prevMonth.isBefore(nextMonth)) {
                if (prevMonth.weekday() === pMoment().startOf('week').weekday()) {
                    row = $('<tr>');
                    html.push(row);
                }
                clsName = '';
                if (prevMonth.year() < year || (prevMonth.year() == year && prevMonth.month() < month)) {
                    clsName += ' old';
                } else if (prevMonth.year() > year || (prevMonth.year() == year && prevMonth.month() > month)) {
                    clsName += ' new';
                }
                if (prevMonth.isSame(pMoment({ y: picker.date.year(), M: picker.date.month(), d: picker.date.date() }))) {
                    clsName += ' active';
                }
                if ((pMoment(prevMonth).add(1, "d") <= picker.options.startDate) || (prevMonth > picker.options.endDate) || isInDisableDates(prevMonth) || !isInEnableDates(prevMonth)) {
                    clsName += ' disabled';
                }
                row.append('<td class="day' + clsName + '">' + prevMonth.date() + '</td>');
                prevMonth.add(1, "d");
            }
            picker.widget.find('.datepicker-days tbody').empty().append(html);
            currentYear = pMoment().year(), months = picker.widget.find('.datepicker-months')
				.find('th:eq(1)').text(year).end().find('span').removeClass('active');
            if (currentYear === year) {
                months.eq(pMoment().month()).addClass('active');
            }
            if (currentYear - 1 < startYear) {
                picker.widget.find('.datepicker-months th:eq(0)').addClass('disabled');
            }
            if (currentYear + 1 > endYear) {
                picker.widget.find('.datepicker-months th:eq(2)').addClass('disabled');
            }
            for (i = 0; i < 12; i++) {
                if ((year == startYear && startMonth > i) || (year < startYear)) {
                    $(months[i]).addClass('disabled');
                } else if ((year == endYear && endMonth < i) || (year > endYear)) {
                    $(months[i]).addClass('disabled');
                }
            }

            html = '';
            year = parseInt(year / 10, 10) * 10;
            yearCont = picker.widget.find('.datepicker-years').find(
                'th:eq(1)').text(year + '-' + (year + 9)).end().find('td');
            picker.widget.find('.datepicker-years').find('th').removeClass('disabled');
            if (startYear > year) {
                picker.widget.find('.datepicker-years').find('th:eq(0)').addClass('disabled');
            }
            if (endYear < year + 9) {
                picker.widget.find('.datepicker-years').find('th:eq(2)').addClass('disabled');
            }
            year -= 1;
            for (i = -1; i < 11; i++) {
                html += '<span class="year' + (i === -1 || i === 10 ? ' old' : '') + (currentYear === year ? ' active' : '') + ((year < startYear || year > endYear) ? ' disabled' : '') + '">' + year + '</span>';
                year += 1;
            }
            yearCont.html(html);
        },

        fillHours = function () {
            pMoment.lang(picker.options.language);
            var table = picker.widget.find('.timepicker .timepicker-hours table'), html = '', current, i, j;
            table.parent().hide();
            if (picker.use24hours) {
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
        },

        fillMinutes = function () {
            var table = picker.widget.find('.timepicker .timepicker-minutes table'), html = '', current = 0, i, j;
            table.parent().hide();
            for (i = 0; i < 5; i++) {
                html += '<tr>';
                for (j = 0; j < 4; j += 1) {
                    html += '<td class="minute">' + padLeft(current.toString()) + '</td>';
                    current += 3;
                }
                html += '</tr>';
            }
            table.html(html);
        },

        fillTime = function () {
            if (!picker.date) return;
            var timeComponents = picker.widget.find('.timepicker span[data-time-component]'),
            hour = picker.date.hours(),
            period = 'AM';
            if (!picker.use24hours) {
                if (hour >= 12) period = 'PM';
                if (hour === 0) hour = 12;
                else if (hour != 12) hour = hour % 12;
                picker.widget.find('.timepicker [data-action=togglePeriod]').text(period);
            }
            timeComponents.filter('[data-time-component=hours]').text(padLeft(hour));
            timeComponents.filter('[data-time-component=minutes]').text(padLeft(picker.date.minutes()));
        },

        click = function (e) {
            e.stopPropagation();
            e.preventDefault();
            picker.unset = false;
            var target = $(e.target).closest('span, td, th'), month, year, step, day, oldDate = picker.date;
            if (target.length === 1) {
                if (!target.is('.disabled')) {
                    switch (target[0].nodeName.toLowerCase()) {
                        case 'th':
                            switch (target[0].className) {
                                case 'switch':
                                    showMode(1);
                                    break;
                                case 'prev':
                                case 'next':
                                    step = dpGlobal.modes[picker.viewMode].navStep;
                                    if (target[0].className === 'prev') step = step * -1;
                                    picker.viewDate.add(step, dpGlobal.modes[picker.viewMode].navFnc);
                                    fillDate();
                                    break;
                            }
                            break;
                        case 'span':
                            if (target.is('.month')) {
                                month = target.parent().find('span').index(target);
                                picker.viewDate.month(month);
                            } else {
                                year = parseInt(target.text(), 10) || 0;
                                picker.viewDate.year(year);
                            }
                            if (picker.viewMode !== 0) {
                                picker.date = pMoment({
                                    y: picker.viewDate.year(),
                                    M: picker.viewDate.month(),
                                    d: picker.viewDate.date(),
                                    h: picker.date.hours(),
                                    m: picker.date.minutes()
                                });
                                notifyChange(oldDate);
                            }
                            showMode(-1);
                            fillDate();
                            break;
                        case 'td':
                            if (target.is('.day')) {
                                day = parseInt(target.text(), 10) || 1;
                                month = picker.viewDate.month();
                                year = picker.viewDate.year();
                                if (target.is('.old')) {
                                    if (month === 0) {
                                        month = 11;
                                        year -= 1;
                                    } else {
                                        month -= 1;
                                    }
                                } else if (target.is('.new')) {
                                    if (month == 11) {
                                        month = 0;
                                        year += 1;
                                    } else {
                                        month += 1;
                                    }
                                }
                                picker.date = pMoment({
                                    y: year,
                                    M: month,
                                    d: day,
                                    h: picker.date.hours(),
                                    m: picker.date.minutes()
                                }
                                );
                                picker.viewDate = pMoment({
                                    y: year, M: month, d: Math.min(28, day)
                                });
                                fillDate();
                                set();
                                notifyChange(oldDate);
                            }
                            break;
                    }
                }
            }
        },

		actions = {
		    incrementHours: function () {
		        checkDate("add", "hours");
		    },

		    incrementMinutes: function () {
		        checkDate("add", "minutes");
		    },

		    decrementHours: function () {
		        checkDate("subtract", "hours");
		    },

		    decrementMinutes: function () {
		        checkDate("subtract", "minutes");
		    },

		    togglePeriod: function () {
		        var hour = picker.date.hours();
		        if (hour >= 12) hour -= 12;
		        else hour += 12;
		        picker.date.hours(hour);
		    },

		    showPicker: function () {
		        picker.widget.find('.timepicker > div:not(.timepicker-picker)').hide();
		        picker.widget.find('.timepicker .timepicker-picker').show();
		    },

		    showHours: function () {
		        picker.widget.find('.timepicker .timepicker-picker').hide();
		        picker.widget.find('.timepicker .timepicker-hours').show();
		    },

		    showMinutes: function () {
		        picker.widget.find('.timepicker .timepicker-picker').hide();
		        picker.widget.find('.timepicker .timepicker-minutes').show();
		    },

		    selectHour: function (e) {
		        picker.date.hours(parseInt($(e.target).text(), 10));
		        actions.showPicker.call(picker);
		    },

		    selectMinute: function (e) {
		        picker.date.minutes(parseInt($(e.target).text(), 10));
		        actions.showPicker.call(picker);
		    }
		},

	    doAction = function (e) {
	        var action = $(e.currentTarget).data('action'), rv = actions[action].apply(picker, arguments), oldDate = picker.date;
	        stopEvent(e);
	        if (!picker.date) picker.date = pMoment({ y: 1970 });
	        set();
	        fillTime();
	        notifyChange(oldDate);
	        return rv;
	    },

        stopEvent = function (e) {
            e.stopPropagation();
            e.preventDefault();
        },

        change = function (e) {
            pMoment.lang(picker.options.language);
            var input = $(e.target), oldDate = picker.date, d = pMoment(input.val(), picker.format, picker.options.useStrict);
            if (d.isValid()) {
                update();
                picker.setValue(d);
                notifyChange(oldDate);
                set();
            }
            else {
                picker.viewDate = oldDate;
                //picker.setValue(""); // unset the date when the input is erased
                notifyChange(oldDate);
                notifyError(d);
                picker.unset = true;
                input.val('');
            }
        },

        showMode = function (dir) {
            if (dir) {
                picker.viewMode = Math.max(picker.minViewMode, Math.min(2, picker.viewMode + dir));
            }

            picker.widget.find('.datepicker > div').hide().filter('.datepicker-' + dpGlobal.modes[picker.viewMode].clsName).show();
        },

        attachDatePickerEvents = function () {
            var $this, $parent, expanded, closed, collapseData;
            picker.widget.on('click', '.datepicker *', $.proxy(click, this)); // this handles date picker clicks
            picker.widget.on('click', '[data-action]', $.proxy(doAction, this)); // this handles time picker clicks
            picker.widget.on('mousedown', $.proxy(stopEvent, this));
            if (picker.options.pickDate && picker.options.pickTime) {
                picker.widget.on('click.togglePicker', '.accordion-toggle', function (e) {
                    e.stopPropagation();
                    $this = $(this);
                    $parent = $this.closest('ul');
                    expanded = $parent.find('.in');
                    closed = $parent.find('.collapse:not(.in)');

                    if (expanded && expanded.length) {
                        collapseData = expanded.data('collapse');
                        if (collapseData && collapseData.transitioning) return;
                        expanded.collapse('hide');
                        closed.collapse('show');
                        $this.find('span').toggleClass(picker.options.icons.time + ' ' + picker.options.icons.date);
                        picker.element.find('.input-group-addon span').toggleClass(picker.options.icons.time + ' ' + picker.options.icons.date);
                    }
                });
            }
            if (picker.isInput) {
                picker.element.on({
                    'focus': $.proxy(picker.show, this),
                    'change': $.proxy(change, this),
                    'blur': $.proxy(picker.hide, this)
                });
            } else {
                picker.element.on({
                    'change': $.proxy(change, this)
                }, 'input');
                if (picker.component) {
                    picker.component.on('click', $.proxy(picker.show, this));
                } else {
                    picker.element.on('click', $.proxy(picker.show, this));
                }
            }
        },

        attachDatePickerGlobalEvents = function () {
            $(window).on(
                'resize.datetimepicker' + picker.id, $.proxy(place, this));
            if (!picker.isInput) {
                $(document).on(
                    'mousedown.datetimepicker' + picker.id, $.proxy(picker.hide, this));
            }
        },

        detachDatePickerEvents = function () {
            picker.widget.off('click', '.datepicker *', picker.click);
            picker.widget.off('click', '[data-action]');
            picker.widget.off('mousedown', picker.stopEvent);
            if (picker.options.pickDate && picker.options.pickTime) {
                picker.widget.off('click.togglePicker');
            }
            if (picker.isInput) {
                picker.element.off({
                    'focus': picker.show,
                    'change': picker.change
                });
            } else {
                picker.element.off({
                    'change': picker.change
                }, 'input');
                if (picker.component) {
                    picker.component.off('click', picker.show);
                } else {
                    picker.element.off('click', picker.show);
                }
            }
        },

        detachDatePickerGlobalEvents = function () {
            $(window).off('resize.datetimepicker' + picker.id);
            if (!picker.isInput) {
                $(document).off('mousedown.datetimepicker' + picker.id);
            }
        },

        isInFixed = function () {
            if (picker.element) {
                var parents = picker.element.parents(), inFixed = false, i;
                for (i = 0; i < parents.length; i++) {
                    if ($(parents[i]).css('position') == 'fixed') {
                        inFixed = true;
                        break;
                    }
                }
                ;
                return inFixed;
            } else {
                return false;
            }
        },

        set = function () {
            pMoment.lang(picker.options.language);
            var formatted = '', input;
            if (!picker.unset) formatted = pMoment(picker.date).format(picker.format);
            if (!picker.isInput) {
                if (picker.component) {
                    input = picker.element.find('input');
                    input.val(formatted);
                }
                picker.element.data('date', formatted);
            } else {
                picker.element.val(formatted);
            }
            if (!picker.options.pickTime) picker.hide();
        },

		checkDate = function (direction, unit) {
		    pMoment.lang(picker.options.language);
		    var newDate;
		    if (direction == "add") {
		        newDate = pMoment(picker.date);
		        if (newDate.hours() == 23) newDate.add(1, unit);
		        newDate.add(1, unit);
		    }
		    else {
		        newDate = pMoment(picker.date).subtract(1, unit);
		    }
		    if (newDate.isAfter(picker.options.endDate) || newDate.subtract(1, unit).isBefore(picker.options.startDate) || isInDisableDates(newDate) || !isInEnableDates(newDate)) {
		        notifyError(newDate.format(picker.format));
		        return;
		    }

		    if (direction == "add") {
		        picker.date.add(1, unit);
		    }
		    else {
		        picker.date.subtract(1, unit);
		    }
		},

		isInDisableDates = function (date) {
		    pMoment.lang(picker.options.language);
		    var disabled = picker.options.disabledDates, i;
		    for (i in disabled) {
		        if (disabled[i] == pMoment(date).format("L")) {
		            return true;
		        }
		    }
		    return false;
		},

        isInEnableDates = function (date) {
            pMoment.lang(picker.options.language);
            var enabled = picker.options.enabledDates, i;
            if (enabled.length) {
                for (i in enabled) {
                    if (enabled[i] == pMoment(date).format("L")) {
                        return true;
                    }
                }
                return false;
            }
            return enabled === false ? true : false;
        },

        padLeft = function (string) {
            string = string.toString();
            if (string.length >= 2) return string;
            else return '0' + string;
        },

        getTemplate = function (pickDate, pickTime, collapse) {
            if (pickDate && pickTime) {
                return (
                    '<div class="bootstrap-datetimepicker-widget dropdown-menu" style="z-index:9999 !important;">' +
                        '<ul class="list-unstyled">' +
							'<li' + (collapse ? ' class="collapse in"' : '') + '>' +
								'<div class="datepicker">' + dpGlobal.template + '</div>' +
							'</li>' +
							'<li class="picker-switch accordion-toggle"><a class="btn" style="width:100%"><span class="' + picker.options.icons.time + '"></span></a></li>' +
							'<li' + (collapse ? ' class="collapse"' : '') + '>' +
								'<div class="timepicker">' + tpGlobal.getTemplate() + '</div>' +
							'</li>' +
                        '</ul>' +
                    '</div>'
                );
            } else if (pickTime) {
                return (
                    '<div class="bootstrap-datetimepicker-widget dropdown-menu">' +
                        '<div class="timepicker">' + tpGlobal.getTemplate() + '</div>' +
                    '</div>'
                );
            } else {
                return (
                    '<div class="bootstrap-datetimepicker-widget dropdown-menu">' +
                        '<div class="datepicker">' + dpGlobal.template + '</div>' +
                    '</div>'
                );
            }
        },

		dpGlobal = {
		    modes: [
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
                }],
		    headTemplate:
                    '<thead>' +
						'<tr>' +
							'<th class="prev">&lsaquo;</th><th colspan="5" class="switch"></th><th class="next">&rsaquo;</th>' +
						'</tr>' +
                    '</thead>',
		    contTemplate:
        '<tbody><tr><td colspan="7"></td></tr></tbody>'
		},

        tpGlobal = {
            hourTemplate: '<span data-action="showHours" data-time-component="hours" class="timepicker-hour"></span>',
            minuteTemplate: '<span data-action="showMinutes" data-time-component="minutes" class="timepicker-minute"></span>'
        };

        dpGlobal.template =
            '<div class="datepicker-days">' +
                '<table class="table-condensed">' + dpGlobal.headTemplate + '<tbody></tbody></table>' +
            '</div>' +
            '<div class="datepicker-months">' +
                '<table class="table-condensed">' + dpGlobal.headTemplate + dpGlobal.contTemplate + '</table>' +
            '</div>' +
            '<div class="datepicker-years">' +
				'<table class="table-condensed">' + dpGlobal.headTemplate + dpGlobal.contTemplate + '</table>' +
            '</div>';

        tpGlobal.getTemplate = function () {
            return (
                '<div class="timepicker-picker">' +
                    '<table class="table-condensed">' +
						'<tr>' +
							'<td><a href="#" class="btn" data-action="incrementHours"><span class="' + picker.options.icons.up + '"></span></a></td>' +
							'<td class="separator"></td>' +
							'<td><a href="#" class="btn" data-action="incrementMinutes"><span class="' + picker.options.icons.up + '"></span></a></td>' +
							(!picker.use24hours ? '<td class="separator"></td>' : '') +
						'</tr>' +
						'<tr>' +
							'<td>' + tpGlobal.hourTemplate + '</td> ' +
							'<td class="separator">:</td>' +
							'<td>' + tpGlobal.minuteTemplate + '</td> ' +
							(!picker.use24hours ? '<td class="separator"></td>' +
							'<td><button type="button" class="btn btn-primary" data-action="togglePeriod"></button></td>' : '') +
						'</tr>' +
						'<tr>' +
							'<td><a href="#" class="btn" data-action="decrementHours"><span class="' + picker.options.icons.down + '"></span></a></td>' +
							'<td class="separator"></td>' +
							'<td><a href="#" class="btn" data-action="decrementMinutes"><span class="' + picker.options.icons.down + '"></span></a></td>' +
							(!picker.use24hours ? '<td class="separator"></td>' : '') +
						'</tr>' +
                    '</table>' +
                '</div>' +
                '<div class="timepicker-hours" data-action="selectHour">' +
                    '<table class="table-condensed"></table>' +
                '</div>' +
                '<div class="timepicker-minutes" data-action="selectMinute">' +
                    '<table class="table-condensed"></table>' +
                '</div>'
            );
        };

        picker.destroy = function () {
            detachDatePickerEvents();
            detachDatePickerGlobalEvents();
            picker.widget.remove();
            picker.element.removeData('DateTimePicker');
            if (picker.component)
                picker.component.removeData('DateTimePicker');
        };

        picker.show = function (e) {
            picker.widget.show();
            picker.height = picker.component ? picker.component.outerHeight() : picker.element.outerHeight();
            place();
            picker.element.trigger({
                type: 'show.dp',
                date: picker.date
            });
            attachDatePickerGlobalEvents();
            if (e) {
                stopEvent(e);
            }
        },

        picker.disable = function () {
            picker.element.find('input').prop('disabled', true);
            detachDatePickerEvents();
        },

        picker.enable = function () {
            picker.element.find('input').prop('disabled', false);
            attachDatePickerEvents();
        },

        picker.hide = function () {
            // Ignore event if in the middle of a picker transition
            var collapse = picker.widget.find('.collapse'), i, collapseData;
            for (i = 0; i < collapse.length; i++) {
                collapseData = collapse.eq(i).data('collapse');
                if (collapseData && collapseData.transitioning)
                    return;
            }
            picker.widget.hide();
            picker.viewMode = picker.startViewMode;
            showMode();
            picker.element.trigger({
                type: 'hide.dp',
                date: picker.date
            });
            detachDatePickerGlobalEvents();
        },

        picker.setValue = function (newDate) {
            pMoment.lang(picker.options.language);
            if (!newDate) {
                picker.unset = true;
            } else {
                picker.unset = false;
            }
            if (!pMoment.isMoment(newDate)) newDate = pMoment(newDate);
            if (newDate.isValid()) {
                picker.date = newDate;
                set();
                picker.viewDate = pMoment({ y: picker.date.year(), M: picker.date.month() });
                fillDate();
                fillTime();
            }
            else {
                notifyError(newDate);
            }
        },

        picker.getDate = function () {
            if (picker.unset) return null;
            return picker.date;
        },

        picker.setDate = function (date) {
            if (!date) picker.setValue(null);
            else picker.setValue(date);
        },

        picker.setEnabledDates = function (dates) {
            if (!dates) picker.options.enabledDates = false;
            else picker.options.enabledDates = dates;
            if (picker.viewDate) update();
        },

        picker.setEndDate = function (date) {
            picker.options.endDate = pMoment(date);
            if (!picker.options.endDate.isValid()) {
                picker.options.endDate = pMoment().add(50, "y");
            }
            if (picker.viewDate) update();
        },

        picker.setStartDate = function (date) {
            picker.options.startDate = pMoment(date);
            if (!picker.options.startDate.isValid()) {
                picker.options.startDate = pMoment({ y: 1970 });
            }
            if (picker.viewDate) update();
        };

        init();
    };

    $.fn.datetimepicker = function (options) {
        return this.each(function () {
            var $this = $(this), data = $this.data('DateTimePicker');
            if (!data) $this.data('DateTimePicker', new DateTimePicker(this, options));
        });
    };
}));
