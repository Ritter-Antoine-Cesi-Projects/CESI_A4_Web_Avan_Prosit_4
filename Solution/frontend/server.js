const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3001;

app.get('/', async (req, res) => {
    try {
        const response = await axios.get('http://server:3000/data');
        const sensorData = response.data;

        sensorData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        let html = `
            <html>
                <head>
                    <title>Sensor Data</title>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
                </head>
                <body class="bg-light">
                    <div class="container mt-5">
                        <h1 class="mb-4 text-primary">Données des capteurs</h1>
                        <table class="table table-striped table-bordered shadow">
                            <thead class="table-dark">
                                <tr>
                                    <th>Sensor ID</th>
                                    <th>Nom</th>
                                    <th>Metrics Pollution</th>
                                    <th>Flux</th>
                                    <th>Date & Heure</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${sensorData.map(row => `
                                    <tr>
                                        <td>${row.sensorId}</td>
                                        <td>${
                                            typeof row.name === 'object'
                                                ? `ref: ${row.name.ref}, usual: ${row.name.usual}`
                                                : row.name || ''
                                        }</td>
                                        <td>${row.metricsPollution}</td>
                                        <td>${row.flux || ''}</td>
                                        <td>${new Date(row.timestamp).toLocaleString()}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </body>
            </html>
        `;

        res.send(html);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
});

app.get('/api/data', async (req, res) => {
    try {
        const response = await axios.get('http://server:3000/data');
        const sensorData = response.data;
        // Trie du plus récent au plus ancien
        sensorData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        res.json(sensorData);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching data' });
    }
});

app.listen(PORT, () => {
    console.log(`Frontend server is running on port ${PORT}`);
});
