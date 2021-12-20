const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const cors = require('cors');


const PORT = process.env.PORT || 3000;

// import modules
const userModel = require('./model/user-model');
const verifyToken = require('./verify-token');


// write code for mongo connection here
mongoose.connect("mongodb://localhost:27017/vid-stream-api")
.then(()=>{console.log("Connection of Mongodb Done")})
.catch(()=>{console.log("Some problem")})


const app = express();
app.use(cors());
app.use(express.json());


app.listen(PORT, (req,res)=>{

    console.log(`Listning on port ${PORT}`);

})

app.post("/register",(req,res)=>{
    
    let user = req.body;

    //  it will convert normal textual password into encrypted one  
    //  (genSalt) this function tell's us how many round you want to do & it will generate random salt i.e mixture  

    bcryptjs.genSalt(10,(err,salt)=>{

        
        if(err===null){
            // pass old password , salt it will give newpassword
            bcryptjs.hash(user.password,salt,(err,newpassword)=>{
           
                // updated it with old password
                user.password = newpassword;

                // save the new encrypted password in database 
                
                let userOBJ = new userModel(user);
                userOBJ.save()
                .then(()=>{
                    res.send({message:"User is Registered"})
                })
                .catch((err)=>{
                    console.log(err);
                    res.send({message:"Problem in creating the user"}) 
                })
       
            })
        }
    })

})


// for login functionality 
// 1. First check if username is correct 
// 2. Whatever username & password pass in body it will store in userCred  

app.post("/login",(req,res)=>{

    // Whatever username & password pass in body it will store in userCred 
    let userCred = req.body;

    // we try to find person with that username 
    userModel.findOne({username:userCred.username})
    .then((user)=>{
        // if we found username, if block will executed 
        if(user!=null){

            // we are checking the previous encrypted password with new encrypted password using bcryptjs.compare() method  
            bcryptjs.compare(userCred.password,user.password,(err,status)=>{
                if(status === true){
        
                   jwt.sign(userCred,"secretkey",(err,token)=>{
                        if(err===null){
                            res.send({message:"welcome user",token:token});
                        }
                   })   
                }
                else{
                    res.send({message:"Password don't match"})
                }    
            })

        }  
        // if we don't found username else block executed 
        else{
            res.send({message:"User is not found"});
        }     
    })
    .catch((err)=>{
        console.log(err);
        res.send({message:"Some problem"});
    })
})

 
// to fetch all videos info

app.get("./videos",verifyToken,(req,res)=>{



})


// to fetch the info a single video based on id 

app.get("/videos/:id",async(req,res)=>{

    let id=req.params.id;
    let video=await videoModel.find({_id:id});
    res.send(video);  
})









// to stream a video 

// to record the time on closing player  