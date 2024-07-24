const { WebSocketServer } = require('ws')
const dotenv = require('dotenv')

dotenv.config()

const wss = new WebSocketServer({ port: process.env.PORT || 8080})

wss.on('connection', (ws) => {
    ws.on('error', console.error)

    ws.on('message', (data) => {
        wss.clients.forEach((client) => client.send(data.toString())) // Pega todos os clientes que estão conectados e envia a mensagem que algum user enviou
    })

    console.log("Client connected")
})

// Para executar o servidor no terminal coloque "npm run dev"