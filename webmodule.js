var fs = require("fs");
var qs = require("querystring");

var types = {
    plain: {"Content-Type": "text/plain"},
    html : {"Content-Type": "text/html"},
    css  : {"Content-Type": "text/css"},
    js   : {"Content-Type": "text/js"},
    png  : {"Content-Type": "image/png"},
    jpg  : {"Content-Type": "image/jpeg"}
};

inferContentType = function(fp) {
    var extension = fp.substr((~-fp.lastIndexOf(".") >>> 0) + 2);
    return types[extension] ?
        types[extension] :
        types.plain;
}

var defined_paths = {
    get : {},
    post : {}
};

var webrenderer = function(){};
webrenderer.prototype._list = [];
webrenderer.prototype.add = function(render) {
    this._list.unshift(render);
    return this;
};
webrenderer.prototype.resolve = function(finalizer) {
    if (this._list.length === 0){
        finalizer();
    } else {
        var thisfunc = this._list.shift();
        webrenderer.prototype.resolve(function(){
            thisfunc();
            finalizer();
        });
    }
};

chain = function(value) {
    return {
        then : function(cb){
            return chain(cb(value));
        }
    };
};

add = function(path, page_execution, http_action) {
    if (typeof path === 'string'){
        path = path.split("/");
    }
    var current_branch = http_action;
    path.forEach(function(every) {
        if (! current_branch[every]) {
            current_branch[every] = {};
        }
        current_branch = current_branch[every];
    });

    return (current_branch._page = {
        exec: page_execution,
        status: true
    });
};


var pools = {};
createPool = function(name, wm) {
    if (pools[name]) {
        return pools[name];
    }
    return (pools[name] = {
        tagged : [],
        enable : function() {
            this.tagged.forEach(function(e){
                e.status = true;
            });
        },
        disable : function() {
            this.tagged.forEach(function(e){
                e.status = false;
            });
        },
        get : function(path, cb) {
            var res = wm.get(path, cb);
            this.tagged.push(res);
            return res;
        },
        post : function(path, cb) {
            var res = wm.post(path, cb);
            this.tagged.push(res);
            return res;
        }
    });
};


var webmodule = function(){
    this.pool = function(name, withPool){
        withPool(createPool(name, this));
    }
};

webmodule.prototype.getPool = function(nameornull) {
    if (typeof nameornull === 'undefined') {
        return Object.keys(pools);
    }
    return {
        tagged : pools[nameornull].tagged,
        disable : pools[nameornull].disable,
        enable : pools[nameornull].enable
    };
};

webmodule.prototype.meta = {};
webmodule.prototype.meta.underscore = [{
        name: "_var",
        clearonwrite: false,
        appvars: function(name){
            return name;
        }
    },{
        name: "_csv",
        clearonwrite: false,
        appvars: function(name){
            return name.split(",");
        }
    },{
        name: "_all",
        clearonwrite: true,
        appvars: function(name) {
            url.unshift(name);
            return url.join("/");
        }
    }
];

webmodule.prototype.pool = function(name, withPool) {
    withPool(createPool(name));
};

webmodule.prototype.getRenderer = function(){
    return new webrenderer();
};

webmodule.prototype.load_url = function(url, type, params) {
    var func;
    var vars = [];
    if (type === 'get' || type === 'GET' || type === '_get') {
        func = defined_paths.get;
    } else if (type === 'post' || type === 'POST' || type === '_post') {
        func = defined_paths.post;
    }
    while(url.length !== 0) {
        var name = url.shift();
        var tree2 = func[name];
        if (typeof tree2 === 'undefined') {
            webmodule.prototype.meta.underscore.forEach(function(tuple) {
                if (func[tuple.name]) {
                    tree2 = func[tuple.name];
                    vars.push(tuple.appvars(name, url));
                    if (tuple.clearonwrite) {
                        url = [];
                    }
                }
            });
        }
        func = tree2;
        if (typeof func === 'undefined') {
            return;
        }
    }
    if (func._page && func._page.status) {
        func._page.exec.apply(null, params.concat(vars));
        return true;
    }
};

webmodule.prototype.get = function(path, callback) {
    return add(path, callback, defined_paths.get);
};

webmodule.prototype.post = function(path, callback) {
    return add(path, callback, defined_paths.post);
};

webmodule.prototype.cookies = function parseCookies (request) {
    var list = {},
    rc = request.headers.cookie;

    rc && rc.split(';').forEach(function(cookie) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
};


webmodule.prototype.extract_data = function(request, callback) {
    var body = '';

    request.on('data', function(data) {
        body += data;
        if (body.length > 1e6) {
            request.connection.destroy();
            return {error: "the user attempted to post a file larger than 1GB"};
        }
    });

    request.on('end', function() {
        callback(qs.parse(body));
    });
};

webmodule.prototype.stream = function(response, fp, type, done) {
    (function(yes, no){
        fs.stat(fp, function(err, stats) {
            if (!err && stats.isFile()) {
                yes();
            } else {
                no();
            }
        });
    })(function() {
        file = fs.createReadStream(fp);
        //TODO infer type from file extension
        response.writeHead(200, type?type:{"Content-Type:": "text/plain"});
        file.on('data', function(chunk) {
            response.write(chunk);
        });
        file.on('end', function() {
            response.end();
            done(response);
        });
    }, function() {
        response.writeHead(404, {"Content-Type": "text/plain"});
        response.end("file not found");
        done(response);
    });
};

webmodule.prototype.eachCookie = function (request, cb) {
    if (request && request.headers && request.headers.cookie) {
        request.headers.cookie.split(';').forEach(function( cookie ) {
            var parts = cookie.split('=');
            cb(parts[0], parts[1]);
        });
    }
};

webmodule.prototype.notFound = function(response) {
    response.writeHead(404, {"Content-Type": "text/plain"});
    response.end("404");
};

webmodule.prototype.reportError = function(response, errors) {
    response.writeHead(500, {"Content-Type": "text/plain"});
    response.end(errors+"");
};

webmodule.prototype.readTemplate = function(templateName, renderfunction){
    fs.readFile(templateName, function (err,data) {
        if (! err) {
            renderfunction(data);
        }
    });
};

webmodule.prototype.meta.define404 = function(notFoundFunction) {
    webmodule.prototype.notFound = notFoundFunction;
};

webmodule.prototype.meta.define500 = function(notFoundFunction) {
    webmodule.prototype.reportError = notFoundFunction;
};

webmodule.prototype.meta.addunderscore = function(name, callback, absorbAll){
    webmodule.prototype.meta.underscore.push({
        "name": name,
        "clearonwrite": absorbAll,
        "appvars": callback
    });
};


webmodule.prototype.headers = {

    ok: function(response, contentType) {
        if (contentType) {
            response.writeHead(200, contentType);
        } else {
            response.writeHead(200, {"Content-Type":"text/plain"});
        }

    },

    redirect: function(response, url) {
        response.writeHead(301, {"Location": url?url:""});
        response.end(url?url:"");
    }
};

exports.webmodule = new webmodule();

webmodule.prototype.fixPrototypes = function(request, response, cb) {
    response.stream = {
        "relative": function(fp, type) {
            fp = process.cwd() + "/" + fp;
            webmodule.prototype.stream(response, fp, type?type:inferContentType(fp));
        },
        "static": function(fp, type) {
            webmodule.prototype.stream(response, fp, type?type:inferContentType(fp));
        }
    }
    cb();
}
