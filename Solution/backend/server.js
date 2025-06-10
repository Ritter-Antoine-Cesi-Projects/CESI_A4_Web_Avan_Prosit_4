const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const Data = mongoose.model('Data', {
  sensorId: Number,
  value: Number,
  timestamp: { type: Date, default: Date.now }
});

app.use(bodyParser.json());

app.post('/data', async (req, res) => {
  const data = new Data(req.body);
  await data.save();
  res.sendStatus(200);
});

app.get('/data', async (req, res) => {
  const data = await Data.find();
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
