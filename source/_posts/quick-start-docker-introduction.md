---
id: 89
title: 'Quick Start Docker: Introduction'
date: 2015-11-20T15:44:39+00:00
author: Adrien
featuredImage: docker-logo.svg
layout: post
guid: http://arccoza.com/?p=89
permalink: /2015/11/quick-start-docker-introduction/
categories:
  - Docker
  - Linux
tags:
  - docker
  - quick
  - start
---
This is a brisk introduction to Docker, to get you up and running as quick as possible with a decent understanding of the command line tools and the architecture of Docker containers.
<!-- more -->
There is a follow up article on creating images with Docker ➙ Quick Start Docker: Creating Images.

# What is it?

Docker is a tool that lets you build, use and deploy reusable images of a particular system environment.

An image is a template of a Linux OS with as many or as few installed components as you need.

You use an image (the template) to create containers, which are the running instances of an image.

Images are composed of layers (each component or instruction used to create the image is a layer).

Images can inherit from other images, starting with a base, usually a stripped down Linux OS.

Create an image with some components (layers) based on a base image.

Create a more complex image based on your first image with additional layers, and so on.

&nbsp;

Images (the templates) and containers (a running template instance) are similar to virtual machines, but use <a href="https://en.wikipedia.org/wiki/LXC" target="_blank">containerisation</a> rather than full blown virtual machines, so they are much lighter.

&nbsp;

**Example:** Perhaps you need an environment for WordPress, you could use or create an image on top of a base Ubuntu image with only MariaDB installed. Then create another image that inherits from the first and adds PHP5 and Nginx.

You can run multiple containers on one machine, and containers can interact with each other.

**Example:** Instead of bundling everything together for your WordPress environment, you could create one image with PHP5 and Nginx, and another image with just MariaDB and link them.

Use your images for development, then deploy the same images to your server for a portable, consistent app environment.

&nbsp;

# How to get it

Most recent versions of Linux natively support Docker and containerisation, but you may want to replace the system repositories with more up to date Docker provided repos.

If you have installed docker on Linux, you will need to sudo your commands unless you add the _docker_ group to the OS and add users to it.

**Example:**

<pre class="lang:default highlight:0 decode:true ">sudo usermod -aG docker bob</pre>

&nbsp;

OSX and Windows do not natively support Docker or containerisation, so you will need to install Docker Toolbox to create a virtual machine to host Docker.

See the install docs <a href="http://docs.docker.com/engine/installation/" target="_blank">here</a> for your OS.

&nbsp;

# How to build an Image

There are two ways to build an image:

  1. Edit an existing, base image using docker command line.
  2. Create a dockerfile, which is a recipe script used to build your image.

See [Quick Start Docker: Creating Images](/), for more info.

&nbsp;

# How to get an Image

You can pull (download/update) images from <a href="https://hub.docker.com/" target="_blank">Docker Hub</a>, a public repository of user and official images.

**Example from the command line:**

<pre class="lang:default highlight:0 decode:true">docker pull google/nodejs:0.10.29</pre>

An image name is made up of three parts: **[user name or organization name]/[image name]:[tag]**

**[user name or organization name]** ➙ The user or organization that created the image.

**[image name]** ➙ The name of the image.

**[tag]** ➙ An optional tag, used to select a particular variant of the image, defaults to latest.

Images without a **[user name or organization name]** are root or base images provided and maintained by Docker.

**Example:**

<pre class="lang:default highlight:0 decode:true ">docker pull debian:testing</pre>

&nbsp;

# How to run an Image

When you run an image what you really do is create and run a container from the image.

To start a new container based on an image from the commandline:

<pre class="lang:default highlight:0 decode:true">docker run google/nodejs:0.10.29</pre>

Docker will initiate your new container and return a container id (long and short versions) and assign a random name. When all the processes in a container finish the container stops.

You can use docker create to do exactly the same thing, creating a container from an image, but it won’t start the container, you can start the container with docker start [container id or name].

&nbsp;

A more useful command to create and run a new container looks like this:

<pre class="lang:default highlight:0 decode:true">docker run --name nodejs -d google/nodejs:0.10.29</pre>

**-d** ➙ will start the container in the background so you can continue to do other things from your terminal. By default containers are started in the foreground with your std in/out/err connected to the main process running in the container.

**&#8211;name** ➙ allows you to assign a meaningful name to the running container, instead of a randomly generated one.

&nbsp;

Most containers automatically run one or more services, you can tell docker to run a particular program or command available in the container when you start the container, by appending it to the end of the run command, this may override the default execution of the container, depending on how it was configured.

<pre class="lang:default highlight:0 decode:true">docker run --name nodejs -i -t google/nodejs:0.10.29 /bin/bash</pre>

**/bin/bash** ➙ is the command/program we want docker to execute inside the container.

**-i** ➙ Keeps std in open.

**-t** ➙ Assigns a pseudo terminal to the process.

