const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const jwt=require('jsonwebtoken');
require('dotenv').config();
const app = express();
const port = process.env.PORT ||5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.shejr13.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
        await client.connect();
        const serviceCollection = client.db('tele_health').collection('services');
         const bookingCollection = client.db('tele_health').collection('bookings');
         const userCollection = client.db('tele_health').collection('users');
         const doctorCollection = client.db('tele_health').collection('doctors');


    app.get('/service', async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
      });

      app.get('/admin/:email',async(req,res)=>{
        const email=req/parms.email;
        const user=await userCollection.findOne({email:email});
        const isAdmin=user.role==='admin';
        res.send({admin:isAdmin});
      })

      app.put('/user/admin/:email',async(req,res)=>{
        const email=req.params.email;
        const filter={email:email};
        const updateDoc={
          $set:{role:'admin'},
        };
        const result=await userCollection.updateOne(filter,updateDoc);
        res.send({result});
      })

      app.put('/user/:email',async(req,res)=>{
        const email=req.params.email;
        const user=req.body;
        const filter={email:email};
        const options={upsert:true};
        const requesterAccount=await userCollection.findOne({email:requester});
        if(requesterAccount.role=== 'admin'){
          const updateDoc={
            $set:user,
          };
          const result=await userCollection.updateOne(filter,updateDoc,options);
          const token=jwt.sign({email:email},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'2h'})
          res.send({result,token});
        }
        else {
          res.status(403).send({message:'forbidden'});
        }
     
      })

      app.get('/user',async(req,res)=>{
        const users=await userCollection.find().toArray();
        res.send(users);
      }) 

      app.post('/booking',async(req,res)=>{
        const booking=req.body;
        console.log(booking)
        const query = {value:booking.value,date:booking.date,patient:booking.patient};
        const result=await bookingCollection.insertOne(booking);
        res.send(result);
      })
      app.post('/doctor',async(req,res)=>{
        const booking=req.body;
        const result=await bookingCollection.insertOne(doctor);
        res.send(result);
      })

    }
    finally{

    }
}
run().catch(console.dir);


app.get('/hero', (req, res) => {
  res.send('Hello heroapa!')
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})