const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
    const {token} = req.cookies
    if(!token) {
        return res.status(403).send('Please login first')
    }
    try {
        const decode = jwt.verify(token, process.env.JWTSECRET)
        console.log(decode)
        req.user = decode
        next()
    } catch (error) {
        console.log(error)
        return res.status(401).send('Invalid token')
    }
}

module.exports = auth