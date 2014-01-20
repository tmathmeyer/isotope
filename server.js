var server = require('./isotope');

var config = 
[
    {
        name : "ECHO",
        location : "./echo"
    }
];

server.create(8000, config);
