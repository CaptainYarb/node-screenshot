module.exports = function(app){
	var fs = require('fs');

	app.server.route({
	    method: 'GET',
	    path: '/ss/{id}',
	    handler: function(request, reply){
	        var filename = 'ss-' + request.params.id + '.png',
	            file = app.dir + app.config.uploads + filename;
	        fs.exists(file, function(exists){
	            if(!exists){
	                return reply(hapi.error.notFound('404'));
	            }
	            return reply.view('screenshot.dust', {
	            	screenshot: "/uploads/" + filename
	            });
	        });
	    }
	});
}