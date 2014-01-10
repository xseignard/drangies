module.exports = function(grunt) {

  // grunt conf
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // some metadata
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
      assets : 'src/assets',
      css: '<%= src.assets %>/css/',
      images: '<%= src.assets %>/images/',
      fonts: '<%= src.assets %>/fonts/'
    },
    // dist folder definition
    distDir: {
      path: 'dist',
      tmp: '<%= distDir.path %>/tmp',
      assets: '<%= distDir.path %>/assets',
      vendor: '<%= distDir.assets %>/vendor',
      fonts: '<%= distDir.assets %>/fonts',
      images: '<%= distDir.assets %>/images',
      css: '<%= distDir.assets %>/css',

    },
    // delete files and folders
    clean: {
      // delete dist folder and reports one
      defaults: ['<%= distDir.path %>'],
      // delete artifacts produced during build
      postBuild: ['<%= distDir.path %>/tmp']
    },
    // concat js files of our app
    concat: {
      options: {
        banner: '<%= meta.banner %>'
      },
      dist: {
        src: ['<%= src.js %>'],
        dest: '<%= distDir.assets %>/<%= pkg.name %>.js'
      }
    },
    // minify the app and vendor libs
    uglify: {
      dist: {
        options: {
          banner: '<%= meta.banner %>'
        },
        files: {
          '<%= distDir.assets %>/<%= pkg.name %>.min.js': [ '<%= distDir.assets %>/<%= pkg.name %>.js' ]
        }
      },
      vendor: {
        files: [
          {
            expand: true,
            cwd: '<%= distDir.tmp %>/vendor',
            src: ['*.js'],
            dest: '<%= distDir.vendor %>',
            ext: '.js'
         }
        ]
      }
    },
    // copy assets
    copy: {
      fonts: {
        files: [
          {
            expand: true,
            cwd: '<%= src.fonts %>',
            src: ['**'],
            dest: '<%= distDir.fonts %>'
          }
        ]
      },
      cname: {
        files: [
          {
            expand: true,
            cwd: '.',
            src: ['CNAME'],
            dest: '<%= distDir.path %>/'            
          }
        ]
      },
      fancyBoxCss: {
        files: [
          {
            expand: true,
            cwd: 'bower_components/fancybox/source',
            src: ['jquery.fancybox.css', 'fancybox_overlay.png', 'fancybox_sprite.png', 'fancybox_loading.gif', 'blank.gif'],
            dest: '<%= distDir.vendor %>'            
          }
        ]
      }
    },
    // copy bower deps before they got minified
    bower: {
      dev: {
        dest: '<%= distDir.tmp %>/vendor'
      }
    },
    // cssmin
    cssmin: {
      minify: {
        expand: true,
        cwd: '<%= src.css %>',
        src: ['*.css'],
        dest: '<%= distDir.css %>',
        ext: '.css'
      }
    },
    // imagemin
    imagemin: {
      images: {
        files: [{
          expand: true,
          cwd: '<%= src.images %>',
          src: ['**/*.{png,jpg,gif}'],
          dest: '<%= distDir.images %>'
        }]
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
        files: ['<%= distDir.path %>/**']
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
  grunt.loadNpmTasks('grunt-contrib-imagemin');

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
  grunt.registerTask('build', ['clean:defaults', 'jshint', 'concat', 'copy', 'bower', 'uglify', 'cssmin', 'imagemin', 'index', 'clean:postBuild']);
  // dev build
  grunt.registerTask('dev-build', ['devFlag', 'build']);
  // prod build
  grunt.registerTask('prod-build', ['prodFlag', 'build']);
};