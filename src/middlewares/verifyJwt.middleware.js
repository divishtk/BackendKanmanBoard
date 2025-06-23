import { ApiError } from '../utils/api-errors.js';
import { asyncHandler } from '../utils/async-handler.js';
import jwt from 'jsonwebtoken';
import { USER } from '../models/user.models.js';
import { PROJECTMEMBER } from '../models/projectmember.models.js';
import mongoose from 'mongoose';

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new ApiError(401, 'Unauthorized request');
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await USER.findById(decodedToken?._id).select(
      '-password -refreshToken',
    );

    if (!user) {
      throw new ApiError(401, 'Invalid Access Token');
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, "Please login" || 'Invalid access token');
  }
});






export const validateProjectPermission = (roles = [] ) => asyncHandler(async(req, resp , next) => {
    const {projectId} = req.params ; 
    if(!projectId) {
        throw new ApiError(401 , "Invalid Project Id ") ;
    } ;

   const projectMembers  =  await PROJECTMEMBER.findOne({
           project: new mongoose.Types.ObjectId(projectId) ,
           user:  new mongoose.Types.ObjectId(req.user._id)
    })

     if(!projectMembers) {
        throw new ApiError(401 , "Project member Not found ") ;
    } ;

    const givenRole = projectMembers?.role ;
    req.user.role = givenRole ;

    if(!roles.includes(givenRole)){
      throw new ApiError(401 , "You do not have permission ") ;
    }
})