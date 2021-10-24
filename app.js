const path = require('path')
const express = require('express')
const app = express()
const cors = require('cors')
const http = require('http')
const socketEvents = require('./socket')
const httpServer = http.createServer(app)

const PORT = process.env.PORT || 3000

const io = require('socket.io')(httpServer, {
    cors: {
        origin: "*",
    }
})

socketEvents(io)

app.use(cors('*'))
app.use(express.static(path.join(__dirname, 'client')))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/index.html'))
})

httpServer.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
})