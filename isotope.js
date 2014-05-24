var http = require("http");
var url = require("url");
var files = require("./files");





exports.create = function(port, config) {
    webmodule = require("./webmodule").webmodule;
    if (config) {
        webmodule.initialize(config);
    }


    

    http.createServer(function(request, response) {
        var uri = url.parse(request.url).pathname;
	    var cookies = {};
	    request.headers.cookie && request.headers.cookie.split(';').forEach(function( cookie ) {
		    var parts = cookie.split('=');
		    cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
	    });

	    if (! webmodule.load_url(uri.split("/").slice(1), request.method, [request, response, cookies])){
		    files.get_file(uri.substr(1), response);
    	}

    }).listen(parseInt(port, 10));

    return webmodule;
}
