module.exports = function(grunt) {

  // grunt conf
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // some metadata
    distDir: 'dist',
    meta: {
      // banner that wil be used in files
      banner:
      '/**\n' +
      ' * <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
      ' * <%= pkg.homepage %>\n' +
      ' *\n' +
      ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
      ' * Licensed <%= pkg.license %>\n' +
      ' */\n',
      reportsDir: 'reports'
    },

    // sources definition
    src: {
      js: ['js/*.js'], 
      index: 'index.html',
      css: 'css/*.css'
    },
    // js linting
    jshint: {
      all: ['<%= src.js %>', 'Gruntfile.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    // check for changes
    watch: {
      // reload web page when a change occurs
      all: {
        options: { livereload: true },
        files: ['<%= src.js %>', '<%= src.css %>', '<%= src.index %>']
      }
    }
  });


  // task loading
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  // imagemin
  // https://gist.github.com/cobyism/4730490
  // http://www.dhar.fr/blog/2012/07/23/some-fun-with-git-hooks-and-grunt-dot-js/
};