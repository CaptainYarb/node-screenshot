var application = {
	settings: function(){
		// capture the desktop
		global.app.settingsWindow = gui.Window.open('settings.html', {
			frame: true,
			toolbar: false,
			width: 400,
			height: 480,
			position: 'center'
		});
		global.app.settingsWindow.focus();
	},
	screenshot: function(){
		var d = new Date().getTime(),
			filename = 'temp/ss-' + d +'.png',
			vals = this.getProgram(filename);
		if(vals.program == false){
			return console.log('Bad OS');
		}
		// calculate coords

		// capture the desktop
		global.app.ss = vals;
		exec('"' + vals.program + '" ' + vals.opts.join(' '), function(){
			global.app.ssWindow = gui.Window.open('crop.html', {
				frame: true,
				toolbar: true,
				'always-on-top': true,
				resize: false
			});
			global.app.ssWindow.resizeTo(vals.coords.width, vals.coords.height);
			global.app.ssWindow.moveTo(vals.coords.x.start, vals.coords.y.start);
			global.app.ssWindow.focus();
		});
	},
	getCoords: function(){
		var coords ={
			x: {
				start: 0,
				stop: 0
			},
			y: {
				start: 0,
				stop: 0
			},
			width: 0,
			height: 0
		}
		_.each(global.app.screens, function(screen){
			// x
			if(screen.bounds.x < coords.x.start){ coords.x.start = screen.bounds.x }
			var x = screen.bounds.x + screen.bounds.width;
			if(x > coords.x.stop){
				coords.x.stop = x;
			}

			// y
			if(screen.bounds.y > coords.y.start){ coords.y.start = screen.bounds.y }
			var y = screen.bounds.y + screen.bounds.height;
			if(y > coords.y.stop){
				coords.y.stop = y;
			}
		});
		coords.width = coords.x.stop - coords.x.start;
		coords.height = coords.y.stop - coords.y.start;
		return coords;
	},
	getProgram: function(filename){
		var results = {
			filename: filename,
			coords: this.getCoords(),
			opts: [],
			program: false
		}
		switch(global.app.os){
			case "win32":
				results.program = "./libs/windows/screenshot.exe";
				results.opts.push('-o');
				results.opts.push('"' + filename + '"');
				results.opts.push('-rc');
				results.opts.push(results.coords.x.start);
				results.opts.push(results.coords.y.start);
				results.opts.push(results.coords.x.stop);
				results.opts.push(results.coords.y.stop);
			break;
		}
		return results;
	}
}
