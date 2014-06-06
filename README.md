isotope
=======
[![Code Climate](https://codeclimate.com/github/tmathmeyer/isotope.png)](https://codeclimate.com/github/tmathmeyer/isotope)

Isotope is a server-side web framework that allows fairly complex url structures with very little code.
It is similar to express, though less featureful and more lightweight. This is the dev branch of the server, 
so expect differences from the master branch. right now most of the work is going into a re-write with better
practices and improved readability. It is not fully feature complete with master (see TODO).



####Example
```JavaScript
var server = require("isotope").create(8080);

// super basic demo of the app process
server.get("helloworld", function(res){
    res.writeHead(200, {"Content-Type":"text/plain"});
    res.end("hello world!");
});

// accept a post request, and log the data
server.post("accept", function(res, req){
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.end();

    // print to console the data that the user posts
    server.extract_data(req, function(data){
        console.log(data);
    });
});




//lets throw in the "underscore"
//a part of a URL object that is passed back dynamically
server.get("echo/_var", function(res, req, part){
    res.writeHead(200, {"Content-Type":"text/plain"});
    res.end(part); // super basic echo module. puts the _var on the screen
});

//the _var underscore can be used multiple times in a url!
server.get("greet/_var/_var", function(res, req, first, last){
    res.writeHead(200, {"Content-Type":"text/plain"});
    res.end("greetings "+first+" "+last);
});

// the csv underscore allows the user to pass in a list separated with commas. 
// think imgur multi-image urls (the inspiration)
// this can also be used many times in one url, like _var
server.get("csv/_csv", function(res, req, csv) {
    res.writeHead(200, {"Content-Type": "text/plain"});
    //write each param on a new line
    csv.forEach(function(each){
        res.write(each+"\n");
    });
    res.end();
});



// server functions (standard redirection, filesystem interaction, cookies, and more)
server.get("redirect", function(res, req) {
    // send a 301 from "fail" to "csv/failure,on,every,corner"
    server.redirect(res, "redirect", "csv/failure,on,every,corner");
});

server.get("fstest/_var", function(res, req, a){
    // stream a document from the filesystem (note, this isn't entirely safe yet)
    server.stream(res, "/Users/ted/Documents/"+a);
});

server.get("cookies", function(res, req) {
    // print all cookies to the document
    res.writeHead(200, {"Content-Type": "text/plain"});
    server.eachCookie(function(cname, cvalue){
        res.write(cname + " = " + cvalue + "<br />");
    });
    res.end();
});





// META: this allows you to dynamically change HOW the server works.
//       it is essentially an API into the server itself
server.meta.define404(function(response) {
    // set up a custom 404 page. 
    // here we change "404" to "custom 404 page"
    response.writeHead(404, {"Content-Type": "text/plain"});
    response.end("custom 404 page");
});

server.meta.define500(function(response, error) {
    // set up a custom 500 page.
    response.writeHead(404, {"Content-Type": "text/plain"});
    response.write("error is as follows\n");
    response.end(error+"");
});

// then of course TEST the custom 500 page
server.get("fail", function(res) {
    res.callNonExistantFunction();
});

// remember underscores? those are meta too. you can add your own custom ones
// we recommend prependin each with an _, but it is optional. 
// node: if you leave out the underscore, one will NOT be added
server.meta.addunderscore("_every", function(name, url){
    url.unshift(name);
    return url;
}, true);

// test the new underscore we just added
server.get("_every", function(res, req, url) {
    res.writeHead(200, {"Content-Type": "text/plain"});
    //write each param on a new line
    url.forEach(function(each){
        res.write(each+"\n");
    });
    res.end();
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
It is still fairly buggy with large chunks of data. see Example for more information.


####Cookies ![alt text](https://www.google.com/help/hc/images/chrome_95647_cookie_allowed.png "yummmmmmm")
Cookies are accessed by the server directly from the request object. see Example for more information.


##TODO:
###misc:
- [X] move filesystem interaction out of the shitty files.js
- [X] clean the webmodules.js file for readibility
- [X] custom 404 pages
- [X] on-page error reporting
    - [X] custom on page error reporting
- [X] fewer crashes!
    - [ ] proof of fewer crashes (unit tests)
- [ ] security and sessions
- [X] make the server itself modifiable though meta-functions
    - [X] allow users to define their own variable _urls
- [ ] improved streaming functionality
- [ ] introduce smoke testing framework
- [ ] add support for rendering engines
- [ ] add builtin header support

###feature-completion:
- [ ] re-introduce modules.
- [ ] interactive cli
    - [ ] at least print SOMETHING

