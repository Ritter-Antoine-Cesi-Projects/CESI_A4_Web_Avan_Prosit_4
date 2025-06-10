const axios = require('axios');
const SENSOR_ID = Number(process.env.SENSOR_ID);
const SERVER_URL = process.env.SERVER_URL;

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

setInterval(async () => {
  let data;
  if (SENSOR_ID === 1) {
    data = {
      sensorId: 1,
      name: 'apha',
      metricsPollution: [
        randomInt(100, 200),
        randomInt(100, 200),
        randomInt(2000, 3000),
        randomInt(5000, 6000)
      ],
      flux: randomInt(2000, 3000),
      timestamp: new Date()
    };
  } else if (SENSOR_ID === 2) {
    data = {
      sensorId: 2,
      name: 'beta',
      metricsPollution: [
        { value: randomInt(1000, 1500) },
        { value: randomInt(500, 700) }
      ],
      timestamp: new Date()
    };
  }

  try {
    await axios.post(SERVER_URL, data);
    console.log(`Data sent from sensor ${SENSOR_ID}:`, data);
  } catch (error) {
    console.error(`Error sending data from sensor ${SENSOR_ID}:`, error.message);
  }
}, 5000);
