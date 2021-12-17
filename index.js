const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// import modules
const userModel = require('./model/user-model')

// write code for mongo connection here


app.use(cors());
app.use(express.json());


app.listen(PORT, (req,res)=>{

    console.log(`Listning on port ${PORT}`);

})

