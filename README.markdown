# Odie - Next-Generation Protokollverkauf #

odie-client is a Knockout.js frontend to [odie-server](https://github.com/fsmi/odie-server).

## Hacking ##

odie-client uses [Broccoli](https://github.com/broccolijs/broccoli) for assets compilation and concatenation.

To setup odie-client, you need to have [npm](https://npmjs.org/) installed. Then from the odie-client root dir:

```bash
sudo install -g broccoli-cli # puts `broccoli` in your PATH
npm install
broccoli serve
```

`serve` will start a local web server with `index.html` at its root and using the odie-server test backend. The server is [LiveReload](http://livereload.com)-enabled, so grab a [browser extension](http://feedback.livereload.com/knowledgebase/articles/86242-how-do-i-install-and-use-the-browser-extensions).
