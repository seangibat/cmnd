module.exports = function(grunt) {

  grunt.initConfig({
    tags: {
      build: {
        src: [
          'public/js/*.js'
        ],
        dest: 'site/index.html'
      }
    }
  });

};