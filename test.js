var webmodule = require("./webmodule").webmodule;
var assert = require('assert');
var tests = [
  {
    "describe":["Stream", "reads valid file"],
    "func":function(done){
      webmodule.stream(m_resp(), "test.txt", {}, function(ctx){
        assert.equal(ctx.status, 200);
        assert.equal(ctx.content, 'Test File\n');
        done();
      });
    }
  },{
    "describe":["Stream", "cant read invalid file"],
    "func":function(done){
      webmodule.stream(m_resp(), "invalid.txt", {}, function(ctx){
        assert.equal(ctx.status, 404);
        assert.equal(ctx.content, 'file not found');
        done();
      });
    }
  },{
    "describe":[
      "respondOK", "sends an OK response"
    ],
    "func": function(done){
      webmodule.headers.ok(m_resp(), webmodule.ok, function(ctx){
        assert.equal(ctx.status, 200);
        assert.equal(ctx.headers, webmodule.ok);
        done();
      });
    }
  },{
    "describe":[
      "redirectDefined", "redirect to a set location"
    ],
    "func": function(done){
      webmodule.headers.redirect(m_resp(), "/redir", function(ctx){
        assert.equal(ctx.status, 301);
        assert.equal(ctx.headers.Location, "/redir");
        done();
      });
    }
  },{
    "describe":[
      "redirectUndefined", "redirect to home location"
    ],
    "func": function(done){
      webmodule.headers.redirect(m_resp(), null, function(ctx){
        assert.equal(ctx.status, 301);
        assert.equal(ctx.headers.Location, "/");
        done();
      });
    }
  }
];





m_req = function(cookies, formData) {
  return {
    "headers": {
      "cookie": cookies.map(function(each){
        return each.name+"="+each.content;
      }).join(";")
    },
    "on": function(type, callback) {
      if (type === 'data') {
        callback(formData);
      }
      if (type === 'end') {
        callback();
      }
    }
  };
};

m_resp = function(){
  return (function(ctx){
    return ctx.inject(ctx, {
      writeHead: function(status, headers) {
        ctx.status = status;
        ctx.headers = headers;
      }, end: function(data) {
        ctx.content += data?data.toString():"";
      }, write: function(data) {
        ctx.content += data?data.toString():"";
      }
    });
  })({
    headers: null,
    status: null,
    content: "",
    inject: function(self, data) {
      Object.keys(data).forEach(function(name){
        self[name] = data[name];
      });
      return self;
    }
  });
};
tests.forEach(function(test) {
  describe(test.describe[0], function(){
    it(test.describe[1], function(done){
      test.func(done);
    });
  });
});
