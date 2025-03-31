require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
console.log(process.env.MONGO_URI);app.listen(process.env.PORT,()=>{
mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log('Connected to MongoDB');
}).catch((err)=>{
    console.log(err);
})
})