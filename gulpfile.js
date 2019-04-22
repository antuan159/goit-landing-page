let gulp = require('gulp'),
  sass = require('gulp-sass'),
  csso = require('gulp-csso'),
  notify = require('gulp-notify'),
  babel = require("gulp-babel"),
  uglify = require('gulp-uglify'),
  sourcemaps = require('gulp-sourcemaps'),
  autoprefixer = require('gulp-autoprefixer'),
  htmlmin = require('gulp-html-minifier'),
  imagemin = require('gulp-imagemin'),
  gcmq = require('gulp-group-css-media-queries'),
  browserSync = require('browser-sync').create();

gulp.task('minify', function () {
  return gulp.src('src/pages/*.html')
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest('build'))
});

gulp.task('sass', function () {
  return gulp.src('src/assets/scss/**/*.scss')
  .pipe(sourcemaps.init())
  .pipe(sass())
  .on("error", notify.onError({
    message: "Error: <%= error.message %>",
    title: "Error running something"
  }))
  .pipe(autoprefixer(['last 10 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
  .pipe(gcmq())
  .pipe(csso())
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('build/css'))
});

gulp.task('font', function () {
  return gulp.src('src/assets/fonts/**/*')
  .pipe(gulp.dest('build/fonts'));
});

gulp.task('img', function () {
  return gulp.src('src/assets/img/**/*.{gif,jpg,jpeg,png,svg}')
  .pipe(gulp.dest('build/img'));
});

gulp.task('img-min', function (done) {
  gulp.src('build/img/*')
  .pipe(imagemin([
    imagemin.gifsicle({interlaced: true}),
    imagemin.jpegtran({progressive: true}),
    imagemin.optipng({optimizationLevel: 5}),
    imagemin.svgo({
      plugins: [
        {removeViewBox: true},
        {cleanupIDs: false}
      ]
    })
  ]))
  .pipe(gulp.dest('build/img'));
  done();
});

gulp.task("script", function () {
  return gulp.src("src/assets/script/main.js")
  .pipe(babel())
  .pipe(uglify())
  .pipe(gulp.dest("build/script"));
});

gulp.task('serve', function () {
  browserSync.init({
    server: {
      baseDir: "./build"
    }
  });
  browserSync.watch('build', browserSync.reload)
});

gulp.task('watch', function () {
  gulp.watch('src/pages/*.html', gulp.series('minify'));
  gulp.watch('src/assets/fonts/**/*', gulp.series('font'));
  gulp.watch('src/assets/img/**/*', gulp.series('img'));
  gulp.watch('src/assets/scss/**/*.scss', gulp.series('sass'));
  gulp.watch('src/assets/script/*.js', gulp.series('script'));
});

gulp.task('default', gulp.series(
  gulp.parallel('sass', 'minify', 'script', 'font', 'img'),
  gulp.parallel('watch', 'serve')
));

gulp.task('build', gulp.series(
  gulp.parallel('img-min')
));