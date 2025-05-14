import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser, resendVerificationEmail, verifyEmail } from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validator.middleware.js";
import { userRegisterationValidator } from "../validators/index.js";
import { verifyJWT } from "../middlewares/verifyJwt.middleware.js";

const router = Router();

router.route('/register').post(userRegisterationValidator(),validate,registerUser);
router.route('/verify-email').get(verifyEmail);
router.route('/resend-verify-email').post(resendVerificationEmail);
router.route('/login').post(loginUser);
router.route('/logout').post(verifyJWT,logoutUser);
router.route('/refresh-accessToken').post(refreshAccessToken);




export default router