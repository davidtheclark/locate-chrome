var tryPath = require('./lib/tryPath');
var locateChrome = require('./lib/locateChrome');

module.exports = function(cb) {
  return locateChrome(process.platform, tryPath, cb);
};
