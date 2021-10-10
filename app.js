const express = require('express')
const app = express()
const cors = require('cors')
const http = require('http')
const httpServer = http.createServer(app)
const io = require('socket.io')(httpServer, {
    cors: {
        origin: "*",
    }
})

const PORT = process.env.PORT || 3000

app.use(cors('*'))

io.on('connection', (socket) => {
    console.log('User connected');
    socket.emit('hello', {})
})

httpServer.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
})