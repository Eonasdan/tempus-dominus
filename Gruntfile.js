module.exports = function (grunt) {
    'use strict';
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        uglify : {
            target: {
                files: {
                    'build/js/bootstrap-datetimepicker.min.js' : 'src/js/bootstrap-datetimepicker.js'
                }
            },
            options: {
                mangle: true,
                compress: {
                    dead_code: false // jshint ignore:line
                },
                output: {
                    ascii_only: true // jshint ignore:line
                },
                report: 'min',
                preserveComments: 'some'
            }
        },

        jshint: {
            all: [
                'Gruntfile.js', 'src/js/*.js', 'test/*.js'
            ],
            options: {
                'browser'  : true,
                'node'     : true,
                'boss'     : false,
                'curly'    : true,
                'debug'    : false,
                'devel'    : false,
                'eqeqeq'   : true,
                'bitwise'  : true,
                'eqnull'   : true,
                'evil'     : false,
                'forin'    : true,
                'immed'    : false,
                'laxbreak' : false,
                'newcap'   : true,
                'noarg'    : true,
                'noempty'  : false,
                'nonew'    : false,
                'onevar'   : true,
                'plusplus' : false,
                'regexp'   : false,
                'undef'    : true,
                'sub'      : true,
                'strict'   : true,
                'unused'   : true,
                'white'    : true,
                'es3'      : true,
                'camelcase' : true,
                'quotmark' : 'single',
                'globals': {
                    'define': false,
                    'jQuery': false,
                    'moment': false,
                    'describe': false,
                    '$': false,
                    'expect': false,
                    'it': false,
                    'beforeEach': false
                }
            }
        },

        jscs: {
            all: [
                'Gruntfile.js', 'src/js/*.js', 'test/*.js'
            ],
            options: {
                config: '.jscs.json'
            }
        },

        less: {
            production: {
                options: {
                    cleancss: true
                },
                files: {
                    'build/css/bootstrap-datetimepicker.min.css': 'src/less/bootstrap-datetimepicker-build.less'
                }
            },
            development: {
                files: {
                    'build/css/bootstrap-datetimepicker.css': 'src/less/bootstrap-datetimepicker-build.less'
                }
            }
        },

        jasmine: {
            customTemplate: {
                src: 'src/js/*.js',
                options: {
                    specs: 'test/*Spec.js',
                    helpers: 'test/*Helper.js',
                    styles: [
                        'build/css/bootstrap-datetimepicker.min.css',
                        'https:////maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css'
                    ],
                    vendor: [
                        'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js',
                        'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.8.1/moment-with-locales.min.js',
                        'https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js'
                    ]
                }
            }
        }

    });

    grunt.loadTasks('tasks');

    grunt.loadNpmTasks('grunt-contrib-jasmine');

    // These plugins provide necessary tasks.
    require('load-grunt-tasks')(grunt);

    // Default task.
    grunt.registerTask('default', ['jshint', 'jscs']);

    // travis build task
    grunt.registerTask('build:travis', [
        // code style
        'jshint', 'jscs',
        // build
        'uglify', 'less',
        // tests
        'jasmine'
    ]);

    // Task to be run when building
    grunt.registerTask('build', [
        'jshint', 'jscs', 'uglify', 'less'
    ]);

    grunt.registerTask('test', ['jshint', 'jscs', 'uglify', 'less', 'jasmine']);
};
