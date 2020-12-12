import { NextFunction, Request, Response } from 'express';
import { CustomResponse } from '../helpers/customResponse';
import { ENV } from '../helpers/env';
import jwt from 'jsonwebtoken';

export const green = (req: Request, res: Response, next: NextFunction) => {
  if (req.url === '/login') {
    // expect login with email/password or oauth2
    const token = jwt.sign({ userId: '8959a248-d1f5-4124-b20b-7dacbea54bdf' }, ENV.JWT);
    res.cookie('docker', token);
    CustomResponse.ok(res, 'Logged In');
  } else if (req.url === '/logout') {
    res.cookie('docker', '', { maxAge: -1 });
    CustomResponse.ok(res, 'Logged Out');
  } else {
    next();
  }
};
