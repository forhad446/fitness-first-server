const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

// middleware
app.use(express.json())
app.use(cors())


const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ajryzz7.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const usersCollection = client.db("usersDB").collection("users");
        const postsCollection = client.db("usersDB").collection("posts");
        const trainersCollection = client.db("trainersDB").collection("trainers");
        const classCollection = client.db("trainersDB").collection("class");

        // new users who created account on my website
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result)
        })
        // all users
        app.get('/users', async (req, res) => {
            const result = await usersCollection.find().toArray();
            res.send(result)
        })

        // for trainers request
        app.post('/trainers', async (req, res) => {
            const data = req.body;
            const result = await trainersCollection.insertOne(data);
            res.send(result)
        })
        // for adding new class
        app.post('/class', async (req, res) => {
            const data = req.body;
            const result = await classCollection.insertOne(data);
            res.send(result)
        })
        // get all post
        app.get('/posts', async (req, res) => {
            const result = await postsCollection.find().toArray();
            res.send(result)
        })
        // get all trainer
        app.get('/trainers', async (req, res) => {
            const result = await trainersCollection.find().toArray();
            res.send(result)
        })
        // get all class  
        app.get('/class', async (req, res) => {
            const result = await classCollection.find().toArray();
            res.send(result)
        })
        // put user by id
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body; 

            const options = { upsert: true };
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    name: data.fullName,
                    password: data.password
                },
            };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.send(result) 
        })
        // put user by email 
        app.put('/dbUsers/:email', async (req, res) => {
            const email = req.params.email;

            const options = { upsert: true }; 
            const filter = { email: email };
            const updateDoc = {
                $set: {
                    role: 'Trainer'
                },
            };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.send(result) 
        })
        // put trainer by id
        app.put('/trainers/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body;

            const options = { upsert: true };
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    status: 'success'
                },
            };
            const result = await trainersCollection.updateOne(filter, updateDoc, options);
            res.send(result) 
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Fitness First Server Is Running...')
})

app.listen(port, () => {
    console.log(`Fitness First Running Port is : ${port}`)
})