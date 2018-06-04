const regexp = /Done \(.+s\)! For help, type "help" or "\?"/

// Spigot 1.8:      'Done (9.617s)! For help, type "help" or "?"'
// vanilla 1.12.2:  'Done (1.629s)! For help, type "help" or "?"'

exports.test = function (message) {
  var match = message.match(regexp)
  return match ? {
    elapse: match[0]
  } : null;
};
