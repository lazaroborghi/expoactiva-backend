import mongoose from "mongoose";

const exhibitorScheme = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    tel: {
        type: String,
        required: false,
    },
    image: {
        type: String,
        required: false,
    },
    logo:{
        type:String,
        required:false,
    },
    description:{
        type:String,
        required:false
    },
    type:{
        type:String,
        required:true
    },
    standId:{
        type:Number,
        required:false
    },
    webPage:{
        type:String,
        required:false
    },
    longitude: {
        type: String,
        required: true,
    },
    latitude: {
        type: String,
        required: true,
    },
});

export default mongoose.model("Exhibitor", exhibitorScheme);
