module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    lint: {
      files: ['grunt.js', 'lib/**/*.js']
    },
    hogan: {
      dev: {
        src: 'docs',
        dest: 'dist',
        variables: {
          title: 'test mustache'
        }
      }
    },
    watch: {
      files: ['<config:lint.files>', 'docs/**/*.*'],
      tasks: 'default'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true
      },
      globals: {
        exports: true
      }
    }
  });

  grunt.registerMultiTask('hogan', 'Compiles mustache templates into html files with hogan.js', function(){
      var config = grunt.config(['hogan', this.target]);
      var hogan = require('hogan');
      var fs = require('fs');

      grunt.log.writeln('inside hogan');
      grunt.log.writeln(config.src);

      var pages = fs.readdirSync(config.src);

      pages.forEach(function(name){

        if(!name.match(/\.mustache$/)) {
          return;
        }

        var page = grunt.file.read(config.src + '/' + name);
        //var context = require(config.src + '/data/' + name.replace(/\.mustache$/, '.json'));
        var context = grunt.file.readJSON(config.src + '/data/' + name.replace(/\.mustache$/, '.json'));
        grunt.log.writeln(context);

        grunt.log.writeln('compiling ' + name + '...');
        page = hogan.compile(page);

        grunt.log.writeln('rendering...');
        page = page.render(context);

        grunt.log.writeln(config.dest + '/' + name.replace(/\.mustache$/, '.html'));
        grunt.file.write(config.dest + '/' + name.replace(/\.mustache$/, '.html'), page);

      });

  });

  // Default task.
  grunt.registerTask('default', 'lint hogan');

};