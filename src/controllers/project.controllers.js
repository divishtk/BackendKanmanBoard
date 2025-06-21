import mongoose from 'mongoose';
import { isMember } from '../../services/isMember.services.js';
import { PROJECT } from '../models/project.models.js';
import { PROJECTMEMBER } from '../models/projectmember.models.js';
import { USER } from '../models/user.models.js';
import { ApiError } from '../utils/api-errors.js';
import { ApiResponse } from '../utils/api-response.js';
import { asyncHandler } from '../utils/async-handler.js';
import { USER_ROLES_ENUM } from '../utils/constants.js';


/**
 *  -> Create Project
 *  -> Update Project
 *  -> Delete Project
 *  -> Add Project member
 *  -> Update member role 
 *  ->
 */

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

    await PROJECTMEMBER.create({
        user : userId , 
        project : project._id , 
        role : USER_ROLES_ENUM.PROJECT_ADMIN
    })

    return res
        .status(201)
        .json(new ApiResponse(201, project, 'Project created successfully'));
});

const deleteProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const userId = req.user._id;

    
    const projectMember = await isMember(userId , projectId) ;

    if (!projectMember) {
        throw new ApiError(404, 'You are not part of this project');
    }

    if (
        projectMember.role !== USER_ROLES_ENUM.PROJECT_ADMIN 
        && projectMember.role !== USER_ROLES_ENUM.ADMIN
    ) {
        throw new ApiError(404, 'You are not allowed to delete this project');
    }

    const projectDelete = await PROJECT.findByIdAndDelete(projectId);
    if (!projectDelete) {
        throw new ApiError(404, 'Project is already deleted!');
    }

    //delete users from project members after deleting project who ever is assciated with that project
    const deleteMany = await PROJECTMEMBER.deleteMany({
        user : userId ,
        project : projectId
    })

    return res
        .status(200)
        .json(new ApiResponse(200, projectDelete, 'Project deleted successfully!'));
});

const updateProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const userId = req.user._id;
    const { name, description } = req.body;


    const projectMember = await isMember(userId , projectId) ;

    if (!projectMember) {
        throw new ApiError(403, 'You are not a member of this project!');
    }
    if (
        projectMember.role !== USER_ROLES_ENUM.PROJECT_ADMIN
         && projectMember.role !== USER_ROLES_ENUM.ADMIN
    ) {
        throw new ApiError(403, 'You are not authorized to update this project!');
    }


    const updatedProject = await PROJECT.findByIdAndUpdate(
        projectId,
        {
            name,
            description,
        },
        { new: true },
    );
    if (!updatedProject) {
        throw new ApiError(404, 'Project could not be updated!');
    }
    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedProject, 'Project updated successfully!'),
        );
});

const addProjectMember = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const userId = req.user._id;
    const { memberId } = req.body;


   const projectMember = await isMember(userId , projectId) ;

    if (!projectMember) {
        throw new ApiError(403, 'You are not a member of this project!');
    }

    if (projectMember.role !== USER_ROLES_ENUM.PROJECT_ADMIN && projectMember.role !== USER_ROLES_ENUM.ADMIN) {
        throw new ApiError(
            403,
            'You are not authorized to add members to this project!',
        );
    }
    
    const findprojectMember = await PROJECTMEMBER.findOne({
        user: memberId,
        project: projectId,
    });
    if (findprojectMember) {
        throw new ApiError(400, 'This member is already a member of this project!');
    }
    const projectMemberAdd = await PROJECTMEMBER.create({
        user: memberId,
        project: projectId,
    });
    if (!projectMemberAdd) {
        throw new ApiError(404, 'Project member could not be added!');
    }
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                projectMemberAdd,
                'Project member added successfully!',
            ),
        );
});

const deleteProjectMember = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const userId = req.user._id;

    const projectMember = await PROJECTMEMBER.findOne({
        user: userId,
        project: projectId,
    });

    if (!projectMember) {
        throw new ApiError(403, 'You are not a member of this project!');
    }
    if (projectMember.role !== USER_ROLES_ENUM.PROJECT_ADMIN) {
        throw new ApiError(
            403,
            'You are not authorized to delete members from this project!',
        );
    }
    const projectMemberDelete = await PROJECTMEMBER.findByIdAndDelete(id);

    if (!projectMemberDelete) {
        throw new ApiError(404, 'Project member could not be deleted!');
    }
    // if (projectMemberDelete.user.toString() === userId.toString()) {
    //     throw new ApiError(403, 'You cannot delete yourself from this project!');
    // }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                projectMemberDelete,
                'Project member deleted successfully!',
            ),
        );
});

const getProjectById = asyncHandler(async (req, res) => {
    const { projectId } = req.params ;
    const userId = req.user._id ;

    const project = await PROJECT.findById(projectId) ;

    if(!project) {
    throw new ApiError(404, "Project not found!")} ;

    if(project.createdBy.toString() !== userId.toString()) {
        const projectMember = await isMember(userId , projectId) ;
        if(!projectMember){
           throw new ApiError(403, "You are not authorized to view this project!");
        }
    }

    return res.status(200).json(new ApiResponse(200, project, "Project found successfully!"))
})


const getAllProjectscreatedByaUser = asyncHandler(async (req, res) => {
    const userId = req.user._id

    const projects = await PROJECT.find({ createdBy: userId })
    if (!projects) {
        throw new ApiError(404, "No projects found!");
    }

    return res.status(200).json(new ApiResponse(200, projects, "Projects found successfully!"))
})


const updateMemberRole = asyncHandler(async (req, res) => {
    const { projectId } = req.params ;
    const userId = req.user._id ;
    const { memberId, role } = req.body ;


    const projectMember = await PROJECTMEMBER.findOne({ user: userId, project: projectId })
    if (!projectMember) {
        throw new ApiError(403, "You are not a member of this project!");
    }
    if (projectMember.role !== USER_ROLES_ENUM.PROJECT_ADMIN) {
        throw new ApiError(403, "You are not authorized to update members in this project!");
    }
    
    const findprojectMember = await PROJECTMEMBER.findOne({ user: memberId, project: projectId })
    if (!findprojectMember) {
        throw new ApiError(404, "Requested member is not a member of this project! Please add them first.");
    }

    if (findprojectMember.role === USER_ROLES_ENUM.ADMIN) {
        throw new ApiError(403, "You cannot update the role of an admin member!");
    }
    if (findprojectMember.role === role) {
        throw new ApiError(400, "This member already has this role!");
    }
    const updatedProjectMember = await PROJECTMEMBER.findByIdAndUpdate(findprojectMember._id, { role }, { new: true })
    if (!updatedProjectMember) {
        throw new ApiError(404, "Project member could not be updated!");
    }

    return res.status(200).json(new ApiResponse(200, updatedProjectMember, "Project member updated successfully!"))

})

const getAllProjects = asyncHandler(async (req, res) => {
    const userId = req.user._id

    const user = await USER.findById(userId) ;
    console.log(user)
    if (!user) {
        throw new ApiError(404, "User not found!");
    }
    // if (user.role !== USER_ROLES_ENUM.ADMIN) {
    //     throw new ApiError(403, "You are not authorized to view all projects!");
    // }

    const projects = await PROJECT.find({})
    if (!projects) {
        throw new ApiError(404, "No projects found!");
    }

    return res.status(200).json(new ApiResponse(200, projects, "Projects found successfully!"))
})


export { createProject, 
    updateProject, 
    addProjectMember, 
    deleteProjectMember, 
    deleteProject,
    getProjectById,
    updateMemberRole, 
    getAllProjects ,
    getAllProjectscreatedByaUser
};
