import moongoose from 'mongoose';
import { AvailableTaskStatus, TASK_STATUS_ENUM } from '../utils/constants.js';


const taskSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    project: {
        type: moongoose.Schema.Types.ObjectId,
        ref: 'PROJECT',
        required: true,
    },
    assignedTo: {
        type: moongoose.Schema.Types.ObjectId,
        ref: 'USER',
    },
    assignedBy: {
        type: moongoose.Schema.Types.ObjectId,
        ref: 'USER',
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: AvailableTaskStatus,
        default: TASK_STATUS_ENUM.TODO,
    },
    attachments: {
        type: [{
            url: String,
            mimeType: String,
            size: Number,
        }],
        default: [],
    }

}, {
    timestamps: true,
})

export const TASK = moongoose.model('TASK', taskSchema);