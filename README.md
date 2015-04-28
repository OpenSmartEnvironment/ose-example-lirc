# Open Smart Environment - LIRC example
Extends the [media player example](http://opensmartenvironment.github.io/doc/#mediaplayerexample). Allows to control
the media player with a IR remote controller via LIRC.

## Features
- Volume up, down and mute
- Play, pause, stop
- Activate the audio command group by pressing "KEY_AUDIO" and
  select a predefined stream by pressing some digit
- Activate the DVB by pressing "KEY_TV" command group and select a
  predefined DVB channel by pressing some digit
- Switch to previous or next channel by pressing the "KEY_PREVIOUS"
  and "KEY_NEXT" keys.

## Important links
This package is a part of the OSE suite. For more information, see the following links:
- [LIRC example documentation](http://opensmartenvironment.github.io/doc/#example-lirc)
- [OSE suite documentation](http://opensmartenvironment.github.io/doc/)
- [All packages](https://github.com/opensmartenvironment/)

## About OSE
<b>Open Smart Environment software is a suite for creating
multi-instance applications that work as a single whole.</b><br>
Imagine, for example, a personal mesh running on various devices
including HTPCs, phones, tablets, workstations, servers, Raspberry
Pis, home automation gadgets, wearables, drones, etc.

OSE software consists of several npm packages: a [framework](http://opensmartenvironment.github.io/doc/#framework) running
on Node.js, an [HTML5 frontend](http://opensmartenvironment.github.io/doc/#html5frontend), extending
packages and a set of example applications.

<a href="http://opensmartenvironment.github.io/doc/resource/ose.svg"><img width=100% src="http://opensmartenvironment.github.io/doc/resource/ose.svg"></a>

**Set-up of current example applications.** Here,
OSE provides a [Media player](http://opensmartenvironment.github.io/doc/#example-player) running on an HTPC
that can be controlled by an IR remote through
[LIRC](http://opensmartenvironment.github.io/doc/#example-lirc) and is capable of playing streams from a
[DVB streamer](http://opensmartenvironment.github.io/doc/#example-dvb) and control devices through GPIO
pins on a [Raspberry Pi](http://opensmartenvironment.github.io/doc/#example-rpi)

For more information about OSE see **[the documentation](http://opensmartenvironment.github.io/doc/)**.

## Status
- Pre-alpha stage (insecure and buggy)
- Unstable API
- Patchy documentation
- No test suite

This is not yet a piece of download-and-use software. It is important
to understand the basic principles covered by the
[documentation](http://opensmartenvironment.github.io/doc/).

## Platforms
OSE has the following prerequisites:
- Node.js (>0.10) running on Debian Jessie and Raspbian
- Firefox 37 or newer with Web Components enabled

## Usage

For the LIRC example to work, you need the following:
- LIRC-supported hardware
- Configured and running LIRC daemon

See [Setting Up LIRC on the
RaspberryPi](http://alexba.in/blog/2013/01/06/setting-up-lirc-on-the-raspberrypi/)


To install the example application, do the following:

    git clone https://github.com/OpenSmartEnvironment/ose-example-lirc
    cd ose-example-lirc
    npm install

Configure the IP address and port number of the OSE Media player within your network in `bin/run.js`.

    player: 'ws://[ip address](http://opensmartenvironment.github.io/doc/#ipaddress):[port](http://opensmartenvironment.github.io/doc/#port)'

Start the LIRC example as follows:

    ./bin/run.js

## Licence
This software is released under the terms of the [GNU General
Public Licence v3.0](http://www.gnu.org/copyleft/gpl.html) or
later.
