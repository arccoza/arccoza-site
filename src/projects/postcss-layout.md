---
title: PostCSS Layout
date: 2015-10-26 11:11:04
author: Adrien
featuredImage: postcss-logo.svg
layout: post.jade
categories:
  - Nodejs
tags:
  - postcss
  - postcss-plugin
  - css
  - layout
  - postcss-layout
---
[travis]:       https://travis-ci.org/arccoza/postcss-layout
[travis-img]:   https://img.shields.io/travis/arccoza/postcss-layout.svg
[npm]:          https://www.npmjs.com/package/postcss-layout
[npm-img]:      https://img.shields.io/npm/v/postcss-layout.svg
[demo]:         http://arccoza.github.io/postcss-layout/

A PostCSS plugin for some common CSS layout patterns and a Grid system. [Demo][demo]
<!-- more -->
[![Travis Build Status][travis-img]][travis][![npm pkg][npm-img]][npm]&nbsp;<iframe style="display:inline-block;" src="https://ghbtns.com/github-btn.html?user=arccoza&repo=postcss-layout&type=star&count=true" frameborder="0" scrolling="0" width="80px" height="20px"></iframe><iframe style="display:inline-block;" src="https://ghbtns.com/github-btn.html?user=arccoza&repo=postcss-layout&type=fork&count=false" frameborder="0" scrolling="0" width="60px" height="20px"></iframe>

The plugin provides three new properties and one @rule.

* The `layout` property in a rule makes the selected elements a container for child elements with a certain layout.
* The `@grid` @rule defines a grid.
* The `grid` property in a rule gives the selected elements a grid defined in `@grid`.
* The `[gridname]-span` property in a rule defines the width of child elements in a grid container.

The plugin uses CSS `calc` for the grid system. Layouts have been tested to work in ie9+.

See the [demo][demo] or the example in the `example/` directory for usage.

All layout elements are given `box-sizing: border-box;` by default.

## New!
You can now add `buffer` and `shift` values to your grid span properties to create space around elements (with `buffer` values) or move them horizontally (with `shift` value) without bumping neighbours. Read more bellow.

## Install
`npm install postcss-layout --save-dev`

## Tips

It is recommended to use the following HTML element arrangment for your layouts, for the most flexible approach:

`<div class="wrapper"> <div class="container"> <div class="item"></div> </div> </div>`

or as I like to do it:

`<div class="container"> <div class="inner"> <div class="item"></div> </div> </div>`

You will quickly bulk up your final CSS file if you use the `layout` property everywhere you want a layout. 
Preferably, create a few reusable layout classes with `layout`, and apply them to your elements.

## Layouts
### stack
```css
.container {
  layout: stack [left|right|center][shrink];
}
```

Creates a container with a vertically stacked 'tower' of elements(items), using `display:block` 
or `display:table`, that can be optionally aligned left, right or center.
Another optional property value is `shrink` which causes a stacked element to shrink wrap its contents; 
it won't expand to fill its parent, instead make its width as small as possible to fit its contents.

