exports.init = function(add_page){
    add_page.get("echo/_var", function(req, res, cook, v){
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(v);
    });
}
