const express = require('express');
const socket = require('socket.io');
const WebSocket = require('ws');

// Constants
const PORT = 3000;

// Init
const app = express();
const krakenSocket = new WebSocket('wss://ws.kraken.com');

krakenSocket.on('open', () => {
  krakenSocket.send('{"event":"subscribe","pair":["XBT/USD","XBT/EUR","ADA/USD"],"subscription":{"name":"ticker"}}')

  krakenSocket.on('message', (data) => {
    console.log(JSON.parse(data.toString()))
  })
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
