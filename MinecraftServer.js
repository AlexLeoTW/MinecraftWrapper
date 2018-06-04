const child_process = require('child_process');
const EventEmitter = require('events');
const path = require('path');
const trigger = require('./logFilters/trigger')


class MinecraftServer {

  constructor(options, filePath) {
    this.options = options;
    this.filePath = filePath;
    this.eventEmitter = new EventEmitter();
    this.players = new Set();

    this.spawn();
  }

  spawn() {
    const self = this;    // could be helpful?

    self.process = child_process.spawn('java', [].concat(self.options, path.basename(self.filePath), 'nogui'), {
      cwd: path.dirname(self.filePath)
    })

    self.process.stdout.on('data', (data) => {
      var line = data.toString().trim();
      console.log(line);
      trigger(self.eventEmitter, line)
    });

    self.process.stderr.on('data', (data) => {
      console.error(data.toString().trim());
    });

    self.process.on('close', (code) => {
      self.eventEmitter.emit('stop', code)
    });

    self.eventEmitter.on('login', (info) => {
      this.players.add(info.player);
    })
    self.eventEmitter.on('logout', (info) => {
      console.log(`players: [${this.players}]`);
      this.players.delete(info.player);
    })
  }

  command(line) {
    const self = this;    // could be helpful?

    self.process.stdin.write(`${line}\n`);
  }

  on(events, callback) {
    this.eventEmitter.on(events, callback);
  }

  stop() {
    this.command("stop");
  }
}

module.exports = MinecraftServer;
