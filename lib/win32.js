var queue = require('queue-async');

var toExec = '\\Google\\Chrome\\Application\\chrome.exe';
var knownPaths = [
  process.env.LOCALAPPDATA + toExec,
  process.env.PROGRAMFILES + toExec,
  process.env['PROGRAMFILES(X86)'] + toExec
];

module.exports = function(locater, finisher) {
  var q = queue(1);
  knownPaths.forEach(function(p) {
    q.defer(locater, p, finisher);
  });
  q.awaitAll(function() { finisher(null); });
};
