const express = require('express');

const app = express();

const port = 3000;

const bodyParser = require('body-parser');

const Redis = require('redis');

const redisClient = Redis.createClient({url:'redis://127.0.0.1:6379'});

const {v4: uuidv4} = require('uuid')

app.use(bodyParser.json()); // look for incoming data

app.get('/', (req, res) => {
    res.send('Hello Josue');
});

app.post('/login', (req, res) => {
    const loginUser = req.body.userName;
    const loginPassword = req.body.password; // access the password data in the body
    console.log('Login Username: '+loginUser);
    // res.send('Hello '+loginUser); don't need anymore
    if (loginUser=="lorenzo@gmail.com" && loginPassword == "Pas$word123"){
        const loginToken = uuidv4();
        res.send(loginToken);
        // res.send("Hello you");
    }
    else{
        res.status(401);
        res.send('Inncorrect password for ' +loginUser);
    }
});

app.listen(port, () => {
    redisClient.connect();
    console.log('listening');
});

// localhost:3000