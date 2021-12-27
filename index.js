require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
app.use(morgan('tiny'))
app.use(express.json())
const cors = require('cors')
app.use(cors())
app.use(express.static('build'))
const Person = require('./models/person')
const { response } = require('express')


// array of persons data
let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


// 3.1 - GET 
app.get('/',(request,response) => {
    response.send('<h1>Hello phonebook exercise</h1>')
})
// Here I am making a HTTP GET request to fetch all the resources in persons. 
//The response (is sending?) persons in json format 
app.get('/api/persons',(request,response) => {
    // response.json(persons)
  Person.find({}).then(person=>{
    //console.log(person);
    response.json(person)      
  })
})


// (my words: Helper) function to generate max id of the phone book // apart of 3.2
const generateMaxId_forInfo = () =>{
    const maxID = persons.length> 0 
      ? Math.max(...persons.map(n=>n.id))
      : 0 
    return maxID 
  }

// 3.2 step 2 - implement info page with max number of entries and time of processing req.
// this workds as long as id's are given in chronological order
app.get('/info',(req,res) => {
    const maxPersons = generateMaxId_forInfo()
    const DateTime = Date()
    res.send(`<div> <h1>Phonebook has ${maxPersons} people in it </h1> <p> ${DateTime}</p> </div>` )
})

//step 3.3 step 3
app.get('/api/persons/:id',(req,res) => {
    // old
    // const id = Number(req.params.id)
    // const person = persons.find(person => person.id === id)
    // if(person){
    //     res.json(person)
    // }
    // else {
    //     res.status(404).end()
    // }
    
    // new
    Person.findById(req.params.id).then((person) => {
      res.json(person)
    })
})

//3.4 step 4 - delete 
app.delete('/api/persons/:id',(req,res) => {
  const id = Number(req.params.id)
  //console.log("id:",id)
  //console.log("id:",typeof(id))
  persons = persons.filter(prsn => prsn.id !== id)
  res.status(204).end()
})



//3.5 step 5 - Post

const generateNewID = ()=>{
  const maxID = Math.floor(Math.random() * 1000)
  //console.log(typeof(maxID))
  return maxID
}



app.post('/api/persons',(req,res)=>{
  const body =req.body
 // console.log(req.body)



  // // Error if name or number is missing from body or if name already exists in phone book
  // const found = persons.findIndex(obj => {
  //   return obj.name === body.name
  // })

  if(body.name === undefined ){
    return res.status(400).json({error:'name missing'})
  }

  else if(body.number === undefined){
    return res.status(400).json({error:'number missing'})
  }



  // else if(found !== -1){
  //   return res.status(400).json({error:'Name already exists '})
  // }
   
  const person = new Person({
    "number": body.number,
    "name":body.name,
    //"id":generateNewID()
  })

  person.save().then(savedPerson => {
    res.json(savedPerson)
  })
  // persons = persons.concat(person)
  // res.json(person)
 
})

// listening for connections on port 3001. ( in my words will connect if localhost 3001 is accesed and the get request above handle the various /... routes. [so far])
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3001;
}
app.listen(port);


