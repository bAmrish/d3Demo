module.exports = function(grunt) {

  	// Project configuration.
  	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		connect: {
			server: {
				option: {
					port: 8000,
					keepalive: true  
				}
			}
		}
	});

  	grunt.loadNpmTasks('grunt-contrib-connect');

	// Default task(s).
	grunt.registerTask('default', ['connect:server:keepalive']);

};