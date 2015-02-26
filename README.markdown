# Odie - Next-Generation Protokollverkauf #

odie-client is a Knockout.js frontend to [odie-server](https://github.com/fsmi/odie-server).

## Hacking ##

odie-client is written in ECMAScript 6 and uses [Babel](https://babeljs.io/) to transpile it to ES5 as part of its [Broccoli](https://github.com/broccolijs/broccoli) asset pipeline.

To setup odie-client, you need to have [npm](https://npmjs.org/) installed. Then from the odie-client root dir:

```bash
sudo npm install -g broccoli-cli # one-time
sudo npm install -g bower        # one-time
npm install                      # whenever package.json has changed
bower install                    # whenever bower.json has changed
broccoli serve                   # whenever Brocfile.js has changed
```

`serve` will start a local web server with `index.html` at its root and using the odie-server test backend. The server is [LiveReload](http://livereload.com)-enabled, so grab a [browser extension](http://feedback.livereload.com/knowledgebase/articles/86242-how-do-i-install-and-use-the-browser-extensions).
