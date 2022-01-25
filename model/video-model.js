const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({

    title:{type:String,required:true},
    year:{type:Number,required:true},
    genres:[{type:String}],
    contentRating:{type:Number,required:true},
    duration:{type:Number,required:true},    
    releaseDate:{type:String,required:true},
    originalTitle:{type:String,required:true},
    storyline:{type:String,required:true},
    actors: [{type: String}],
    imdbRating:{type:Number,min:1,max:10},
    posteurl:{type:String,required:true},
    videoPath:{type:String,required:true},

},{timestamps:true});

const videoModel = new mongoose.model('video',videoSchema);

module.exports = videoModel; 