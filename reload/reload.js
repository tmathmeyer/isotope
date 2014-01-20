exports.init = function(server){
    server.get("modules", function(req, res, cook){
        server.files.get_file("node_modules/isotope_server/reload/reload.html", res);
    });

    server.get("modules/css/_var", function(req, res, cook, filename){
        server.files.get_file("node_modules/isotope_server/reload/"+filename, res);
    });

    server.get("modules/get/all", function(req, res){
        res.writeHead(200, {"Content-Type": "text/json"});
        res.end(JSON.stringify(server.get_all_modules()));
    });

    server.get("modules/status/_var", function(req, res){
        res.writeHead(200, {"Content-Type": "text/json"});
        res.end(server.get_module_status(v));
    });

    server.get("modules/unload/_var", function(req, res, cook, v){
        res.writeHead(200, {"Content-Type": "text/plain"});
        if (server.unload_module(v)){
            res.end("success");
            console.log("unloaded module: "+v);
        } else {
            res.end("failure");
        }
    });

    server.get("modules/refresh/_var", function(req, res, cook, v){
        res.writeHead(200, {"Content-Type": "text/plain"});
        if (server.reload_module(v)){
            res.end("success");
        } else {
            res.end("failure");
        }
    });
}
