describe('Plugin initialization and component basic construction', function () {
    'use strict';
    var dtp;

    it('loads jquery plugin properly', function () {
        expect($('<div>').datetimepicker).toBeDefined();
        expect($('<div>').datetimepicker.defaults).toBeDefined();
    });

    it('throws an Error if constructing on a structure with no input element', function () {
        dtp = $('<div>');
        $(document).find('body').append(dtp);

        expect(function () {
            dtp = dtp.datetimepicker();
        }).toThrow();
    });

    it('creates the component with default options on an input element', function () {
        dtp = $('<input>');
        $(document).find('body').append(dtp);

        expect(function () {
            dtp = dtp.datetimepicker();
        }).not.toThrow();

        expect(dtp).not.toBe(null);
    });
});

describe('Public API method tests', function () {
    'use strict';
    var dtp,
        dpChangeSpy = jasmine.createSpy();

    beforeEach(function () {
        dtp = $('<div>').append($('<input>'));
        $(document).find('body').on('dp.change', dpChangeSpy);
        $(document).find('body').append(dtp);
        dtp.datetimepicker();
        dtp = dtp.data('DateTimePicker');
    });

    describe('configuration option name match to public api function', function () {
        Object.getOwnPropertyNames($.fn.datetimepicker.defaults).forEach(function (key) {
            it('has function ' + key + '()', function () {
                expect(dtp[key]).toBeDefined();
            });
        });
    });

    describe('date() function', function () {
        describe('typechecking', function () {
            it('accepts a null', function () {
                expect(function () {
                    dtp.date(null);
                }).not.toThrow();
            });

            it('accepts a string', function () {
                expect(function () {
                    dtp.date('2013/05/24');
                }).not.toThrow();
            });

            it('accepts a Date object', function () {
                expect(function () {
                    dtp.date(new Date());
                }).not.toThrow();
            });

            it('accepts a Moment object', function () {
                expect(function () {
                    dtp.date(moment());
                }).not.toThrow();
            });

            it('does not accept undefined', function () {
                expect(function () {
                    dtp.date(undefined);
                }).toThrow();
            });

            it('does not accept a number', function () {
                expect(function () {
                    dtp.date(0);
                }).toThrow();
            });

            it('does not accept a generic Object', function () {
                expect(function () {
                    dtp.date({});
                }).toThrow();
            });

            it('does not accept a boolean', function () {
                expect(function () {
                    dtp.date(false);
                }).toThrow();
            });
        });

        describe('functionality', function () {
            it('has no date set upon construction', function () {
                expect(dtp.date()).toBe(null);
            });

            it('sets the date correctly', function () {
                var timestamp = moment();
                dtp.date(timestamp);
                expect(dtp.date().isSame(timestamp)).toBe(true);
            });
        });
    });

    describe('format() function', function () {
        describe('typechecking', function () {
            it('accepts a false value', function () {
                expect(function () {
                    dtp.format(false);
                }).not.toThrow();
            });

            it('accepts a string', function () {
                expect(function () {
                    dtp.format('YYYY-MM-DD');
                }).not.toThrow();
            });

            it('does not accept undefined', function () {
                expect(function () {
                    dtp.format(undefined);
                }).toThrow();
            });

            it('does not accept true', function () {
                expect(function () {
                    dtp.format(true);
                }).toThrow();
            });

            it('does not accept a generic Object', function () {
                expect(function () {
                    dtp.format({});
                }).toThrow();
            });
        });

        describe('functionality', function () {
            it('returns no format before format is set', function () {
                expect(dtp.format()).toBe(false);
            });

            it('sets the format correctly', function () {
                dtp.format('YYYY-MM-DD');
                expect(dtp.format()).toBe('YYYY-MM-DD');
            });
        });
    });

    describe('destroy() function', function () {
        describe('existence', function () {
            it('is defined', function () {
                expect(dtp.destroy).toBeDefined();
            });
        });
    });

    describe('toggle() function', function () {
        describe('existence', function () {
            it('is defined', function () {
                expect(dtp.toggle).toBeDefined();
            });
        });
    });

    describe('show() function', function () {
        describe('existence', function () {
            it('is defined', function () {
                expect(dtp.show).toBeDefined();
            });
        });
    });

    describe('hide() function', function () {
        describe('existence', function () {
            it('is defined', function () {
                expect(dtp.hide).toBeDefined();
            });
        });
    });

    describe('disable() function', function () {
        describe('existence', function () {
            it('is defined', function () {
                expect(dtp.disable).toBeDefined();
            });
        });
    });

    describe('enable() function', function () {
        describe('existence', function () {
            it('is defined', function () {
                expect(dtp.enable).toBeDefined();
            });
        });
    });

    describe('options() function', function () {
        describe('existence', function () {
            it('is defined', function () {
                expect(dtp.options).toBeDefined();
            });
        });
    });

    describe('disabledDates() function', function () {
        describe('existence', function () {
            it('is defined', function () {
                expect(dtp.disabledDates).toBeDefined();
            });
        });
    });

    describe('enabledDates() function', function () {
        describe('existence', function () {
            it('is defined', function () {
                expect(dtp.enabledDates).toBeDefined();
            });
        });
    });

    describe('daysOfWeekDisabled() function', function () {
        describe('existence', function () {
            it('is defined', function () {
                expect(dtp.daysOfWeekDisabled).toBeDefined();
            });
        });
    });

    describe('maxDate() function', function () {
        describe('existence', function () {
            it('is defined', function () {
                expect(dtp.maxDate).toBeDefined();
            });
        });
    });

    describe('minDate() function', function () {
        describe('existence', function () {
            it('is defined', function () {
                expect(dtp.minDate).toBeDefined();
            });
        });
    });

    describe('defaultDate() function', function () {
        describe('existence', function () {
            it('is defined', function () {
                expect(dtp.defaultDate).toBeDefined();
            });
        });
        describe('functionality', function () {
            it('returns no defaultDate before defaultDate is set', function () {
                expect(dtp.defaultDate()).toBe(false);
            });

            it('sets the defaultDate correctly', function () {
                dtp.format('YYYY-MM-DD');
                expect(dtp.format()).toBe('YYYY-MM-DD');
            });

            it('triggers a change event when shown and input field is empty', function () {
                var timestamp = moment();
                dtp.defaultDate(timestamp);
                dtp.show();
                expect(dpChangeSpy).toHaveBeenCalled();
                expect(timestamp.isSame(dtp.date())).toBe(true);
            });
        });
    });

    describe('locale() function', function () {
        describe('functionality', function () {
            it('it has the same locale as the global moment locale with default options', function () {
                expect(dtp.locale()).toBe(moment.locale());
            });

            it('it switches to a selected locale without affecting global moment locale', function () {
                dtp.locale('el');
                dtp.date(moment());
                expect(dtp.locale()).toBe('el');
                expect(dtp.date().locale()).toBe('el');
                expect(moment.locale()).toBe('en');
            });
        });
    });

    describe('useMinutes() function', function () {
        describe('existence', function () {
            it('is defined', function () {
                expect(dtp.useMinutes).toBeDefined();
            });
        });
    });

    describe('useSeconds() function', function () {
        describe('existence', function () {
            it('is defined', function () {
                expect(dtp.useSeconds).toBeDefined();
            });
        });
    });

    describe('useCurrent() function', function () {
        describe('existence', function () {
            it('is defined', function () {
                expect(dtp.useCurrent).toBeDefined();
            });
        });
    });

    describe('minuteStepping() function', function () {
        describe('existence', function () {
            it('is defined', function () {
                expect(dtp.minuteStepping).toBeDefined();
            });
        });
    });

    describe('pickDate() function', function () {
        describe('existence', function () {
            it('is defined', function () {
                expect(dtp.pickDate).toBeDefined();
            });
        });
    });

    describe('pickTime() function', function () {
        describe('existence', function () {
            it('is defined', function () {
                expect(dtp.pickTime).toBeDefined();
            });
        });
    });

    describe('showToday() function', function () {
        describe('existence', function () {
            it('is defined', function () {
                expect(dtp.showToday).toBeDefined();
            });
        });
    });

    describe('collapse() function', function () {
        describe('existence', function () {
            it('is defined', function () {
                expect(dtp.collapse).toBeDefined();
            });
        });
    });

    describe('icons() function', function () {
        describe('existence', function () {
            it('is defined', function () {
                expect(dtp.icons).toBeDefined();
            });
        });
    });

    describe('useStrict() function', function () {
        describe('existence', function () {
            it('is defined', function () {
                expect(dtp.useStrict).toBeDefined();
            });
        });
    });

    describe('sideBySide() function', function () {
        describe('existence', function () {
            it('is defined', function () {
                expect(dtp.sideBySide).toBeDefined();
            });
        });
    });

    describe('widgetParent() function', function () {
        describe('existence', function () {
            it('is defined', function () {
                expect(dtp.widgetParent).toBeDefined();
            });
        });
    });

    describe('minViewMode() function', function () {
        describe('existence', function () {
            it('is defined', function () {
                expect(dtp.minViewMode).toBeDefined();
            });
        });
    });

    describe('viewMode() function', function () {
        describe('existence', function () {
            it('is defined', function () {
                expect(dtp.viewMode).toBeDefined();
            });
        });
    });

    describe('direction() function', function () {
        describe('existence', function () {
            it('is defined', function () {
                expect(dtp.direction).toBeDefined();
            });
        });
    });

    describe('calendarWeeks() function', function () {
        describe('existence', function () {
            it('is defined', function () {
                expect(dtp.calendarWeeks).toBeDefined();
            });
        });
    });

    describe('orientation() function', function () {
        describe('existence', function () {
            it('is defined', function () {
                expect(dtp.orientation).toBeDefined();
            });
        });
    });

    describe('showTodayButton() function', function () {
        describe('existence', function () {
            it('is defined', function () {
                expect(dtp.showTodayButton).toBeDefined();
            });
        });
    });

    describe('showClear() function', function () {
        describe('existence', function () {
            it('is defined', function () {
                expect(dtp.showClear).toBeDefined();
            });
        });
    });
});
