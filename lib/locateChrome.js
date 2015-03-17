var Promise = require('es6-promise').Promise;

var darwin = require('./darwin');
var win32 = require('./win32');
var others = require('./others');

module.exports = function(platform, tryPath, cb) {
  return new Promise(function(resolve) {
    var finisher = cb || function(r) {
      resolve(r);
    };

    if (platform === 'darwin') {
      darwin(tryPath, finisher);
      return;
    }

    if (platform === 'win32') {
      win32(tryPath, finisher);
      return;
    }

    others(finisher);
  });
};
