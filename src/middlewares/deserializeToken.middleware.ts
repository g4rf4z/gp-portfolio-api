import { Request, Response, NextFunction } from 'express';

import { verifyJwt, reIssueAccessToken } from '../utils/jwt.util';

const deserializeToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { accessToken, refreshToken } = req.cookies;
  if (!accessToken && !refreshToken) return next();

  const { decoded, expired } = verifyJwt(accessToken);
  if (decoded?.account && decoded) {
    res.locals = decoded;
    res.locals.account = decoded.account;
    return next();
  }

  if (!expired && !refreshToken) return next();

  const newAccessToken = await reIssueAccessToken({ refreshToken });
  if (newAccessToken)
    res.cookie('accessToken', newAccessToken, {
      maxAge: 900000,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

  const result = verifyJwt(newAccessToken as string);
  res.locals.type = result?.decoded;
  res.locals.account = result?.decoded?.account;

  return next();
};

export default deserializeToken;
