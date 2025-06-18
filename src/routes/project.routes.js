import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJwt.middleware.js";
import { createProject, updateProject } from "../controllers/project.controllers.js";
import {createProjectValidator, updateProjectValidator} from '../validators/index.js'

const projectRouter = Router();

projectRouter.route('/create-project').post(verifyJWT ,createProjectValidator(), createProject) ;
projectRouter.route('/update-project/:projectId').patch(verifyJWT ,updateProjectValidator(), updateProject) ;



export default projectRouter