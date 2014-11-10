module.exports = function(app){

	var sid = 0;

	app.server.route({
	    method: ['GET', 'POST'],
	    path: '/login',
	    config: {
	        auth: {
	        	mode: 'try',
	        	strategy: 'session'
	        },
	        plugins: {
	        	'hapi-auth-cookie': {
	        		redirectTo: false
	        	}
	        }
	    },
	    handler: function(request, reply){
	    	console.log('login');
	    	if(request.auth.isAuthenticated){
	    	    return reply.redirect('/manage');
	    	}
	    	var errors = '',
	    		account = {
			        id: 'john',
			        password: 'password',
			        name: 'John Doe'
			    };
	    	if(request.method === 'post'){
	    		request.server.app.cache.set(sid, { account: account }, 0, function (err){
	    		    if(err){
	    		        reply(err);
	    		    }
	    			request.auth.session.set({ sid: String(++uuid) });
	    			return reply.redirect('/manage');
	    		});
	    	}
	        reply.view('login.dust', {
	            subject: 'Login - GrabKit Server'
	        });
	    }
	});

	app.server.route({
	    method: 'GET',
	    path: '/logout',
	    config: {
	    	plugins: {
	    		'hapi-auth-cookie': {
	    			redirectTo: false
	    		}
	    	}
	    },
	    handler: function(request, reply){
			request.auth.session.clear();
			return reply.redirect('/');
	    }
	});
}