module.exports = function(app){
	var events = require("events"),
		fs = require('fs');

	app.server.pack.register({
		name: 'rethinkdb',
		version: "0.0.1",
		options: {
			autoconnect: true
		},
		attributes: {
			name: 'RethinkDB Auto Pool',
		},
		register: function(plugin, options, next){
			if(!app.config.database || !app.config.database.enabled){
				return next();
			}
			plugin.ext('onPreHandler', function(request, callback){
				if(request.route.plugins && request.route.plugins.rethinkdb == false){
					return callback();
				}
				console.log('connecting to rethinkdb...');
				app.rethinkdb.connect(function(err, r, conn, rethinkNext){
					if(err){
						return callback(plugin.hapi.error.badRequest('Database connection failed.', err));
					}
					request.rethinkdb = {
						r: r,
						conn: conn,
						next: rethinkNext
					};
					return callback();
				});

			});
			plugin.events.on('tail', function (request){
				if(request.rethinkdb){
					console.log('closing connection to rethinkdb...');
					request.rethinkdb.next();
				}
			});
			return next();
		}
	}, function(err){
		if(err){
			app.logs.emit('error', 'Failed to load rethinkdb autoconnect');
		}
	});


	return {
		database: function(){
			if(!app.config.database || !app.config.database.enabled){
				return false;
			}
			var r = require('database'),
				pool = require('generic-pool').Pool;

			var rpool = pool({
					name: 'database',
					create: function(callback){
						return r.connect(app.config.database.config, callback);
					},
					destroy: function(conn){
						return conn.close();
					},
					max: app.config.database.poolMax || 10,
					min: app.config.database.poolMin || 2,
					idleTimeoutMillis: app.config.database.poolTimeout || 180000
				})
			return {
				closeAll: function(){
					return rpool.destroyAllNow();
				},
				connect: function(callback){
					rpool.acquire(function(err, conn){
						if(err){
							return callback(err);
						}
						var ranRelease = false,
							release = function(type, reset){
								if(ranRelease == false){
									if(reset == undefined){
										clearTimeout(clearPool);
									}
									rpool.release(conn);
									ranRelease = true;
								}
								return;
							};
						var clearPool = setTimeout(function(){
							return release('forcefully closing', true);
						}, 15000);
						return callback(null, r, conn, release);
					});
				},
				escapeRegExp: function(string){
					return String(string).replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
				}
			}
		}()
	}
}