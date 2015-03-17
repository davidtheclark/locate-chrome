var exec = require('child_process').exec;

module.exports = function(finisher) {
  exec('which google-chrome', function(err, r) {
    if (err) throw err;
    finisher(r.trim());
  });
};
