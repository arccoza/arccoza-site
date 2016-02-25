var browserify = require('browserify');
// var assign = require('object-assign');
// var minimatch = require('minimatch');

var renderBrowserify = function(data, options, callback) {
  options = hexo.theme.config.browserify || hexo.config.browserify || options || {};
  console.log(data.path, options);

  var b = browserify(options);
  b.add(data.path);
  b.bundle(function(err, buf) {
    callback(err, buf && buf.toString());
  });

  // return 'nada';
}

hexo.extend.renderer.register('js', 'js', renderBrowserify);
