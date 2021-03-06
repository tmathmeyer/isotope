var server = require("./isotope").create(8080);

// super basic demo of the app process
server.get("helloworld", function(res){
    res.writeHead(200, {"Content-Type":"text/plain"});
    res.end("hello world!");
});

// accept a post request, and log the data
server.post("accept", function(res, req){
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.end();

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
    server.headers.redirect(res, "csv/failure,on,every,corner");
});

server.get("fstest/_var", function(res, req, a){
    // stream a document from the filesystem (note, this isn't entirely safe yet)
    res.stream.relative(a);
});

server.get("cookies", function(res, req) {
    // print all cookies to the document
    res.writeHead(200, {"Content-Type": "text/html"});
    server.eachCookie(req, function(cname, cvalue){
        res.write(cname + " = " + cvalue + "<br />");
    });
    res.end();
});

server.get("setcookie", function(res){
  res.writeHead(200, {
    "Content-Type":"text/html",
    "Set-Cookie":"cookie=example_cookie"
  });
  res.write("set a cookie, please visit");
  res.end("<a href='/cookies'>/cookies</a>");
})





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
    url.unshift("all parts of the url:");
    return url;
}, true);

// test the new underscore we just added
server.get("every/_every", function(res, req, url) {
    res.writeHead(200, {"Content-Type": "text/plain"});
    //write each param on a new line
    url.forEach(function(each){
        res.write(each+"\n");
    });
    res.end();
});



// pools feature
server.pool("example_pool", function(pool){
    pool.get("pool", function(res) {
        res.header();
        res.end("hello from the pool");
    });

    // this page disables the example_pool podule
    pool.get("pool/suicide", function(res) {
        res.header();
        pool.disable();
        res.end("this is the last message from me!");
    });
});

server.pool("example_pool", function(pool) {
    pool.get("loop", function(res) {
        res.header();
        res.end("pools can be loaded into many times!");
    });
});

server.pool("re-enable", function(pool) {
    pool.get("re-enable", function(res) {
        res.header();
        res.end("re-enabling the example pool");
        server.getPool("example_pool").enable();
    });
});
