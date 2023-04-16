const Gpio = require('onoff').Gpio;
const http = require('http');

let overriden = false

const conn = new Gpio(17, 'in');

http.createServer(function (req, res) {
  res.setHeader("Content-Type", "application/json")
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.write(((conn.readSync() === 1) || overriden).toString());
  res.end();
}).listen(3001);

setInterval(() => {
  fetch(`http://cvcoc.nathankutzan.info/gridoverride/status`)
    .then((response) => response.json())
    .then((data) => overriden = data)
}, 1000)
