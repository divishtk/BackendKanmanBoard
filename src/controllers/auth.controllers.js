import { USER } from '../models/user.models.js';
import { asyncHandler } from '../utils/async-handler.js';
import { emailVerificationMailGenContent, sendMail } from '../utils/mail.js';
import { ApiError } from '../utils/api-errors.js';

const registerUser = asyncHandler(async (req, resp) => {
  const { email, username, fullname, password } = req.body;


  const existingUser = await USER.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    throw new ApiError(409, 'User already exists with this email or username');
  }
  const user = await USER.create({
    email,
    username: username.toLowerCase(),
    fullname,
    password,
  });


  const createdUser = await USER.findById(user._id).select("-password")

  if (!createdUser) { 
    throw new ApiError(500, 'Error creating user');
  }


  //Generate token for email verification
  const { unhashedToken, hashedToken, tokenExpiry } = user.generateTemporaryToken();
  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;
  await user.save();

  //send verification email
  const verificationUrl = `${process.env.FRONTEND_URL}/api/v1/auth/verify-email/?token=${unhashedToken}&id=${user._id}`;
  const mailGenContent = emailVerificationMailGenContent(
    username,
    verificationUrl,
  );

  try {
    await sendMail({
      email: user.email,
      subject: 'Verify your email address',
      mailGenContent,
    });

    return resp.status(201).json({
      message:
        'User registered successfully. Please check your email for verification link.',
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    return resp.status(500).json({
      message: 'Error sending verification email',
      error: error.message,
    });
  }
});





const verifyEmail = asyncHandler(async (req, resp) => {
  const { email, username, password, role } = req.body;
});

const resendVerificationEmail = asyncHandler(async (req, resp) => {
  const { email, username, password, role } = req.body;
});

const logoutUser = asyncHandler(async (req, resp) => {
  const { email, username, password, role } = req.body;
});

const refreshAccessToken = asyncHandler(async (req, resp) => {
  const { email, username, password, role } = req.body;
});

const forgotPasswordRequest = asyncHandler(async (req, resp) => {
  const { email, username, password, role } = req.body;
});

const changeCurrentPassword = asyncHandler(async (req, resp) => {
  const { email, username, password, role } = req.body;
});

const getCurrentProfile = asyncHandler(async (req, resp) => {
  const { email, username, password, role } = req.body;
});

export { registerUser };
