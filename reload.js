var files = require("./files");
exports.init = function(server){
    server.get("modules", function(req, res, cook){
        files.get_file("reload.html", res);
    });

    server.get("modules/get/all", function(req, res){
        res.writeHead(200, {"Content-Type": "text/json"});
        res.end(JSON.stringify(server.get_all_modules()));
    });

    server.get("modules/status/_var", function(req, res){
        res.writeHead(200, {"Content-Type": "text/json"});
        res.end(server.get_module_status(v));
    });

    server.get("modules/refresh/_var", function(req, res, cook, v){
        res.writeHead(200, {"Content-Type": "text/plain"});
        if (server.reload_module(v)){
            res.end(v + " has been reloaded");
        } else {
            res.end(v + " was not reloaded");
        }
    });
}
