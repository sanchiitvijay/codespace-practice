const mongoose = require('mongoose')

const {MONGO_URI} = process.env

exports.connect = () => {
    mongoose.connect(MONGO_URI)
    .then(
        console.log("DATABASE IS CONNECTED SUCCESSFULLY")
    )
    .catch((error) => {
        console.log('DB CONNECTION ERROR');
        console.log(error);
        process.exit(1)
    })
}