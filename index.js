const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const cors = require('cors');

const app = express();
const port = process.env.PORT ||  5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hty68.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// console.log(uri);

async function run (){
    try{
        await client.connect();
       const database = client.db('tore_trip');
       const productCollection = database.collection('TorePlase');
       const orderCollection =database.collection('orders')


    //    GET products api
    app.get('/products', async(req,res) =>{
        
        const cursor = productCollection.find({});
        const products = await cursor.toArray();
      

        res.send({
            // count,
            products
        });

    });


    // // get single services

    app.get('/products/:id', async(req,res) =>{
        const id = req.params.id;
       
        const query = {_id: ObjectId(id)};
        const product = await productCollection.findOne(query);
        res.json(product);

    })

    // delete api

    app.delete('/products/:id', async(req,res) =>{
        const id = req.params.id;
        const query = {_id:ObjectId(id)};
        const result = await productCollection.deleteOne(query);
        res.json(result)
    })


    // use post get data by keys

    app.post('/products/bykeys', async(req,res) =>{
       const keys = req.body;
       const query = {key:{$in: keys}}
       const products = await productCollection.find(query).toArray();
        res.json(products)
    });

    // post api

    app.post('/products', async(req,res) =>{
        const product = req.body;
        console.log('hit the post api', product);

       const result = await productCollection.insertOne(product)
       console.log(result);
        res.json(result)
        
    });


    // get order api 

    app.get('/orders', async(req,res) =>{
        const cursor = orderCollection.find({});
        const orders = await cursor.toArray();
        res.send(orders);
    });

    // add order api
    app.post('/orders', async(req,res) =>{
        const order = req.body;
        
       
        const result = await orderCollection.insertOne(order);
        res.json(result);
        
    });

    //   Delete Api
    app.delete('/orders/:id', async(req,res)=>{
        const id = req.params.id;
        const query = {_id:ObjectId(id)};
        const result = await orderCollection.deleteOne(query);
        res.json(result);
    });
  

    }
    finally{
       
    }

}

run().catch(console.dir);

app.get('/', (req,res) =>{
    res.send('travel express server is running on browser');
});

app.listen(port, ()=>{
    console.log('sever is running at port', port);
})