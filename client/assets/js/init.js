var os = require('os'),
	gui = require('nw.gui'),
	exec = require('child_process').exec,
	_ = require('underscore'),
	events = require('events');

gui.Screen.Init();
gui.App.setCrashDumpDir('./crashes');

global.app = {
	os: os.platform(),
	screens: gui.Screen.screens,
	ss: null,
	events: new events.EventEmitter()
};