// Plugins
var gulp = require('gulp'); // https://github.com/gulpjs/gulp
var sass = require('gulp-sass'); // https://github.com/dlmanning/gulp-sass
var webserver = require('gulp-webserver'); // https://github.com/schickling/gulp-webserver



// Sass
gulp.task('sass', function() {
  return gulp.src('css/*.scss')
  .pipe( sass() )
  .on('error', function(err) {
    console.log( err.message );
  })
  .pipe( gulp.dest('css/') );
});



// Webserver
gulp.task('webserver', function() {
  gulp.src('.').pipe(webserver({
    host: '0.0.0.0',
    port: '8080',
    livereload: true,
    directoryListing: false,
    open: false
  }));
});



// Tasks
gulp.task('dev', ['sass', 'watch', 'webserver']);

gulp.task('watch', function() {
  gulp.watch(['css/**/*.scss'], ['sass']);
});

// List Commands
gulp.task('default', function() {
  // Highlight Function
  function highlight(text) { return '\033[0;36m'+ text +'\033[0m'; }

  // Heading
  console.log('\n');
  console.log('GULP TASKS');
  console.log('----------');

  // List
  console.log( highlight('dev ')+ '[sass, watch, webserver]');
  console.log( highlight('watch ')+ '[sass]');
  console.log( highlight('sass') );
  console.log( highlight('webserver') );

  // Space
  console.log('\n');
});
