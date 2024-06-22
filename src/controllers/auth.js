import { registerUser, loginUser, logoutUser, refreshSession } from "../services/auth.js";
import { THIRTY_DAYS } from "../constants/index.js";
export const registerUserController = async (req, res) => { 
    const user = await registerUser(req.body);
    
    res.json({
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
