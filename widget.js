const WebSocket = require('ws')

class Widget {
    constructor(port,id){
        this.id = id
        this.state = undefined
        this.connection = new WebSocket(`ws://localhost:${port}/widgets/w${id}`)
        this.connection.on('open', () => {
            console.log(`////WIDGET w${id} LOG: Ready!`)
        })
        this.connection.on('message', (data) => {
            this.state = JSON.parse(data).data.status
            console.log(`////WIDGET w${id} LOG: Message received -> ${data}`)
        })
        this.connection.on('close',()=>{
            console.log(`////WIDGET w${this.id} LOG: Connection closed!`,this.connection.readyState)
        })
    }

    stop(){
        this.connection.terminate()
        console.log(`////WIDGET w${this.id} LOG: Closing connection!`,this.connection.readyState)
    }
}

module.exports = Widget
