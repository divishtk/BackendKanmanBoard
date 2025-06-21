import mongoose from 'mongoose';
import { PROJECTMEMBER } from '../src/models/projectmember.models.js';
import { ApiError } from '../src/utils/api-errors.js';

const isMember = async (userId, projectId) => {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new ApiError(400, 'Invalid Project ID .');
    }
    const projectMember = await PROJECTMEMBER.findOne({
        user: userId.toString(),
        project: projectId,
    });


    if (!projectMember) {
        throw new ApiError(403, 'This project is either deleted or you are not a member of it!');
    }
    return projectMember;
};

export { isMember };
