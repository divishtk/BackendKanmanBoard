import moongoose, { Schema } from 'mongoose';


const projectSchema = new Schema({
    name:{
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description:{
        type:String,
        required: true,
    },
    createdBy:{
        type: moongoose.Schema.Types.ObjectId,
        ref: 'USER',
    }
},{
    timestamps: true
})

export const PROJECT = moongoose.model('PROJECT', projectSchema);