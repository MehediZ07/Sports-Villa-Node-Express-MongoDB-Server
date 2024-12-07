const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();
// middleware
app.use(cors());
app.use(express.json());

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.swu9d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// sportsEquipments
// uPlMoHIHZE9Wi6Gg

const uri = "mongodb+srv://sportsEquipments:uPlMoHIHZE9Wi6Gg@cluster0.9yghi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";




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
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        const database = client.db('sportsEquipments');
        const equipmentCollection = database.collection('equipment');
        const userCollection = database.collection('users');
        const ourAthletesCollection = database.collection('ourAthletes');
        const ourPartnerCollection = database.collection('ourPartner');
        const cartCollection = database.collection('addCart');


        app.get('/equipment', async (req, res) => {
            const cursor = equipmentCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        
        app.get('/equipment/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await equipmentCollection.findOne(query);
            res.send(result);
        })


        app.post('/equipment', async (req, res) => {
            const newequipment = req.body;
            console.log('Adding new equipment', newequipment)
            const result = await equipmentCollection.insertOne(newequipment);
            res.send(result);
        });
          

        app.put('/equipment/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: req.body
            }

            const result = await equipmentCollection.updateOne(filter, updatedDoc, options)

            res.send(result);
        })


        app.delete('/equipment/:id', async (req, res) => {
            console.log('going to delete', req.params.id);
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await equipmentCollection.deleteOne(query);
            res.send(result);
        })


        // Users related apis
        app.get('/users', async (req, res) => {
            const cursor = userCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/users', async (req, res) => {
            const newUser = req.body;
            console.log('creating new user', newUser);
            const result = await userCollection.insertOne(newUser);
            res.send(result);
        });

        app.patch('/users', async (req, res) => {
            const email = req.body.email;
            const filter = { email };
            const updatedDoc = {
                $set: {
                    lastSignInTime: req.body?.lastSignInTime,
                    hotoUrl: req.body?.photo,
                    name: req.body?.name,
                }
            }

            const result = await userCollection.updateOne(filter, updatedDoc);
            res.send(result);
        })

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.send(result);
        })

           // ourAthletes related apis
           app.get('/ourAthletes', async (req, res) => {
            const cursor = ourAthletesCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

                // ourPartner related apis
                app.get('/ourPartner', async (req, res) => {
                    const cursor = ourPartnerCollection.find();
                    const result = await cursor.toArray();
                    res.send(result);
                });

                // addCart related apis
               app.get('/addCart', async (req, res) => {
                   const cursor = cartCollection.find();
                   const result = await cursor.toArray();
                   res.send(result);
                });


                app.post('/addCart', async (req, res) => {
                    const newequipment = req.body;
                    console.log('Adding new equipment', newequipment)
                    const result = await cartCollection.insertOne(newequipment);
                    res.send(result);
                });
                
                app.delete('/addCart/:id', async (req, res) => {
                    console.log('going to delete', req.params.id);
                    const id = req.params.id;
                    const query = { _id: new ObjectId(id) }
                    const result = await cartCollection.deleteOne(query);
                    res.send(result);
                })

                app.delete('/clearCart', async (req, res) => {
                    try {
                        const result = await cartCollection.deleteMany({}); // Delete all documents
                        res.send({
                            acknowledged: result.acknowledged,
                            deletedCount: result.deletedCount,
                            message: 'All items have been removed from the collection.',
                        });
                    } catch (error) {
                        console.error("Error clearing the collection:", error);
                        res.status(500).send({ error: "Failed to clear the collection." });
                    }
                });
                
                
                
                
                
    } finally {
        // Ensures that the client will close when you finish/error
        //   await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Sports Equipment')
})

app.listen(port, () => {
    console.log(`Sports Equipment in port: ${port}`);
})
