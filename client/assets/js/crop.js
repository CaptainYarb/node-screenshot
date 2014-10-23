process.on("uncaughtException", function(e){ console.log(e); });

var gui = require('nw.gui'),
	clipboard = gui.Clipboard.get();

// window shit goes here
$(document).ready(function(){
	var canvas = document.getElementById('canvas');

	canvas.width =global.app.ss.coords.width;
	canvas.height= global.app.ss.coords.height;

	var context = canvas.getContext('2d'),
		screenshot = new Image();

	var mouse = {x: 0, y: 0};
	document.addEventListener('mousemove', function(e){
	    mouse.x = e.clientX || e.pageX;
	    mouse.y = e.clientY || e.pageY;
	}, false);

	var mouseDraw = false,
		drawBox = {start: {x:0, y:0}, end: {x: 0, y: 0}},
		finalized = false;

	var dataURItoBlob = function (dataURI){
	    // convert base64/URLEncoded data component to raw binary data held in a string
	    var byteString;
	    if (dataURI.split(',')[0].indexOf('base64') >= 0)
	        byteString = atob(dataURI.split(',')[1]);
	    else
	        byteString = unescape(dataURI.split(',')[1]);

	    // separate out the mime component
	    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

	    // write the bytes of the string to a typed array
	    var ia = new Uint8Array(byteString.length);
	    for (var i = 0; i < byteString.length; i++){
	        ia[i] = byteString.charCodeAt(i);
	    }

	    return new Blob([ia], {type:mimeString});
	}

	var drawSelection = function(){
		if(mouseDraw || finalized == true){
			console.log('draw');
			context.drawImage(screenshot, 0, 0);
			// background
			context.fillStyle = "rgba(0, 0, 0, 0.6)";
			context.beginPath();
			context.moveTo(0, 0);
			context.lineTo(0, global.app.ss.coords.height);
			context.lineTo(global.app.ss.coords.width, global.app.ss.coords.height);
			context.lineTo(global.app.ss.coords.width, 0);
			if(finalized !== true){
				var width = mouse.x-drawBox.start.x,
					height = mouse.y-drawBox.start.y;
				context.rect(drawBox.start.x, drawBox.start.y , width , height);
				context.fill();
			}else{
				finalized = false;
				var width = drawBox.end.x-drawBox.start.x,
					height = drawBox.end.y-drawBox.start.y;
				context.rect(drawBox.start.x, drawBox.start.y , width , height);
				context.fill();
				var outputCanvas = document.createElement('canvas'),
					outputCanvasContext = outputCanvas.getContext('2d');
				outputCanvas.width = width;
				outputCanvas.height = height;
				outputCanvasContext.drawImage(canvas, drawBox.start.x, drawBox.start.y, width, height, 0, 0, width, height);
				var output = outputCanvas.toDataURL("image/png");
				$('#output').attr('src', output).show();
				$('#canvas').hide();

				var formData = new FormData();
				formData.append("file", dataURItoBlob(output));
				$.ajax({
					type: "POST",
					url: "http://127.0.0.1:1234/upload",
					data: formData,
					processData: false,
					contentType: false,
					success: function(data){
						if(data && data.url){
							clipboard.set(data.url, 'text');
						}
						return window.close();
					}
				});
			}
		}
	}

	canvas.onmousedown = function(){
		mouseDraw = true;
		drawBox.start = {x: mouse.x, y: mouse.y};
	};
	canvas.onmouseup = function(){
		drawBox.end = {x: mouse.x, y: mouse.y};
		mouseDraw = false;
		finalized = true;
		window.requestAnimationFrame(drawSelection);
	};
	canvas.onmousemove = function(){
		if(mouseDraw == true){
			window.requestAnimationFrame(drawSelection);
		}
	};

	screenshot.src = global.app.ss.filename;
	screenshot.onload = function(){
		console.log(screenshot.src);
		context.drawImage(screenshot, 0, 0);
	}

	$(window).on('keydown', function(e){
		console.log(e.which);
		switch(e.which){
			case 27: // escape
				global.app.ss = null;
				window.close();
			break;
		}
	});
});