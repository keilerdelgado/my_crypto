const Websocket = require('ws')

const P2P_PORT = process.env.P2P_PORT || 5001
const peers = process.env.PEERS ? process.env.PEERS.split(',') : []
//HTTP_PORT=3002 P2P_PORT=5002 PEERS=ws://localhost:5001 npm run dev
const MESSAGE_TYPES = {
    chain: 'CHAIN',
    transaction: 'TRANSACTION'
}
class P2pServer {
    constructor(blockchain,transactionPool){
        this.blockchain = blockchain
        this.transactionPool = transactionPool
        this.sockets = []
    }
    listen() {
        const server = new Websocket.Server({ port:P2P_PORT })
        server.on('connection',socket => this.connectSocket(socket))
        this.connectToPeers()
        console.log(`Escuchando por conexiones peer-to-peer en el puerto ${P2P_PORT}`)
    }

    connectToPeers(){
        peers.forEach(peer => {
            const socket = new Websocket(peer)
            socket.on('open',()=>{
                this.connectSocket(socket)
            })
        })

    }
    
    connectSocket(socket){
        this.sockets.push(socket)
        console.log('socket conectado')
        this.messageHandler(socket)
        this.sendChain(socket)
    }

    messageHandler(socket){
        socket.on('message',message => {
            const data = JSON.parse(message)
            console.log(data)
            switch (data.type) {
                case MESSAGE_TYPES.chain:
                    this.blockchain.replaceChain(data.chain)
                    break;
                case MESSAGE_TYPES.transaction:
                    this.transactionPool.updateOrAddTransaction(data.transaction)
                    break
                default:
                    break;
            }
        })
    }

    sendTransaction(socket,transaction){
        socket.send(JSON.stringify({
            type:MESSAGE_TYPES.transaction,
            transaction
        }))
    }

    sendChain(socket){
        socket.send(JSON.stringify({
            type: MESSAGE_TYPES.chain,
            chain: this.blockchain.chain
        }))
    }
    
    syncChains(){
        this.sockets.forEach(socket => {
            this.sendChain(socket)
        })
    }

    broadcastTransaction(transaction){
        this.sockets.forEach(socket => this.sendTransaction(socket))
    }
}

module.exports = P2pServer