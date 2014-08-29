/**
 * Created by bagrat on 23.08.14.
 */
var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var del = require('del');

// Not all tasks need to use streams
// A gulpfile is just another node program and you can use all packages available on npm
gulp.task('clean', function(cb) {
    // You can use multiple globbing patterns as you would with `gulp.src`
    del(['build'], cb);
});

gulp.task('nodemon',function () {
    nodemon({ script: 'index.js'})
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['nodemon']);