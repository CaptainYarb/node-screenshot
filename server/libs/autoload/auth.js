module.exports = function(app){
	app.server.pack.register(require('hapi-auth-cookie'), function (err){
	    app.server.auth.strategy('session', 'cookie', {
	        password: 'FMAfmsdkfm33902fjAF3fa9jAF3afS#FJIBPc',
	        cookie: 'grabkit-auth',
	        redirectTo: '/login',
	        isSecure: false
	    });
	});
}