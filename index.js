const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()
const morgan = require('morgan')
const Person = require('./models/person')
const { request, response } = require('express')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))

console.log('deploying check');

const errorHandler = (err,req,res,next) => {
  //console.log(err.message);
  if(err.name === "CastError"){
    return res.status(400).send({error: "malformatted id"})
  }
  else if (err.name === 'ValidationError') {
    
    return res.status(400).json({ error: err.message })
  }
  next(err)
}

const unknownEndpoint = (req,res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

// GET 
app.get('/',(request,response) => {
    response.send('<h1>Hello phonebook exercise</h1>')
})
 
app.get('/api/persons',(request,response) => {
  
  Person.find({}).then(person=>{
    response.json(person)      
  })
})

// const generateMaxId_forInfo = () =>{
//   const maxID = persons.length> 0 
//     ? Math.max(...persons.map(n=>n.id))
//     : 0 
//   return maxID 
// }
// app.get('/info',(req,res) => {
//     const maxPersons = generateMaxId_forInfo()
//     const DateTime = Date()
//     res.send(`<div> <h1>Phonebook has ${maxPersons} people in it </h1> <p> ${DateTime}</p> </div>` )
// })

// get by id 
app.get('/api/persons/:id',(req,res,next) => {
    Person.findById(req.params.id)
      .then((person) => {
        if(person){
          res.json(person)
        }
        else{
          res.status(404).end()
        }     
      })
      .catch((err) => {
       // console.log(err);
        next(err)
      })
})

//delete 
app.delete('/api/persons/:id',(req,res,next) => {
  Person.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.status(204).end()
    })
    .catch((err) => {
      next(err)
    })
})

//Post
const generateNewID = ()=>{
  const maxID = Math.floor(Math.random() * 1000)
  return maxID
}
app.post('/api/persons',(req,res,next)=>{
  const body =req.body
  if(body.name === undefined ){
    return res.status(400).json({error:'name missing'})
  }
  else if(body.number === undefined){
    return res.status(400).json({error:'number missing'})
  }
  const person = new Person({
    "number": body.number,
    "name":body.name,
  })
  person.save()
    .then(savedPerson => {
      res.json(savedPerson)
    })
    .catch((error) => {
      //console.log(error);
      next(error)
    })
})

//update 
app.put('/api/persons/:id',(req,res,next)=>{
  const body = req.body
  console.log(body);
  const person = {
    name: body.name,
    number: body.number
  }
  Person.findByIdAndUpdate(req.params.id,person,{new:true})
    .then(updatedPerson =>{

      if(updatedPerson){
        res.json(updatedPerson)
      }
        // not sure what is the proper way to handled updated person not found { test by opening two browsers, deleting a data pt , and try to change it in the other.}
        else{
          next()
        }
    })
    .catch(error => next(error))
})


app.use(unknownEndpoint)
app.use(errorHandler)

// listening for connections on port 3001. ( in my words will connect if localhost 3001 is accesed and the get request above handle the various /... routes. [so far])
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3001;
}
app.listen(port);


