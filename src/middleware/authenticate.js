import createHTTPError from 'http-errors';
import { SessionsCollection } from '../db/models/session.js';

  import { UsersCollection } from '../db/models/user.js';

export const authenticate = async (req, res, next) => {
  try {
    const header = req.get('Authorization');
    if (!header) {
      console.log('Authorization header not found');
      return next(createHTTPError(401, 'Authorization header not found'));
    }

    const parts = header.split(' ');
    if (parts.length !== 2) {
      console.log(`Invalid Authorization header format: ${header}`);
      return next(createHTTPError(401, 'Invalid Authorization header format. Expected format: Bearer <token>'));
    }

    const [bearer, token] = parts;
    if (bearer !== 'Bearer' || !token) {
      console.log(`Invalid Bearer or token: Bearer=${bearer}, Token=${token}`);
      return next(createHTTPError(401, 'Bearer should be "Bearer" and token should be provided'));
    }

    const session = await SessionsCollection.findOne({ accessToken: token });
    if (!session) {
      console.log('Session not found for token:', token);
      return next(createHTTPError(401, 'Session not found'));
    }

    if (session.accessTokenValidUntil < new Date()) {
      console.log('Access token expired');
      return next(createHTTPError(401, 'Access token expired'));
    }

    const user = await UsersCollection.findById(session.userId);
    if (!user) {
      console.log('User not found for session userId:', session.userId);
      return next(createHTTPError(401, 'User not found'));
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Internal server error', error);
    next(createHTTPError(500, 'Internal server error'));
  }
};