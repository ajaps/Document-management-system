import coveralls from 'gulp-coveralls';
import exit from 'gulp-exit';
import gulp from 'gulp';
import injectModules from 'gulp-inject-modules';
import istanbul from 'gulp-istanbul';
import jasmineNode from 'gulp-jasmine-node';
import loadPlugins from 'gulp-load-plugins';
import path from 'path';


// Load the gulp plugins into the `plugins` variable
const plugins = loadPlugins();

const sourcePaths = {
  js: ['./**/*.js', '!dist/**', '!node_modules/**', '!coverage/**', '!Documentation/**']
};

// Compile all Babel Javascript into ES5 and place in dist folder
gulp.task('babel', () =>
  gulp.src(sourcePaths.js, { base: '.' })
    .pipe(plugins.babel())
    .pipe(gulp.dest('dist'))
);

// Run test and generate coverage
gulp.task('coverage', (cb) => {
  gulp.src('dist/server/**/*.js')
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .on('finish', () => {
      gulp.src('dist/server/tests/*.js')
      .pipe(plugins.babel())
      .pipe(jasmineNode())
      .pipe(istanbul.writeReports())
      .pipe(istanbul.enforceThresholds({ thresholds: { global: 30 } }))
      .on('end', cb)
      .pipe(exit());
    });
});

gulp.task('coveralls', () => gulp.src('./coverage/lcov')
    .pipe(coveralls()));

// Restart server with on every changes made to file
gulp.task('nodemon', ['babel'], () =>
  plugins.nodemon({
    script: path.join('dist', 'server.js'),
    ignore: ['README.md', 'node_modules/**/*.js', 'dist/**/*.js'],
    ext: 'js',
    tasks: ['babel']
  })
);

gulp.task('test', ['coverage']);
gulp.task('default', ['nodemon']);
gulp.task('production', ['babel']);
