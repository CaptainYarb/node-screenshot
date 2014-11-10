var fs = require('fs'),
    _ = require('underscore');

var app = {
    config: require('./config.json'),
    dir: process.cwd() + '/',
    hapi: require('hapi'),
    joi: require('joi')
};

app.server = app.hapi.createServer(app.config.server.host, app.config.server.port, {
    plugins: {
        rethinkdb: {
            autoconnect: true
        }
    }
});

// load system libraries
_.each(fs.readdirSync(app.dir + app.config.systemDir), function(file){
    if(file.slice(-3) === '.js'){
        var systemParts = require(app.dir + app.config.systemDir + file)(app);
        _.each(systemParts, function(fn, name){
            if(fn !== false){
                app[name] = fn;
            }
        });
    }
});

// load controllers
_.each(app.recursiveList(app.dir + 'controllers'), function(file){
    try{
        require(file)(app);
    }catch(e){
        app.logs.emit('error', 'Failed to load Controller [' + file + ']. ' + e.stack)
    }
});

// handle 404
app.server.route({
    method: '*',
    path: '/{p*}',
    handler: function(request, reply){
        reply.code(404).view('404.dust');
    }
});

app.server.start(function (){
    console.log('info', 'Server running at: ' + app.server.info.uri);
});