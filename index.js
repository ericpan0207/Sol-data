const express = require('express')
const {scrapeLogic} = require("./scrapeLogic")
const {token} = require("./token.js")
const {wallet} = require("./wallet.js")
const {wallet2} = require("./wallet2.js")

const app = express();

const PORT = process.env.PORT || 4000;

app.get("/wallet/:address", (req, res) => {
    wallet(req, res);
})

app.get("/wallet2/:address", (req, res) => {
    wallet2(req, res);
})

app.get("/token/:address", (req, res) => {
    token(req, res);
})

app.get("/scrape", (req, res) => {
    scrapeLogic(res);
})

app.get("/", (req, res) => {
    res.send("Render server is up and running");
}) 

app.listen(4000, () => {
    console.log(`Listening on port ${PORT}`)
})