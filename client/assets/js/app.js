var os = require('os'),
	gui = require('nw.gui'),
	exec = require('child_process').exec,
	_ = require('underscore'),
	events = require('events');

gui.Screen.Init();
console.log(gui.Screen.screens);
gui.App.setCrashDumpDir('./crashes');

global.app = {
	os: os.platform(),
	screens: gui.Screen.screens,
	ss: null,
	events: new events.EventEmitter()
};

var shortcut = new gui.Shortcut({
	key: 'Ctrl+Shift+4',
	active: function(){
		console.log('do it!');
		screenshot.desktop();
	},
	failed: function(msg){
		console.log('Failed to bind to print', msg);
	}
});
gui.App.registerGlobalHotKey(shortcut);