isotope
=======

Isotope is a server-side web framework that allows fairly complex page structures with very little code.
It is similar to express, though less featureful and more lightweight. This is the dev branch of the server, 
so expect differences from the master branch. right now most of the work is going into a re-write with better
practices and improved readability. It is not fully feature complete with master (see TODO).



####Example
```JavaScript
var server = require("isotope").create(8080);

server.get("csv/_csv", function(req, res, csv) {
    res.writeHead(200, {"Content-Type": "text/plain"});
    //write each param on a new line
    csv.forEach(function(each){
        res.write(each+"\n");
    });
    res.end();
});

server.get("fail", function(req, res) {
    // send a 301 from "fail" to "csv/failure,on,every,corner"
    server.redirect(res, "fail", "csv/failure,on,every,corner");
});

server.get("fstest/_var", function(req, res, a){
    // stream a document from the filesystem (note, this isn't entirely safe yet)
    server.stream(res, "/Users/ted/Documents/"+a);
});

server.get("cookies", function(req, res) {
    // print all cookies to the document
    res.writeHead(200, {"Content-Type": "text/plain"});
    server.eachCookie(function(cname, cvalue){
        res.write(cname + " = " + cvalue + "<br />");
    });
    res.end();
});

server.post("accept", function(req, res){
    response.writeHead(200, {"Content-Type": "text/plain"});

    // print to console the data that the user posts
    server.extract_data(req, function(data){
        console.log(data);
    });

    response.end("post successful");
});
```

####Overview
Each server.get() and server.post() passes a callback function into the server core that gets executed when a user makes a request that matches the provided request. What makes the get and post functions special are the variable urls. Url segments beginning with an _ are as follows:

varible | what it does
--------| -------------
_var    | causes the server to pass the actual string as a parameter to the callback function (many of these can be used in one url)
_csv    | causes the server to pass the actual string split by "," as an array to the callback function
_all    | causes the server to ignore everything after the _all and pass the rest of the url back to the server 


####Posting data
The last block in the example shows how to recieve data from the client. It is still fairly buggy with large chunks of data. this needs improvment.


####Cookies
Cookies are accessed by the server directly from the request object. The penultimate example block shows how this is done.


##TODO:
- [X] move filesystem interaction out of the shitty files.js
- [X] clean the webmodules.js file for readibility
- [ ] custom 404 pages
- [ ] on-page error reporting
- [ ] fewer crashes!
- [ ] security and sessions
- [ ] re-introduce modules.
- [ ] allow users to define their own variable _urls
- [ ] improved streaming functionality
- [ ] introduce smoke testing framework
- [ ] interactive cli
