module.exports = function(app){
	app.server.route({
	    method: ['GET'],
	    path: '/',
	    config: {
	    	auth: 'session'
	    },
	    handler: function(request, reply){
	        reply.view('manage.dust', {
	            subject: 'Manage - GrabKit Server'
	        });
	    }
	});
}