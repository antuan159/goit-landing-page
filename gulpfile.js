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
  rename = require('gulp-rename'),
  gcmq = require('gulp-group-css-media-queries'),
  browserSync = require('browser-sync').create();

gulp.task('minify', function () {
  return gulp.src('src/*.html')
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest('build'))
});

gulp.task('sass', function () {
  return gulp.src('src/scss/**/*.scss')
  .pipe(sourcemaps.init())
  .pipe(sass())
  .on("error", notify.onError({
    message: "Error: <%= error.message %>",
    title: "Error running something"
  }))
  .pipe(autoprefixer(['last 10 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
  .pipe(gcmq())
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('src/css'))
});

gulp.task('css-min', function () {
  return gulp.src('src/css/**/*.css')
  .pipe(csso())
  .pipe(rename('style.min.css'))
  .pipe(gulp.dest('build/css'))
});

gulp.task('font', function () {
  return gulp.src('src/fonts/**/*')
  .pipe(gulp.dest('build/fonts'));
});

gulp.task('img-min', function () {
  return gulp.src('src/img/**/*.{gif,jpg,jpeg,png,svg}')
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
});

gulp.task("script", function () {
  return gulp.src("src/script/main.js")
  .pipe(babel())
  .pipe(uglify())
  .pipe(gulp.dest("build/script"));
});

gulp.task('serve', function () {
  browserSync.init({
    server: {
      baseDir: "./src"
    }
  });
  browserSync.watch('src', browserSync.reload)
});

gulp.task('watch', function () {
  gulp.watch('src/scss/**/*.scss', gulp.series('sass'));
});

gulp.task('default', gulp.series(
  gulp.parallel('sass'),
  gulp.parallel('watch', 'serve')
));

gulp.task('build', gulp.series(
  gulp.parallel('minify', 'img-min', 'css-min', 'img-min', 'script', 'font')
));