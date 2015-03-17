var fs = require('fs');

module.exports = function(p, success, failure) {
  fs.exists(p, function(exists) {
    if (exists) success(p);
    else failure();
  });
};
