var fs = require('fs'),
    hapi = require('hapi'),
    config = require('./config.json'),
    uploadPath = './public/uploads/';


var server = hapi.createServer(config.host, config.port);


server.route({
    method: 'GET',
    path: '/',
    handler: function(request, reply){
        return reply('home');
    }
});

server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: 'public'
        }
    }
});

server.route({
    method: 'GET',
    path: '/ss/{id}',
    handler: function(request, reply){
        var filename = 'ss-' + request.params.id + '.png',
            file = uploadPath + filename;
        fs.exists(file, function(exists){
            if(!exists){
                return reply(hapi.error.notFound('404'));
            }
            return reply('<img src="/uploads/' + filename + '" alt="screenshot" />');
        });
    }
});

server.route({
    method: 'POST',
    path: '/upload',
    handler: function(request, reply){
        var data = request.payload;
        if(data.file){
            var d = new Date().getTime(),
                slug = Math.random().toString(36).substring(7) + '-' + d,
                filename = 'ss-' + slug +'.png',
                path = uploadPath;
            fs.writeFile(path + filename, data.file, function (err){
                if(err){
                    return reply(hapi.error.internal('File write error.'));
                }
                return reply({
                    filename: filename,
                    url: config.url + 'ss/' + slug
                });
            });
        }else{
            return reply(hapi.error.internal('no file uploaded'));
        }
    }
});

server.start(function (){
    console.log('info', 'Server running at: ' + server.info.uri);
});