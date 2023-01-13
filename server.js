const express = require("express");

const app = express();

const port = 3000;

app.get("/", (req, res) => {
    res.send("Hello Josue");
});

app.listen(port, () => {
    console.log("listening");
});

// localhost:3000