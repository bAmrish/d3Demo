'use strict';

module.exports = function(grunt) {

  	//capture --port option if passed in or elease default to 8000
	var gruntServePort = grunt.option('port') || 8000;

  	// Project configuration.
  	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		connect: {
			server: {
				options: {
					port: gruntServePort,
					keepalive: true
				}
			}
		},

        open: {
            server: {
                path: 'http://localhost:' + gruntServePort + '/'
            }
        }
	});

    //Load required grunt task
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-open');

    //define grunt serve command to start a local server for server testing.
	grunt.registerTask('serve', ['open:server', 'connect:server']);

	//default task.
	grunt.registerTask('default', function () {
		console.log('Use "grunt serve" command to start local server on port ' + gruntServePort + '. ');
	});

};