const regexp = /(.+)\[(.+):\d+\] logged in with entity id \d+ at \(.+\)/

// Vanilla 1.12.2:  [14:20:13] [Server thread/INFO]: NXG_Navigater[/127.0.0.1:39620] logged in with entity id 273 at (-217.23821347186774, 101.0, 100.87133309525096)
// Spigot 1.8:      [13:49:08 INFO]: NXG_Navigater[/127.0.0.1:42888] logged in with entity id 2206 at ([world] -0.5, 64.0, 168.5)

exports.test = function (message) {
  var match = message.match(regexp)
  return match ? {
    player: match[0],
    ip: match[1]
  } : null;
};
