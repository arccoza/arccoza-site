---
#id: 75
title: Building libav and avconv with libfdk_aac and libx264
date: 2015-10-30T02:23:49+00:00
author: Adrien
featuredImage: libav-logo.svg
layout: post
#guid: http://arccoza.com/?p=75
#permalink: /2015/10/building-libav-and-avconv-with-libfdk_aac-and-libx264/
categories:
  - Linux
tags:
  - aac
  - avconv
  - libav
  - libfdk_aac
  - libx264
  - linux
  - x264
---
I was trying to transcode the AC3 5.1 (6ch) audio in some MKV videos to 2ch stereo AAC, using avconv command line, and discovered that it’s native support for AAC isn’t great. An alternative is to use the Fraunhofer libfdk\_aac encoder, but it isn’t available in standard system packages of libav or ffmpeg, due to licensing quirks. But you can build your own avconv from source with libfdk\_aac support, and here’s a quick howto, from the terminal.
<!-- more -->

## Howto

I’m working in Elementary OS Freya, essentially the same as Ubuntu 14.04 for these instructions.

  1. Remove all traces of avconv and libav with:
    `sudo apt-get remove &#8211;purge libav-tools`
  2. Install dev dependencies:
    `sudo apt-get install build-essential`
    `sudo apt-get install yasm`
    `sudo apt-get install libfdk-aac-dev` (this is the AAC codec we want to add to libav)
    `sudo apt-get install libx264-dev` (libx264 open source H.264 AVC codec to add to libav)
  3. Create a working directory where you will put the source files for compilation.
    `mkdir ~/temp` (or whatever you want to call it)
    `cd ~/temp`
  4. Get the libav source code, either:
    * Clone the git repo for libav (make sure you&#8217;re in the `~/temp` directory).
      `git clone git://git.libav.org/libav.git`
    * Or download a stable source release from:
      * <a href="https://libav.org/download/" target="_blank">https://libav.org/download/</a>
      * Extract your download into `~/temp`
  5. Change to the source directory.
    `cd ~/temp/libav`
  6. Create an install directory for libav/avconv, I just used:
    `mkdir ~/Apps`
  7. Configure the build for your system (you should be in ~/temp/libav), add your install directory to the `--prefix` option.
    ```bash
    ./configure \
    --prefix=$HOME/Apps \
    --enable-nonfree \
    --enable-gpl \
    --disable-shared \
    --enable-static \
    --enable-libx264 \
    --enable-libfdk-aac
    ```
    This selects the standard codecs and adds libx264 and libfdk-aac.
  8. Now, finally, make your build.
    `make && make install`
    * This might take a couple minutes.

Once you have your build in your ~/Apps directory (or wherever you installed libav), you will find avconv in the ~/Apps/bin directory, add that to your **PATH** so you can call it from anywhere on the command line.


## Examples

### Convert

```bash
avconv -i "input.mkv" -c:v copy -c:a libfdk_aac -vbr 5 -ar 48000 -ac 2 “output.mp4”
```

### Bulk convert

```bash
for f in *.mkv; do avconv -i "$f" -c:v copy -c:a libfdk_aac -vbr 5 -ar 48000 -ac 2 "${f%.*mkv}.mp4"; done
```
