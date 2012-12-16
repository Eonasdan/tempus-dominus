/**
 * @license
 * =========================================================
 * bootstrap-datetimepicker.js 
 * http://www.eyecon.ro/bootstrap-datepicker
 * =========================================================
 * Copyright 2012 Stefan Petre
 *
 * Contributions:
 *  - Andrew Rowls
 *  - Thiago de Arruda
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
 
(function($) {
	
	// Picker object
	
	var DateTimePicker = function(element, options) {
		this.id = dpgId++;
		this.initDatePicker(element, options);
	};
	
	DateTimePicker.prototype = {
		constructor: DateTimePicker,

		initDatePicker: function(element, options) {
			this.$element = $(element);
			this.format = options.format || this.$element.data('date-format') || 'mm/dd/yyyy';
			this.language = options.language in dates ? options.language : 'en'
			this.parser = buildDateParser(this.format, this);
			this.picker = $(DPGlobal.template).appendTo('body');
			this.isInput = this.$element.is('input');
			this.component = this.$element.is('.date') ? this.$element.find('.add-on') : false;

			this.minViewMode = options.minViewMode||this.$element.data('date-minviewmode')||0;
			if (typeof this.minViewMode === 'string') {
				switch (this.minViewMode) {
					case 'months':
						this.minViewMode = 1;
					break;
					case 'years':
						this.minViewMode = 2;
					break;
					default:
						this.minViewMode = 0;
					break;
				}
			}
			this.viewMode = options.viewMode||this.$element.data('date-viewmode')||0;
			if (typeof this.viewMode === 'string') {
				switch (this.viewMode) {
					case 'months':
						this.viewMode = 1;
					break;
					case 'years':
						this.viewMode = 2;
					break;
					default:
						this.viewMode = 0;
					break;
				}
			}
			this.startViewMode = this.viewMode;
			this.weekStart = options.weekStart||this.$element.data('date-weekstart')||0;
			this.weekEnd = this.weekStart === 0 ? 6 : this.weekStart - 1;
			this.fillDow();
			this.fillMonths();
			this.update();
			this.showMode();
			this._attachDatePickerEvents();
		},

		initTimePicker: function() {
		
		},

		show: function(e) {
			this.picker.show();
			this.height = this.component ? this.component.outerHeight() : this.$element.outerHeight();
			this.place();
			this.$element.trigger({
				type: 'show',
				date: this.date
			});
			this._attachDatePickerWidgetEvents();
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}
		},
		
		hide: function() {
			this.picker.hide();
			this.viewMode = this.startViewMode;
			this.showMode();
			this.set();
			this.$element.trigger({
				type: 'hide',
				date: this.date
			});
			this._detachDatePickerWidgetEvents();
		},
		
		set: function() {
			var formated = this.formatDate(this.date);
			if (!this.isInput) {
				if (this.component){
					this.$element.find('input').prop('value', formated);
				}
				this.$element.data('date', formated);
			} else {
				this.$element.prop('value', formated);
			}
		},
		
		setValue: function(newDate) {
			if (typeof newDate === 'string') {
				this.date = this.parseDate(newDate);
			} else {
				this.date = new Date(newDate);
			}
			this.set();
			this.viewDate = new Date(this.date.getFullYear(), this.date.getMonth(), 1, 0, 0, 0, 0);
			this.fill();
		},
		
		place: function(){
			var offset = this.component ? this.component.offset() : this.$element.offset();
			this.picker.css({
				top: offset.top + this.height,
				left: offset.left
			});
		},
		
		update: function(newDate){
			var dateStr = (typeof newDate === 'string' ?
	    				     newDate : (this.isInput ?
	    						this.$element.prop('value') : this.$element.data('date') || this.formatDate(new Date())));
			this.date = this.parseDate(dateStr);
			this.viewDate = new Date(this.date.getFullYear(), this.date.getMonth(), 1, 0, 0, 0, 0);
			this.fill();
		},
		
		fillDow: function() {
			var dowCnt = this.weekStart;
			var html = '<tr>';
			while (dowCnt < this.weekStart + 7) {
				html += '<th class="dow">' + dates[this.language].daysMin[(dowCnt++) % 7] + '</th>';
			}
			html += '</tr>';
			this.picker.find('.datepicker-days thead').append(html);
		},
		
		fillMonths: function() {
			var html = '';
			var i = 0
			while (i < 12) {
				html += '<span class="month">' + dates[this.language].monthsShort[i++] + '</span>';
			}
			this.picker.find('.datepicker-months td').append(html);
		},
		
		fill: function() {
			var d = new Date(this.viewDate),
				year = d.getFullYear(),
				month = d.getMonth(),
				currentDate = this.date.valueOf();
			this.picker.find('.datepicker-days th:eq(1)')
						.text(dates[this.language].months[month] + ' ' + year);
			var prevMonth = new Date(year, month-1, 28,0,0,0,0),
				day = DPGlobal.getDaysInMonth(prevMonth.getFullYear(), prevMonth.getMonth());
			prevMonth.setDate(day);
			prevMonth.setDate(day - (prevMonth.getDay() - this.weekStart + 7)%7);
			var nextMonth = new Date(prevMonth);
			nextMonth.setDate(nextMonth.getDate() + 42);
			nextMonth = nextMonth.valueOf();
			html = [];
			var clsName;
			while (prevMonth.valueOf() < nextMonth) {
				if (prevMonth.getDay() === this.weekStart) {
					html.push('<tr>');
				}
				clsName = '';
				if (prevMonth.getMonth() < month) {
					clsName += ' old';
				} else if (prevMonth.getMonth() > month) {
					clsName += ' new';
				}
				if (prevMonth.valueOf() === currentDate) {
					clsName += ' active';
				}
				html.push('<td class="day'+clsName+'">'+prevMonth.getDate() + '</td>');
				if (prevMonth.getDay() === this.weekEnd) {
					html.push('</tr>');
				}
				prevMonth.setDate(prevMonth.getDate()+1);
			}
			this.picker.find('.datepicker-days tbody').empty().append(html.join(''));
			var currentYear = this.date.getFullYear();
			
			var months = this.picker.find('.datepicker-months')
						.find('th:eq(1)')
							.text(year)
							.end()
						.find('span').removeClass('active');
			if (currentYear === year) {
				months.eq(this.date.getMonth()).addClass('active');
			}
			
			html = '';
			year = parseInt(year/10, 10) * 10;
			var yearCont = this.picker.find('.datepicker-years')
								.find('th:eq(1)')
									.text(year + '-' + (year + 9))
									.end()
								.find('td');
			year -= 1;
			for (var i = -1; i < 11; i++) {
				html += '<span class="year'+(i === -1 || i === 10 ? ' old' : '')+(currentYear === year ? ' active' : '')+'">'+year+'</span>';
				year += 1;
			}
			yearCont.html(html);
		},
		
		click: function(e) {
			e.stopPropagation();
			e.preventDefault();
			var target = $(e.target).closest('span, td, th');
			if (target.length === 1) {
				switch(target[0].nodeName.toLowerCase()) {
					case 'th':
						switch(target[0].className) {
							case 'switch':
								this.showMode(1);
								break;
							case 'prev':
							case 'next':
								this.viewDate['set'+DPGlobal.modes[this.viewMode].navFnc].call(
									this.viewDate,
									this.viewDate['get'+DPGlobal.modes[this.viewMode].navFnc].call(this.viewDate) + 
									DPGlobal.modes[this.viewMode].navStep * (target[0].className === 'prev' ? -1 : 1)
								);
								this.fill();
								this.set();
								break;
						}
						break;
					case 'span':
						if (target.is('.month')) {
							var month = target.parent().find('span').index(target);
							this.viewDate.setMonth(month);
						} else {
							var year = parseInt(target.text(), 10)||0;
							this.viewDate.setFullYear(year);
						}
						if (this.viewMode !== 0) {
							this.date = new Date(this.viewDate);
							this.$element.trigger({
								type: 'changeDate',
								date: this.date,
								viewMode: DPGlobal.modes[this.viewMode].clsName
							});
						}
						this.showMode(-1);
						this.fill();
						this.set();
						break;
					case 'td':
						if (target.is('.day')){
							var day = parseInt(target.text(), 10)||1;
							var month = this.viewDate.getMonth();
							if (target.is('.old')) {
								month -= 1;
							} else if (target.is('.new')) {
								month += 1;
							}
							var year = this.viewDate.getFullYear();
							this.date = new Date(year, month, day,0,0,0,0);
							this.viewDate = new Date(year, month, Math.min(28, day),0,0,0,0);
							this.fill();
							this.set();
							this.$element.trigger({
								type: 'changeDate',
								date: this.date,
								viewMode: DPGlobal.modes[this.viewMode].clsName
							});
						}
						break;
				}
			}
		},
		
		mousedown: function(e) {
			e.stopPropagation();
			e.preventDefault();
		},
		
		showMode: function(dir) {
			if (dir) {
				this.viewMode = Math.max(this.minViewMode, Math.min(2, this.viewMode + dir));
			}
			this.picker.find('>div').hide().filter('.datepicker-'+DPGlobal.modes[this.viewMode].clsName).show();
		},

		destroy: function() {
			this._detachDatePickerEvents();
			this._detachDatePickerWidgetEvents();
			this.picker.remove();
			this.$element.removeData('datetimepicker');
			this.component.removeData('datetimepicker');
		},

		formatDate: function(d) {
			return this.format.replace(/dd/g, function(){
				var str = d.getDate().toString();
				if (str.length == 1) return '0' + str;
				return str;
			}).replace(/MM/g, function() {
				var str = (d.getMonth() + 1).toString();
				if (str.length == 1) return '0' + str;
				return str;
			}).replace(/yyyy/g, function() {
				return d.getFullYear().toString();
			}).replace(/hh/g, function(){
				var str = d.getHours().toString();
				if (str.length == 1) return '0' + str;
				return str;
			}).replace(/mm/g, function() {
				var str = (d.getMinutes()).toString();
				if (str.length == 1) return '0' + str;
				return str;
			}).replace(/ss/g, function() {
				return d.getSeconds().toString();
			});
		},

		parseDate: function(str) {
			return this.parser.parse(str);
		},

		_attachDatePickerEvents: function() {
			this.picker.on({
				click: $.proxy(this.click, this),
				mousedown: $.proxy(this.mousedown, this)
			});
			if (this.isInput) {
				this.$element.on({
					focus: $.proxy(this.show, this),
					blur: $.proxy(this.hide, this),
					keyup: $.proxy(this.update, this)
				});
			} else {
				if (this.component){
					this.component.on('click', $.proxy(this.show, this));
				} else {
					this.$element.on('click', $.proxy(this.show, this));
				}
			}
		},

		_attachDatePickerWidgetEvents: function() {
			$(window).on('resize.datetimepicker' + this.id, $.proxy(this.place, this));
			if (!this.isInput) {
				$(document).on('mousedown.datetimepicker' + this.id, $.proxy(this.hide, this));
			}
		},

		_detachDatePickerEvents: function() {
			this.picker.off({
				click: this.click,
				mousedown: this.mousedown
			});
			if (this.isInput) {
				this.$element.off({
					focus: this.show,
					blur: this.hide,
					keyup: this.update
				});
			} else {
				if (this.component){
					this.component.off('click', this.show);
				} else {
					this.$element.off('click', this.show);
				}
			}
		},

		_detachDatePickerWidgetEvents: function () {
			$(window).off('resize.datetimepicker' + this.id);
			if (!this.isInput) {
				$(document).off('mousedown.datetimepicker' + this.id);
			}
		}
	};
	
	$.fn.datetimepicker = function ( option, val ) {
		return this.each(function () {
			var $this = $(this),
				data = $this.data('datetimepicker'),
				options = typeof option === 'object' && option;
			if (!data) {
				$this.data('datetimepicker', (data = new DateTimePicker(this, $.extend({}, $.fn.datetimepicker.defaults,options))));
			}
			if (typeof option === 'string') data[option](val);
		});
	};

	$.fn.datetimepicker.defaults = {
	};
	$.fn.datetimepicker.Constructor = DateTimePicker;
	var dpgId = 0;
	var dates = $.fn.datetimepicker.dates = {
		en: {
			days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
			daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
			daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
			months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
			monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
		}
	};

	var dateFormatComponents = {
		dd: {parserMethod: 'setDate', getPattern: function() { return '(0?[1-9]|[1-2][0-9]|3[0-1])\\b';}},
		MM: {parserMethod: 'setMonth', getPattern: function() {return '(0?[1-9]|1[0-2])\\b';}},
		month: {parserMethod: 'setMonthByName', getPattern: function(picker) {
			var rv = [], values = dates[picker.language].months;
			for (var i = 0; i < values.length; i++)
				rv.push(escapeRegExp(values[i]));
			return '(' + rv.join('|') + ')';
		}},
		monthShort: {parserMethod: 'setMonthByShortName', getPattern: function(picker) {
			var rv = [], values = dates[picker.language].monthsShort;
			for (var i = 0; i < values.length; i++)
				rv.push(escapeRegExp(values[i]));
			return '(' + rv.join('|') + ')';
		}},
		yyyy: {parserMethod: 'setYear', getPattern: function() {return '(\\d{2}|\\d{4})\\b';}},
		hh: {parserMethod: 'setHour', getPattern: function() {return '(0?[0-9]|1[0-9]|2[0-3])\\b';}},
		mm: {parserMethod: 'setMinutes', getPattern: function() {return '(0?[1-9]|[1-5][0-9])\\b';}},
		ss: {parserMethod: 'setSeconds', getPattern: function() {return '(0?[1-9]|[1-5][0-9])\\b';}},
		ms: {parserMethod: 'setMilliseconds', getPattern: function() {return '([0-9]{1,3})\\b';}},
	};
	var tmp = [];
	for (var k in dateFormatComponents) tmp.push(k);
	tmp.push('.');

	var formatComponent = new RegExp(tmp.join('|'));

	function escapeRegExp(str) {
		// http://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
		return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
	}

	function buildDateParser (format, picker) {
		var match, component, components = [], str = format, indexHash = {}, i = 0;
		while (match = formatComponent.exec(str)) {
			i++;
			component = match[0];
			if (component in dateFormatComponents) {
				indexHash[i] = dateFormatComponents[component].parserMethod;
				components.push('\\s*' + dateFormatComponents[component].getPattern(picker) + '\\s*');
			}
			else {
				components.push(escapeRegExp(component));
			}
			str = str.slice(component.length);
		}
		return new DateParser(new RegExp('^\\s*' + components.join('') + '\\s*$'), indexHash);
	}

	var DateParser = function(regExp, indexHash) {
		this.regExp = regExp;
		this.indexHash = indexHash;
	};
	DateParser.prototype = {
		constructor: DateParser,

		parse: function (str) {
			var match, i, methodName, value, rv = new Date(0);
			if (!(match = this.regExp.exec(str)))
				return null;
			for (i = 1; i < match.length; i++) {
				methodName = this.indexHash[i];
				if (!methodName)
					continue;
				value = match[i];
				if (/^d+$/.test(value))
					value = parseInt(value, 10);
				(DateParser.prototype[methodName] || Date.prototype[methodName]).call(rv, value);
			}
			return rv;
		}
	};

	var DPGlobal = {
		modes: [
			{
				clsName: 'days',
				navFnc: 'Month',
				navStep: 1
			},
			{
				clsName: 'months',
				navFnc: 'FullYear',
				navStep: 1
			},
			{
				clsName: 'years',
				navFnc: 'FullYear',
				navStep: 10
		}],
		isLeapYear: function (year) {
			return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0))
		},
		getDaysInMonth: function (year, month) {
			return [31, (DPGlobal.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month]
		},
		headTemplate: '<thead>'+
							'<tr>'+
								'<th class="prev">&lsaquo;</th>'+
								'<th colspan="5" class="switch"></th>'+
								'<th class="next">&rsaquo;</th>'+
							'</tr>'+
						'</thead>',
		contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>'
	};
	DPGlobal.template = '<div class="datepicker dropdown-menu">'+
							'<div class="datepicker-days">'+
								'<table class=" table-condensed">'+
									DPGlobal.headTemplate+
									'<tbody></tbody>'+
								'</table>'+
							'</div>'+
							'<div class="datepicker-months">'+
								'<table class="table-condensed">'+
									DPGlobal.headTemplate+
									DPGlobal.contTemplate+
								'</table>'+
							'</div>'+
							'<div class="datepicker-years">'+
								'<table class="table-condensed">'+
									DPGlobal.headTemplate+
									DPGlobal.contTemplate+
								'</table>'+
							'</div>'+
						'</div>';

})(window.jQuery)
