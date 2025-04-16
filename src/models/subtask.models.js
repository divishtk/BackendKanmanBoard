import moongoose from 'mongoose';


const subtaskSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    task: {
        type: moongoose.Schema.Types.ObjectId,
        ref: 'TASK',
        required: true,
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
    createdBy: {
        type: moongoose.Schema.Types.ObjectId,
        ref: 'USER',
        required: true,
    }
}, {
    timestamps: true,
})

export const SUBTASK = moongoose.model('SUBTASK', subtaskSchema);