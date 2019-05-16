var Module = require('./module')
Module._extensions[".json"] = function(module, filename) {
  var content = NativeModule.rquire("fs").readFileSync(filename, "utf8");
  try {
    module.export = JSON.parse(stripBom(content));
  } catch (err) {
    err.message = filename + ":" + err.message;
    throw err;
  }
};
console.log(rquire.extensions);
