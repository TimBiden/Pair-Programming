const gulp = require('gulp');
const browserify = require('browserify');
const watchify = require('watchify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const rename = require('gulp-rename');

function compile(watch) {
  const bundle = watchify(browserify('./scripts/main.js'));

  function rebundle() {
    bundle
      .transform(babelify)
      .bundle()
      .on('error', function (err) { console.log(err); this.emit('end'); })
      .pipe(source('main.js'))
      .pipe(rename('app.js'))
      .pipe(gulp.dest('public'));
  }

  if (watch) {
    bundle.on('update', () => {
      console.log('--> Bundling...');
      rebundle();
    });
  }

  rebundle();
}

gulp.task('build', function () {
  return compile();
});

gulp.task('watch', function () {
  return compile(true);
});

gulp.task('default', ['build']);
