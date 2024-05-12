const express = require("express");
const cors = require("cors");
require("dotenv").config();
const cookieParser=require('cookie-parser')
const jwt=require ('jsonwebtoken')
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const port = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://cardoctor-bd.web.app",
      "https://cardoctor-bd.firebaseapp.com",
    ],
    credentials: true,
  })
);
// midleware create 
   const verifayToken=(req,res,next)=>{
    const token=req?.cookie?.token 
    if(!token){
      return res.status(401).send({message:'unathorise'})
    }
    jwt.verify(token.process.env.TOKEN_KEY,(error,decoded)=>{
      if(error){
        return res.status(401).send({message:'can not accecss'})
      }
      req.user=decoded
      next()
    }
    )
   }
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
    // await client.connect();
    const database = client.db("Services");
    const ServiceCallaction = database.collection("All_Service");
    const BookingCallaction = database.collection("Booking");
    // auth verification 
    app.post('/jwt',async(req,res)=>{
      const user=req.body
      const token=jwt.sign(user,process.env.TOKEN_KEY,{expiresIn:'24h'})
      res
      .cookie('token',token,{
        httpOnly:true,
        secure:true,
        sameSite:'none'
      })
      .send({success:true})
    })
    app.post('/tokenout',async (req,res)=>{
      const user=req.body
      res
      .clearCookie('token',{maxAge:0})
      .send({success:true})
    })

    app.delete("/booking/:id", async (req, res) => {
      const id = req.params.id;
      const quary = { _id: new ObjectId(id) };
      const result = await ServiceCallaction.deleteOne(quary);

      res.send(result);
    });

    app.get("/booking", async (req, res) => {
      const userEmail = req.query.email;
      const quary = { providerEmail: userEmail };

      const result = await ServiceCallaction.find(quary).toArray();

      res.send(result);
    });
    app.get("/booked", async (req, res) => {
      const currentUser = req.query.email;
      const quary = {    providerEmail: currentUser, };

      const result = await BookingCallaction.find(quary).toArray();

      res.send(result);
    });
    // to do service
    app.get("/service_to_do", async (req, res) => {
      const currentUser = req.query.email;
      const quary = {
     
        userEMail: currentUser
      };

      const result = await BookingCallaction.find(quary).toArray();

      res.send(result);
    });

    // todo service update
    app.put("/update_status/:id", async (req, res) => {
      const id = req.params.id;
      const status = req.body;
     
    
      const quary = { _id: new ObjectId(id) };
      const updateUser = {
        $set:status
       
      };
      const result  =await BookingCallaction.updateOne(quary,updateUser)
     res.send(result)
    });

    app.get("/booking/:id", async (req, res) => {
      const id = req.params.id;
      const quary = { serviceId: id };

      const result = await BookingCallaction.findOne(quary);
      console.log(result);
      res.send(result);
    });

    app.post("/booking", async (req, res) => {
      const bokingData = req.body;
      const result = await BookingCallaction.insertOne(bokingData);
      res.send(result);
    });
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const quary = { _id: new ObjectId(id) };
      const result = await ServiceCallaction.findOne(quary);
      res.send(result);
    });
    app.get("/services", async (req, res) => {
      const course = ServiceCallaction.find();
      const result = await course.toArray();
      res.send(result);
    });
    // search data
    app.get("/searching", async (req, res) => {
      const { search } = req.query;

      const filtering = new RegExp(search, "i");
      const serviceFiltering = await ServiceCallaction.find({
        serviceName: filtering,
      }).toArray();

      res.send(serviceFiltering);
    });
    app.post("/servics", async (req, res) => {
      const serviceData = req.body;

      const result = await ServiceCallaction.insertOne(serviceData);
      res.send(result);
    });
    app.put("/update/:id", async (req, res) => {
      const id = req.params.id;
      const serviceData = req.body;
      const quary = { _id: new ObjectId(id) };

      const createUser = {
        $set: {
          serviceName: serviceData.serviceName,
          emailAddress: serviceData.emailAddress,
          serviceArea: serviceData.serviceArea,
          Price: serviceData.Price,
          imgURL: serviceData.imgURL,
          description: serviceData.description,
        },
      };
      const result = await ServiceCallaction.updateOne(quary, createUser);
      res.send(result);
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

connectToMongoDB();

app.get("/", (req, res) => {
  res.send("Your service is running");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
