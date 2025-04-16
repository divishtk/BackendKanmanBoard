import { asyncHandler } from '../utils/async-handler.js';
import { ApiResponse } from '../utils/api-response.js';
import { User } from '../models/user.model.js';

const registerUser = asyncHandler(async (req, resp) => {

    const {email,username,password,role} = req.body;

    
});
