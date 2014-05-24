var files = require('./files');

var defined_paths = {
    get : {}, 
    post : {}
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

    current_branch._page = page_execution;
}

webmodule = function(){}

webmodule.prototype.initialize = function(configuration) {
    configuration.forEach(function(data){
        require("../../"+data.location).init(server);
    });

    webmodule.prototype.initialize = function() {
        console.log("you can not call initialize twice");
    };
};

webmodule.prototype.view = function(url, type, params) {
    var func;
    var vars = [];
    if (type == 'get' || type == 'GET' || type == '_get') {
        func = defined_paths.get;
    } else if (type == 'post' || type == 'POST' || type == '_post') {
        func = defined_paths.post;
    }

    
    while(url.length != 0) {
        var name = url.shift();
        var tree2 = func[name];
        if (typeof tree2 === 'undefined') {
            if (func["_var"]) {
                tree2 = func["_var"];
                vars.push(name);
            } else if (func["_csv"]) {
                tree2 = func["_csv"];
                vars.push(name.split(","));
            } else if (func["_all"]) {
                vars.push(name+"/"+url.join("/"));
                tree2 = func["_all"];
                url = [];
            }
        } 
        func = tree2;
        if (typeof func === 'undefined') {
            return;
        }
    }
    if (func._page) {
        func._page.apply(null, params.concat(vars));
        return true;
    }
};

webmodule.prototype.get = function(path, callback, description, color) {
    add(path, callback, defined_paths.get);
}; 

webmodule.prototype.post = function(path, callback, description) {
    add(path, callback, defined_paths.post);
};

webmodule.prototype.get_postdata = function(request, callback) {
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


exports.webmodule = new webmodule();
