import mongoose from 'mongoose';
import { PROJECTMEMBER } from '../src/models/projectmember.models.js';
import { ApiError } from '../src/utils/api-errors.js';

const isMember = async (userId, projectId) => {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new ApiError(400, 'Invalid Project ID format.');
    }
    const projectMember = await PROJECTMEMBER.findOne({
        user: userId,
        project: projectId,
    });

    if (!projectMember) {
        throw new ApiError(403, 'You are not a member of this project!');
    }
    return projectMember;
};

export { isMember };
