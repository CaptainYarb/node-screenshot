module.exports = function(app){
	var events = require("events"),
		fs = require('fs'),
		colors = require('colors'),
		_ = require('underscore'),
		crypto = require('crypto');

		var colorMap = {
			'info': 'green',
			'warn': 'yellow',
			'error': 'red'
		};

	return {
		events: new events.EventEmitter(),
		logs: function(){
			var eventHandler = new events.EventEmitter();
			var handleLog = function(type, data){
				var t = new Date(),
					timestamp = (t.getMonth()+1) + '/' + t.getDate() + '/'+ t.getFullYear() + ' ' + t.getHours() + ':' + t.getMinutes() + ':' + t.getSeconds(),
					line = colors.grey('[' + colors[colorMap[type]](String(type).toUpperCase()) + ' ' + timestamp + ']')+' '+ String(data);
				if(app.config.log && app.config.log.file){
					// write to file
					if(type == 'error' && app.config.log.errorFile){
						fs.appendFileSync(app.config.log.file, "\n\r" + line);
					}else{
						fs.appendFileSync(app.config.log.file, "\n\r" + line);
					}
				}
				if(type == 'info'){
					console.log(line);
				}else{
					console.error(line);
				}
			}

			eventHandler.on('info', function(data){ return handleLog('info', data); });
			eventHandler.on('warn', function(data){ return handleLog('warn', data); });
			eventHandler.on('error', function(data){ return handleLog('error', data); });

			return eventHandler;
		}(),
		recursiveList: function(dir){
			var parent = this,
				stat = fs.statSync(dir),
				list = [];
			if(!stat.isDirectory()){
				return false;
			}
			dir = String(dir + '/').replace(/\//g, '/'); // ensure proper trailing slash
			_.each(fs.readdirSync(dir), function(file){
				if(fs.statSync(dir + file).isDirectory()){
					var recursive = parent.recursiveList(dir + file);
					if(recursive instanceof Array && recursive.length > 0){
						list = list.concat(recursive); // add results
					}
				}else{
					if(String(file).slice(-3) === '.js'){
						list.push(dir + file);
					}
				}
			});
			return list;
		},
		generateCode: function(length, seperator){
			length = length || 32;
			seperator = seperator || false;

			var text = "",
		   		possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		   	if(seperator != false){
		    	regex = new RegExp('.{'+seperator+'}', 'g');
		   	}
		    for(var i=0; i < length; i++){
		        text += possible.charAt(Math.floor(Math.random() * possible.length));
		    }
			return seperator && text.match(regex).join('-') || text;
		},
		hashPassword: function(password){
			return crypto.createHash('sha512').update(users.salt.prepend+password+users.salt.append).digest('hex');
		},
		success: function(data){
			data = data || {};
			return {
				statusCode: 200,
				success: true,
				data: data
			}
		},
		fail: function(message, data){
			message = message || '';
			data = data || {};
			return {
				statusCode: 200,
				success: false,
				message: message,
				data: data
			}
		},
		error: function(err, data){
			var returnData = app.hapi.error.internal(err, data);
			// TODO: REMOVE
			if(typeof(err) == 'object'){
				data = err;
				err = '';
			}
			// END
			returnData.output.payload.message = err;
			returnData.output.payload.data = data;
			return returnData;
		},
		inputError: function(err, inputName, inputType, data){
			var returnData = app.hapi.error.badRequest(err, data);
			returnData.output.payload.validation = {
				source: inputType || 'payload',
				keys: [inputName]
			}
			return returnData;
		},
		formatError: function(data){
			if(data instanceof String){
				return this.error(data);
			}
			switch(data.type){
				case "db":
					this.logs.emit('error', data.err);
					return this.error('Database error');
				break;
				case "input":
					return this.inputError(data.msg, data.field, data.fieldType || false, data.err || {});
				break;
				case "error":
				case "network":
					return this.error(data.msg, data.err || {});
				break;
				case "fail":
					return this.fail(data.msg, data.err || {});
				break;
				default:
					return this.error(String(data));
				break;
			}
		}
	}
}