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
        type: Buffer,
        required: false,
    },
    logo:{
        type:Buffer,
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
        type: Number,
        required: true,
    },
    latitude: {
        type: Number,
        required: true,
    },
});

export default mongoose.model("Exhibitor", exhibitorScheme);
