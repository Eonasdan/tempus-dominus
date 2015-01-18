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
                'jquery'   : true,
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
                    'moment': false,
                    // Jasmine
                    'jasmine': false,
                    'describe': false,
                    'xdescribe': false,
                    'expect': false,
                    'it': false,
                    'xit': false,
                    'spyOn': false,
                    'beforeEach': false,
                    'afterEach': false
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
                        'node_modules/bootstrap/dist/css/bootstrap.min.css',
                        'build/css/bootstrap-datetimepicker.min.css'
                    ],
                    vendor: [
                        'node_modules/jquery/dist/jquery.min.js',
                        'node_modules/moment/min/moment-with-locales.min.js',
                        'node_modules/bootstrap/dist/js/bootstrap.min.js'
                    ],
                    display: 'none',
                    summary: 'true'
                }
            }
        }

    });

    grunt.loadTasks('tasks');

    grunt.loadNpmTasks('grunt-contrib-jasmine');

    // These plugins provide necessary tasks.
    require('load-grunt-tasks')(grunt);

    // Default task.
    grunt.registerTask('default', ['jshint', 'jscs', 'less', 'jasmine']);

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

    grunt.registerTask('nuget', 'Create a nuget package', function () {
        var target = grunt.option('target') || 'less', done = this.async();
        if (target === 'less') {
            grunt.util.spawn({
                cmd: 'src/nuget/nuget.exe',
                args: [
                    'pack',
                    'src/nuget/Bootstrap.v3.Datetimepicker.nuspec',
                    '-OutputDirectory',
                    'build/nuget',
                    '-Version',
                    grunt.config.get('pkg').version
                ]
            }, function (error, result) {
                if (error) {
                    grunt.log.error(error);
                } else {
                    grunt.log.write(result);
                }
                done();
            });
        }
        else { //--target=css
            grunt.util.spawn({
                cmd: 'src/nuget/nuget.exe',
                args: [
                    'pack',
                    'src/nuget/Bootstrap.v3.Datetimepicker.CSS.nuspec',
                    '-OutputDirectory',
                    'build/nuget',
                    '-Version',
                    grunt.config.get('pkg').version
                ]
            }, function (error, result) {
                if (error) {
                    grunt.log.error(error);
                } else {
                    grunt.log.write(result);
                }
                done();
            });
        }
    });

    grunt.registerTask('test', ['jshint', 'jscs', 'uglify', 'less', 'jasmine']);
};
