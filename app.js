const express = require("express")
require('dotenv').config()


const app = express();
app.get("/", (req, res)=> {
    res.send("oh hi there")
})


module.exports = app