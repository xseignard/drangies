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
      ' */\n'
    },

    // sources definition
    src: {
      js: 'src/js/*.js', 
      index: 'src/index.html',
      css: 'src/assets/css/*.css',
      fonts: 'src/assets/fonts/*.*'
    },
    // delete files and folders
    clean: {
      // delete dist folder and reports one
      defaults: ['<%= distDir %>'],
      // delete artifacts produced during build
      postBuild: ['<%= distDir %>/tmp']
    },
    // concat js files of our app
    concat: {
      options: {
        banner: '<%= meta.banner %>'
      },
      dist: {
        src: ['<%= src.js %>'],
        dest: '<%= distDir %>/assets/<%= pkg.name %>.js'
      }
    },
    // minify the app and vendor libs
    uglify: {
      dist: {
        options: {
          banner: '<%= meta.banner %>'
        },
        files: {
          '<%= distDir %>/assets/<%= pkg.name %>.min.js': [ '<%= distDir %>/assets/<%= pkg.name %>.js' ]
        }
      },
      vendor: {
        files: [
          {
            expand: true,
            cwd: '<%= distDir %>/tmp/vendor',
            src: ['*.js'],
            dest: '<%= distDir %>/assets/vendor',
            ext: '.js'
         }
        ]
      }
    },
    // copy assets
    copy: {
      images: {
        files: [{src: ['**'], dest: '<%= distDir %>/assets/images', cwd: 'src/assets/images', expand: true}]
      },
      fonts: {
        files: [{src: ['**'], dest: '<%= distDir %>/assets/fonts', cwd: 'src/assets/fonts', expand: true}]
      },
      cname: {
        files: [{src: ['CNAME'], dest: '<%= distDir %>/', cwd: '.', expand: true}]
      }
    },
    // copy bower deps
    bower: {
      dev: {
        dest: '<%= distDir %>/tmp/vendor'
      }
    },
    // cssmin
    cssmin: {
      minify: {
        expand: true,
        cwd: 'src/assets/css',
        src: ['*.css'],
        dest: '<%= distDir %>/assets/css',
        ext: '.css'
      }
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
      dist: {
        options: { livereload: true },
        files: ['<%= distDir %>/**']
      },
      dev: {
        files: ['src/**'],
        tasks: ['dev-build']
      }
    }
  });


  // task loading
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-bower');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-clean');
  // imagemin
  // https://gist.github.com/cobyism/4730490
  // http://www.dhar.fr/blog/2012/07/23/some-fun-with-git-hooks-and-grunt-dot-js/
  
  // task to process src/index.html
  grunt.registerTask('index', 'Process index.html template', function () {
    grunt.file.copy('src/index.html', 'dist/index.html', { process: grunt.template.process });
  });
  // tasks to set dev/prod flag
  grunt.registerTask('devFlag', 'dev flag', function () {
    grunt.config.set('dev', true);
    grunt.config.set('prod', false);

  });
   grunt.registerTask('prodFlag', 'prod flag', function () {
    grunt.config.set('prod', true);
    grunt.config.set('dev', false);
  });

  // build
  grunt.registerTask('build', ['clean:defaults', 'jshint', 'concat', 'copy', 'bower', 'uglify', 'cssmin', 'index', 'clean:postBuild']);
  // dev build
  grunt.registerTask('dev-build', ['devFlag', 'build']);
  // prod build
  grunt.registerTask('prod-build', ['prodFlag', 'build']);
};