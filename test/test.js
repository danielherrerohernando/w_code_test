const Server = require('../server')
const Widget = require('../widget')
const Charger = require('../charger')


const expect  = require('chai').expect


describe('SERVER TEST', () => {

    waitTil = done => {
        if (devices.every(e=>e.connection.readyState===1)) done()
        else setTimeout(()=>{waitTil(done)}, 100 );
    }

    before(`Start server and devices`,done => {
        s = new Server(3100,3200)
        c1 = new Charger(3100,'1234')
        w1 = new Widget(3200,'ABCD')
        c2 = new Charger(3100,'4234')
        w2 = new Widget(3200,'DBCD')
        c3 = new Charger(3100,'3333')
        devices = [c1,c2,w1,w2,c3]
        waitTil(done)
    })

    it('all chargers and widgets are running',done => {
        devices.forEach(e=>expect(e.connection.readyState).to.equal(1))
        done()
    })

    it('widgets are stored in server property connectedwidgets',done => {
        expect(Object.keys(s.connectedWidgets).length).to.equal(2)
        done()
    })

    it('charger1 sends state -> widget1 should receive it', done => {
        c1.sendState()
        w1.connection.once('message', (message) => {
            const t = JSON.parse(message)
            expect(t.data.status).to.equal(`charging`)
            done()
        })
    })

    it('charger1 updates and sends state -> widget1 should receive it updated', done => {
        c1.state = `charging80`
        c1.sendState()
        w1.connection.once('message', (message) => {
            const t = JSON.parse(message)
            expect(t.data.status).to.equal(`charging80`)
            done()
        })
    })

    it('charger1 sends state but widget1 goes offline -> charger gets back an error msg from server', done => {
        w1.stop()
        c1.sendState()
        c1.connection.once('message', (message) => {
            expect(message).to.include(`Error`)
            done()
        })
    })

    it('charger2 sends state -> widget2 should receive it and update its own state', done => {
        c2.sendState()
        w2.connection.once('message', (message) => {
            expect(c2.state).to.equal(w2.state)
            done()
        })
    })


    it('charger2 sends invalid state -> widget2 should not receive it and server sends back an error msg', done => {
        c2.state = `blablabla`
        c2.sendState()
        c2.connection.once('message', (message) => {
            expect(message).to.include(`Error`)
            done()
        })
    })


    it('widget1 is back online -> widget1 should get updated state from charger', done => {
        w1 = new Widget(3200,'ABCD')

        w1.connection.once('message', (message) => {
            const t = JSON.parse(message)
            expect(t.data.status).to.equal(`charging80`)
            done()
        })
    })

    it('charger3 sends message and no one receives them', done => {
        c3.state = `charged`
        c3.sendState()
        done()
    })

    it('widget3 starts -> widget3 receives pending message from charger3', done => {
        w3 = new Widget(3200,'CCCC')

        w3.connection.once('message', () => {
            expect(w3.state).to.be.equal(`charged`)
            done()
        })
    })

    after(`Close connections`,done=>{
        c1.stop()
        c2.stop()
        w1.stop()
        w2.stop()
        c3.stop()
        w3.stop()
        s.stop()
        done()
    })


})