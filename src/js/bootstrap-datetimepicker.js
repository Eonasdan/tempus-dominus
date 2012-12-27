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
	var smartPhone = (window.orientation != undefined);
	var DateTimePicker = function(element, options) {
		this.id = dpgId++;
		this.init(element, options);
	};
	
	DateTimePicker.prototype = {
		constructor: DateTimePicker,

		init: function(element, options) {
			var icon;
			if (!(options.pickTime || options.pickDate))
				throw new Error('Must choose at least one picker');
			this.options = options;
			this.$element = $(element);
			this.format = options.format || this.$element.data('date-format') || 'MM/dd/yyyy';
			this._compileFormat();
			this.language = options.language in dates ? options.language : 'en'
			this.pickDate = options.pickDate;
			this.pickTime = options.pickTime;
			this.isInput = this.$element.is('input');
			this.component = this.$element.is('.date') ? this.$element.find('.add-on') : false;
			if (this.component) {
				icon = this.component.find('i');
			}
			if (this.pickTime) {
				this.timeIcon = icon.data('time-icon') || 'icon-time';
				icon.addClass(this.timeIcon);
			}
			if (this.pickDate) {
				this.dateIcon = icon.data('date-icon') || 'icon-calendar';
				icon.removeClass(this.timeIcon);
				icon.addClass(this.dateIcon);
			}
			this.picker = $(getTemplate(this.timeIcon, options.pickDate, options.pickTime)).appendTo('body');
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

		show: function(e) {
			this.picker.show();
			this.height = this.component ? this.component.outerHeight() : this.$element.outerHeight();
			this.place();
			this.$element.trigger({
				type: 'show',
				date: this.date
			});
			this._attachDatePickerGlobalEvents();
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}
		},
		
		hide: function() {
			// Ignore event if in the middle of a picker transition
			var collapse = this.picker.find('.collapse')
			for (var i = 0; i < collapse.length; i++) {
				var collapseData = collapse.eq(i).data('collapse');
				if (collapseData && collapseData.transitioning)
					return;
			}
			this.picker.hide();
			this.viewMode = this.startViewMode;
			this.showMode();
			this.set();
			this.$element.trigger({
				type: 'hide',
				date: this.date
			});
			this._detachDatePickerGlobalEvents();
		},
		
		set: function() {
			var formated = this.formatDate(this.date);
			if (!this.isInput) {
				if (this.component){
					var input = this.$element.find('input');
					input.val(formated);
					this._resetMaskPos(input);
				}
				this.$element.data('date', formated);
			} else {
				this.$element.val(formated);
				this._resetMaskPos(this.$element);
			}
		},
		
		setValue: function(newDate) {
			if (typeof newDate === 'string') {
				this.date = this.parseDate(newDate);
			} else {
				this.date = new Date(newDate);
			}
			this.set();
			this.viewDate = UTCDate(this.date.getUTCFullYear(), this.date.getUTCMonth(), 1, 0, 0, 0, 0);
			this.fillDate();
			this.fillTime();
		},

		getDate: function() {
			return new Date(this.date.valueOf());
		},

		setDate: function(date) {
			this.setValue(date.valueOf());
		},

		getLocalDate: function() {
			var d = this.date;
			return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(),
				       d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(), d.getUTCMilliseconds());
		},

		setLocalDate: function(localDate) {
			this.setValue(Date.UTC(localDate.getFullYear(), localDate.getMonth(), localDate.getDate(),
					      localDate.getHours(), localDate.getMinutes(), localDate.getSeconds(), localDate.getMilliseconds()));
		},
		
		place: function(){
			var offset = this.component ? this.component.offset() : this.$element.offset();
			this.picker.css({
				top: offset.top + this.height,
				left: offset.left
			});
		},
		
		update: function(newDate){
			var dateStr = newDate;
			if (!dateStr) {
				if (this.isInput) {
					dateStr = this.$element.val();
				} else {
					dateStr = this.$element.find('input').val();
				}
				if (!dateStr) {
					var tmp = new Date()
					this.date = UTCDate(tmp.getFullYear(), tmp.getMonth(), tmp.getDate(),
							    tmp.getHours(), tmp.getMinutes(), tmp.getSeconds(), tmp.getMilliseconds())
				} else {
					this.date = this.parseDate(dateStr);
				}
			}
			this.viewDate = UTCDate(this.date.getUTCFullYear(), this.date.getUTCMonth(), 1, 0, 0, 0, 0);
			this.fillDate();
			this.fillTime();
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
		
		fillDate: function() {
			var year = this.viewDate.getUTCFullYear();
			var month = this.viewDate.getUTCMonth();
			var currentDate = UTCDate(
				this.date.getUTCFullYear(), this.date.getUTCMonth(), this.date.getUTCDate(),
				0, 0, 0, 0
			);
			this.picker.find('.datepicker-days th:eq(1)')
						.text(dates[this.language].months[month] + ' ' + year);
			var prevMonth = UTCDate(year, month-1, 28, 0, 0, 0, 0);
			var day = DPGlobal.getDaysInMonth(prevMonth.getUTCFullYear(), prevMonth.getUTCMonth());
			prevMonth.setUTCDate(day);
			prevMonth.setUTCDate(day - (prevMonth.getUTCDay() - this.weekStart + 7) % 7);
			var nextMonth = new Date(prevMonth.valueOf());
			nextMonth.setUTCDate(nextMonth.getUTCDate() + 42);
			nextMonth = nextMonth.valueOf();
			html = [];
			var clsName;
			while (prevMonth.valueOf() < nextMonth) {
				if (prevMonth.getUTCDay() === this.weekStart) {
					html.push('<tr>');
				}
				clsName = '';
				if (prevMonth.getUTCMonth() < month) {
					clsName += ' old';
				} else if (prevMonth.getUTCMonth() > month) {
					clsName += ' new';
				}
				if (prevMonth.valueOf() === currentDate.valueOf()) {
					clsName += ' active';
				}
				html.push('<td class="day' + clsName + '">' + prevMonth.getUTCDate() + '</td>');
				if (prevMonth.getUTCDay() === this.weekEnd) {
					html.push('</tr>');
				}
				prevMonth.setUTCDate(prevMonth.getUTCDate() + 1);
			}
			this.picker.find('.datepicker-days tbody').empty().append(html.join(''));
			var currentYear = this.date.getUTCFullYear();
			
			var months = this.picker.find('.datepicker-months')
						.find('th:eq(1)')
							.text(year)
							.end()
						.find('span').removeClass('active');
			if (currentYear === year) {
				months.eq(this.date.getUTCMonth()).addClass('active');
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
				html += '<span class="year' + (i === -1 || i === 10 ? ' old' : '') + (currentYear === year ? ' active' : '') + '">' + year + '</span>';
				year += 1;
			}
			yearCont.html(html);
		},

		fillTime: function() {
			if (!this.date)
				return;
			var timeComponents = this.picker.find('.timepicker span[data-time-component]');
			timeComponents.filter('[data-time-component=hours]').text(padLeft(this.date.getUTCHours().toString(), 2, '0'));
			timeComponents.filter('[data-time-component=minutes]').text(padLeft(this.date.getUTCMinutes().toString(), 2, '0'));
			timeComponents.filter('[data-time-component=seconds]').text(padLeft(this.date.getUTCSeconds().toString(), 2, '0'));
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
								this.fillDate();
								this.set();
								break;
						}
						break;
					case 'span':
						if (target.is('.month')) {
							var month = target.parent().find('span').index(target);
							this.viewDate.setUTCMonth(month);
						} else {
							var year = parseInt(target.text(), 10)||0;
							this.viewDate.setUTCFullYear(year);
						}
						if (this.viewMode !== 0) {
							this.date = UTCDate(
								this.viewDate.getUTCFullYear(), this.viewDate.getUTCMonth(), this.viewDate.getUTCDate(),
								this.date.getUTCHours(), this.date.getUTCMinutes(), this.date.getUTCSeconds(),
								this.date.getUTCMilliseconds()
							);
							this.$element.trigger({
								type: 'changeDate',
								date: this.date,
								viewMode: DPGlobal.modes[this.viewMode].clsName
							});
						}
						this.showMode(-1);
						this.fillDate();
						this.set();
						break;
					case 'td':
						if (target.is('.day')){
							var day = parseInt(target.text(), 10)||1;
							var month = this.viewDate.getUTCMonth();
							if (target.is('.old')) {
								month -= 1;
							} else if (target.is('.new')) {
								month += 1;
							}
							var year = this.viewDate.getUTCFullYear();
							this.date = UTCDate(
								year, month, day,
								this.date.getUTCHours(), this.date.getUTCMinutes(), this.date.getUTCSeconds(),
								this.date.getUTCMilliseconds()
							);
							this.viewDate = UTCDate(year, month, Math.min(28, day),0,0,0,0);
							this.fillDate();
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

		actions: {
			incrementHours: function(e) {
				this.date.setUTCHours(this.date.getUTCHours() + this.options.hourStep);
			},

			incrementMinutes: function(e) {
				this.date.setUTCMinutes(this.date.getUTCMinutes() + this.options.minuteStep);
			},

			incrementSeconds: function(e) {
				this.date.setUTCSeconds(this.date.getUTCSeconds() + this.options.secondStep);
			},

			decrementHours: function(e) {
				this.date.setUTCHours(this.date.getUTCHours() - this.options.hourStep);
			},

			decrementMinutes: function(e) {
				this.date.setUTCMinutes(this.date.getUTCMinutes() - this.options.minuteStep);
			},

			decrementSeconds: function(e) {
				this.date.setUTCSeconds(this.date.getUTCSeconds() - this.options.secondStep);
			}
		},

		doAction: function(e) {
			if (!this.date) this.date = UTCDate(1970, 0, 0, 0, 0, 0, 0);
			var action = $(e.currentTarget).data('action');
			var rv = this.actions[action].apply(this, arguments);
			this.set();
			this.fillTime();
			this.$element.trigger({
				type: 'changeDate',
				date: this.date,
			});
			return rv;
		},

		// part of the following code was taken from
		// http://cloud.github.com/downloads/digitalBush/jquery.maskedinput/jquery.maskedinput-1.3.js
		keydown: function(e) {
			var self = this, k = e.which, input = $(e.target);
			if (k == 8 || k == 46) {
				// backspace and delete cause the maskPosition
				// to be recalculated
				setTimeout(function() {
					self._resetMaskPos(input);
				});
			}
		},

		keypress: function(e) {
			var k = e.which;
			if (k == 8 || k == 46) {
				// For those browsers which will trigger
				// keypress on backspace/delete
				return;
			}
			var input = $(e.target);
			var c = String.fromCharCode(k);
			var val = input.val() || '';
			val += c;
			var mask = this._mask[this._maskPos];
			if (!mask) {
				return false;
			}
			if (mask.end != val.length) {
				return;
			}
			if (!mask.pattern.test(val.slice(mask.start))) {
				val = val.slice(0, val.length - 1);
				while ((mask = this._mask[this._maskPos]) && mask.character) {
					val += mask.character;
					// advance mask position past static
					// part
					this._maskPos++;
				}
				val += c;
				if (mask.end != val.length) {
					input.val(val);
					return false;
				} else {
					if (!mask.pattern.test(val.slice(mask.start))) {
						input.val(val.slice(0, mask.start));
						return false;
					} else {
						input.val(val);
						this._maskPos++;
						return false;
					}
				}
			} else {
				this._maskPos++;
			}
		},

		change: function(e) {
			var input = $(e.target);
			var val = input.val();
			if (this._formatPattern.test(val)) {
				this.update();
				this.$element.trigger({
					type: 'changeDate',
					date: this.date,
					viewMode: DPGlobal.modes[this.viewMode].clsName
				});
				this.set();
			} else if (val && val.trim()) {
				if (this.date) this.set();
				else input.val('');
			}
			this._resetMaskPos(input);
		},

		mousedown: function(e) {
			e.stopPropagation();
			e.preventDefault();
		},
		
		showMode: function(dir) {
			if (dir) {
				this.viewMode = Math.max(this.minViewMode, Math.min(2, this.viewMode + dir));
			}
			this.picker.find('.datepicker > div').hide().filter('.datepicker-'+DPGlobal.modes[this.viewMode].clsName).show();
		},

		destroy: function() {
			this._detachDatePickerEvents();
			this._detachDatePickerGlobalEvents();
			this.picker.remove();
			this.$element.removeData('datetimepicker');
			this.component.removeData('datetimepicker');
		},

		formatDate: function(d) {
			return this.format.replace(formatReplacer, function(match) {
				var methodName, property, rv;
				property = dateFormatComponents[match].property
				methodName = 'get' + property;
				rv = d[methodName]();
				if (methodName === 'getUTCMonth') rv = rv + 1;
				if (methodName === 'getUTCYear') rv = rv + 1900 - 2000;
				return padLeft(rv.toString(), match.length, '0');
			});
		},

		parseDate: function(str) {
			var match, i, property, methodName, value, parsed = {};
			if (!(match = this._formatPattern.exec(str)))
				return null;
			for (i = 1; i < match.length; i++) {
				property = this._propertiesByIndex[i];
				if (!property)
					continue;
				value = match[i];
				if (/^\d+$/.test(value))
					value = parseInt(value, 10);
				parsed[property] = value;
			}
			return this._finishParsingDate(parsed);
		},

		_resetMaskPos: function(input) {
			var val = input.val();
			for (var i = 0; i < this._mask.length; i++) {
				if (this._mask[i].end > val.length) {
					// If the mask has ended then jump to
					// the next
					this._maskPos = i;
					break;
				} else if (this._mask[i].end === val.length) {
					this._maskPos = i + 1;
					break;
				}
			}
		},

		_finishParsingDate: function(parsed) {
			var year, month, date, hours, minutes, seconds;
			year = parsed.UTCFullYear;
			if (parsed.UTCYear) year = 2000 + parsed.UTCYear;
			if (!year) year = 1970;
			if (parsed.UTCMonth) month = parsed.UTCMonth - 1;
			else month = 0;
			date = parsed.UTCDate || 1;
			hours = parsed.UTCHours || 0;
			minutes = parsed.UTCMinutes || 0;
			seconds = parsed.UTCSeconds || 0;
			return UTCDate(year, month, date, hours, minutes, seconds, 0);
		},

		_compileFormat: function () {
			var match, component, components = [], mask = [], str = this.format, propertiesByIndex = {}, i = pos = 0;
			while (match = formatComponent.exec(str)) {
				component = match[0];
				if (component in dateFormatComponents) {
					i++;
					propertiesByIndex[i] = dateFormatComponents[component].property;
					components.push('\\s*' + dateFormatComponents[component].getPattern(this) + '\\s*');
					mask.push({
						pattern: new RegExp(dateFormatComponents[component].getPattern(this)),
						property: dateFormatComponents[component].property,
						start: pos,
						end: pos += component.length
					});
				}
				else {
					components.push(escapeRegExp(component));
					mask.push({
						pattern: new RegExp(escapeRegExp(component)),
						character: component,
						start: pos,
						end: ++pos
					});
				}
				str = str.slice(component.length);
			}
			this._mask = mask;
			this._maskPos = 0;
			this._formatPattern = new RegExp('^\\s*' + components.join('') + '\\s*$');
			this._propertiesByIndex = propertiesByIndex;
		},

		_attachDatePickerEvents: function() {
			var self = this;
			this.picker.on({
				click: $.proxy(this.click, this),
				mousedown: $.proxy(this.mousedown, this),
			});
			this.picker.on('click', '[data-action]', $.proxy(this.doAction, this));
			if (this.pickDate && this.pickTime) {
				this.picker.on('click.togglePicker', '.accordion-toggle', function(e) {
					e.stopPropagation();
					var $this = $(this);
					var $parent = $this.closest('ul');
					var expanded = $parent.find('.collapse.in');
					var closed = $parent.find('.collapse:not(.in)');

					if (expanded && expanded.length) {
						var collapseData = expanded.data('collapse');
						if (collapseData && collapseData.transitioning) return;
						expanded.collapse('hide');
						closed.collapse('show')
						$this.find('i').toggleClass(self.timeIcon + ' ' + self.dateIcon);
						self.$element.find('.add-on i').toggleClass(self.timeIcon + ' ' + self.dateIcon);
					}
				});
			}
			if (this.isInput) {
				this.$element.on({
					'focus': $.proxy(this.show, this),
					'change': $.proxy(this.change, this),
				});
				if (this.options.maskInput) {
					this.$element.on({
						'keydown': $.proxy(this.keydown, this),
						'keypress': $.proxy(this.keypress, this)
					});
				}
			} else {
				this.$element.on({
					'change': $.proxy(this.change, this),
				}, 'input');
				if (this.options.maskInput) {
					this.$element.on({
						'keydown': $.proxy(this.keydown, this),
						'keypress': $.proxy(this.keypress, this)
					}, 'input');
				}
				if (this.component){
					this.component.on('click', $.proxy(this.show, this));
				} else {
					this.$element.on('click', $.proxy(this.show, this));
				}
			}
		},

		_attachDatePickerGlobalEvents: function() {
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
			this.picker.off('click', '[data-action]');
			if (this.pickDate && this.pickTime) {
				this.picker.off('click.togglePicker');
			}
			if (this.isInput) {
				this.$element.off({
					'focus': this.show,
					'change': this.change,
				});
				if (this.options.maskInput) {
					this.$element.off({
						'keydown': this.keydown,
						'keypress': this.keypress
					});
				}
			} else {
				this.$element.off({
					'change': this.change,
				}, 'input');
				if (this.options.maskInput) {
					this.$element.off({
						'keydown': this.keydown,
						'keypress': this.keypress
					}, 'input');
				}
				if (this.component){
					this.component.off('click', this.show);
				} else {
					this.$element.off('click', this.show);
				}
			}
		},

		_detachDatePickerGlobalEvents: function () {
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
		maskInput: true,
		pickDate: true,
		pickTime: true,
		hourStep: 1,
		minuteStep: 15,
		secondStep: 30
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
		dd: {property: 'UTCDate', getPattern: function() { return '(0?[1-9]|[1-2][0-9]|3[0-1])\\b';}},
		MM: {property: 'UTCMonth', getPattern: function() {return '(0?[1-9]|1[0-2])\\b';}},
		yy: {property: 'UTCYear', getPattern: function() {return '(\\d{2})\\b'}},
		yyyy: {property: 'UTCFullYear', getPattern: function() {return '(\\d{4})\\b';}},
		hh: {property: 'UTCHours', getPattern: function() {return '(0?[0-9]|1[0-9]|2[0-3])\\b';}},
		mm: {property: 'UTCMinutes', getPattern: function() {return '(0?[0-9]|[1-5][0-9])\\b';}},
		ss: {property: 'UTCSeconds', getPattern: function() {return '(0?[0-9]|[1-5][0-9])\\b';}},
		ms: {property: 'UTCMilliseconds', getPattern: function() {return '([0-9]{1,3})\\b';}},
	};

	var keys = [];
	for (var k in dateFormatComponents) keys.push(k);
	keys[keys.length - 1] += '\\b';
	keys.push('.');

	var formatComponent = new RegExp(keys.join('\\b|'));
	keys.pop();
	var formatReplacer = new RegExp(keys.join('\\b|'), 'g');

	function escapeRegExp(str) {
		// http://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
		return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
	}

	function padLeft(s, l, c) {
		return Array(l - s.length + 1).join(c || ' ') + s;
	}

	function getTemplate(timeIcon, pickDate, pickTime) {
		if (pickDate && pickTime) {
			return (
				'<div class="datetimepicker dropdown-menu">' +
					'<ul>' +
						'<li class="collapse in">' +
							'<div class="datepicker">' +
							DPGlobal.template +
							'</div>' +
						'</li>' +
						'<li class="picker-switch"><a class="accordion-toggle"><i class="' + timeIcon + '"></i></a></li>' +
						'<li class="collapse">' +
							'<div class="timepicker">' +
							TPGlobal.template +
							'</div>' +
						'</li>' +
					'</ul>' +
				'</div>'
			);
		} else if (pickTime) {
			return (
				'<div class="datetimepicker dropdown-menu">' +
					'<div class="timepicker">' +
					TPGlobal.template +
					'</div>' +
				'</div>'
			);
		} else {
			return (
				'<div class="datetimepicker dropdown-menu">' +
					'<div class="datepicker">' +
					DPGlobal.template +
					'</div>' +
				'</div>'
			);
		}
	}

	function UTCDate() {
		return new Date(Date.UTC.apply(Date, arguments));
	}

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
		headTemplate: 
			'<thead>' +
				'<tr>' +
					'<th class="prev">&lsaquo;</th>' +
					'<th colspan="5" class="switch"></th>' +
					'<th class="next">&rsaquo;</th>' +
				'</tr>' +
			'</thead>',
		contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>'
	};
	DPGlobal.template =
				'<div class="datepicker-days">' +
					'<table class="table-condensed">' +
						DPGlobal.headTemplate +
						'<tbody></tbody>' +
					'</table>' +
				'</div>' +
				'<div class="datepicker-months">' +
					'<table class="table-condensed">' +
						DPGlobal.headTemplate +
						DPGlobal.contTemplate+
					'</table>'+
				'</div>'+
				'<div class="datepicker-years">'+
					'<table class="table-condensed">'+
						DPGlobal.headTemplate+
						DPGlobal.contTemplate+
					'</table>'+
				'</div>';
	var TPGlobal = {
	        hourTemplate: '<span data-time-component="hours" class="timepicker-hour"></span>',
                minuteTemplate: '<span data-time-component="minutes" class="timepicker-minute"></span>',
                secondTemplate: '<span data-time-component="seconds" class="timepicker-second"></span>',
	};
	TPGlobal.template = 
		'<table class="table-condensed">' +
			'<tr>' +
				'<td><a href="#" class="btn" data-action="incrementHours"><i class="icon-chevron-up"></i></a></td>' +
				'<td class="separator">&nbsp;</td>' +
				'<td><a href="#" class="btn" data-action="incrementMinutes"><i class="icon-chevron-up"></i></a></td>' +
                                '<td class="separator">&nbsp;</td>' +
				'<td><a href="#" class="btn" data-action="incrementSeconds"><i class="icon-chevron-up"></i></a></td>' +
			'</tr>' +
			'<tr>' +
				'<td>' + TPGlobal.hourTemplate + '</td> ' +
				'<td class="separator">:</td>' +
				'<td>' + TPGlobal.minuteTemplate + '</td> ' +
				'<td class="separator">:</td>' +
				'<td>' + TPGlobal.secondTemplate + '</td>' +
			'</tr>' +
			'<tr>' +
				'<td><a href="#" class="btn" data-action="decrementHours"><i class="icon-chevron-down"></i></a></td>' +
				'<td class="separator"></td>' +
				'<td><a href="#" class="btn" data-action="decrementMinutes"><i class="icon-chevron-down"></i></a></td>' +
				'<td class="separator">&nbsp;</td>' +
				'<td><a href="#" class="btn" data-action="decrementSeconds"><i class="icon-chevron-down"></i></a></td>' +
			'</tr>' +
		'</table>'


})(window.jQuery)
