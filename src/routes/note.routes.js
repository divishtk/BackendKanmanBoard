import { Router } from 'express';
import { AvailableUserRoles, USER_ROLES_ENUM } from '../utils/constants.js';
import { validateProjectPermission } from '../middlewares/verifyJwt.middleware.js';
import {
  createNote,
  deleteNote,
  getNotesById,
  updateNote,
} from '../controllers/note.controller.js';

const router = Router();

router
  .route('/:projectId')
  .get(validateProjectPermission(AvailableUserRoles), getNotes)
  .post(validateProjectPermission([USER_ROLES_ENUM.ADMIN]), createNote);

router
  .route('/:projectId/n/:noteId')
  .get(validateProjectPermission(AvailableUserRoles), getNotesById)
  .put(validateProjectPermission([USER_ROLES_ENUM.ADMIN]), updateNote)
  .delete(validateProjectPermission([USER_ROLES_ENUM.ADMIN]), deleteNote)
  .post(validateProjectPermission([USER_ROLES_ENUM.ADMIN]), createNote);

//router.route('').post() ;

export default router;
