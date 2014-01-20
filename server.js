var server = require('./isotope');

var config = 
[
    {
        name : "ECHO",
        location : "./echo_me"
    }
];

server.create(8000, config);