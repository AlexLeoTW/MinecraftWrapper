const regexp = /(.+) lost connection: Disconnected/

// Vanilla 1.12.2:  [20:32:12] [Server thread/INFO]: NXG_Navigater lost connection: Disconnected
// Spigot 1.8:      [00:54:07 INFO]: NXG_Navigater lost connection: Disconnected

exports.test = function (message) {
  var match = message.match(regexp)
  return match ? {
    player: match[0]
  } : null;
};
