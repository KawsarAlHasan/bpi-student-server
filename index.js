const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o35z3.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
})

async function run() {
  try {
    await client.connect()
    const studentCollection = client.db('student').collection('students')

    app.get('/students', async (req, res) => {
      console.log('query', req.query)
      const page = parseInt(req.query.page)
      const size = parseInt(req.query.size)
      const query = {}
      const cursor = studentCollection.find(query)

      let students
      if (page || size) {
        students = await cursor
          .skip(page * size)
          .limit(size)
          .toArray()
      } else {
        students = await cursor.toArray()
      }
      res.send(students)
    })

    app.get('/studentsCount', async (req, res) => {
      const count = await studentCollection.estimatedDocumentCount()
      res.send({ count })
    })

    // student post
    app.post('/addStudent', async (req, res) => {
      const newSutdent = req.body
      const result = await studentCollection.insertOne(newSutdent)
      res.send(result)
    })

    app.get('/student/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: ObjectId(id) }
      const result = await studentCollection.findOne(query)
      res.send(result)
    })

    app.get('/user/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: ObjectId(id) }
      const result = await studentCollection.findOne(query)
      res.send(result)
    })

    // Change student image
    app.put('/user/:id', async (req, res) => {
      const id = req.params.id
      const updateStudentInfo = req.body
      const filter = { _id: ObjectId(id) }
      const options = { upsert: true }
      const updatedDoc = {
        $set: {
          img: updateStudentInfo.img,
        },
      }
      const result = await studentCollection.updateOne(
        filter,
        updatedDoc,
        options,
      )
      res.send(result)
    })

    // update students info
    app.put('/student/:id', async (req, res) => {
      const id = req.params.id
      const updateStudentInfo = req.body
      const filter = { _id: ObjectId(id) }
      const options = { upsert: true }
      const updatedDoc = {
        $set: {
          fName: updateStudentInfo.fName,
          lName: updateStudentInfo.lName,
          address: updateStudentInfo.address,
          semester: updateStudentInfo.semester,
          phone: updateStudentInfo.phone,
          description: updateStudentInfo.description,
        },
      }
      const result = await studentCollection.updateOne(
        filter,
        updatedDoc,
        options,
      )
      res.send(result)
    })

    //Delete
    app.delete('/student/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: ObjectId(id) }
      const result = await studentCollection.deleteOne(query)
      res.send(result)
    })
  } finally {
  }
}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Running student info app!')
})

app.listen(port, () => {
  console.log('Server is running')
})
