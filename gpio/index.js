const Gpio = require('onoff').Gpio;
const http = require('http'); 

const conn = new Gpio(17, 'in');

http.createServer(function (req, res) {
    res.setHeader("Content-Type", "application/json")
    res.write((conn.readSync() === 1).toString());
    res.end();
  }).listen(3001);