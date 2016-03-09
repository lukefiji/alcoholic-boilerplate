"use strict";

var gulp = require("gulp"),
    sass = require("gulp-sass"),
browserSync = require("browser-sync"),
     rename = require("gulp-rename"),
       maps = require("gulp-sourcemaps"),
     inject = require("gulp-inject"),
        del = require("del");

// Compile SASS files
gulp.task("sass", function() {
  gulp.src("src/scss/**/*.scss")
      .pipe(maps.init())
      .pipe(sass())
      .pipe(maps.write('./'))
      .pipe(gulp.dest("dist/css"))
      .pipe(browserSync.reload({
        stream: true
      }));
});

// Spin up a server
gulp.task("browserSync", function() {
  browserSync({
    server: {
      baseDir: "dist"
    }
  });
});

// Live reload anytime a file changes
gulp.task("watch", ["browserSync", "sass"], function() {
  gulp.watch("src/scss/**/*.scss", ["sass"]);
  gulp.watch("dist/*.html").on("change", browserSync.reload);
});

// Clean the dist folder
gulp.task("clean", function() {
  del(["dist"]);
});

// Copy html files
gulp.task('copyHtml', function() {
    gulp.src('./src/index.html')
    // Perform minification tasks, etc here
    .pipe(gulp.dest('./dist'));
});

// Inject css & js into html
gulp.task("inject", [ "sass", "copyHtml"], function() {
  var target = gulp.src('./dist/index.html');
  var sources = gulp.src(['./dist/**/*.js', './dist/**/*.css'], {read: false});

  return target.pipe(inject(sources))
               .pipe(gulp.dest('./dist'));
});

// Compiles all gulp tasks
gulp.task("default", ["sass", "copyHtml", "inject"]);
