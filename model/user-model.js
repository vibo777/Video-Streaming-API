const mongoose = require('mongoose');

// Create user Schema
const userSchema = new mongoose.Schema({

    name:{type:'string',required:true},
    email:{type:'string',required:true,unique:true},
    username:{type:'string',required:true,unique:true},
    password:{type:'string',required:true}

},{timestamps:true})

// create user model 

const userModel = new mongoose.Model('user', userSchema);

// let export the user model so that we can import in main file 
module.exports = userModel; 
