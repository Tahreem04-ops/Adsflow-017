
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let ads = [];

app.get("/api/ads", (req,res)=> res.json(ads));

app.post("/api/ads", (req,res)=>{
  ads.push(req.body);
  res.json(req.body);
});

app.listen(5000,()=>console.log("Backend running 5000"));
