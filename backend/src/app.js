const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const locationsRoutes = require('./routes/locations.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api', (req, res) => {
    res.status(200).send('Message from PlaceRadar Back-End using API');
});

app.use('/api/locations', locationsRoutes);

app.get('/health', (req, res) => {
    res.status(200).send('API is running');
});

app.use(errorHandler);

module.exports = app;