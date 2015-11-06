var http = require("http");
var url = require("url");

exports.create = function(port, config) {
    webmodule = require("./webmodule").webmodule;
    if (config) {
        webmodule.initialize(config);
    }

    http.createServer(function(request, response) {
        webmodule.fixPrototypes(request, response, function() {
            try {
                var uri = url.parse(request.url).pathname.split("/").slice(1);
                response.header = headerparse(response);
                if (! webmodule.load_url(uri, request.method, [response, request])) {
                    webmodule.notFound(response);
                }
            } catch (exc) {
                console.log(exc.stack);
                webmodule.reportError(response, exc);
            }
        });
    }).listen(parseInt(port, 10));

    return webmodule;
}


headerparse = function(res) {
    return function(details) {
        if (typeof details === "undefined") {
            details = {};
        }
        var contentType = {"Content-Type": "text/plain"};
        var status = 200;
        if (details.content) {
            contentType = details.content;
        }
        if (details.status) {
            status = details.status;
        }
        res.writeHead(status, contentType);
    }
}
