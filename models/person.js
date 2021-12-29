const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');
require('dotenv').config()

// what is this
const url = process.env.MONGODB_URI
//const url = 'mongodb+srv://fsophonebook:dec27daniel@cluster0.f6qq3.mongodb.net/phonebook?retryWrites=true&w=majority'

console.log('connecting to', url);

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB');
    })
    .catch((err)=>{
        console.log('error connecting to MongoDB:', err.message);
    })

const personSchema = new mongoose.Schema({
  name: {type: String, required: true,  unique: true, minlength: 3}, 
  number: {type: String, required: true, minlength: 3}
});

personSchema.plugin(uniqueValidator);

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person',personSchema)


