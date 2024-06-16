import { registerUser, loginUser } from "../services/auth.js";
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
    
    res.json({
        status: 201,
        data: {accessToken: session.accessToken},
        message: "Successfully logged in!",
    });
};