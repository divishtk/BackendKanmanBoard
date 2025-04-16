import moongoose from 'mongoose';
import { AvailableUserRoles, USER_ROLES_ENUM } from '../utils/constants.js';


const projectMemberSchema = new Schema({
    user: {
        type: moongoose.Schema.Types.ObjectId,
        ref: 'USER',
        required: true,
    },
    project: {
        type: moongoose.Schema.Types.ObjectId,
        ref: 'PROJECT',
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: AvailableUserRoles,
        default: USER_ROLES_ENUM.MEMBER,
    },

}, {
    timestamps: true,
})

export const PROJECTMEMBER = moongoose.model('PROJECTMEMBER', projectMemberSchema);