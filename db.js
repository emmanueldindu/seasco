const mongoose = require('mongoose')

const connect_url = 'mongodb+srv://emmanuelnwobodoc04:chimnadindu@logistic.e1tdm9r.mongodb.net/test'


const connectDB = (url) => {
    return mongoose.connect(connect_url)
}



module.exports = connectDB