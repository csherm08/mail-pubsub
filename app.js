const express = require('express')
const { synchronousPull } = require('./pubsub-service');
const { callGetSecret } = require('./mailer');
const app = express();
const port = 8080;
const projectId = 'frese-bakery-api';
const subscriptionName = 'projects/frese-bakery-api/subscriptions/mailer';

app.get('/pull-messages', async (req, res) => {
    try {
        const apiKey = await callGetSecret();
        await synchronousPull(projectId, subscriptionName, apiKey);
        res.send('Messages pulled successfully');
    } catch(error) {
        console.error('Error pulling messages:', error);
        res.status(500).send('Error pulling messages');
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});