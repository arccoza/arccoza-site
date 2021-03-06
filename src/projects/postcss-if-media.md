---
title: PostCSS ?If Media
date: 2016-02-10 12:15:09
author: Adrien
featuredImage: postcss-logo.svg
layout: post.jade
categories:
  - Nodejs
tags:
  - postcss
  - postcss-plugin
  - css
  - if-media
  - postcss-if-media
---
[travis]:       https://travis-ci.org/arccoza/postcss-if-media
[travis-img]:   https://img.shields.io/travis/arccoza/postcss-if-media.svg
[npm]:          https://www.npmjs.com/package/postcss-if-media
[npm-img]:      https://img.shields.io/npm/v/postcss-if-media.svg
[postcss-custom-media]: https://github.com/postcss/postcss-custom-media
[postcss-media-minmax]: https://github.com/postcss/postcss-media-minmax

A PostCSS plugin for adding `?if media` queries inside rules and inline with property values.
A great way to keep style values for different media queries neatly organized and grouped together under their natural rules.
Use with [PostCSS Media Minmax][postcss-media-minmax] and [PostCSS Custom Media][postcss-custom-media] for best effect.
<!-- more -->
[![Travis Build Status][travis-img]][travis][![npm pkg][npm-img]][npm]&nbsp;<iframe style="display:inline-block;" src="https://ghbtns.com/github-btn.html?user=arccoza&repo=postcss-if-media&type=star&count=true" frameborder="0" scrolling="0" width="80px" height="20px"></iframe><iframe style="display:inline-block;" src="https://ghbtns.com/github-btn.html?user=arccoza&repo=postcss-if-media&type=fork&count=false" frameborder="0" scrolling="0" width="60px" height="20px"></iframe>

## Explanation
The plugin provides `?if media QUERY` as an inline declaration and a nested block, where `QUERY` is any valid media query.

Any properties with the `?if media QUERY` declaration following their value, or any properties inside an `?if media QUERY { }` block will be extracted from their rule and placed in their own rule under an `@media QUERY` query.

The generated `@media` queries are placed directly after the original rule to maintain specificity.

## Install
`npm install postcss-if-media --save`

## Example 1
An inline declaration example.

```css
/* Input. */
.test {
  position: relative;
  margin: 0 1em ?if media (min-width: 1025px);
  margin: 0 0.5em ?if media (min-width: 641px) and (max-width: 1024px);
  margin: 0 0.3em ?if media (max-width: 640px);
}

/* Output. */
.test {
  position: relative;
}

@media (min-width: 1025px) {
  .test {
     margin: 0 1em;
  }
}
@media (min-width: 641px) and (max-width: 1024px) {
  .test {
     margin: 0 0.5em;
  }
}
@media (max-width: 640px) {
  .test {
     margin: 0 0.3em;
  }
}
```

## Example 2
A nested block example.

```css
/* Input. */
.test {
  position: relative;
  ?if media (min-width: 1025px) {
    color: red;
    margin: 0 1em;
  }
  ?if media (min-width: 641px) and (max-width: 1024px) {
    color: green;
    margin: 0 0.5em;
  }
  ?if media (max-width: 640px) {
    color: blue;
    margin: 0 0.3em;
  }
}

/* Output. */
.test {
  position: relative;
}

@media (min-width: 1025px) {
  .test {
    color: red;
    margin: 0 1em;
  }
}
@media (min-width: 641px) and (max-width: 1024px) {
  .test {
    color: green;
    margin: 0 0.5em;
  }
}
@media (max-width: 640px) {
  .test {
    color: blue;
    margin: 0 0.3em;
  }
}
```
