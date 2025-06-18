import { PROJECT } from '../models/project.models.js';
import { PROJECTMEMBER } from '../models/projectmember.models.js';
import { ApiError } from '../utils/api-errors';
import { ApiResponse } from '../utils/api-response';
import { USER_ROLES_ENUM } from '../utils/constants';

const createProject = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const userId = req.user._id;

    const existingProjectName = await PROJECT.findOne({ name });
    if (existingProjectName) {
        throw new ApiError(401, 'Project Name Already exists, select new name');
    }

    const project = await PROJECT.create({
        name,
        description,
        createdBy: userId,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, project, 'Project created successfully'));
});

const deleteProject = asyncHandler(async (req, res) => {
    const {projectId}  = req.params ; 
    const userId = req.user._id;

    const projectMember = await PROJECTMEMBER.findOne({
        user : userId ,
        project : projectId
    }) ;

    if(!projectMember) {
        throw new ApiError(404, "You are not part of this project") ;
    }

    if(projectMember.role!==USER_ROLES_ENUM.PROJECT_ADMIN || projectMember.role!==USER_ROLES_ENUM.ADMIN){
                throw new ApiError(404, "You are not allowed to delete this project") ;
    } 

    const projectDelete = await PROJECT.findByIdAndDelete(projectId) ;
    if(!projectDelete){
                throw new ApiError(404, "Project could not be deleted!");
    }

    return res.status(200).json(new ApiResponse(200, projectDelete, "Project deleted successfully!"))   

});


const updateProject = asyncHandler(async (req, res) => {})



export { createProject ,
    deleteProject ,

 };
