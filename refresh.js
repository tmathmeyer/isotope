exports.init = function(server){
    server.get("refresh", function(req, res, cook, v){
        res.writeHead(200, {"Content-Type": "text/html"});
        server.get_loaded_modules().forEach(function(a){
            res.write(a+"\n");
        });
    });
}
