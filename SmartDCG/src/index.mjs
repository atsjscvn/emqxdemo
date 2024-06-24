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
  client.subscribe('control')
})

// Receive messages
client.on('message', function (topic, message) {
  if (topic === 'control') {
    const command = JSON.parse(message.toString());

    for (const device of command.data) {
      for (const coil of device.Coils) {
        console.log('Control Coil: ' + coil.address.toString() + ', Value: ' + (coil.value ? 'ON' : 'OFF'))
      }

      for (const hr of device.HoldingRegisters) {
        console.log('Control Hoding Register: ' + hr.address.toString() + ', Value: ' + hr.value.toString())
      }
    }
  }
})

setInterval(() => {
  var payload;

  if (Math.random() > 0.5) {
    payload = {
      timestamp: new Date(),
      data: [
        {
          deviceId: 1,
          online: true,
          Coils: [
            { address: 1, value: Math.random() > 0.5 }
          ],
          DiscreteInputs: [
            { address: 1, value: Math.random() > 0.5 }
          ],
          InputRegisters: [
            { address: 1, value: Math.random() * 65536 }
          ],
          HoldingRegisters: [
            { address: 1, value: Math.random() * 65536 }
          ]
        }
      ]
    }
  } else {
    payload = {
      timestamp: new Date(),
      data: [
        {
          deviceId: 1,
          online: false
        }
      ]
    }
  }

  client.publish('monitoring', JSON.stringify(payload))
}, 5000);

