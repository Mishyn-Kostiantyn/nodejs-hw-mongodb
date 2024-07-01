import { registerUser, loginUser, logoutUser, refreshSession, sendResetEmail, resetPassword,loginOrSignupWithGoogle } from "../services/auth.js";
import { THIRTY_DAYS } from "../constants/index.js";
import { generateAuthUrl } from '../utils/googleOAuth2.js';
export const registerUserController = async (req, res) => { 
    const user = await registerUser(req.body);
    
    res.status(201).json({
        status: 201,
        data: user,
        message: "Successfully created a user!",
    });
};
export const loginUserController = async (req, res) => { 
    const session = await loginUser(req.body);
    res.cookie('sessionToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });
    
    res.json({
        status: 200,
        data: {accessToken: session.accessToken},
        message: "Successfully logged in an user!!",
    });
};
export const  logoutUserController= async (req, res) => { 
    await logoutUser({
        sessionId: req.cookies.sessionId, 
        sessionToken: req.cookies.sessionToken,
        
   });
    res.clearCookie('sessionToken');
    res.clearCookie('sessionId'); 
    
    
    res.status(204).json({
        status: 204,
        data: {},
        message: "Successfully logged out!",
    });
};
export const refreshTokenController = async (req, res) => {
    const { sessionId, sessionToken } = req.cookies;
    const session = await refreshSession({ sessionId, sessionToken });
     res.cookie('sessionToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });
    
    res.json({
        status: 200,
        data: {accessToken: session.accessToken},
        message: "Congratulations, Token is refreshed!",
    });
};
export const sendResetEmailController = async (req, res) => {
   try {
        await sendResetEmail(req.body.email);
        res.json({
            message: 'Reset password email was successfully sent!',
            status: 200,
            data: {},
        });
    } catch (error) {
        res.status(error.status || 500).json({
            message: error.message,
            status: error.status || 500,
            data: error.data || {},
        });
    }
};
export const resetPasswordController = async (req, res) => {
    await resetPassword(req.body);
  res.json({
    message: 'Password was successfully reset!',
    status: 200,
    data: {},
  });
};    
export const getGoogleOAuthUrlController = async (req, res) => {
  const url = generateAuthUrl();
  res.json({
    status: 200,
    message: 'Successfully get Google OAuth url!',
    data: {
      url,
    },
  });
};
export const loginWithGoogleController = async (req, res) => {
  const session = await loginOrSignupWithGoogle(req.body.code);
 res.cookie('sessionToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });
  res.json({
    status: 200,
    message: 'Successfully logged in via Google OAuth!',
    data: {
      accessToken: session.accessToken,
    },
  });
};