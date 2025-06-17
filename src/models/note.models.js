import moongoose, { Schema } from 'mongoose';

const projectNote = new Schema(
    {
        project: {
            type: moongoose.Schema.Types.ObjectId,
            ref: 'PROJECT',
            required: true,
        },
        createdBy: {
            type: moongoose.Schema.Types.ObjectId,
            ref: 'USER',
            required: true,
        },
        content:{
            type: String,
            required: true,
        }

    },
    {
        timestamps: true,
    },
);

export const PROJECTNOTE = moongoose.model('PROJECTNOTE', projectNote);
