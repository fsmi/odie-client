var concat = require('broccoli-concat');
var mergeTrees = require('broccoli-merge-trees');
var Funnel = require('broccoli-funnel');
var esTranspiler = require('broccoli-babel-transpiler');
var lessCompiler = require('broccoli-less-single');
var replace = require('broccoli-string-replace');

var jsDeps = new Funnel('bower_components/', {
  files: [
    'bootstrap/dist/js/bootstrap.js',
    'jquery/dist/jquery.js',
    'jquery-cookie/jquery.cookie.js',
    'knockout/dist/knockout.js',
    'knockout-es5/dist/knockout-es5.js',
    'typeahead.js/dist/typeahead.jquery.js'
  ]
});
// bootstrapify typeahead markup
var jsDeps = replace(jsDeps, {
  files: ['typeahead.js/dist/typeahead.jquery.js'],
  patterns: [{
    match: /<span class="tt-suggestions"><\/span>/,
    replacement: '<ul class="tt-suggestions"></ul>'
  }, {
    match: /<div class="tt-suggestion"><\/div>/,
    replacement: '<li class="tt-suggestion"></li>'
  }]
});

var js = 'js/';
var es6js = new Funnel(js, {
  include: ['app.js', 'config.js', 'lib.js', 'ko/*.js', 'vm/*.js']
});
es6js = esTranspiler(es6js);
var es6polyfill = new Funnel('node_modules/broccoli-babel-transpiler/node_modules/babel-core', {
  include: ['browser-polyfill.js']
});
js = mergeTrees([jsDeps, es6polyfill, js, es6js], { overwrite: true });
js = concat(js, {
  // some scripts depend on the 'jQuery' or 'ko' global
  inputFiles: ['jquery/dist/jquery.js', 'knockout/dist/knockout.js', '**/*.js'],
  outputFile: '/assets/scripts.js',
  separator: '\n;\n'
});

var less = mergeTrees([
  'bower_components/bootstrap/less/',
  'less/'
]);
css = mergeTrees([
  lessCompiler(less, 'bootstrap.my.less', 'bootstrap.css'),
  new Funnel('bower_components/bootstrap/dist/css', {
    files: ['bootstrap-theme.css']
  }),
  'css/'
]);
css = concat(css, {
  inputFiles: [
    'bootstrap.css',
    'bootstrap-theme.css',
    'fontello.css',
    'app.css',
    'login.css'
  ],
  outputFile: '/assets/styles.css'
});

var fonts = 'fonts/';
fonts = new Funnel(fonts, {
  include: ['*.woff', '*.ttf'],
  destDir: '/fonts'
});

var views = 'views/';

module.exports = mergeTrees([js, css, fonts, views]);
