const split= require('../logFilters/spliter').split;
const done = require('./done')
const login = require('./login')
const logout = require('./logout')

const events = { done, login, logout };
var listCommand = false;

module.exports = function (eventEmitter, message) {

  if (message = split(message)) {
    message = message.message
  } else {
    return;
  }

  for (let key in events) {
    var info = events[key].test(message);
    if (info) {
      eventEmitter.emit(key, info)
      break;
    }
  }
};
