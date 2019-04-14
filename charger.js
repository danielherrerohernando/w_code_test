const WebSocket = require('ws')

class Charger {
    constructor(port,id){
        this.id = id
        this.state = `charging`
        this.connection = new WebSocket(`ws://localhost:${port}/chargers/c${id}`)
        this.connection.on('open', () => {
            console.log(`**CHARGER c${id} LOG: Ready!`)
        })
        this.connection.on('message', (data) => {
            console.log(`**CHARGER c${this.id} LOG: Error msg received from server -> ${data}`)
        })
        this.connection.on('close',()=>{
            console.log(`**CHARGER c${this.id} LOG: Connection closed!`,this.connection.readyState)
        })
    }

    sendState(){
        this.connection.send(JSON.stringify(
            {
                "event": "chargingStatus",
                "data": {
                    "status": this.state,
                }
            }
        ))
    }

    stop(){
        this.connection.terminate()
        console.log(`**CHARGER c${this.id} LOG: Closing connection!`,this.connection.readyState)
    }
}

module.exports = Charger



