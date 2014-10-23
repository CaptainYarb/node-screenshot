var screenshot = {
	desktop: function(){
		var program = this.getProgram(),
			vals = this.getOpts();
		if(program == false){
			return console.log('Bad OS');
		}
		// calculate coords

		// capture the desktop
		console.log('"' + program + '" ' + vals.opts);
		global.app.ss = vals;
		exec('"' + program + '" ' + vals.opts, function(){
			var cropWin = window.open('crop.html'),
				crop = gui.Window.get(cropWin);
			crop.resizeTo(vals.coords.width, vals.coords.height);
			crop.moveTo(vals.coords.x.start, vals.coords.y.start);
			crop.setAlwaysOnTop(true);
			crop.focus();
		});
	},
	getOpts: function(){
		var opts = [],
			d = new Date().getTime(),
			filename = 'temp/ss-' + d +'.png';
		opts.push('-o');
		opts.push('"' + filename + '"');
		opts.push('-rc');
		var coords = this.getCoords();
		opts.push(coords.x.start);
		opts.push(coords.y.start);
		opts.push(coords.x.stop);
		opts.push(coords.y.stop);
		return {
			opts: opts.join(' '),
			coords: coords,
			filename: filename
		};
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
	getProgram: function(){
		switch(global.app.os){
			case "win32":
				return "./libs/windows/screenshot.exe";
			break;
			default:
				return false;
		}
	}
}
