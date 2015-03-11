var fs = require('fs');
var exec = require('child_process').exec;
var Promise = require('es6-promise').Promise;
var userhome = require('userhome');
var queue = require('queue-async');
var which = require('which');

var osx = process.platform === 'darwin';
var win = process.platform === 'win32'

module.exports = function(cb) {
  return new Promise(function(resolve) {
    var finisher = cb || function(r) {
      resolve(r);
    };

    if (osx) {
      getOSXPath(finisher);
    } else if (win) {
      getWinPath(finisher);
    } else {
      getLinuxPath(finisher);
    }
  });
}

function getOSXPath(finisher) {
  var toExec = '/Contents/MacOS/Google Chrome';
  var regPath = '/Applications/Google Chrome.app' + toExec;
  var altPath = userhome(regPath.slice(1));
  var mdFindCmd = 'mdfind \'kMDItemDisplayName == "Google Chrome" && kMDItemKind == Application\'';

  queue(1)
    .defer(tryLocation, regPath, finisher)
    .defer(tryLocation, altPath, finisher)
    .defer(tryMd)
    .awaitAll(function() { finisher(null); });

  function tryMd(next) {
    exec(mdFindCmd, function(err, stdout) {
      if (err || !stdout) next();
      else finisher(stdout.trim() + toExec);
    })
  }
}

function getWinPath(finisher) {
  var winSuffix = '\\Google\\Chrome\\Application\\chrome.exe';
  var prefixes = [
    process.env.LOCALAPPDATA,
    process.env.PROGRAMFILES,
    process.env['PROGRAMFILES(X86)']
  ];

  queue(1)
    .defer(tryLocation, prefixes[0] + winSuffix, finisher)
    .defer(tryLocation, prefixes[1] + winSuffix, finisher)
    .defer(tryLocation, prefixes[2] + winSuffix, finisher)
    .awaitAll(function() { finisher(null); });
}

function getLinuxPath(finisher) {
  which('google-chrome', function(r) {
    var returned = (Object.prototype.toString.call(r) === '[object Error]') ? null : r;
    finisher(returned);
  });
}

function tryLocation(p, success, next) {
  fs.exists(p, function(exists) {
    if (exists) success(p);
    else next();
  });
}
