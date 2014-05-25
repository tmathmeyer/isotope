var http = require("http");
var url = require("url");

exports.create = function(port, config) {
    webmodule = require("./webmodule").webmodule;
    if (config) {
        webmodule.initialize(config);
    }

    http.createServer(function(request, response) {
        var uri = url.parse(request.url).pathname.split("/").slice(1);
	    if (! webmodule.load_url(uri, request.method, [request, response])) {
		    webmodule.notFound(response);
    	}
    }).listen(parseInt(port, 10));

    return webmodule;
}
