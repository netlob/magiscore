cordova.define("cordova-plugin-theme-detection.ThemeDetection", function(require, exports, module) {
var exec = require("cordova/exec");

var CLASS = "ThemeDetection";

exports.isAvailable = function(success, error) {
  exec(success, error, CLASS, "isAvailable", []);
};

exports.isDarkModeEnabled = function(success, error) {
  exec(success, error, CLASS, "isDarkModeEnabled", []);
};

});
