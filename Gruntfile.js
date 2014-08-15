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
                'Gruntfile.js', 'src/js/*.js'
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
                    'moment': false
                }
            }
        },

        jscs: {
            all: [
                'Gruntfile.js', 'src/js/*.js'
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
        }

    });

    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    require('load-grunt-tasks')(grunt);

    // Default task.
    grunt.registerTask('default', ['jshint', 'jscs']);

    // travis build task
    grunt.registerTask('build:travis', [
        // code style
        'jshint', 'jscs'
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
        else {
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
};