Essentially this allows us to run and connect to bash shell with a terminal inside the container and interact with it.

&nbsp;

If you just want to run a command or program inside the container without interaction:

<pre class="lang:default highlight:0 decode:true">docker run --name nodejs -d google/nodejs:0.10.29 ls -l</pre>

This will create and run the container then execute the <span class="lang:default highlight:0 decode:true crayon-inline ">ls -l</span>  command.

&nbsp;

To see any output from your new container as it started type:

<pre class="lang:default highlight:0 decode:true">docker logs [id or name]</pre>

Where id is the long or short id of the container and name is the name assigned by you or docker.

**Example:**

<pre class="lang:default highlight:0 decode:true">docker logs nodejs</pre>

This will print in your terminal all messages and errors from the processes running in your container at startup.

The run command is the most complicated docker command with plenty of options to configure and customize your container. For the full list of options see the <a href="https://docs.docker.com/v1.8/reference/run/" target="_blank">reference</a>.

&nbsp;

# About Containers, Images and Linking

Containers can be designed to expose ports and volumes (directories) and use ENVIRONMENT VARIABLES.

When an Image is developed it can be configured to expose (make accessible from outside the container) certain ports, perhaps port 80 if it is running a web service. Certain directories inside the container can be mounted as volumes on the host or in other containers. And environment variables can be defined to control the creation and execution of the container.

All exposed ports, volumes and environment variables defined by an image can be overridden or new ones defined by the user with the run command when creating a new container. So the developer of an Image can define this configuration but the run command has final say.

**Example:**

<pre class="lang:default highlight:0 decode:true">docker run -d --name mariadb -p 3306:3306 -e MYSQL_ROOT_PASSWORD=”some_password" -v /app/db/mysql:/var/lib/mysql arccoza/mariadb</pre>

**-p** ➙ maps the containers exposed ports to a host port **[host-port:container-port]**. Anything that can access the host can then talk to the container from this port on the host, to bind to a specific interface you can provided a host ip address or the loopback address: <span class="lang:default highlight:0 decode:true crayon-inline ">127.0.0.1:3306:3306</span>  **[host-ip:host-port:container-port]**.

So 3306 is exposed in the container and mapped to the same port on the containers host machine, meaning you can now talk to MariaDB running in the container. You can map to a different port on the host as needed, and add a /udp to use UDP ports instead of TCP: <span class="lang:default highlight:0 decode:true crayon-inline ">127.0.0.1:3306:3306/udp</span> .

**-P** ➙ use a capital -P without any other info to automatically map a containers ports to random ports on the host.

**-e** ➙ sets an environment variable in the container, **[variable name=variable value]**. Here we set a variable called MYSQL\_ROOT\_PASSWORD which is used by the container to set the database root user password. You can set additional variables that are not defined by the container image.

**-v** ➙ binds and mounts a directory (volume) on the host inside the container **[host-dir:container-dir:rw|ro]**. Now the /app/db/mysql directory on the host is available inside the container mounted at /var/lib/mysql, so that when MariaDB inside the container writes data to the standard /var/lib/mysql folder it will actually be writing data to /app/db/mysql on the host. If a host-dir is not provided then docker creates a new volume for the container-dir. You can optionally provide a third argument of **:rw** or **:ro** which sets the volume to read-write or read-only mode, the default is **rw**. Like all the other options a volume may be defined in the container image and mounted or it can be created by the run command.

&nbsp;

Volumes are also useful for keeping your applications code out of the container. For instance, perhaps you have a node project in a directory on your machine, you want to test it with a node container, instead of including the code in your container you can just mount your code directory inside the container and run it.

**Example:**

<pre class="lang:default highlight:0 decode:true">docker run -it --rm --name myapp -v /var/myapp:/usr/src/app -w /usr/src/app node:4 node your-daemon-or-script.js</pre>

Here we tell docker to create a node container and mount our code from /var/myapp in the container at /usr/src/app, and run the node command on your mounted script.

**-w** ➙ sets the working directory (the default directory) for commands executed in the container.

**&#8211;rm** ➙ removes any data stored by the container when it finishes, useful when you rerun the same image multiple times for testing.

&nbsp;

You could use this method to share a volume among multiple containers, but there are better options. A common design pattern with docker is not to use the host to mount and share volumes among containers, but rather to create one minimalist container that is used for storage only, here you mount all the other containers volumes. Using an image with SSH access to create your storage container allows you to login and interact with the volumes.

**Example:**

<pre class="lang:default highlight:0 decode:true">docker run -d --name mariadb -p 3306:3306 -e MYSQL_ROOT_PASSWORD=”some_password" -v /var/lib/mysql arccoza/mariadb

docker run -d --name data_store -p 2222:22 --volumes-from mariadb ubuntu:14.04</pre>

