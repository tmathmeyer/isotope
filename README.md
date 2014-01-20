isotope
=======

Isotope is a server-side web framework that allows fairly complex page structures with very little code.
To use isotope, one must create a server file, normally server.js, that is executed by node. A good example is:

```JavaScript
var server = require('./isotope');
server.create(8000, './config');
```

this creates a server on port 8000 with a configuration file located in the same folder called config.js.
note: for any port number under 1024, root access is needed.

The config file is where one should list the names of each set of pages as well as the path to each definition. Each entry in the list is considered a separate "module" and pages are grouped together this way for unloading and reloading. an example config would look like this:

```JavaScript
exports.getModules = function(){
    return [
        {
            name : "echo",
            location : "./echo"
        },
        {
            name : "reverse",
            location : "./reverse"
        }
    ];
}
```

Each of these (echo, reverse) are loaded when the server is started, and each can be loaded and unloaded through a web interface that is only accessible from localhost. 

Finally, modules are the most important part. They generally look something like this:

```JavaScript
exports.init = function(server){
    server.get("echo/_var", function(request, response, cookies, val){
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.end(v);
    });

    server.get("echo/_csv", function(request, response, cookies, csv){
        response.writeHead(200, {"Content-Type": "text/plain"});
        csv.forEach(function(each){
            response.write(each+"\n");
        });
        response.end();
    });

    server.post("echo/post", function(request, response){
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.end("you made a post!!!");
    });
}
```

Each of the 

```
server.get()
server.post()
```

are the functions for creating pages at the given path, as well as the functions that are executed when that path is accessed. There are also three special URL modifiers:
_var : matches any url value (split by "/") and passes the actual value to the function
_csv : takes any comma separated list in the url and passes the elements as an array to the function
_raw : all parts of the URL following the _raw tag are interpreted as a filesystem path. 

Finally, each function passed to the .get() or .post() methods takes functions in the following order:

```
request : the http_request object (as defined in the nodejs docs)
response : the http_response object (as defined in the nodejs docs)
cookies : any cookies associated with the domain
```

followed by any number of parameters, corresponding to the number of _var, _csv, and _raw modifiers in the url. 
