const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vweq3se.mongodb.net/your-database-name?retryWrites=true&w=majority`;

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

        app.get('/toys', async (req, res) => {
            try {
                const toysData = await toysCollection.find().toArray();
                res.json(toysData);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        app.get('/uploads', async (req, res) => {
            try {
                const { email } = req.query;
                const toysData = await toysCollection.find({ email: email }).toArray();
                res.json(toysData);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        app.get('/toy/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const toy = await toysCollection.findOne(query);
            res.send(toy);
        });

        app.post('/api/toys', async (req, res) => {
            const {
                image,
                toy_name,
                seller,
                email,
                category,
                price,
                rating,
                available_quantity,
                description,
            } = req.body;

            const toyData = {
                image,
                toy_name,
                seller,
                email,
                category,
                price,
                rating,
                available_quantity,
                description,
            };

            const result = await toysCollection.insertOne(toyData);
            res.send(result);
        });

        app.delete('/api/toys/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const query = { _id: new ObjectId(id) };

                const result = await toysCollection.deleteOne(query);

                if (result.deletedCount === 1) {
                    res.json({ message: 'Toy deleted successfully' });
                } else {
                    res.status(404).json({ error: 'Toy not found' });
                }
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });


        console.log('Connected to MongoDB!');
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
