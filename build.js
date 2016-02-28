var metalsmith = require('metalsmith');
var markdown = require('metalsmith-markdown');
var highlight = require('highlight.js');
var layouts = require('metalsmith-layouts');
// var postcss = require('postcss');
var browserify = require('metalsmith-browserify');
var more = require('metalsmith-more');
var permalinks = require('metalsmith-permalinks');
var collections = require('metalsmith-collections');
var paginate = require('metalsmith-pagination');
var snippet = require('metalsmith-snippet');
var metadata = require('metalsmith-metadata');
var fileMetadata = require('metalsmith-filemetadata');
var watch = require('metalsmith-watch');
var serve = require('metalsmith-serve');
var marked = require('marked');
var markedRenderer = new marked.Renderer();

markedRenderer.code = function (code, lang) {
  try {
    code = highlight.highlight(lang, code, true).value;
  } catch (ex) {
  }

  return '<pre class="highlight highlight--block"><code>' + code + '</code></pre>';
}

markedRenderer.codespan = function (code) {
  try {
    code = highlight.highlightAuto(code).value;
  } catch (ex) {
  }
  
  return '<code class="highlight highlight--span">' + code + '</code>';
}

// console.log(marked('```\nvar a;\n```', { renderer: markedRenderer }));

var postcssPlugins = {};
postcssPlugins['import'] = require('postcss-import');
postcssPlugins['layout'] = require('postcss-layout');
postcssPlugins['if-media'] = require('postcss-if-media');
postcssPlugins['aspect-ratio'] = require('postcss-aspect-ratio');
postcssPlugins['custom-media'] = require('postcss-custom-media');
postcssPlugins['media-minmax'] = require('postcss-media-minmax');
postcssPlugins['autoprefixer'] = require('autoprefixer');
// postcssPlugins['layout'] = require('postcss-layout');


