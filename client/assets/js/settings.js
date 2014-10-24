var openSettings = function(){
	// capture the desktop
	global.app.settingsWindow = gui.Window.open('settings.html', {
		frame: true,
		toolbar: true,
		width: 400,
		height: 350,
		position: 'center'
	});
	settingsWindow.focus();
}