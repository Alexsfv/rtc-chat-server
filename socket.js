let socketIds = []

module.exports = function (io) {
    io.on('connection', (socket) => {
        const sId = socket.id
        let availableRandomSocketIds = []

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

        socket.on('sendRandomOffer', (data) => {
            if (data.prevRandomCalleeId) {
                availableRandomSocketIds = availableRandomSocketIds.filter(id => id !== data.prevRandomCalleeId)
            } else {
                availableRandomSocketIds = [...socketIds]
            }
            const otherSocketIds = availableRandomSocketIds.filter(id => id !== sId)
            const randomIdx = Math.floor((Math.random() * otherSocketIds.length))
            const randomCaleeId = otherSocketIds[randomIdx]
            if (randomCaleeId) {
                const offerData = {
                    ...data,
                    calleeId: randomCaleeId
                }
                socket.emit('sendRandomOffer', offerData)
                console.log('sendRandomOffer');
            }
            if (!otherSocketIds.length) {
                socket.emit('emptyAvailableRandom')
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

        socket.on('peerDisconnect', (data) => {
            const socketId = socketIds.find(id => data.partnerId === id)
            if (socketId) {
                availableRandomSocketIds = [...socketIds]
                socket
                    .to(socketId)
                    .emit('peerDisconnect')
                console.log('peerDisconnect,', socketId);
            }
        })

        socket.on('disconnect', () => {
            socketIds = socketIds.filter(id => sId !== id)
        })
        socket.emit('hello', {})
    })
}