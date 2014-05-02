'use strict';

module.exports = function(grunt) {

  	// Project configuration.
  	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		connect: {
			server: {
				option: {
					port: 8000
				}
			}
		}
	});

  	grunt.loadNpmTasks('grunt-contrib-connect');

  	//define grunt serve command to start a local server for dev testing.
	grunt.registerTask('serve', ['connect:server:keepalive']);

	//default task.
	grunt.registerTask('default', function () {
		console.log('Use "grunt serve" command to start local server on port 8000. ');
	});

};