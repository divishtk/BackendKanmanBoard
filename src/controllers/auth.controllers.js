import { USER } from '../models/user.models.js';
import { asyncHandler } from '../utils/async-handler.js';
import { emailVerificationMailGenContent, sendMail } from '../utils/mail.js';
import { ApiError } from '../utils/api-errors.js';
import { ApiResponse } from '../utils/api-response.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken'

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await USER.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    let refreshTokenExpiry;
    refreshTokenExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    user.refreshToken = refreshToken;
    user.refreshTokenExpiry = refreshTokenExpiry;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      'Something went wrong while generating referesh and access token',
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
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

  const createdUser = await USER.findById(user._id).select('-password');

  if (!createdUser) {
    throw new ApiError(500, 'Error creating user');
  }

  //Generate token for email verification
  const { unhashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();
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

    return res
      .status(200)
      .json(new ApiResponse(200, 'User registed check email for verification'));
  } catch (error) {
    return res
      .status(400)
      .json(new ApiError(200, 'Email verified succesfully'));
  }
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;
  if (!token) {
    throw new ApiError(400, 'Token invalid');
  }

  //validate token
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await USER.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpiry: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    throw new ApiError(
      400,
      'Token is expired, kindly generate new verification link',
    );
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpiry = undefined;

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, 'Email verified succesfully'));
});

const resendVerificationEmail = asyncHandler(async (req, res) => {
  console.log('1');
  const { email } = req.body;
  if (!email) {
    throw new ApiError(401, 'Kindly provide email id!');
  }

  const user = await USER.findOne({
    email,
  });

  if (!user) {
    throw new ApiError(401, 'You are not registered, please create account');
  }

  if (user.isEmailVerified) {
    throw new ApiError(400, 'Your email is already verified');
  }

  const { unhashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();
  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;

  await user.save({ validateBeforeSave: false });

  const verificationUrl = `${process.env.FRONTEND_URL}/api/v1/auth/verify-email/?token=${unhashedToken}&id=${user._id}`;
  const mailGenContent = emailVerificationMailGenContent(
    user.username,
    verificationUrl,
  );

  await sendMail({
    email: user.email,
    subject: 'Verification email resent successfully',
    mailGenContent,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, 'Verification email resent successfully'));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  const user = await USER.findOne({ email });

  if (!user) {
    throw new ApiError(404, 'User does not exist');
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid user credentials');
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id,
  );
  const loggedInUser = await USER.findById(user._id).select(
    '-password -refreshToken',
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  };

  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        'User logged In Successfully',
      ),
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await USER.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, //removes field from mongo document
      },
    },
    {
      new: true,
    },
  );

  const options = {
    httpOnly: true,
    secure: true
  }

  return res
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(new ApiResponse(200, {}, "User logged Out successfully"))
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const  incommingRefreshToken  = req.body.refreshToken || req.headers.authorization?.replace("Bearer ", "") || req.cookies?.refreshToken;

        if(!incommingRefreshToken){
          throw new ApiError(400,"Refresh token not found") ;
        }

        const decodedToken = await jwt.verify(incommingRefreshToken ,process.env.REFRESH_TOKEN_SECRET) ;
        const user  = await USER.findById(decodedToken._id).select("-password");
        if(!user){
          throw new ApiError(401, "Invalid refresh token")
        }

         // Check if the incoming refresh token matches the one in DB
         if (incommingRefreshToken !== user?.refreshToken) {
          throw new ApiError(401, "Refresh token is expired or used")
      }

      const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

      const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken},
                "Access token refreshed"
            )
        )
});

const forgotPasswordRequest = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;
});

const getCurrentProfile = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;
});

export {
  registerUser,
  verifyEmail,
  resendVerificationEmail,
  loginUser,
  logoutUser,
  refreshAccessToken
};
