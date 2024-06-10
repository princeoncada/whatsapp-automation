import express from 'express';
import { setSender, sendMessage } from './functions.js';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8000;

const checkAuth = (req, res, next) => {
    const password = req.headers['x-api-key']; 
    const correctPassword = process.env.API_KEY; 

    if (password && password === correctPassword) {
        next();
    } else {
        res.status(403).send('Forbidden'); 
    }
};

app.post('/set-sender', async (req, res) => {
    try {
        await setSender();
        res.status(200).send("Sender set successfully!");
    } catch (error) {
        res.status(500).send(`Error setting sender: ${error}`);
    }
})

app.post('/send-message', async (req, res) => {
    try {
        await sendMessage(req.body.message);
        res.status(200).send("Message sent successfully!");
    } catch (error) {
        res.status(500).send(`Error sending message: ${error}`);
    }
});

app.get('/', async (req, res) => {
    res.send("Render Puppeteer server is up and running!");
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});