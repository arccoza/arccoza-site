var metalsmith = require('metalsmith');
var drafts = require('metalsmith-drafts');
var markdown = require('metalsmith-markdown');
var highlight = require('highlight.js');
var layouts = require('metalsmith-layouts');
// var postcss = require('postcss');
var postcss = require('./metalsmith-with-postcss');
var justAMoment = require('./metalsmith-just-a-moment');
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
  // try {
  //   code = highlight.highlightAuto(code).value;
  // } catch (ex) {
  // }
  
  return '<code class="highlight highlight--span">' + code + '</code>';
}

// console.log(marked('```\nvar a;\n```', { renderer: markedRenderer }));

metalsmith(__dirname)
  .source('src')
  .destination('pub')
  .use(watch())
  .use(serve())
  .use(metadata({
    site: 'site.yaml',
    menus: 'menus.yaml'
  }))
  .use(drafts())
  // .use(fileMetadata([
  //   {pattern: "posts/*", metadata: {"type": "post"}},
  //   {pattern: "projects/*", metadata: {"type": "projects"}}
  // ]))
  .use(justAMoment())
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
  // .use(snippet({
  //   maxLength: 250,
  //   suffix: '...'
  // }))
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
      // console.log(metalsmith._metadata);
      done();
    }
  }())
  .use(layouts({
    engine: 'jade',
    directory: 'templates',
    default: 'post.jade',
    pattern: ['**/*.html']
  }))
  .use(postcss({
    pattern: ['**/*.css', '!**/_*/*', '!**/_*'],
    plugins: {
      'postcss-import': {},
      'postcss-if-media': {},
      'postcss-custom-media': {},
      'postcss-media-minmax': {},
      'postcss-layout': {},
      'postcss-aspect-ratio': {},
      'autoprefixer': {}
    }
  }))
  .use(browserify('js/main.js', [
    './src/js/main.js'
  ]))
  .build(function (err) {
    if (err) {
      throw err;
    }
  });