metalsmith(__dirname)
  .source('src')
  .destination('pub')
  .use(watch())
  .use(serve())
  .use(metadata({
    site: 'site.yaml',
    menus: 'menus.yaml'
  }))
  // .use(fileMetadata([
  //   {pattern: "posts/*", metadata: {"type": "post"}},
  //   {pattern: "projects/*", metadata: {"type": "projects"}}
  // ]))
  .use(function(options){
    options = options || {};
    options.pattern = options.pattern || ['**/*.md'];
    options.pattern = Array.isArray(options.pattern) ? options.pattern : [options.pattern];
    var moment = require('moment');
    var match = require('multimatch');


    var recur = function(obj) {
      var self = recur;
      var m = null;

      if(Array.isArray(obj)) {
        // console.log('-- array --');
        for(var i = 0, v; v = obj[i++];) {
          // console.log('----------------------', i - 1, v);
          v = self(v);
          obj[i - 1] = v;
        }
      }
      else if(obj instanceof Date) {
        // console.log('-- value --');
        m = moment(obj);
        return m.isValid() ? m : obj;
      }
      else if(obj && typeof obj === 'object' && !(obj instanceof Buffer || obj instanceof ArrayBuffer)) {
        // console.log('-- object --');
        for(k in obj) {
          if(obj.hasOwnProperty(k)) {
            var v = obj[k];
            // console.log('----------------------', k, v);
            v = self(v);
            obj[k] = v;
          }
        }
      }
      
      // console.log('-- return --');
      return obj;
    }

    return function metalsmithMoment(files, metalsmith, done) {
      var fa = match(Object.keys(files), options.pattern);
      var fo = {};
      for(var i = 0, f; f = fa[i++];) {
        fo[f] = files[f];
      }
      // console.log(new Buffer('a') instanceof Buffer);
      recur(fo);
      // console.log(metalsmith._metadata);
      recur(metalsmith._metadata);

      // console.log(metalsmith._metadata);
      // console.log(files['img/logo.svg'].contents instanceof Buffer);

      done();
    }
  }())
  .use(collections({
    all: {
      pattern: '@(posts|projects)/**/*.md',
      sortBy: 'date',
      reverse: true
    },
    posts: {
      pattern: 'posts/**/*.md',
      sortBy: 'date',
      reverse: true
    },
    projects: {
      pattern: 'projects/**/*.md',
      sortBy: 'date',
      reverse: true
    },
    pages: {
      pattern: 'pages/**/*.md',
      sortBy: 'date',
      reverse: true
    }
  }))
  .use(paginate({
    'collections.all': {
      perPage: 9,
      layout: 'index.jade',
      first: 'index.html',
      path: 'all/page/:num/index.html',
      pageMetadata: {
        //title: 'Blog'
      }
    },
    'collections.posts': {
      perPage: 9,
      layout: 'index.jade',
      first: 'posts/index.html',
      path: 'posts/page/:num/index.html',
      pageMetadata: {
        //title: 'Blog'
      }
    },
    'collections.projects': {
      perPage: 9,
      layout: 'index.jade',
      first: 'projects/index.html',
      path: 'projects/page/:num/index.html',
      pageMetadata: {
        //title: 'Blog'
      }
    }
  }))
  .use(markdown({
    gfm: true,
    tables: true,
    renderer: markedRenderer,
    highlight: function(code, lang) {
      if(!lang) {
        return code;
      }

      try {
        return highlight.highlight(lang, code, true).value;
      } catch (ex) {
        return code;
      }
    }
  }))
  .use(more({
    key: 'excerpt'
  }))
  .use(snippet({
    maxLength: 250,
    suffix: '...'
  }))
  .use(permalinks({
    // match: { collection: 'posts' },
    // pattern: ':date/:title',
    // date: 'YYYY/MM/DD'
  	linksets: [{
      match: { collection: 'posts' },
      pattern: ':date/:title',
      date: 'YYYY/MM/DD'
    },{
      match: { collection: 'projects' },
      pattern: 'projects/:title',
      date: 'YYYY/MM/DD'
    },{
      match: { collection: 'pages' },
      pattern: ':title'
    }]
  }))
  .use(function(){
    return function(files, metalsmith, done) {
      // console.log(files);
      // console.log(metalsmith._metadata.collections.posts);
      done();
    }
  }())
  .use(layouts({
    engine: 'jade',
    directory: 'templates',
    default: 'post.jade',
    pattern: ['**/*.html']
  }))
  // .use(postcss([
  //   postcssPlugins['import'],
  //   postcssPlugins['custom-media'],
  //   postcssPlugins['media-minmax'],
  //   postcssPlugins['if-media'],
  //   postcssPlugins['layout'],
  //   postcssPlugins['aspect-ratio']
  // ]))
  .use(
    function(options){
      options = options || {};
      options.pattern = options.pattern || ['**/*.css', '!**/_*/*', '!**/_*'];
      options.pattern = Array.isArray(options.pattern) ? options.pattern : [options.pattern];
      var path = require('path');
      // var Promise = require('promise');
      var minimatch = require("minimatch");
      var postcss = require('postcss');
      if(!(options.plugins && options.plugins.length))
        throw 'You must provide some PostCSS plugins.'
      var processor = postcss(options.plugins);

      
      return function metalsmithPostcss(files, metalsmith, done){
        var allKeys = Object.keys(files);
        var actKeys = [];
        var remKeys = [];
        var keys = null;
        var promises = [];

        for(var i = 0, pat; pat = options.pattern[i++];) {
          if(pat[0] != '!') {
            keys = allKeys.filter(minimatch.filter(pat, { matchBase: true }));
            actKeys = actKeys.concat(keys);
            remKeys = remKeys.length ? remKeys.filter(minimatch.filter('!' + pat, { matchBase: true })) : remKeys;
            // remKeys = remKeys.concat(keys);
          }
          else if(actKeys.length) {
            actKeys = actKeys.filter(minimatch.filter(pat, { matchBase: true }));
            keys = allKeys.filter(minimatch.filter(pat.slice(1), { matchBase: true }));
            remKeys = remKeys.concat(keys);
          }
        }

        for(var i = 0, key; key = actKeys[i++];) {
          var file = files[key];
          var css = file.contents.toString();

          var promise = processor.process(css, {
            from: path.join(metalsmith._source, key),
            to: path.join(metalsmith._destination, key)
          })
          .then((function(file, result) {
            // console.log(file, '\n-------------------------------------------');
            file.contents = new Buffer(result.css);
          }).bind(null, file));

          promises.push(promise);
        }

        Promise.all(promises)
          .then(function(results) {
            for(var i = 0, key; key = remKeys[i++];) {
              delete files[key];
            }
            // console.log(actKeys, remKeys, Object.keys(files));
            done();
          })
          .catch(function(err) {
            done(new Error("[metalsmith-postcss]Error during postcss processing: " + JSON.stringify(err)));
          });

        
      };
    }({
      pattern: ['**/*.css', '!**/_*/*', '!**/_*'],
      plugins: [
        postcssPlugins['import'],
        postcssPlugins['if-media'],
        postcssPlugins['custom-media'],
        postcssPlugins['media-minmax'],
        postcssPlugins['layout'],
        postcssPlugins['aspect-ratio'],
        postcssPlugins['autoprefixer']
      ]
    })
  )
  .use(browserify('js/main.js', [
    './src/js/main.js'
  ]))
  .build(function (err) {
    if (err) {
      throw err;
    }
  });