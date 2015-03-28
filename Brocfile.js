var concat = require('broccoli-concat');
var mergeTrees = require('broccoli-merge-trees');
var Funnel = require('broccoli-funnel');
var lessCompiler = require('broccoli-less-single');
var replace = require('broccoli-string-replace');
var browserify = require('broccoli-fast-browserify');

var env = process.env.BROCCOLI_ENV || 'development';

// bootstrapify typeahead markup
var typeahead = new Funnel('node_modules/typeahead.js/dist', { files: ['typeahead.jquery.js'] });
typeahead = replace(typeahead, {
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

// Transpile and concatenate js and inline views via browserify.
// We use browserify instead of broccoli for transpilation to get correct source maps.
var views = new Funnel('views/', {
  destDir: 'views/'
});
js = mergeTrees([typeahead, js, views]);
js = browserify(js, {
  browserify: {
    debug: env === 'development' // source maps
  },
  bundles: {
    'assets/scripts.js': {
      transform: [require('babelify'), require('brfs')],
      entryPoints: ['main.js']
    }
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
