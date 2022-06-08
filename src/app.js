const express = require('express');
const socket = require('socket.io');
const {io} = require('socket.io-client');

const app = express();

let krakenSocket = io('wss://ws.kraken.com');

krakenSocket.on('connect_error', (err) => {
  console.log(`connect_error due to ${err}`);
});

krakenSocket.onAny((eventName, ...args) => {
  console.log(eventName);
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
