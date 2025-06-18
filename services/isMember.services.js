import { PROJECTMEMBER } from "../src/models/projectmember.models.js";
import { asyncHandler } from "../src/utils/async-handler.js";

const isMember = asyncHandler(async (userId, projectId) => {

    const projectMember  = await PROJECTMEMBER.findOne({
        user: userId ,
        project : projectId
    })

    if (!projectMember) {
        throw new ApiError(403, 'You are not a member of this project!');
    }
    return projectMember

})

export {
    isMember
}
