import dotenv from "dotenv";
import mqtt from 'mqtt'

//
dotenv.config();

const url = process.env.EMQXURL

// Create an MQTT client instance
const options = {
    clean: true,
    connectTimeout: 4000,
    clientId: process.env.EMQXCLIENTID,
    username: process.env.EMQXUSER,
    password: process.env.EMQXPASSWORD,
}
const client = mqtt.connect(url, options)

client.on('connect', function () {
    console.log('Connected')
    client.subscribe('monitoring')
})

// Receive messages
client.on('message', function (topic, message) {
    if (topic === 'monitoring'){
        const data = JSON.parse(message.toString());
        //console.log(data)
        console.log(message.toString())
    }
})

setInterval(() => {
    var payload = {
        timestamp: new Date(),
        data: [
            {
                deviceId: 1,
                Coils: [
                    { address: 1, value: Math.random() > 0.5 }
                ],
                HoldingRegisters: [
                    { address: 1, value: Math.random() * 65536 }
                ]
            }
        ]
    }

    client.publish('control', JSON.stringify(payload))
}, 5000);