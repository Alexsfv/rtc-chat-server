let socketIds = []

module.exports = function (io) {
    io.on('connection', (socket) => {
        const sId = socket.id
        socketIds.push(sId)

        socket.emit('setPersonalCode', sId)

        socket.on('sendOfferSDP', (data) => {
            const calleeId = socketIds.find(id => data.callee.id === id)
            if (calleeId) {
                socket
                    .to(calleeId)
                    .emit('sendOfferSDP', data)
                console.log('sendOfferSDP');
            }
        })

        socket.on('sendAnswerSDP', (data) => {
            const callerId = socketIds.find(id => data.caller.id === id)
            if (callerId) {
                socket
                    .to(callerId)
                    .emit('sendAnswerSDP', data)
                console.log('sendAnswerSDP');
            }
        })

        socket.on('sendIceCandidate', (data) => {
            const socketId = socketIds.find(id => data.partnerId === id)
            if (socketId) {
                socket
                    .to(socketId)
                    .emit('sendIceCandidate', data)
                console.log('sendIceCandidate');
            }
        })

        socket.on('disconnect', () => {
            socketIds = socketIds.filter(id => sId !== id)
        })
        socket.emit('hello', {})
    })
}