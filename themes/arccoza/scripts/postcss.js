var postcss = require('postcss');

var renderPostCSS = function (data, options) {
  var _cwd = process.cwd();
  // console.log(__dirname, process.cwd());
  // console.log(hexo.theme);
  try {
    process.chdir(hexo.theme.context.theme_dir);
    // console.log(`Switch to new CWD: ${process.cwd()}`);
  }
  catch (err) {
    console.log(`chdir: ${err}`);
  }

  var plugins = Object.keys(hexo.theme.config.postcss.plugins)
  .map(function (pluginName) {
    return require(pluginName)
    (hexo.theme.config.postcss.plugins[pluginName] || undefined);
  });

  return postcss(plugins)
  .process(data.text)
  .then(function (result) {
    try {
      process.chdir(_cwd);
      // console.log(`Switch to old CWD: ${process.cwd()}`);
    }
    catch (err) {
      console.log(`chdir: ${err}`);
    }

    return result.css;
  });
};

hexo.extend.renderer.register('css', 'css', renderPostCSS);