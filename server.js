const express = require('express');

const app = express();

const port = 3000;

const bodyParser = require('body-parser');

app.use(bodyParser.json()); // look for incoming data

app.get('/', (req, res) => {
    res.send('Hello Josue');
});

app.post('/login', (req, res) => {
    const loginUser = req.body.userName;
    console.log('Login Username: '+loginUser);
    res.send('Hello '+loginUser);
});

app.listen(port, () => {
    console.log('listening');
});

// localhost:3000