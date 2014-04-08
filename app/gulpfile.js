var
gulp = require('gulp'),
$ = require('gulp-load-plugins')({lazy: false}),
paths = {
  app: {
    scripts: {
      all: '{js,react}/**/*.{js,jsx}',
      entry: 'js/main.jsx'
    },
    stylesheets: 'sass/*.sass',
    images: 'img/**/*',
    extras: '*.{png,ico,txt,xml}'
  },
  dist: {
    root: '../dist',
    scripts: '../dist/js',
    stylesheets: '../dist/css',
    images: '../dist/img'
  },
  tests: '../tests'
};

// TODO: Add imageoptim for /img and favicons

gulp.task('lint', function() {
  return gulp.src(paths.app.scripts.all)
    .pipe($.jshint())
    .pipe($.jshint.reporter('default'));
});

gulp.task('scripts', function() {
  return gulp.src(paths.app.scripts.entry)
    .pipe($.browserify({
      transform: ['reactify'],
      insertGlobals : false,
      debug : !$.util.env.production
    }))
    .pipe($.rename('all.js'))
    .pipe(gulp.dest(paths.dist.scripts))
    .pipe($.size())
    .pipe($.connect.reload())
});

gulp.task('sass', function () {
  return gulp.src(paths.app.stylesheets)
    .pipe($.rubySass())
    .pipe($.autoprefixer())
    .pipe($.minifyCss())
    .pipe(gulp.dest(paths.dist.stylesheets))
    .pipe($.size())
    .pipe($.connect.reload())
});

gulp.task('html', function() {
  return gulp.src('app/**/*.html')
    .pipe(gulp.dest(paths.dist.root))
    .pipe($.size())
    .pipe($.connect.reload())
});

gulp.task('images', function() {
  return gulp.src(paths.app.images)
    .pipe(gulp.dest(paths.dist.images))
    .pipe($.size())
    .pipe($.connect.reload())
});

gulp.task('extras', function() {
  return gulp.src(paths.app.extras)
    .pipe(gulp.dest(paths.dist.root))
    .pipe($.size())
    .pipe($.connect.reload())
});

// gulp.task('clean', function () {
//     return gulp.src([paths.dist.stylesheets, path.dist.scripts, path.dist.images], { read: false }).pipe($.clean());
// });

gulp.task('watch', function() {
  gulp.watch(paths.app.scripts.all, ['scripts']);
  gulp.watch(paths.app.stylesheets, ['sass']);
  gulp.watch(paths.app.images, ['images']);
});

gulp.task('gh-pages', function () {
  gulp.src("paths.dist.root")
    .pipe($.ghPages('https://github.com/rileyjshaw/own-this-website.git'));
});

gulp.task('connect', $.connect.server({
    root: [paths.dist.root],
    port: 1234,
    livereload: true,
    open: {
      browser: 'Google Chrome'
    }
}));

gulp.task('default', ['scripts', 'sass', 'html', 'extras', 'images', 'watch']);
gulp.task('deploy', ['scripts', 'sass', 'html', 'extras', 'images', 'gh-pages']);
