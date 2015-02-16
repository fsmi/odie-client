var concat = require('broccoli-concat');
var mergeTrees = require('broccoli-merge-trees');
var pickFiles = require('broccoli-static-compiler');
var esTranspiler = require('broccoli-babel-transpiler');

var js = 'js/';
var es6js = pickFiles(js, {
  srcDir: '/',
  destDir: '/',
  files: ['app.js', 'lib.js', 'ko/*.js', 'vm/*.js']
});
es6js = esTranspiler(es6js);
var es6polyfill = pickFiles('node_modules/broccoli-babel-transpiler/node_modules/babel-core', {
  srcDir: '/',
  destDir: '/',
  files: ['browser-polyfill.js']
});
js = mergeTrees([js, es6polyfill, es6js], { overwrite: true });
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
