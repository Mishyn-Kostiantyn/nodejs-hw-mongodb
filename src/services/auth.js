import bcrypt from 'bcrypt';
import { UsersCollection } from "../db/models/user.js";
import createHttpError from 'http-errors';
import crypto from 'crypto';
import { SessionsCollection } from '../db/models/session.js';
import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/index.js';
import jwt from 'jsonwebtoken';
import { env } from '../utils/env.js';
import { sendEmail } from '../utils/sendMail.js';
import { SMTP } from '../constants/index.js';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';
import { TEMPLATES_DIR } from '../constants/index.js';
import { getFullNameFromGoogleTokenPayload, validateCode } from '../utils/googleOAuth2.js';
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
export const sendResetEmail = async (email) => {
  const user = await UsersCollection.findOne({ email });
  console.log('User email:', email);
  if (!user) throw createHttpError(404, 'User not found');
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env('JWT_SECRET'),
    {
      expiresIn: '15m',
    },
  );
    const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );

  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${env('APP_DOMAIN')}/auth/reset-password?token=${resetToken}`,
  });
   await sendEmail({
    from: env(SMTP.SMTP_FROM),
    to: email,
    subject: 'Reset your password',
    html
  });

};
export const resetPassword = async (payload) => { 
  let entries;

  try {
    entries = jwt.verify(payload.token, env('JWT_SECRET'));
    console.log ('Entries:', entries);
  } catch (err) {
    if (err instanceof Error) throw createHttpError(401, err.message);
    throw err;
  }
  const user = await UsersCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await UsersCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );

};
export const loginOrSignupWithGoogle = async (code) => {
  const loginTicket = await validateCode(code);
  const payload = loginTicket.getPayload();
  if (!payload) throw createHttpError(401);

  let user = await UsersCollection.findOne({ email: payload.email });
  if (!user) {
    const password = await bcrypt.hash(crypto.randomBytes(64), 10);
    user = await UsersCollection.create({
      email: payload.email,
      name: getFullNameFromGoogleTokenPayload(payload),
      password,
   
    });
  }
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