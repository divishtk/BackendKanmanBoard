import { Router } from "express";
import { USER_ROLES_ENUM } from "../utils/constants";
import { validateProjectPermission } from "../middlewares/verifyJwt.middleware";

const router = Router();

router.route('/:projectId')
.get(validateProjectPermission([USER_ROLES_ENUM.ADMIN , USER_ROLES_ENUM.MEMBER]),getNotes)
.post(validateProjectPermission([USER_ROLES_ENUM.ADMIN], USER_ROLES_ENUM.MEMBER),createNote) ;


//router.route('').post() ;


export default router  