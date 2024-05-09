const express = require('express')
const cors=require('cors')
const port=process.env.PORT||5000
const app=express()
app.use(cors({
    origin: [
      "http://localhost:5173",
      "https://cardoctor-bd.web.app",
      "https://cardoctor-bd.firebaseapp.com",
    ],
    credentials: true,
  }))
app.get('/',(req,res)=>{
    res.send('your service is wating')
})
app.listen(port,()=>{
    console.log(`yor port is runing ${port}`)
})