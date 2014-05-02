'use strict';

module.exports = function(grunt) {

  	grunt.loadNpmTasks('grunt-contrib-connect');

  	//capture --port option if passed in or elease default to 8000
	var gruntServPort = grunt.option('port') || 8000;

  	// Project configuration.
  	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		connect: {
			server: {
				options: {
					port: gruntServPort,
					keepalive: true
				}
			}
		}
	});

  	//define grunt serve command to start a local server for dev testing.
	grunt.registerTask('serve', ['connect:server']);

	//default task.
	grunt.registerTask('default', function () {
		console.log('Use "grunt serve" command to start local server on port ' + gruntServPort + '. ');
	});

};