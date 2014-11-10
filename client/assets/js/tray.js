// right click menu
var menu = new gui.Menu(),
	fs = require('fs');
menu.append(new gui.MenuItem({ label: 'Create Screenshot', click: function(){
	application.screenshot();
}}));
menu.append(new gui.MenuItem({ type: 'separator' }));
menu.append(new gui.MenuItem({ label: 'Settings', click: function(){
	application.settings();
}}));
menu.append(new gui.MenuItem({ label: 'Exit', click: function(){
	process.exit();
}}));

// create tray
var tray = new gui.Tray({
	title: 'Node Screenshot',
	icon: './assets/images/tray_icon.png',
	alticon: './assets/images/tray_icon_32.png',
	menu: menu
});

global.app.events.on('uploadSuccess', function(data){
	// TODO: create popup
	fs.unlink(data.tempFile, function(err){
		// TODO: handle temp error
	});
});

global.app.events.on('uploadError', function(data){
	// TODO: create popup
	fs.unlink(data.tempFile, function(err){
		// TODO: handle temp error
	});
});

tray.on('click', function(){
	return application.screenshot();
});