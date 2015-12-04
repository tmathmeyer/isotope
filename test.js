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
  }
];



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
