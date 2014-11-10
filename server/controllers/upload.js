module.exports = function(app){

	var fs = require('fs');

	app.server.route({
	    method: 'POST',
	    path: '/upload',
	    handler: function(request, reply){
	        var data = request.payload;
	        if(data.file){
	            var d = new Date().getTime(),
	                slug = Math.random().toString(36).substring(7) + '-' + d,
	                filename = 'ss-' + slug +'.png';
	            fs.writeFile(app.dir + app.config.uploads + filename, data.file, function (err){
	                if(err){
	                    return reply(app.hapi.error.internal('File write error.'));
	                }
	                return reply({
	                    filename: filename,
	                    url: app.config.server.url + 'ss/' + slug
	                });
	            });
	        }else{
	            return reply(app.hapi.error.internal('no file uploaded'));
	        }
	    }
	});
}