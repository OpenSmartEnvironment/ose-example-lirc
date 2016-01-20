#!/usr/bin/env node

/**
 * @caption LIRC example
 *
 *
 * @readme
 * Extends the [media player example]. Allows to control
 * the media player with a IR remote controller via LIRC.
 *
 * @features
 * - Volume up, down and mute
 * - Play, pause, stop
 * - Activate the audio command group by pressing "KEY_AUDIO" and
 *   select a predefined stream by pressing some digit
 * - Activate the DVB by pressing "KEY_TV" command group and select a
 *   predefined DVB channel by pressing some digit
 * - Switch to previous or next channel by pressing the "KEY_PREVIOUS"
 *   and "KEY_NEXT" keys.
 *
 *
 * @usage
 * ## Usage
 *
 * For the LIRC example to work, you need the following:
 * - LIRC-supported hardware
 * - Configured and running LIRC daemon
 *
 * See [Setting Up LIRC on the
 * RaspberryPi](http://alexba.in/blog/2013/01/06/setting-up-lirc-on-the-raspberrypi/)
 *
 *
 * To install the example application, do the following:
 *
 *     git clone https://github.com/OpenSmartEnvironment/ose-example-lirc
 *     cd ose-example-lirc
 *     npm install
 *
 * Configure the IP address and port number of the OSE Media player within your network in `bin/run.js`.
 *
 *     player: 'ws://IP_ADDRESS:PORT'
 *
 * Start the LIRC example as follows:
 *
 *     ./bin/run.js
 *
 *
 * @module example-lirc
 * @main example-lirc
 */

/**
 * @caption LIRC example startup script
 *
 * @readme
 * This script starts OSE instance with configuration from config file.
 *
 * @class example-lirc.bin.run
 * @type module
 */


'use strict';

// The OSE framework is initialized by requiring the "ose" package:
const O = require('ose')(module)
  .setPackage('ose-example-lirc')
;

var Remote = require('ose-control/lib/remote');
var Media = O.getClass('ose-media/lib/remote');

/*!
 * OSE is configured by a configuration object, `module.exports` in
 * this case. Each property of this object defines the configuration
 * for one [OSE plugin].
 */

// Basic properties of OSE instance
exports.ose = {
  name: 'lirc',          // Name of this OSE instance
  space: 'example.org',  // Space name this instance belongs to
  spid: 4,
};


// Enable general control package
exports['ose-control'] = {};

// Enable general lirc package
exports['ose-lirc'] = {};

// Enable media package
exports['ose-media'] = {};


// Enable CLI interface
exports.cli = {
  id: 'ose/lib/cli',

  // CLI can run some commands:
  /*
  script: [
    'wait 10000',
    'space example.org',
    'shard lirc',
    'entry lirc',
    'info',
    'detail',
  ],
  */
};


// Definition of data structure – The space named "example.org"
// contains all your data
exports.space = {
  id: 'ose/lib/space',         // Module id
  name: 'example.org',         // Name of the space
  home: 'player',              // Home instance of the space

  // Peers to connect to
  peers: {
    // Media player OSE instance – Change the following IP
    // address to that of the media player instance.
    player: 'ws://10.166.25.14:4431',  // CHANGE ME !!!!!
  }
};

// The space is partitioned into shards:
// LIRC shard
exports.control = {
  id: 'ose/lib/shard',
  sid: 5,                   // Shard id unique within the space
  schema: 'control',        // Schema the shard belongs to
  alias: 'lirc',            // Shard alias
  home: 'lirc',             // Home instance of the space
  upgrades: [
    initLirc,  // Method initializing entries belonging to the shard, defined below
  ],
};

// "lirc" shard initialization method.
function initLirc(transaction, cb) {
  // Create entry representing LIRC
  var entry = transaction.add('lirc', {
    alias: 'lirc',
    name: 'LIRC',
    player: {  // Identification of media player entry
      entry: 'player',
      shard: 'media',
    },
  });

  // Relay LIRC commands to `Remote` component
  entry.on('receive', function(val) {
    Remote.receive(entry, val);
  });


  // Create the `media` command group. This group has some predefined
  // LIRC commands, see "ose-media/lib/remote.js" or
  // http://opensmartenvironment.github.io/doc/modules/media.remote.html
  var media = new Media(entry.dval.player);

  // After this timeout switch to the last command group without the
  // timeout defined (tv or audio)
  media.timeout = 10000;

  // Set the `media` command group as the default group. The group is
  // selected by pressing "menu" button (LIRC "KEY_MENU") .
  Remote.defaults(entry, 'menu', media);

  // Setup LIRC "KEY_POWER" command
  Remote.add(media, 'power', function() {
    entry.shard.post(entry.dval.player, 'stop');
  });

  // Setup LIRC "KEY_NEXT" and "KEY_PREVIOUS" commands
  Remote.add(media, 'next', Remote.next);
  Remote.add(media, 'previous', Remote.prev);


  // Create `audio` command group activated by "KEY_AUDIO" LIRC command
  var audio = Remote.addGroup(entry, 'audio');
  Remote.groupKey(entry, audio);

  // Setup target of commands
  audio.target = entry.dval.player;

  // Setup individual streams that will be played after some digit is
  // pressed on a remote controller
  media.addSource(audio, {space: 'example.org', shard: 'media'}, require('../data/streams'));


  // Create `dvb` command group activated by "KEY_TV" LIRC command
  var dvb = Remote.addGroup(entry, 'tv');
  Remote.groupKey(entry, dvb);

  // Setup target of commands
  dvb.target = entry.dval.player;

  // Setup individual DVB channels, that will be played after some
  // digit is pressed on a remote
  // TODO  media.addSource(dvb, 'example.org', 'media', require('../media/dvb'));


  return cb();
}

// Start OSE instance
O.run();
