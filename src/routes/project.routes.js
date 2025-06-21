import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJwt.middleware.js";
import { addProjectMember, createProject, deleteProject, getAllProjects, getAllProjectscreatedByaUser, getEnrolledProjects, getProjectById, updateMemberRole, updateProject } from "../controllers/project.controllers.js";
import {createProjectValidator, updateMemberRoles, updateProjectValidator} from '../validators/index.js'

const projectRouter = Router();

projectRouter.route('/create-project').post(verifyJWT ,createProjectValidator(), createProject) ;
projectRouter.route('/update-project/:projectId').patch(verifyJWT ,updateProjectValidator(), updateProject) ;
projectRouter.route('/delete-project/:projectId').delete(verifyJWT, deleteProject) ;
projectRouter.route('/add-members/:projectId').post(verifyJWT, addProjectMember) ;
projectRouter.route('/update-project-members-role/:projectId').patch(verifyJWT,updateMemberRoles(),updateMemberRole) ;
projectRouter.route('/getprojectsCreatedByUser').get(verifyJWT,getAllProjectscreatedByaUser) ;
projectRouter.route('/getProjectById/:projectId').get(verifyJWT,getProjectById) ;
projectRouter.route('/getYourEnrolledProjects').get(verifyJWT,getEnrolledProjects) ;


export default projectRouter