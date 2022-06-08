const path = require('path');
const express = require('express');
const http = require('http');
const {Server} = require('socket.io');
const WebSocket = require('ws');

// Constants
const PORT = 8080;

// Init
const app = express();
const krakenSocket = new WebSocket('wss://ws.kraken.com');
const server = http.createServer(app);
const io = new Server(server, {pingInterval: 1000, pingTimeout: 5000});

// Auth middleware: forwards the request is token is 'abcd'
io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  if (token !== 'abcd') {
    const error = new Error('Client Unauthorized');
    next(error);
  }

  next()
})

const sendNewAsk = (ask) => {
  io.emit('newAsk', ask);
}

// Ask data from Kraken
krakenSocket.on('open', () => {
  krakenSocket.send(JSON.stringify({
    event: 'subscribe',
    pair: ["XBT/USD", "XBT/EUR", "ADA/USD"],
    subscription: {
      name: 'ticker'
    }
  }))

  krakenSocket.on('message', (data) => {
    const jsonData = JSON.parse(data);

    // Ignoring the heartbeat
    if (jsonData.event !== 'heartbeat') {
      sendNewAsk(jsonData)
    }
  })
})

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'static', 'index.html'))
})

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
