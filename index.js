const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o35z3.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });





async function run() {
    try {
        await client.connect();
        const studentCollection = client.db('student').collection('students');

        app.get('/students', async (req, res) => {
            const query = {};
            const cursor = studentCollection.find(query);
            const students = await cursor.toArray();
            res.send(students);
        });

        // student post
        app.post('/addStudent', async (req, res) => {
            const newStdent = req.body;
            const result = await studentCollection.insertOne(newStdent);
            res.send(result);
        });

        app.get('/student/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await studentCollection.findOne(query);
            res.send(result);
        });

        //Delete
        app.delete('/student/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await studentCollection.deleteOne(query);
            res.send(result);
        });
    }
    finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("Running student info app!");
});

app.listen(port, () => {
    console.log('curd server is running');
});