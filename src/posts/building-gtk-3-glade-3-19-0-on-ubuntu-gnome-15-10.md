---
#id: 54
title: Building GTK+ 3 Glade 3.19.0, on Ubuntu-Gnome 15.10
date: 2015-10-26T23:13:09+00:00
author: Adrien
featuredImage: gnome-logo-horizontal.svg
layout: post.jade
#guid: http://arccoza.com/?p=54
#permalink: /2015/10/building-gtk-3-glade-3-19-0-on-ubuntu-gnome-15-10/
categories:
  - Linux
tags:
  - glade
  - gtk3
  - linux
---
The current stable release of Glade on Ubuntu 14.04 and up is 3.18.0 and doesn’t include many of the newer widgets and layouts available in GTK+ 3, so let's build the newest stable release, 3.19.0, which does have the new stuff.
<!-- more -->

Glade 3.19.0 depends on GTK+ 3.16.0 or newer, you will need a system with at least Gnome 3.16.0. If you are on Ubuntu 15.04 you can try installing Gnome 3.16.0 ([instructions here](http://www.omgubuntu.co.uk/2015/06/how-to-upgrade-to-gnome-3-16-in-ubuntu-15-04), Ubuntu > 15.10 and derivatives support GTK+ 3.16.0. I’m working in Elementary OS Freya / Ubuntu 14.04 so I’ll be using a virtual machine with Ubuntu-Gnome 15.10 ([download here](https://wiki.ubuntu.com/UbuntuGNOME/GetUbuntuGNOME)).

## Howto

Once you have a system with GTK+ 3.16.0 setup and ready, follow this howto from your terminal.


  1. Create a working directory where you will put the source files for compilation.
    `mkdir ~/temp`
    `cd ~/temp`
  2. Download Glade source.
    * Get the source .tar from <a href="http://ftp.gnome.org/pub/GNOME/sources/glade/3.19/">here</a>.
    * Extract the archive into your working directory `~/temp`.
  3. Change to the source directory.
    `cd ~/temp/glade-3.19.0`
    Read the INSTALL file for additional instructions if you like.
  4. Run the configure script to prepare the package for your system.
    `./configure`
    The script might take a moment to run, and you will most likely receive errors that may not state the obvious.
  5. If you receive errors you are probably missing dependencies.
    * If you get:
      `configure: error: Your intltool is too old.  You need intltool 0.41.0 or later.`
    * Run:
      `sudo apt-get install intltool`
    * If you get something like:
      `configure: error: The pkg-config script could not be found or is too old. Make sure it is in your PATH or set the PKG_CONFIG environment variable to the full path to pkg-config.Alternatively, you may set the environment variables GTK_CFLAGS and GTK_LIBS to avoid the need to call pkg-config. See the pkg-config man page for more details.`
    * Run
      `sudo apt-get install pkg-config`
    * If you get:
      `configure: error: Package requirements (gtk+-3.0 >= 3.16.0 gmodule-2.0 libxml-2.0 >= 2.4.0) were not met:No package 'gtk+-3.0' found No package 'gmodule-2.0' found No package 'libxml-2.0' found Consider adjusting the PKG_CONFIG_PATH environment variable if you installed software in a non-standard prefix. Alternatively, you may set the environment variables GTK_CFLAGS and GTK_LIBS to avoid the need to call pkg-config. See the pkg-config man page for more details.`
    * Run:
      `sudo apt-get install libgtk-3-dev`
      `sudo apt-get install libxml2-dev`

      Once you have all the dependencies run `./compile` again.

  6. If you’ve got past configuration, it’s time to make your build.
      `make`
      This might take a little while...

  7. If you receive this error during make:
    `I/O error : Attempt to load network entity http://docbook.sourceforge.net/release/xsl/current/manpages/docbook.xsl warning: failed to load external entity "http://docbook.sourceforge.net/release/xsl/current/manpages/docbook.xsl" cannot parse http://docbook.sourceforge.net/release/xsl/current/manpages/docbook.xsl Makefile:609: recipe for target 'glade.1' failed
    make[2]: *** [glade.1] Error 4
    make[2]: Leaving directory '/home/user/temp/glade-3.19.0/man'
    Makefile:493: recipe for target 'all-recursive' failed
    make[1]: *** [all-recursive] Error 1
    make[1]: Leaving directory '/home/user/temp/glade-3.19.0'
    Makefile:422: recipe for target 'all' failed
    make: *** [all] Error 2`

    Run:
    `sudo apt-get install docbook-xsl`

    Run `make` again.

  8. Once you are done compiling Glade, install it.
    `sudo make install`

    * Look in your apps or type `glade` to run your new Glade 3.19.0.
    * If glade won’t run and you encounter this error when run from terminal:
      `glade: error while loading shared libraries: libgladeui-2.so.6: cannot open shared object file: No such file or directory`
    * Run:
     `sudo cp gladeui/.libs/libgladeui-2.so.6 /usr/lib/`

And that’s it you should have a working install of Glade 3.19.0.
