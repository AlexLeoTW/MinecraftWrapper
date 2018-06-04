const spigot18    = '[13:47:10 INFO]: Done (9.617s)! For help, type "help" or "?"'
const vanilla1122  = '[16:08:29] [Server thread/INFO]: Done (1.629s)! For help, type "help" or "?"';

const spliters = [
  /\[(\d{2}:\d{2}:\d{2}) (.+)\]: (.+)/,             // spigot
  /\[(\d{2}:\d{2}:\d{2})\] \[.+\/(.+)\]: (.+)/,     // vanilla
]

function split(line) {
  var match;

  for (spliter of spliters) {
    match = line.match(spliter)
    if (match) { break; }
  }

  return match ? {
    time: match[1],
    level: match[2],
    message: match[3]
  } : null;
}

exports.split = split;
