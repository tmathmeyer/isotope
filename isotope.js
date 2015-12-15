var http = require("http");
var url = require("url");

exports.create = function(port, modules) {
    webmodule = require("./webmodule").webmodule;
    if (modules) {
        modules.forEach(function(each) {
            each(webmodule);
        });
    }

    http.createServer(function(request, response) {
        webmodule.fixPrototypes(request, response, function() {
            try {
                var parsed = url.parse(request.url);
                var uri = parsed.pathname.split("/").slice(1);
                var query = parsed.query();
                response.header = headerparse(response);
                if (! webmodule.load_url(uri, query, request.method, [response, request])) {
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
