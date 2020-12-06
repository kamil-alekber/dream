import { NextFunction, Request, Response } from 'express';
import { CustomResponse } from '../helpers/customResponse';
import { ENV } from '../helpers/env';
import jwt from 'jsonwebtoken';

export const authorization = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization || req.cookies?.docker;
  if (!token) CustomResponse.unauthorized(res);

  try {
    const verified = jwt.verify(token, ENV.JWT) as any;
    req.user = verified?.userId;
    next();
  } catch (error) {
    CustomResponse.unauthorized(res, error.message, null);
  }
};
