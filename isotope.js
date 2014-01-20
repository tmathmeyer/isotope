var http = require("http");
var url = require("url");
var modules = require("./webmodule");
var files = require("./files");



exports.create = function(port, config){
    if (config){
        modules.init(config);
    } else {
        modules.init();
    }

    http.createServer(function(request, response) {
        var uri = url.parse(request.url).pathname;
	    var cookies = {};
	    request.headers.cookie && request.headers.cookie.split(';').forEach(function( cookie ) {
		    var parts = cookie.split('=');
		    cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
	    });

	    var success = modules.view(uri.split("/").slice(1), request.method, [request, response, cookies]);
	    if (! success){
		    files.get_file(uri.substr(1), response);
    	}

    }).listen(parseInt(port, 10));
}
