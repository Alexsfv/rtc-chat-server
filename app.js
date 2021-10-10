const express = require('express')
const app = express()
const cors = require('cors')
const http = require('http')
const socketEvents = require('./socket')
const httpServer = http.createServer(app)

const io = require('socket.io')(httpServer, {
    cors: {
        origin: "*",
    }
})

socketEvents(io)

const PORT = process.env.PORT || 3000

app.use(cors('*'))

httpServer.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
})