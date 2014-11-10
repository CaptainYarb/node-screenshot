module.exports = function(app){
    var dust = require('dustjs-linkedin'),
        _ = require('underscore'),
        fs = require('fs');

    // load layouts
    _.each(fs.readdirSync(app.dir + app.config.dust.layoutsDir), function(layout){
        dust.loadSource(dust.compile(fs.readFileSync(app.dir + app.config.dust.layoutsDir + layout, 'utf8'), 'layouts/'+layout.replace('.dust', '')));
    });

    app.server.views({
        engines: {
            dust:  {
                module: {
                    compile: function(template, options, callback){
                        var compiled = dust.compileFn(template, options && options.name);
                        process.nextTick(function(){
                            callback(null, function(context, options, callback){
                                compiled(context, callback)
                            });
                        })
                    }
                },
                compileMode: 'async'
            },
        },
        path: app.dir + app.config.dust.templateDir
    });
    return {
        dust: dust
    }
}