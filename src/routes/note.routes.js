import { Router } from 'express';
import { AvailableUserRoles, USER_ROLES_ENUM } from '../utils/constants.js';
import { validateProjectPermission, verifyJWT } from '../middlewares/verifyJwt.middleware.js';
import {
  createNote,
   getNotes,
   deleteNote,
   getNotesById,
   updateNote,
} from '../controllers/note.controller.js';

const noteRouter = Router();

// router
//   .route('/:projectId')
//   .get(validateProjectPermission(AvailableUserRoles), getNotes)
//   .post(validateProjectPermission([USER_ROLES_ENUM.ADMIN]), createNote);


// noteRouter
//   .route('/:projectId')
//    .get(verifyJWT, getNotes)
//   .post(verifyJWT, createNote);


  
noteRouter.route('/:projectId/notes').get(verifyJWT, getNotes); // Fetch all notes for a project
noteRouter
  .route('/get-noteById/:noteId')
  .get(verifyJWT, getNotesById)
  
noteRouter
  .route('/update-noteById/:noteId')
  .get(verifyJWT, updateNote) 

  noteRouter
  .route('/delete-noteById/:noteId')
  .delete(verifyJWT, deleteNote) 


// noteRouter
//   .route('/:projectId/n/:noteId')
//    .post(validateProjectPermission(verifyJWT, createNote)
//   .get(validateProjectPermission(AvailableUserRoles), getNotesById)
//   // .put(validateProjectPermission([USER_ROLES_ENUM.ADMIN]), updateNote)
//   // .delete(validateProjectPermission([USER_ROLES_ENUM.ADMIN]), deleteNote)

//router.route('').post() ;

export default noteRouter;
