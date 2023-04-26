const mongoose = require('mongoose');
const Joi = require('joi')

const CustomerSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId()
      },

    name: {
        type: String,
        required: true

    },

    origin: {
        type: String,

        
    },

    destination: {
        type: String,

    },

    
    Date: {
        type: Date,
   
    },
   

    current: {
        type: String,
  
    },

    description: {
        type: String,
   

    }



});

const Customer = mongoose.model('Customer', CustomerSchema)

// module.exports = mongoose.model('Customer', CustomerSchema)
module.exports.Customer = Customer