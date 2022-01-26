const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const cors = require('cors');
const fs = require('fs');

// import modules
const userModel = require('./model/user-model');
const verifyToken = require('./verify-token');
const videoModel = require('./model/video-model');
const userVideoModel = require('./model/user-video-model');


// write code for mongo connection here
mongoose.connect("mongodb://localhost:27017/vid-stream-api")
.then(()=>{console.log("Connection of Mongodb Done")})
.catch(()=>{console.log("Some problem")})


const app = express();
app.use(cors());
app.use(express.json());


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
                    res.send({message:"User is Registered",success:true})
                })
                .catch((err)=>{
                    console.log(err);
                    res.send({message:"Problem in creating the user",success:false}) 
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
                            res.send({message:"welcome user",token:token,user_id:user._id,success:true});
                        }
                   })   
                }
                else{
                    res.send({message:"Password don't match",success:false})
                }    
            })

        }  
        // if we don't found username else block executed 
        else{
            res.send({message:"User is not found",success:false});
        }     
    })
    .catch((err)=>{
        console.log(err);
        res.send({message:"Some problem",success:false});
    })
})

 
// to fetch all videos info
app.get("/videos",verifyToken,async(req,res)=>{
    let videos = await videoModel.find();
    res.send(videos);

})


// to fetch the info a single video based on id 
app.get("/videos/:id",async(req,res)=>{

    let id=req.params.id; // read the id 
    let video=await videoModel.find({_id:id});   // find one video based on id 
    console.log(video);
    res.send(video);  
})

 
// to stream a video 
app.get("/stream/:videoid",async (req,res)=>{

    let range =req.headers.range; 
    if(!range){
        res.status(400).send({message:"Range headers is required"});
    }


    let videoid=req.params.videoid; // read the id 
      
    let video=await videoModel.find({_id:videoid}); // find one video based on id 
    const videoSize = fs.statSync(video.videoPath).size;
    

      // start byte of the chunk 
      const start = Number(range.replace(/\D/g,""));

      // end byte of chunk
      const end = Math.min(start+10**6,videoSize-1);
  
      const contentlength = end - start + 1;
  
      let headers = {
          "Content-Range" : `bytes ${start}-${end}/${videoSize}`,
          "Accept-Ranges" : "bytes",
          "Content-length" : contentlength,
          "content-Type" : "video/mp4"
      }
  
      res.writeHead(206,headers);
  
      let videoStream = fs.createReadStream("./video.mp4",{start,end});
  
      // stream that we recive we passing as response using pipe
      videoStream.pipe(res);

}) 
app.listen(8000);


// One end point is remaining in this project & we need to complete that 
// this is assignment for us to complete 
// to record the time on closing player  

