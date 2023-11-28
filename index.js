const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

// middleware
app.use(express.json())
app.use(cors())

const uri = "mongodb+srv://forhad445:hCYCLsss09eq1Cud@cluster0.ajryzz7.mongodb.net/?retryWrites=true&w=majority";

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

        // new users who created account on my website
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result)
        })

        // for trainers request
        app.post('/trainers', async (req, res) => {
            const data = req.body;
            const result = await trainersCollection.insertOne(data);
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