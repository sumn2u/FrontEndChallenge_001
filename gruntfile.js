module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			all: ['Gruntfile.js']
		},
		watch: {
			scripts: {
				files: '**/*.*',
				tasks: ['default'],
				options: {
					spawn:false
				},
			},
      templates: {
              files: ['templates/*.html'], // which files to watch
              tasks: ['ngtemplates'],
              options: {
                  nospawn: true
              }
          }
		},
		concat: {
			options: {
				seperator: ";\n\n;" //seprator to identify
			},
			lib_and_app: {
				src: ['lib/angular/angular.js', 'lib/angular/angular-animate.js','lib/angular-route/angular-ui-router.js', 'lib/loading-bar/loading-bar.js', 'lib/dir-pagination/dirPagination.js','lib/jquery.js','lib/notify.js','lib/bootstrap/bootstrap.min.js','app/app.js'],
				dest: "dist/daliaresearch.js"
			},
		},
    ngtemplates: { //compiling angular templates
       surveyapp: {
         src: ['templates/**.html'],
         dest: 'dist/lib/templates.js',
         options: {
           htmlmin: {
                 collapseWhitespace: true,
                 collapseBooleanAttributes: true
           }
         }
       }
     },
		cssmin: {
			target: {
				files: [{
					expand: true,
					cwd: 'css',
					src: ['*.css', '!*.min.css'],
					dest: 'dist/css/',
					ext: '.min.css'
				}]
			}
		},
		copy: {
		  main: {
		    files: [
		      {expand: true, cwd: '', src: ['index.html'], dest: 'dist/'},
					{expand: true, cwd: '', src: ['css/*'], dest: 'dist/'},
		    ],
		  },
		},
		uglify: {
			my_target: {
				options: {
					mangle: false
				},
				files: {
					"dist/daliaresearch.min.js": ["dist/daliaresearch.js"]
				}
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-angular-templates');
	grunt.registerTask('default', ['jshint','ngtemplates','concat:lib_and_app', 'uglify', 'copy','watch']);
};
