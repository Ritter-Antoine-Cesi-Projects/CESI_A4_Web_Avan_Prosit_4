const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const Data = mongoose.model('Data', new mongoose.Schema({
  sensorId: Number,
  name: mongoose.Schema.Types.Mixed,
  metricsPollution: mongoose.Schema.Types.Mixed,
  flux: Number,
  timestamp: { type: Date, default: Date.now }
}));

app.use(bodyParser.json());

app.post('/data', async (req, res) => {
  const { sensorId, name, metricsPollution, flux, timestamp } = req.body;

  // Si metricsPollution est un tableau, découpe chaque valeur
  if (Array.isArray(metricsPollution)) {
    const entries = metricsPollution.map(mp => {
      // Si mp est un objet avec value, sinon c'est un nombre
      const value = typeof mp === 'object' && mp !== null ? mp.value : mp;
      return {
        sensorId,
        name,
        metricsPollution: value,
        flux,
        timestamp
      };
    });
    await Data.insertMany(entries);
  } else {
    // Cas normal, insertion unique
    const data = new Data(req.body);
    await data.save();
  }
  res.sendStatus(200);
});

app.get('/data', async (req, res) => {
  const data = await Data.find();
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
