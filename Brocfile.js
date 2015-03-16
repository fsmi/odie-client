var concat = require('broccoli-concat');
var mergeTrees = require('broccoli-merge-trees');
var Funnel = require('broccoli-funnel');
var esTranspiler = require('broccoli-babel-transpiler');
var lessCompiler = require('broccoli-less-single');
var replace = require('broccoli-string-replace');
var webpackify = require('broccoli-webpack');
var dereference = require('broccoli-dereference');

// deps we have to load via relative paths (e.g., './knockout-es5' instead of 'knockout-es5')
// because they're not their package.json's 'main' file or we need to patch them
var jsDeps = mergeTrees([
    new Funnel('node_modules/', { files: ['bootstrap/js/modal.js'] }),
    new Funnel('node_modules/knockout-es5/src/', { files: ['knockout-es5.js'] }),
    new Funnel('node_modules/broccoli-babel-transpiler/node_modules/babel-core', { files: ['browser-polyfill.js'] }),
    new Funnel('node_modules/typeahead.js/dist', { files: ['typeahead.jquery.js'] })
]);
// bootstrapify typeahead markup
var jsDeps = replace(jsDeps, {
  files: ['typeahead.jquery.js'],
  patterns: [{
    match: /<span class="tt-suggestions"><\/span>/,
    replacement: '<ul class="tt-suggestions"></ul>'
  }, {
    match: /<div class="tt-suggestion"><\/div>/,
    replacement: '<li class="tt-suggestion"></li>'
  }]
});

var js = 'js/';
js = esTranspiler(js);

// inline views via webpack
var views = new Funnel('views/', {
  destDir: 'views/'
});
js = mergeTrees([jsDeps, js, views]);
js = dereference(js); // webpack doesn't seem to like symlinks
js = webpackify(js, {
  entry: './main',
  output: { filename: 'assets/scripts.js' },
  module: {
    loaders: [
      // Bind 'window' to global one. Don't even ask.
      { test: 'main.js', loader: 'imports?this=>window&window=>this' },
      { test: /\.html$/, loader: 'raw' },
      { test: '../typeahead.jquery.js', loader: 'imports?jQuery=jquery' }
    ]
  }
});

var less = mergeTrees([
  'node_modules/bootstrap/less/',
  'less/'
]);
css = mergeTrees([
  lessCompiler(less, 'bootstrap.my.less', 'bootstrap.css'),
  new Funnel('node_modules/bootstrap/dist/css', {
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

var index = new Funnel('views/', {
  files: ['index.html']
});

module.exports = mergeTrees([js, css, fonts, index]);
