var gulp = require('gulp');
var $ = require('gulp-load-plugins')({lazy: false});

// cli arguments
var argv = require('minimist')(process.argv.slice(2));
// parse unnamed arguments [cdn, url, port]
// indexed assuming that ._[0] will be 'watch' or 'deploy'
if(argv._[1] !== undefined) {
  argv.cdn = argv._[1];
  if(argv._[2] !== undefined) {
    argv.url = argv._[2];
    if(argv[3] !== undefined) {
      argv.port = argv._[3];
    }
  }
}
// set defaults
if(!argv.hasOwnProperty('cdn')) {
  if(argv.dev || argv._[0] === 'watch') {
    argv.cdn = 'localhost';
  } else {
    argv.cdn = 'own.rileyjshaw.com';  //replace this with wherever you're keeping the static content
  }
}
if(!argv.hasOwnProperty('url')) {
  argv.url = argv.dev ? 'localhost' : 'toyserver.rileyjshaw.com';  //replace this with your own socket server
}
if(!argv.hasOwnProperty('port')) {
  argv.port = '8000';
}

var paths = {
  app: {
    scripts: {
      all: '{js,react}/**/*.{js,jsx}',
      entry: 'js/main.jsx'
      // bower components pulled in with usemin
    },
    stylesheets: ['css/*.css', 'sass/*.sass'],
    images: 'img/**/*.{gif, png, jpg}',
    svgs: 'img/**/*.svg',
    extras: ['*.{png,ico,txt,xml}', '404.html', 'CNAME'],
    temp: 'temp'
  },
  dist: {
    // BE VERY CAREFUL CHANGING ROOT VALUE (see clean_dist task)
    root: '../dist',
    scripts: '../dist/js',
    stylesheets: '../dist/css',
    images: '../dist/img'
  }
};

gulp.task('build_app', function() {
  var debug;
  if(argv.dev) {
    debug: true;
  } else {
    debug: false;
    process.env.NODE_ENV = 'production';
  }

  return gulp.src(paths.app.scripts.entry)
    .pipe($.replace('<YOUR CDN HERE>', argv.cdn))
    .pipe($.replace('<YOUR SERVER HERE>', argv.url))
    .pipe($.replace('<PORT>', argv.port))
    .pipe($.browserify({
      transform: ['reactify'],
      insertGlobals: false,
      debug: debug
    }))
    .pipe($.jshint())
    .pipe($.jshint.reporter('default'))
    .pipe($.rename('app.js'))
    .pipe(gulp.dest(paths.app.temp))
    .pipe($.size())
    .pipe($.connect.reload())
});

gulp.task('usemin', function() {
  gulp.src('index.html')
    .pipe($.usemin())
    .pipe(gulp.dest(paths.app.temp))
    .pipe($.size());
});

gulp.task('js_concat', ['build_app', 'usemin'], function() {
  return gulp.src([paths.app.temp + '/js/*.js', paths.app.temp + '/*.js'])
    .pipe($.concat('all.js'))
    .pipe($.if(!argv.dev, $.uglify()))
    .pipe(gulp.dest(paths.dist.scripts))
    .pipe($.size())
});

gulp.task('sass', function () {
  return gulp.src(paths.app.stylesheets)
    .pipe($.rubySass())
    .pipe($.concat('main.css'))
    .pipe($.autoprefixer())
    .pipe($.if(!argv.dev, $.minifyCss()))
    .pipe(gulp.dest(paths.dist.stylesheets))
    .pipe($.size())
    .pipe($.connect.reload())
});

gulp.task('html', ['scripts'], function() {
  return gulp.src(paths.app.temp + '/*.html')
    .pipe($.if(!argv.dev, $.minifyHtml({empty: true})))
    .pipe(gulp.dest(paths.dist.root))
    .pipe($.size())
    .pipe($.connect.reload())
});

gulp.task('images', [], function() {
  return gulp.src(paths.app.images)
    .pipe($.imagemin())
    .pipe(gulp.dest(paths.dist.images))
    .pipe($.size())
    .pipe($.connect.reload())
});

gulp.task('svgs', [], function() {
  return gulp.src(paths.app.svgs)
    .pipe($.svgmin())
    .pipe(gulp.dest(paths.dist.images))
    .pipe($.size())
    .pipe($.connect.reload())
});

gulp.task('extras', function() {
  return gulp.src(paths.app.extras)
    .pipe($.imagemin())
    .pipe(gulp.dest(paths.dist.root))
    .pipe($.size())
    .pipe($.connect.reload())
});

gulp.task('clean_temp', ['scripts', 'html', 'images', 'svgs'], function () {
  return gulp.src(paths.app.temp, {read: false})
    .pipe($.clean());
});

gulp.task('watch_files', function() {
  gulp.watch(paths.app.scripts.all, ['scripts']);
  gulp.watch(paths.app.stylesheets, ['sass']);
  gulp.watch(paths.app.images, ['images']);
});

gulp.task('gh_pages', ['default'], function () {
  gulp.src(paths.dist.root + '/**/*')
    .pipe($.ghPages('https://github.com/rileyjshaw/own-this-website.git', 'origin'));
});

gulp.task('connect', ['default'], $.connect.server({
    root: [paths.dist.root],
    port: 1234,
    livereload: true,
    open: {
      browser: 'Google Chrome'
    }
}));

gulp.task('scripts', ['build_app', 'usemin', 'js_concat']);
gulp.task('default', ['scripts', 'sass', 'html', 'extras', 'images', 'svgs', 'clean_temp']);

// These are the ones you'll want to call.
//
// Be very careful using clean_dist; since force
// is sent to true, it has the potential to delete
// anything in your filesystem. You've been warned!
gulp.task('clean_dist', function () {
  return gulp.src(paths.dist.root, {read: false})
    .pipe($.clean({force: true})); // !!!
});
gulp.task('watch', ['default', 'watch_files', 'connect']);
gulp.task('deploy', ['default', 'gh_pages']);
