exports.init = function(add_page){
    add_page.get(["echo2", "_csv"], function(req, res, cook, csv){
        res.writeHead(200, {"Content-Type": "text/plain"});
        
        csv.forEach(function(data){
            res.write(data+"\n\n");
        });

        res.end();
    });
}
