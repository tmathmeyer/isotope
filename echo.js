exports.init = function(server){
    server.get("echo/_var", function(reqest, response, cookies, val){
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.end(v);
    });

    server.get("echo/_csv", function(reqest, response, cookies, csv){
        response.writeHead(200, {"Content-Type": "text/plain"});
        csv.forEach(function(each){
            response.write(each+"\n");
        });
        response.end();
    });

    server.post("echo/post", function(reqest, response){
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.end("you made a post!!!");
    });
}