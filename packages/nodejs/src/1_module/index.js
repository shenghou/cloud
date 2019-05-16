import { type } from "os";

//兼容多种模块规范NODE AMD CDM navigation
(function(name, definition) {
  //检查AMD或CMD环境
  var hasDefine = typeof define === "function",
  //检查NODE环境
    hasExports = typeof module !== "undefined" && module.exports;
  if (hasDefine) {
    define(definition);
  } else if (hasExports) {
    module.exports = definition();
  } else {
    this[name] = definition();
  }
})("hello", function() {
  var hello = function() {};
  return hell0;
});
