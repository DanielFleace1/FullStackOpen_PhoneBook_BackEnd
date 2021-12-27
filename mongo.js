const mongoose = require('mongoose')



const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://fsophonebook:${password}@cluster0.f6qq3.mongodb.net/phonebook?retryWrites=true&w=majority`
mongoose.connect(url)


const personSchema = new mongoose.Schema({
    name: String, 
    number: String
})

const Person = mongoose.model('Person',personSchema)

const person = new Person({
    name: name,
    number: number,
})

if(process.argv.length <3){
    console.log('Please provide password as an argument: node mongo.js <password>');
}
else if(process.argv.length == 3){
    
    Person.find({}).then((result) => {
        result.forEach(person => {
            console.log(person.name,person.number);
        })
        mongoose.connection.close()
    })
  
}
else if(process.argv.length>3){
    person.save().then(result =>{
        console.log(`added ${result.name} with the number: ${result.number} to phonebook`);
        mongoose.connection.close()
    })
}

