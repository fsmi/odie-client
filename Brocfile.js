var concat = require('broccoli-concat');
var mergeTrees = require('broccoli-merge-trees');
var Funnel = require('broccoli-funnel');
var lessCompiler = require('broccoli-less-single');
var replace = require('broccoli-string-replace');
var browserify = require('broccoli-fast-browserify');

var env = process.env.BROCCOLI_ENV || 'development';

// fix https://github.com/timschlechter/bootstrap-tagsinput/pull/377
var tagsinput = new Funnel('node_modules/bootstrap-tagsinput/src', { files: ['bootstrap-tagsinput.js'] });
tagsinput = replace(tagsinput, {
  files: ['bootstrap-tagsinput.js'],
  patterns: [{
    match: /\.on\('typeahead:selected'/,
    replacement: ".on('typeahead:selected typeahead:autocompleted'",
  }],
});

var js = 'js/';

// Transpile and concatenate js and inline views via browserify.
// We use browserify instead of broccoli for transpilation to get correct source maps.
var views = new Funnel('views/', {
  destDir: 'views/'
});
js = mergeTrees([tagsinput, js, views]);
js = browserify(js, {
  browserify: {
    debug: env === 'development' // source maps
  },
  bundles: {
    'assets/scripts.js': {
      transform: [require('babelify'), { tr: require('browserify-shim'), options: { global: true } }, require('brfs')],
      entryPoints: ['main.js']
    }
  }
});

var css = mergeTrees([
  'css/',
  'less/',
  'node_modules/bootstrap/less/',
  'node_modules/bootstrap-tagsinput/dist',
  'node_modules/bootstrap-datepicker/dist/css',
]);
css = lessCompiler(css, 'app.less', 'assets/styles.css');

var fonts = 'fonts/';
fonts = new Funnel(fonts, {
  include: ['*.woff', '*.ttf'],
  destDir: '/fonts'
});

var images = 'images/';
images = new Funnel(images, {
  include: ['*.png' ],
  destDir: '/images'
});

var index = new Funnel('views/', {
  files: ['index.html']
});

// the pdf.js node packages don't include a viewer, and it's too much of a hassle to write and maintain one,
// so we instead use the default viewer, which is only distributed with the zip file.
// see http://mozilla.github.io/pdf.js/ if you want to update the included viewer.
// Unzipping a new release into an emptied pdfjs/ directory should work.
var pdfjs = new Funnel('pdfjs/', {
  exclude: ['LICENSE'],
  destDir: '/pdfjs'
});

module.exports = mergeTrees([js, css, fonts, images, index, pdfjs]);
