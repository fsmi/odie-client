var concat = require('broccoli-concat');
var mergeTrees = require('broccoli-merge-trees');
var pickFiles = require('broccoli-static-compiler');

var js = 'js/';
js = concat(js, {
  // some scripts depend on the 'jQuery' global
  inputFiles: ['jquery-2.1.1.min.js', '**/*.js'],
  outputFile: '/assets/scripts.js',
  separator: '\n;\n'
});

var css = 'css/';
css = concat(css, {
  inputFiles: ['bootstrap.css', 'bootstrap-theme.css', '*.css'],
  outputFile: '/assets/styles.css'
});

var fonts = 'fonts/';
fonts = pickFiles(fonts, {
  srcDir: '/',
  destDir: '/fonts',
  files: ['*.woff']
});

var views = 'views/';

module.exports = mergeTrees([js, css, fonts, views]);
