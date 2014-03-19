var
gulp = require('gulp'),
$ = require('gulp-load-plugins')({lazy: false});

var paths = {
  app: {
    scripts: {
      all: '{js,react}/**/*.{js,jsx}',
      entry: 'js/main.jsx'
    },
    stylesheets: 'sass/*.sass'
  },
  dist: {
    root: '../dist',
    scripts: '../dist/js',
    stylesheets: '../dist/css',
    images: '../dist/img'
  },
  tests: '../tests'
};

gulp.task('lint', function() {
  return gulp.src(paths.app.scripts.all)
    .pipe($.jshint())
    .pipe($.jshint.reporter('default'));
});

gulp.task('scripts', function() {
  return gulp.src( paths.app.scripts.entry )
    .pipe( $.browserify({
      transform: ['reactify'],
      insertGlobals : false,
      debug : !$.util.env.production
    }) )
    .pipe($.rename( 'all.js' ))
    .pipe(gulp.dest( paths.dist.scripts ))
    .pipe($.size())
    .pipe($.connect.reload())
});

gulp.task('sass', function () {
  return gulp.src(paths.app.stylesheets)
    .pipe($.rubySass())
    .pipe($.autoprefixer())
    .pipe($.minifyCss())
    .pipe(gulp.dest( paths.dist.stylesheets ))
    .pipe($.size())
    .pipe($.connect.reload())
});

gulp.task('html', function() {
  return gulp.src('app/**/*.html')
    .pipe(gulp.dest( paths.dist.root ))
    .pipe($.size())
    .pipe($.connect.reload())
})

// gulp.task('clean', function () {
//     return gulp.src([paths.dist.stylesheets, path.dist.scripts, path.dist.images], { read: false }).pipe($.clean());
// });

gulp.task('watch', function() {
  gulp.watch(paths.app.scripts.all, ['scripts']);
  gulp.watch(paths.app.stylesheets, ['sass']);
});

gulp.task('connect', $.connect.server({
    root: [paths.dist.root],
    port: 1234,
    livereload: true,
    open: {
      browser: 'Google Chrome'
    }
}));

gulp.task('default', [ 'scripts', 'sass', 'watch' ]);

// gulp.task( 'deploy', [ 'scripts', 'sass' ])
