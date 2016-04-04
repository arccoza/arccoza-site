---
title: 'A Hostile Web: DDoS mitigation with Advanced Policy Firewall'
subtitle: 
date: 2016-03-28T00:42:00+00:00
author: Adrien
featuredImage: ddos-mitigation.svg
layout: post.jade
draft: false
excerpt: Dealing with malicious traffic on the web is pretty much par for the course for anyone running publicly accessible servers, so here we'll go through some quick and simple tools and methods to secure your server(s) from various DDoS or DoS style attacks and other hostile traffic.

categories:
  - Web
tags:
  - security
  - ddos
  - dos
  - mitigation
  - apf
  - advanced-policy-firewall
  - firewall
---
# Introduction
Dealing with malicious traffic on the web is pretty much par for the course for anyone running publicly accessible servers, so here we'll go through some quick and simple tools and methods to secure your server(s) from various DDoS or DoS style attacks and other hostile traffic.

We'll start with Advanced Policy Firewall, in the second [post over here](/2016/03/28/a-hostile-web-ddos-mitigation-and-protecting-your-servers-with-nginx-and-fail2ban) we'll look at Nginx and Fail2Ban.

# Advanced Policy Firewall
APF is great, reactive, firewall for Linux and IPTables/NetFilter, ceated by these guys -> [R-fx Networks](https://www.rfxn.com/projects/advanced-policy-firewall/), git it here -> [github.com/rfxn/advanced-policy-firewall](https://github.com/rfxn/advanced-policy-firewall).

## Install
From the terminal (as root on your server), in a temp dir, perhaps /root/tmp, do:

  1. `wget https://github.com/rfxn/advanced-policy-firewall/archive/master.zip`
  2. `unzip master.zip`
    - `apt-get install unzip` on Ubuntu/Debian `yum install unzip` on Red Hat Linux/Fedora/CentOS, if you don't have unzip on your system.
  3. `./install`

APF should be busy installing, when done it will print currently listening ports and install files will be here:

  - Install path: `/etc/apf`
  - Bin path: `/usr/local/sbin/apf`

To list server (listening) ports for the current user again use the provided `get_ports` script. This will help you identify what ports you should leave open during config. 

## Configure
First you'll want to configure your basic firewall options, blocking and opening certain ports. APF allows you to create general rules for inbound and outbound traffic from all IPs, and more specific rules in `deny_hosts.rules` and `allow_hosts.rules` for individual IPs. 

So let's open the minimum ports we will need to run a web server, and go through some of the other basic settings. You should always only open the minimum number of ports you need, keeping all others closed reduces your exposure.

The config file is very well documented, find it here:

  - `/etc/apf/conf.apf`
  - Open it with `nano /etc/apf/conf.apf` or your preferred editor.
  - All setting values are numbers (unless otherwise noted):
    - 0 is disabled.
    - 1 is enabled.
    - >= 1 are metered levels.
    - Can also be a list of numbers (eg. port numbers).
    - And special keywords, such as `all`.

### The Basics
```sh
DEVEL_MODE="1"
```
When this is enabled the firewall will automatically shutoff every 5 mins, this ensures you don't accidentally lock yourself out of the system when testing your config.
```sh
DEVEL_MODE="0"
```
Set to 0 to disable dev mode when you are sure everything is working.
___
```sh
IFACE_UNTRUSTED="eth0"
```
This is the untrusted / public network interface, the network interface that connects your server to the internet. eth0 is the common default on most linuxes. `ifconfig` will list your server's network interfaces.
___
```sh
IFACE_TRUSTED=""
```
This is the trusted / private network interface, if you have a second private network enabled between your server(s) set it here.
___
```sh
IG_TCP_CPORTS="22,25,80,443"
```
Incoming / listening TCP ports, this is a common or global rule shared by all addresses on this machine. We have opened the ports for SSH, SMTP, HTTP and HTTPS. IG stands for ingress.
___
```sh
IG_UDP_CPORTS=""
```
Incoming / listening UDP ports, this is a common or global rule shared by all addresses on this machine. We have no open UDP ports.
___
```sh
IG_ICMP_TYPES="3,5,11,0,30,8"
```
Allowed incoming ICMP message types, these are the ICMP messages that the server will respond to, all others are ignored, useful for avoiding certain attacks. This is also a common or global rule shared by all addresses on this machine.
___
```sh
EGF="0"
```
Enable or disable outbound filtering. Inbound filtering is always enabled, but you can choose whether to filter the ports and traffic eminating from your server. Makes for more robust security, ensuring that if your server is compromised you could prevent outbound traffic on ports that shouldn't be talking, and prevent your server becoming a node in a bot network used to attack others. Can be tricky to configure and is generally safe to leave disabled.
___
```sh
EG_TCP_CPORTS="21,25,80,443,43"
```
Allowed outbound TCP connection ports, only works if `EGF="1"`. EG stands for egress.
___
```sh
EG_UDP_CPORTS="20,21,53"
```
Allowed outbound UDP connection ports, only works if `EGF="1"`.
___
```sh
EG_ICMP_TYPES="all"
```
Allowed outbound ICMP messages, only works if `EGF="1"`.
___
```sh
LOG_DROP="0"
```
Enables detailed logging, this is very useful for debugging your config or for use during an attack to see who is doing what. Only enable when needed as it writes a lot of data consistently.
___
That should have your basic static firewall setup for a common web server.

### Advanced Stuff
APF's best feature is RAB, Reactive Address Blocking. With RAB enabled the firewall takes an active, dynamic approach to defending your system, blocking IP addresses when certain rules are broken.

```sh
RAB="1"
```
Globally enables or disables all Reactive Address Blocking.
___

```sh
RAB_SANITY="1"
```
Will block an address connecting to this server that breaks sanity rules, such as trying to spoof an address or modifying packet flags. As it says in the conf comments, don't disable this.
___
```sh
RAB_PSCAN_LEVEL="2"
```
Port scan violations, will block an address that tries to access ports that are generally not used on the modern net and identified as malicious. 0 for disabled, 1 for low security, 2 for medium security and 3 for high security.
___
```sh
RAB_HITCOUNT="1"
```
This controls how many times an address must break the rules before it is blocked, `"0"` or `"1"`to block on the first violation, `"2"` to block after the second violation and so on. It is best to keep this at `"1"`. Note that `"0"` here does not mean disabled.
___
```sh
RAB_TIMER="300"
```
The amount of time an address is blocked for after it breaks enough rules (controlled by `RAB_HITCOUNT`), in seconds. 300s = 5mins.
___
```sh
RAB_TRIP="1"
```
This will reset the `RAB_TIMER` count down if an address continues to attempt any kind of communication to the server after it has been blocked and is still in the ban timeout. This is a great feature that can completely deny an address that is bombarding the server. Definitely leave this enabled.
___
```sh
RAB_LOG_HIT="1"
```
Log all addresses that violate RAB rules. Useful for tracking attacks. This will always be enabled if `LOG_DROP` is enabled.
___
```sh
RAB_LOG_TRIP="0"
```
Continue logging all communication attempts by an address that is already banned. Again useful for tracking an ongoing attack. This will always be enabled if `LOG_DROP` is enabled. Best to only enable when needed, because it generates a lot of data.
___
```sh
TCP_STOP="DROP"
UDP_STOP="DROP"
ALL_STOP="DROP"
```
`TCP_STOP, UDP_STOP, ALL_STOP` tells the firewall what to do with malicious traffic from TCP, UDP and any other protocol respectively. Possible values are:
  - `RESET` the standard TCP/IP signal, telling the connecting machine to close the connection.
  - `DROP` silently drop any packets, don't send any signals back to the connecting machine, the best option, most attackers will know that this means your server is there and ignoring their traffic, but it is quick and uses fewer resources than transmitting a signal, which can make a big difference when your server is being bombarded.
  - `REJECT` is an alternative to `DROP` and responds to the connecting machine with an error, telling it that the port or service is unavailable.
  - `PROHIBIT` sends an ICMP error message instead of a TCP message, and is usually only used by UDP, but can be used for other STOP values. A good alternative to `RESET` or `REJECT` if you must send a signal, adds less load to the system.
___
```sh
PKT_SANITY="1"
```
Makes sure packets conform to TCP/IP standards, enables or disables all other sanity checks. The default settings in the conf file are best for most situations, you can read more about all the other sanity options in the conf file. 
___
```sh
ICMP_LIM="10/s"
```
Limits the rate of ICMP messages, units can be per second (/s) or per minute (/m). Can prevent machines from hammering your server with ICMP messages, but allows your server to respond to legitimate message flow.
___

There are many more settings documented in the conf.apf file itself, the values provided here are a good default for the most useful options. Remember to set

### Tips
Remember, create as few opportunities for attack by reducing your exposure to the bare minimum required for your app or service. And don't forget to set `DEVEL_MODE="0"` when you are done configuring and testing, otherwise the firewall will disable itself automatically after 5mins.

## Commands
  - `apf -s` or `apf --start` enable firewall rules.
  - `apf -r` or `apf --restart` refresh firewall rules.
  - `apf -f` or `apf --stop` disable firewall rules.
  - `apf -l` or `apf --list` list firewall rules.
  - `apf -t` or `apf --status` firewall status.
  - `apf -a HOST COMMENT` or `apf --allow HOST COMMENT` add HOST (IP or domain) with optional COMMENT to allow_hosts.rules file and load this new rule, allowing the HOST traffic.
  - `apf -d HOST COMMENT` or `apf --deny HOST COMMENT` add HOST (IP or domain) with optional COMMENT to deny_hosts.rules file and load this new rule, denying the HOST traffic.
  - `apf -u HOST COMMENT` or `apf --remove HOST COMMENT` remove HOST (IP or domain) from *_hosts.rules file(s) and remove rule from firewall.
  - `apf -o` or `apf --ovars` output all config options.

## Updating
If you want to update APF to a newer release, just download, unzip and `./install` as above, the installer will automatically backup the previous version and install the newer release.
Run the provided `importconf` script to copy your old configuration into your new install.