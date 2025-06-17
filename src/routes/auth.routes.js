import { Router } from "express";
import { forgotPasswordRequest, getCurrentProfile, loginUser, logoutUser, passwordReset, refreshAccessToken, registerUser, resendVerificationEmail, verifyEmail } from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validator.middleware.js";
import { userRegisterationValidator } from "../validators/index.js";
import { verifyJWT } from "../middlewares/verifyJwt.middleware.js";

const router = Router();

router.route('/register').post(userRegisterationValidator(),validate,registerUser);
router.route('/verify-email').get(verifyEmail);
router.route('/resend-verify-email').post(resendVerificationEmail);
router.route('/login').post(loginUser);
router.route('/logout').post(verifyJWT,logoutUser);
router.route('/refresh-accessToken').post(verifyJWT,refreshAccessToken);
router.route('/forgot-password-request').post(verifyJWT,forgotPasswordRequest);
router.route('/reset-your-password').get(verifyJWT,passwordReset);
router.route('/get-profile').get(verifyJWT,getCurrentProfile);







export default router