const express = require("express")
require('dotenv').config()
require("./database/database").connect()

const app = express();
app.get("/", (req, res)=> {
    res.send("oh hi there")
})


module.exports = app