#### Caveats
Firefox has [buggy](https://bugzilla.mozilla.org/show_bug.cgi?id=307866) table layout, and will ignore `min-height` or `min-width` on `shrink` / `display:table` elements(items).

#### Example
```css
/* Input. */
.container {
  layout: stack right shrink;
}

/* Output */
.container {
  box-sizing: border-box;
}
.container > * {
  box-sizing: border-box;
  display: table;
  margin-left: auto;
}
```

### lines
```css
.container {
  layout: lines [top|bottom|middle][left|right|center][nowrap];
}
```

Creates horizontally arranged child elements(items) in the container, using `display:inline-block`.
There are optional horizontal and vertical alignment property values.
Child elements in a `layout: lines` container will wrap when they are longer than the container width, 
unless `nowrap` is specified.
This layout sets `font-size:0` on the container to remove whitespace, then sets `font-size:initial` on 
child elements to reset `font-size`. Be aware of this as your font sizes may not be what you expect.

#### Caveats
Using the vertical align options automatically sets `nowrap`, you cannot vertically allign more than one line 
with `display:inline-block` and psuedo element technique. To vertically align multiline items use the layout 
demonstrated in the `example` directory, which uses two nested layouts, the first for vertical alignment, then 
horizontal alignment inside the vertically aligned element.

Grids cannot use `em` units for gutters with `layout:lines` because the container has `font-size:0` to 
deal with whitespace.

#### Example
```css
/* Input. */
.container {
  layout: lines bottom center;
}

/* Output. */
.container {
  text-align: center;
  box-sizing: border-box;
  font-size: 0;
}
.container > * {
  box-sizing: border-box;
  display: inline-block;
  text-align: initial;
  vertical-align: bottom;
  font-size: initial;
}
.container:after {
  position: relative;
  content: "";
  display: inline-block;
  width: 0;
  height: 100%;
  vertical-align: middle;
}
```

### flow
```css
.container {
  layout: flow [left|right];
}
```

Creates horizontally arranged child elements(items) in the container, using `float:left` by default.
There are optional horizontal arrangement property values.
Child elements in a `layout: flow` container will wrap when they are longer than the container width. 
This layout uses a pseudo element clear-fix technique.

#### Caveats
Using `left` or `right` options will align items left or right and also reverse item arrangement because 
floats are being used to create the layout.

#### Example
```css
/* Input. */
.container {
  layout: flow right;
}

/* Output. */
.container {
  text-align: initial;
  box-sizing: border-box;
  font-size: initial;
}
.container > * {
  box-sizing: border-box;
  display: initial;
  float: right;
  text-align: initial;
  vertical-align: initial;
  font-size: initial;
}
.container:after {
  position: relative;
  content: "";
  display: table;
  clear: both;
}
```

### columns
```css
.container {
  layout: columns;
}
```

Creates horizontally arranged child elements(items), using `display:table` and `display:table-cell` 
that stretch in columns from the top to the bottom of the selected container elements, 
and horizontally fill their container.
*NOTE* the `.container` will have a width set of `100%` by default.

#### Example
```css
/* Input. */
.container {
  layout: columns;
}

/* Output */
.container {
  width: 100%;
  table-layout: fixed;
  display: table;
  box-sizing: border-box;
}
.container > * {
  box-sizing: border-box;
  display: table-cell;
}
```

### rows
```css
.container {
  layout: rows;
}
```

Creates vertically arranged child elements(items), using `display:table` and `display:table-row` 
that stretch in rows from the left to the right of the selected container elements, 
and vertically fill their container.
*NOTE* the `.container` will have a width set of `100%` by default.

#### Example
```css
/* Input. */
.container {
  layout: rows;
}

/* Output */
.container {
  width: 100%;
  table-layout: fixed;
  display: table;
  box-sizing: border-box;
}
.container > * {
  box-sizing: border-box;
  display: table-row;
}
```

## Grids

### Define a grid
```css
@grid GRID_NAME {
  count: NUMBER_OF_COLUMNS;
  [gutter: GUTTER_VALUE [VERTICAL_GUTTER_VALUE];]
}
```

Define a grid with name GRID_NAME (eg. g12), number of columns NUMBER_OF_COLUMNS (eg. 12), and optional gutter GUTTER_VALUE (eg. 10px). An optional VERTICAL_GUTTER_VALUE (eg. 15px) can be set, if set then the first GUTTER_VALUE becomes the horizontal gutter.

### Use a grid
```css
.container {
  layout: lines;
  grid: GRID_NAME;
}
```

Use the `grid` property in a container to set which defined grid you want to use.
You **must** set `layout:lines` or `layout:flow` or `layout:columns` on the container for the grid to work, currently the only layout values which respond to the `grid` and `span` properties. *NOTE* the `.container` will have negative margins if gutter was set, so it is recommended to place the grid `.container` in its own wrapper container.

```css
.child {
  GRID_NAME-span: WIDTH [, BUFFER / BUFFER_LEFT BUFFER_RIGHT [, SHIFT ] ];
}
```

Use the `GRID_NAME-span` property in a child to define its width relative to the container grid. You can also optionally provide `BUFFER` values; A single `BUFFER` value adds that much spacing to both the left and right side of the child. Use `BUFFER_LEFT` and `BUFFER_RIGHT` individual values to set different spacing for each side. There is also an optional `SHIFT` value; A positive `SHIFT` value moves the child right, a negative `SHIFT` value moves the child left, this move will not affect the flow of the other child elements, you must provide a value for `BUFFER` to use `SHIFT`, just use 0 if you don't want any buffer. 

#### Caveats
As mentioned before, you cannot use `em` units for gutters in a `layout:lines` container.
You cannot use gutters with `layout:columns`, and the items will always stretch to fill remaining space.

#### Example
```css
/* Input. */
@grid g12 {
  count: 12;
  gutter: 10px;
}

.container {
  layout: lines;
  grid: g12;
}

.child {
  g12-span: 4, 2 0, -1;
}

/* Output. */
.container {
  box-sizing: border-box;
  margin-right: -5px;
  margin-left: -5px;
}
.container > * {
  box-sizing: border-box;
  display: inline-block;
  text-align: initial;
}
.container:before {
  position: relative;content: "";
  display: inline-block;
  width: 0;
  height: 100%;
  vertical-align: middle;
}

.child {
  left: -8.333333333333334%;
  margin-right: 5px;
  margin-left: calc(16.666666666666668% + 5px);
  width: calc(33.333333333333336% - 10px);
}
```
