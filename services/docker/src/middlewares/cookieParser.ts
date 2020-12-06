import { NextFunction, Request, Response } from 'express';

export const cookieParser = (req: Request, res: Response, next: NextFunction) => {
  const prepareCookie = req.headers.cookie?.split('; ');
  const cookieMap = {};

  prepareCookie?.forEach((el) => {
    const splitted = el.split('=');
    cookieMap[splitted[0]] = splitted[1];
  });

  req.cookies = cookieMap;
  next();
};
