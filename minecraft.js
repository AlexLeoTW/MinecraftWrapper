const readline      = require('readline');
const fs            = require('fs');
const path          = require('path');
const os            = require('os');
const request       = require('request');
const MinecraftServer = require('./MinecraftServer');
const tar           = require('./lib/tar');

const serverPackFileName = 'server.tar.bz2';
const callbackUrl = process.argv[2];
var serverConfig;

// download serverPack
// TODO: merge this part with ./lib/download.js
new Promise((resolve , reject) => {
  console.log('downloading serverPack...');

  request.get(`${callbackUrl}/serverPack`)
  .on('response', (res) => {
    var tarFile = fs.createWriteStream(serverPackFileName);
    res.pipe(tarFile);

    res.on('end', () => {
      resolve();
    })
  })
})

// get serverConfig
.then(() => {
  request.get(`${callbackUrl}/config`, (error, response, body) => {
    if (error || response.statusCode !== 200 ) { throw error }
    serverConfig = JSON.parse(body);
    console.log(`config: ${serverConfig}`);
  })
})


// unpack serverPack
.then(() => {
  return tar.decompress(serverPackFileName);
})

// start MinecraftServer
.then(() => {
  console.log('============ server ============');
  const server = new MinecraftServer(
    [].concat(serverConfig.javaArgs).concat('-jar'),
    path.join('./server', serverConfig.serverJar)
  );
  const stdin = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: ''
  });

  stdin.on('line', (line) => {
    server.command(line);
  });

  server.on('done', (info) => {
    request.post(`${callbackUrl}/server`, { form: {
      ip: getIp()
    }});
    autoShutdown(server);
  });

  server.on('stop', () => {
    stopRoutine();
  });
})

// TODO: trigger autoShutdown only after last user logout for 10 min.
function autoShutdown(server) {
  setTimeout(() => {
    if (server.players.size > 0) {
      autoShutdown(server);
    } else {
      server.stop();
    }
  // }, 10*60*1000)    // 10 minutes
  }, 30*1000)    // 30 sec.
}

// close and save server
function stopRoutine() {
  tar.compress('server', serverPackFileName)
  .then(() => {
    uploadServer(`${callbackUrl}/serverPack`)
    request.delete(`${callbackUrl}/server`, { form: {
      ip: getIp()
    }});
  }).then(() => {
    setTimeout(() => {
      process.exit();
    }, 5*1000)
  })
}

function getIp() {
  var interfaces = os.networkInterfaces();

  for (var iface in interfaces) {
    for (var index = 0; index < interfaces[iface].length; index++) {
      if (!interfaces[iface][index].internal && interfaces[iface][index].family == 'IPv4') {
        return interfaces[iface][index].address;
      }
    }
  }
}

function uploadServer(url) {
  request.post(url, {
    formData: {
      server: fs.createReadStream('server.tar.bz2'),
    }
  }, (err, httpResponse, body) => {
    if (err) { console.error(err) }
    console.log(`${httpResponse.statusCode} ${httpResponse.statusMessage}`);
    console.log(body);
  });
}
