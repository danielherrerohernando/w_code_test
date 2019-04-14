const WebSocket = require('ws')

class ServerWS {
    constructor(chargersport,widgetsport){

        this.wssChargers = new WebSocket.Server({ port: chargersport})
        this.wssWidgets = new WebSocket.Server({ port: widgetsport})

        this.connectedWidgets = {}
        this.pendingMessages = {}

        this.wssChargers.on('connection', (ws,req) => {
            const id = req.url.slice(req.url.length-4)
            console.log(`--------SERVER LOG: A charger with id=${id} is connected`)

            const widgetid = this.urlNexus(id)
            this.pendingMessages[widgetid] = []
            
            ws.on('message', (message) => {
                console.log(`--------SERVER LOG: Message coming from charger id=${id}`)
                if(this.msgChecker(message)){
                    if(this.connectedWidgets[widgetid]&&this.connectedWidgets[widgetid].readyState===1) {
                        this.connectedWidgets[widgetid].send(message)
                        console.log(`--------SERVER LOG: Message redirected to widget id=${widgetid}`)
                    }
                    else if(this.connectedWidgets[widgetid]&&this.connectedWidgets[widgetid].readyState!==1) {
                        console.log(`--------SERVER LOG: Cannot redirect message to widget id=${widgetid} cause it is not connected, storing it until widget is back`)
                        ws.send(`Error: Please start the linked widget`)
                        this.pendingMessages[widgetid].push(message)
                    }
                    else {
                        console.log(`--------SERVER LOG: There is no widget yet linked to this charger, storing it until linked widget start`)
                        this.pendingMessages[widgetid].push(message)
                    }
                }
                else {
                    console.log(`--------SERVER LOG: Invalid message coming from charger id=${id}`)
                    ws.send(`Error: Please check charger state`)
                }
               
            })
        })

        this.wssWidgets.on('connection', (ws,req) => {
            const id = req.url.slice(req.url.length-4)
            this.connectedWidgets[id] = ws
            console.log(`--------SERVER LOG: A widget with id=${id} is connected`)
            if(this.pendingMessages[id].length>0){
                this.pendingMessages[id].forEach(e=>ws.send(e))
                console.log(`--------SERVER LOG: Sending pending messages to widget id=${id}`)
                this.pendingMessages[id]=[]
            }
        })
    }

    urlNexus(str) {
        return String.fromCharCode(...str.split("").map(e=>parseInt(e)+64))
    } 

    msgChecker(str) {
        return JSON.parse(str).event===`chargingStatus`&&/charging|charging80|charged/.test(JSON.parse(str).data.status)
    }

    stop() {
        this.wssChargers.close()
        this.wssWidgets.close()
        console.log(`--------SERVER LOG: Shutting down`)
    }
}


module.exports = ServerWS





