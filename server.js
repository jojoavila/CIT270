const express = require('express');

const app = express();

const port = 3000;

const bodyParser = require('body-parser');

const Redis = require('redis');

const redisClient = Redis.createClient({url:'redis://127.0.0.1:6379'});

const {v4: uuidv4} = require('uuid')

app.use(bodyParser.json()); // look for incoming data

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Hello Josue');
});

app.get('/validate/:loginToken', async(req, res) =>{
    const loginToken = req.params.loginToken;
    const loginUser = await redisClient.hGet('TokenMap', loginToken);
    res.send(loginUser);
});

app.post('/login', async (req, res) => {
    const loginUser = req.body.userName;
    const loginPassword = req.body.password; // access the password data in the body
    console.log('Login Username: '+loginUser);
    // res.send('Hello '+loginUser); don't need anymore
    const correctPassword = await redisClient.hGet('UserMap', loginUser);
    if (loginPassword == correctPassword){
        const loginToken = uuidv4();
        await redisClient.hSet('TokenMap', loginToken, loginUser) // add token to Map
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