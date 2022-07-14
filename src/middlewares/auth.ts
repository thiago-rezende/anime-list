import { validateJwt } from '~/utils/jwt';
import { Request, Response, NextFunction } from 'express';

import { AuthenticationError } from '~/errors/auth';

import { getUser } from '~/controllers/users';
import { UserNotFoundError } from '~/errors/user';

import { JsonWebTokenError } from 'jsonwebtoken';

const authMiddleware = async function (
  req: Request,
  _res: Response,
  next: NextFunction
) {
  if (req.path === '/auth') return next();
  if (req.method === 'POST' && req.path === '/v1/users') return next();
  if (req.method === 'POST' && req.path === '/v1/animes') return next();

  if (!req.headers.authorization)
    return next(new AuthenticationError('missing authorization token'));

  const accessToken = req.headers.authorization.split(' ')[1];

  const payload = validateJwt(accessToken);

  if (payload instanceof JsonWebTokenError) return next(payload);

  const user = await getUser(payload.user.id);

  if (user instanceof UserNotFoundError)
    return next(new AuthenticationError('user not found'));

  req.user = user;

  next();
};

export default authMiddleware;
