import bcrypt from 'bcrypt';
import { UsersCollection } from "../db/models/user.js";
import createHttpError from 'http-errors';
import crypto from 'crypto';
import { SessionsCollection } from '../db/models/session.js';
import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/index.js';
export const registerUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (user) throw createHttpError(409, 'Email in use');
  
  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });
};
export const loginUser = async ({email, password}) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) throw createHttpError(404, 'User not found');
  
  const areEqual= await bcrypt.compare(password, user.password);
  if (!areEqual) throw createHttpError(401, 'Wrong password');
  await SessionsCollection.deleteOne({userId:user._id});
  const accessToken = crypto.randomBytes(64).toString('base64');
  const refreshToken = crypto.randomBytes(64).toString('base64');
  return await SessionsCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  });
  
  
};
export const logoutUser = async ({ sessionId, sessionToken }) => {
 
  return await SessionsCollection.deleteOne({_id:sessionId, refreshToken:sessionToken});
};
export const refreshSession = async ({ sessionId, sessionToken }) => {
  const session = await SessionsCollection.findOne({ _id: sessionId, refreshToken: sessionToken });
  if (!session) throw createHttpError(404, 'Session not found');
  
  if (session.refreshTokenValidUntil < new Date()) throw createHttpError(401, 'Refresh token expired');
   const user=await UsersCollection.findOne({ _id: session.userId });
  await SessionsCollection.deleteOne({ _id: sessionId, refreshToken: sessionToken });
  const accessToken = crypto.randomBytes(64).toString('base64');
  const refreshToken = crypto.randomBytes(64).toString('base64');
  return await SessionsCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  });
 };