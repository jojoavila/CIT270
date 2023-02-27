const express = require('express');

const app = express();

const port = 443;

const bodyParser = require('body-parser');

const Redis = require('redis');

const redisClient = Redis.createClient({url:'redis://127.0.0.1:6379'});

const {v4: uuidv4} = require('uuid')

app.use(bodyParser.json()); // look for incoming data

app.use(express.static('public'));

const cookieParser = require("cookie-parser");

const https = require('https');

const fs = require('fs');
const { create } = require('domain');



app.use(cookieParser());

app.use(async function (req, res, next){
    var cookie = req.cookies.stedicookie;
    if(cookie === undefined && !req.url.includes("login") && !req.url.includes("html") && req.url !== '/' && req.url.includes('css') && !req.url.includes('js') && !req.url.includes('ico') && !req.url.includes('png')) {
        // no: set a new cookie
        res.status(401);
        res.send('no cookie');
    }
    else{
        // yes: coockie was already present
        res.status(200);
        next();
    } 
});

app.post('/rapidsteptest', async(req, res) => {
    const steps = req.body;
    await redisClient.zAdd('Steps',[{score:0,value:JSON.stringify(steps)}]);
    console.log('Steps',steps);
    res.send('saved');
});

app.get('/', (req, res) => {
    res.send('Hello Josue');
});

app.get('/validate', async(req, res) =>{
    const loginToken = req.cookies.stedicookie;
    console.log('loginToken', loginToken);
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
        await redisClient.hSet('TokenMap', loginToken, loginUser); // add token to Map
        res.cookie('stedicookie', loginToken);
        res.send(loginToken);
        // res.send("Hello you");
    }
    else{
        res.status(401);
        res.send('Inncorrect password for ' +loginUser);
    }
});

https.createServer({
    key: fs.readFileSync('./etc/letsencrypt/live/josueavila.cit270.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/josueavila.cit270.com/cert.pem'),
    ca: fs.readFileSync('/etc/letsencrypt/live/josueavila.cit270.com/fullchain.pem')
},
app
).listen(port, ()=>{
    redisClient.connect();
    console.log('Listening on port: '+ port)
});

// app.listen(port, () => {
//     redisClient.connect();
//     console.log('listening');
// });

// localhost:3000