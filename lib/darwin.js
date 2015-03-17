var queue = require('queue-async');
var exec = require('child_process').exec;
var userhome = require('userhome');

var fromAppToExec = '/Contents/MacOS/Google Chrome';
var knownPaths = [
  '/Applications/Google Chrome.app' + fromAppToExec,
  userhome + '/Applications/Google Chrome.app' + fromAppToExec
];

module.exports = function(locater, finisher, pathsToTry, searcher) {
  searcher = searcher || mdSearch;
  pathsToTry = pathsToTry || knownPaths;

  var q = queue(1);
  pathsToTry.forEach(function(p) {
    q.defer(locater, p, finisher);
  });
  q.defer(searcher, finisher);
  q.awaitAll(function() { finisher(null); });
};

function mdSearch(finisher, next) {
  exec(
    'mdfind \'kMDItemDisplayName == "Google Chrome" && kMDItemKind == Application\'', function(err, stdout) {
      if (err || !stdout) next();
      else finisher(stdout.trim() + fromAppToExec);
    }
  );
}
