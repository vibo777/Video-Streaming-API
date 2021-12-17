const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({

    name:{type:String,required:true},
    genre:{type:String,required:true},
    releaseDate:{type:String,required:true},
    runTime: {type: String, required: true},
    description: {type: String, required: true},
    actors: [{type: String}],
    rating: {type: Number, min: 0, max: 10},
    production: {type: String, required: true},
    director: [{type: String}],
    videoLink: {type: String, required: true},
},{timestamps:true});

const videoModel = new mongoose.Model('video',videoSchema);

module.exports = videoModel; 