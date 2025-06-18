import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJwt.middleware.js";
import { createProject } from "../controllers/project.controllers.js";
import {createProjectValidator} from '../validators/index.js'

const projectRouter = Router();

projectRouter.route('/create-project').post(verifyJWT ,createProjectValidator(), createProject) ;


export default projectRouter