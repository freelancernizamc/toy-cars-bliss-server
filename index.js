const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// middleware
// const corsConfig = {
//     origin: '',
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE']
// }
// app.use(cors(corsConfig))
// app.options("", cors(corsConfig))
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vweq3se.mongodb.net/your-database-name?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function run() {
    try {
        // await client.connect();
        const toysCollection = client.db('toyCars').collection('toys');
        const newToysCollection = client.db('toyCars').collection('toys');



        app.get('/toys', async (req, res) => {
            try {

                const toysData = await toysCollection.find().toArray();
                res.json(toysData);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });


        app.get('/toys/:id', async (req, res) => {
            try {
                const toyId = req.params.id;
                const toy = await toysCollection.findOne({ _id: ObjectId(toyId) });
                if (toy) {
                    res.json(toy);
                } else {
                    res.status(404).json({ error: 'Toy not found' });
                }
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });


        app.post('/api/toys', async (req, res) => {
            const { pictureUrl, name, sellerName, sellerEmail, category, price, rating, availableQuantity, description } = req.body;
            const toyData = {
                pictureUrl,
                name,
                sellerName,
                sellerEmail,
                category,
                price,
                rating,
                availableQuantity,
                description,
            };

            newToysCollection.insertOne(toyData, (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Error saving the toy');
                } else {
                    res.status(200).send('Toy saved successfully');
                }
            });
        });



        // Send a ping to confirm a successful connection
        await client.db('admin').command({ ping: 1 });
        console.log('Pinged your deployment. You successfully connected to MongoDB!');
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}

run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('Assignment-11-server is running');
});
app.listen(port, () => {
    console.log(`Server is running on PORT: ${port}`);
});
