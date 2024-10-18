const express = require("express")
require('dotenv').config()
require("./database/database").connect()
const User = require("./model/user")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cookieParser = require("cookie-parser")


const app = express();
app.use(express.json())
app.use(cookieParser())



app.get("/", (req, res)=> {
    res.send("oh hi there")
})

app.post("/register", async(req, res) => {
    try {
        const {firstname, lastname, email, password}= req.body;
        if(!(firstname && lastname && email && password)) {
            return res.status(400).send('All field are compulsory')
        }
        const existingUser = await User.findOne({ email })

        if(existingUser) {
            return res.status(400).send('Email registered already')
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            firstname,
            lastname,
            email,
            password: hashedPassword,
        })

        const token = jwt.sign(
            {id: user._id, email},
            process.env.JWTSECRET,
            {
                expiresIn: '1d'
            }
        )

        user.token = token;
        user.password = undefined

        
        res.status(201).json(user)



    } catch (error) {
        console.log(error)
    }
})

app.post("/login", async(req, res) => {
    try {
        const {email , password} = req.body;
        if(!(email && password)) {
            return res.status(401).send("ALl fields are required");
        }

        const user = await User.findOne({email})
        if(!user){
            return res.status(401).send("User does not found")
        }

        const comp = await bcrypt.compare(password, user.password);

        if(!comp) {
            return res.status(401).send("Password is incorrect")
        }

        const token  = await jwt.sign(
            {id: user._id},
            process.env.JWTSECRET,
            {
                expiresIn: '1d'
            }
        )

        user.token = token
        user.password = undefined

        const options = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            httpOnly: true,
        }
        res.status(200).cookie.cookie("token", token, options).json({
            success: true,
            token,
            user
        })


    } catch (error) {
        console.log(error)
    }
})

module.exports = app