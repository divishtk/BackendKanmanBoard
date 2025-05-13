import { Router } from "express";
import { registerUser, resendVerificationEmail, verifyEmail } from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validator.middleware.js";
import { userRegisterationValidator } from "../validators/index.js";

const router = Router();

router.route('/register').post(userRegisterationValidator(),validate,registerUser);
router.route('/verify-email').get(verifyEmail);
router.route('/resend-verify-email').post(resendVerificationEmail);


export default router