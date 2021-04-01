const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const { response } = require('express')
const app = express()

app.use(express.json())
app.use(cors())

morgan.token('body', function (request) {
  return request.method === 'POST'
    ? JSON.stringify(request.body)
    : null
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  }
]

app.get('/', (req, res) => {
  response.send('go to /api/persons for data')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  const info = `<p>Phonebook has info for ${persons.length} people</p> <p>${Date()}</p>`
  response.send(info)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(p => p.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const id = Math.floor(Math.random() * 1000)
  const person = request.body
  person.id = id

  if (person.name === "") {
    console.log('no name')
    response.status(400).send({ error: 'name needed'})
    return
  } else if (person.number === "") {
    console.log('no number')
    response.status(400).send({ error: 'number needed'})
    return 
  } else if (persons.some(p => p.name === person.name)) {
    console.log('name already in use')
    response.status(409).send({ error: 'name must be unique'})
    return
  }

  persons = persons.concat(person)
  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})