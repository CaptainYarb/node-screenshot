module.exports = function(app){
	app.server.route({
	    method: 'GET',
	    path: '/{param*}',
	    handler: {
	        directory: {
	            path: 'public'
	        }
	    }
	});
}