import gulp from 'gulp';
import loadPlugins from 'gulp-load-plugins';
import path from 'path';

// Load the gulp plugins into the `plugins` variable
const plugins = loadPlugins();

// Compile all Babel Javascript into ES5 and place in dist folder
gulp.task('babel', () =>
  gulp.src(['server/**/*.js', './server.js'])
    .pipe(plugins.babel())
    .pipe(gulp.dest('dist'))
);

// Restart server with on every changes made to file
gulp.task('nodemon', ['babel'], () =>
  plugins.nodemon({
    script: path.join('dist', 'server.js'),
    ignore: ['README.md', 'node_modules/**/*.js', 'dist/**/*.js'],
    ext: 'js',
    tasks: ['babel']
  })
);

gulp.task('default', ['nodemon']);
gulp.task('production', ['babel']);
