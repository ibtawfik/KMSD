/**
 * Created by islam on 5/5/15.
 */
module.exports = function(grunt) {

    'use strict';

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                eqnull: true,
                browser: true,
                strict: true,
                undef: true,
                unused: true,
                bitwise: true,
                forin: true,
                freeze: true,
                latedef: true,
                noarg: true,
                nocomma: true,
                nonbsp: true,
                nonew: true,
                notypeof: true,
                jasmine: true,
                jquery: true,
                globals: {
                    module: false, require: false, // for Gruntfile.js
                    exports: false, // for protractor.conf.js
                    inject: false, // testing angular
                    angular: false,
                    console: false,
                    browser: false, element: false, by: false, // Protractor
                },
            },
            all: ['Gruntfile.js', 'karma.conf.js', 'protractor.conf.js', '*.js']
        },
        karma: {
            once: {
                configFile: 'karma.conf.js',
                singleRun: true
            },
            unit: {
                configFile: 'karma.conf.js',
                background: true,
                singleRun: false
            }
        },
        // Run karma and watch files using:
        // grunt karma:unit:start watch
        watch: {
            files: ['*.js'],
            tasks: ['jshint', 'karma:unit:run']
        },
        concat: {
            options: {
                separator: ';',
            },



            dist: {
                // Order is important! gameLogic.js must be first because it defines myApp angular module.
                src: ['gameLogic.js', 'game.js','resizeGameAreaService.js','gameService.js','messageService.js','stateService.js'],
                dest: 'dist/everything.js'
            },
        },
        uglify: {
            options: {
                sourceMap: true,
            },
            my_target: {
                files: {
                    'dist/everything.min.js': ['dist/everything.js']
                }
            }
        },
        processhtml: {
            dist: {
                files: {
                    'game.min.html': ['game.html']
                }
            }
        },


        manifest: {
            generate: {
                options: {
                    basePath: '.',
                    cache: [
                        'http://ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular.js',
                        'http://ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular-touch.js',
                        'http://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/0.12.1/ui-bootstrap-tpls.js',
                        'http://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.css',
                        'http://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/fonts/glyphicons-halflings-regular.woff',
                        'http://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/fonts/glyphicons-halflings-regular.ttf',
                        'resizeGameAreaService.js',
                        'gameService.js',
                        'messageService.js',
                        'stateService.js',
                        'http://yoav-zibin.github.io/emulator/main.css',
                        'dist/everything.min.js',
                        'game.css',
                        'imgs/Help1.png',
                        'imgs/Help2.png',
                        'imgd/Help3.png'
                    ],
                    network: [
                        'dist/everything.min.js.map',
                        'dist/everything.js'
                    ],
                    timestamp: true
                },
                dest: 'game.appcache',
                src: []
            }
        },
        'http-server': {
            'dev': {
                // the server root directory
                root: '.',
                port: 9000,
                host: "0.0.0.0",
                cache: 1,
                showDir : true,
                autoIndex: true,
                // server default file extension
                ext: "html",
                // run in parallel with other tasks
                runInBackground: true
            }
        },
    });


    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-manifest');
    grunt.loadNpmTasks('grunt-http-server');

    //require('load-grunt-tasks')(grunt);

    // Default task(s).
    grunt.registerTask('default', ['jshint', 'karma:unit',
        'concat', 'uglify',
        'processhtml', 'manifest',
        'http-server']);

};