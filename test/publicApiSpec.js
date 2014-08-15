describe('Plugin initialization and component basic construction', function () {
    'use strict';
    var dtp;

    it('loads jquery plugin properly', function () {
        expect($('<div>').datetimepicker).not.toBe(undefined);
        expect($('<div>').datetimepicker.defaults).not.toBe(undefined);
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
    var dtp;

    beforeEach(function () {
        dtp = $('<div>').append($('<input>'));
        $(document).find('body').append(dtp);
        dtp.datetimepicker();
        dtp = dtp.data('DateTimePicker');
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
        });
    });

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
