const axios = require('axios');
const SENSOR_ID = process.env.SENSOR_ID;
const SERVER_URL = process.env.SERVER_URL;

setInterval(async () => {
  const data = {
    sensorId: SENSOR_ID,
    value: Math.random() * 100,
    timestamp: new Date()
  };

  try {
    await axios.post(SERVER_URL, data);
    console.log(`Data sent from sensor ${SENSOR_ID}:`, data);
  } catch (error) {
    console.error(`Error sending data from sensor ${SENSOR_ID}:`, error.message);
  }
}, 5000);
