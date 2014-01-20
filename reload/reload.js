exports.init = function(server){
    server.get("modules", function(req, res, cook){
        if (res.connection.remoteAddress == "127.0.0.1"){
            server.files.get_file("node_modules/isotope/reload/reload.html", res);
        } else {
            res.writeHead(200, {"Content-Type": "text/json"});
            res.end(JSON.stringify({error: "denied"}));
        }
    });

    server.get("modules/css/_var", function(req, res, cook, filename){
        if (res.connection.remoteAddress == "127.0.0.1"){
            server.files.get_file("node_modules/isotope/reload/"+filename, res);
        } else {
            res.writeHead(200, {"Content-Type": "text/json"});
            res.end(JSON.stringify({error: "denied"}));
        }
    });

    server.get("modules/get/all", function(req, res){
        res.writeHead(200, {"Content-Type": "text/json"});
        if (res.connection.remoteAddress == "127.0.0.1"){
            res.end(JSON.stringify(server.get_all_modules()));
        } else {
            res.end(JSON.stringify({error: "denied"}));
        }
    });

    server.get("modules/status/_var", function(req, res){
        res.writeHead(200, {"Content-Type": "text/json"});
        if (res.connection.remoteAddress == "127.0.0.1"){
            res.end(server.get_module_status(v));
        } else {
            res.end(JSON.stringify({error: "denied"}));
        }
    });

    server.get("modules/unload/_var", function(req, res, cook, v){
        res.writeHead(200, {"Content-Type": "text/plain"});
        if (res.connection.remoteAddress == "127.0.0.1"){
            if (server.unload_module(v)){
                res.end("success");
                console.log("unloaded module: "+v);
            } else {
                res.end("failure");
            }
        } else {
            res.end("denied");
        }
    });

    server.get("modules/refresh/_var", function(req, res, cook, v){
        res.writeHead(200, {"Content-Type": "text/plain"});
        if (res.connection.remoteAddress == "127.0.0.1"){
            if (server.reload_module(v)){
                res.end("success");
            } else {
                res.end("failure");
            }
        } else {
            res.end("denied");
        }
    });
}