Here we have two containers, mariadb exposes a volume at /var/lib/mysql and data_store pulls in all volumes from mariadb while exposing the SSH port 22 mapped to 2222 on the host.

**&#8211;volumes-from** ➙ mounts all the volumes from the named container inside this container.

## Linking

There are other ways to connect containers, you can use the &#8211;link option with the run command to connect one container to another and pass some information about the source container to the recipient container. It is essential to name your containers when working with links.

**Example:**

<pre class="lang:default highlight:0 decode:true">docker run -d --name mariadb -e MYSQL_ROOT_PASSWORD=”some_password" arccoza/mariadb

docker run -d --name web --link mariadb:db -v /var/myapp:/usr/src/app -w /usr/src/app node:4 node your-daemon-or-script.js</pre>

**&#8211;link** ➙ links a named container [name:alias] with this container. An alias can optionally be provided that assigns a new name for the source container in the recipient container. An alias is useful when the source container or its name may change, and the recipient depends on that name.

When a link is created Docker creates a secure tunnel between the containers, so no ports need to be exposed to the host or the rest of the network with the -p option, ports that were defined as exposed in the source container image will be available to the recipient.

Docker shares this information about the source container with the recipient container using ENVIRONMENT VARIABLES and the /etc/hosts file. The hosts file holds name -> ip address mappings, and will be automatically updated by Docker, so the alias db in the recipient container should resolve to the source container ip address.

Docker also creates several environment variables in the recipient container, including those defined in the image and run command, as well as automatically defined variables prefixed with the source name or alias.

See this <a href="https://docs.docker.com/v1.8/userguide/dockerlinks/#environment-variables" target="_blank">link</a> for a list of variables created by Docker.

&nbsp;

# Controlling your containers

#### and other useful commands

&nbsp;

### For Containers

##### List running containers

docker ps

&nbsp;

##### <span style="font-weight: 400;">List all containers</span>

<span style="font-weight: 400;">docker ps -a</span>

&nbsp;

##### <span style="font-weight: 400;">List containers filtered by name</span>

<span style="font-weight: 400;">docker ps -a -f ‘name=mariadb’</span>

<span style="font-weight: 400;">see more filters </span>[<span style="font-weight: 400;">here</span>](https://docs.docker.com/v1.8/reference/commandline/ps/#filtering)

&nbsp;

##### <span style="font-weight: 400;">Pause container</span>

<span style="font-weight: 400;">docker pause [container]</span>

&nbsp;

##### <span style="font-weight: 400;">Resume container</span>

<span style="font-weight: 400;">docker unpause [container]</span>

&nbsp;

##### <span style="font-weight: 400;">Stop container</span>

<span style="font-weight: 400;">docker stop -t 10 [container]</span>

<span style="font-weight: 400;">-t 10 or &#8211;time=10, 10 seconds to wait for stop before killing process.</span>

&nbsp;

##### <span style="font-weight: 400;">Stop all containers</span>

<span style="font-weight: 400;">docker stop $(docker ps -a -q)</span>

&nbsp;

##### <span style="font-weight: 400;">Start container</span>

<span style="font-weight: 400;">docker start [container]</span>

&nbsp;

##### <span style="font-weight: 400;">Restart container</span>

<span style="font-weight: 400;">docker restart -t 10 [container]</span>

<span style="font-weight: 400;">-t 10 or &#8211;time=10, 10 seconds to wait for stop before killing process.</span>

&nbsp;

##### <span style="font-weight: 400;">Attach to container shell</span>

<span style="font-weight: 400;">docker exec -i -t [container] /bin/bash</span>

&nbsp;

##### <span style="font-weight: 400;">Remove container</span>

<span style="font-weight: 400;">docker rm [container]</span>

&nbsp;

##### <span style="font-weight: 400;">Remove all containers</span>

<span style="font-weight: 400;">docker rm $(docker ps -a -q)</span>

&nbsp;

##### <span style="font-weight: 400;">Show container output</span>

<span style="font-weight: 400;">docker logs [container]</span>

&nbsp;

##### <span style="font-weight: 400;">Show processes running in a container</span>

<span style="font-weight: 400;">docker top [container]</span>

&nbsp;

##### <span style="font-weight: 400;">List information about an image or container</span>

<span style="font-weight: 400;">docker inspect [image/container name/id]</span>

&nbsp;

### For Images

##### <span style="font-weight: 400;">List all images</span>

<span style="font-weight: 400;">docker images</span>

&nbsp;

##### <span style="font-weight: 400;">Search for a new image (but really it’s much easier to browse docker hub)</span>

<span style="font-weight: 400;">docker search mongodb</span>

&nbsp;

##### <span style="font-weight: 400;">Remove an image</span>

<span style="font-weight: 400;">docker rmi tutum/mongodb</span>

&nbsp;

##### <span style="font-weight: 400;">Remove all images</span>

<span style="font-weight: 400;">docker rmi $(docker images -q)</span>
