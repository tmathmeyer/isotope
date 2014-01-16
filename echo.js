exports.init = function(server){
    server.get("echo/_var", function(req, res, cook, v){
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(v);
    });

    server.get("echo/haha", function(req, res){
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end("lel");
    });

    server.post("echo/post", function(req, res){
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end("you made a post!!!");
    });
}
