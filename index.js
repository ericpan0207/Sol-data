const express = require('express')
const {scrapeLogic} = require("./scrapeLogic")

const app = express();

const PORT = process.env.PORT || 4000;

app.get("/scrape", (req, res) => {
    scrapeLogic(res);
})

app.get("/", (req, res) => {
    res.send("Render server is up and running");
}) 

app.listen(4000, () => {
    console.log(`Listening on port ${PORT}`)
})