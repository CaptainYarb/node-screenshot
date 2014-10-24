var shortcut = new gui.Shortcut({
	key: 'Ctrl+Shift+4',
	active: function(){
		application.desktop();
	},
	failed: function(msg){
		console.log('Failed to bind to print', msg);
	}
});
gui.App.registerGlobalHotKey(shortcut);