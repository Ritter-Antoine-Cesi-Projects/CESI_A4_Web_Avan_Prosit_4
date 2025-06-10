const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3001;

app.get('/', async (req, res) => {
    try {
        const response = await axios.get('http://server:3000/data');
        const sensorData = response.data;

        // Trie du plus récent au plus ancien
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
                        <div id="stats" class="mb-4"></div>
                        <table class="table table-striped table-bordered shadow">
                            <thead class="table-dark">
                                <tr>
                                    <th>Sensor ID</th>
                                    <th>Valeur</th>
                                    <th>Date & Heure</th>
                                </tr>
                            </thead>
                            <tbody id="sensor-table-body">
                                <!-- Les données seront insérées ici -->
                            </tbody>
                        </table>
                    </div>
                    <script>
                        function computeStats(data) {
                            const now = Date.now();
                            const oneMinuteAgo = now - 60 * 1000;
                            const lastMinute = data.filter(row => new Date(row.timestamp).getTime() >= oneMinuteAgo);
                            let avg = 0;
                            if (lastMinute.length > 0) {
                                avg = lastMinute.reduce((sum, row) => sum + row.value, 0) / lastMinute.length;
                            }
                            return {
                                count: data.length,
                                avgLastMinute: avg,
                                countLastMinute: lastMinute.length
                            };
                        }

                        async function fetchData() {
                            const res = await fetch('/api/data');
                            const data = await res.json();
                            const tbody = document.getElementById('sensor-table-body');
                            tbody.innerHTML = '';
                            data.forEach(row => {
                                const tr = document.createElement('tr');
                                tr.innerHTML = \`
                                    <td>\${row.sensorId}</td>
                                    <td>\${row.value.toFixed(2)}</td>
                                    <td>\${new Date(row.timestamp).toLocaleString()}</td>
                                \`;
                                tbody.appendChild(tr);
                            });

                            // Affichage des stats
                            const stats = computeStats(data);
                            document.getElementById('stats').innerHTML = \`
                                <div class="alert alert-info">
                                    <strong>Moyenne sur la dernière minute :</strong> \${stats.countLastMinute > 0 ? stats.avgLastMinute.toFixed(2) : 'N/A'}<br>
                                    <strong>Nombre de mesures sur la dernière minute :</strong> \${stats.countLastMinute}
                                </div>
                            \`;
                        }
                        fetchData();
                        setInterval(fetchData, 10000); // toutes les 10 secondes
                    </script>
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
