const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const port = process.env.PORT || 5000;
const app = express();
app.use(express.json())
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://cardoctor-bd.web.app",
    "https://cardoctor-bd.firebaseapp.com",
  ],
  credentials: true,
}));

const uri = `mongodb+srv://${process.env.MB_USER}:${process.env.MB_PASS}@moto-race.y7jbbdm.mongodb.net/?retryWrites=true&w=majority&appName=Moto-Race`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectToMongoDB() {
  try {
    await client.connect();
    const database = client.db("Services");
    const ServiceCallaction = database.collection("All_Service");
    app.post('/servics',async(req,res)=>{
        const serviceData=req.body
        console.log(serviceData)
        const createUser={
            $set:{
                serviceName: serviceData.serviceName,
  emailAddress: serviceData.emailAddress,
  serviceArea: serviceData.serviceArea,
  Price: serviceData.Price,
  imgURL: serviceData.imgURL,
  description: serviceData.description,
  providerEmail: serviceData.providerEmail,
  providerImage:serviceData.providerImage,
  providerName: serviceData.providerName
            }
        }
        const result =await ServiceCallaction.insertOne(createUser)
        res.send(result)
    })



    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

connectToMongoDB();

app.get('/', (req, res) => {
  res.send("Your service is running");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
