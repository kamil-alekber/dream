import express, { NextFunction, Request, Response } from 'express';
import { ENV } from './helpers/env';
import cors from 'cors';
import { appRoutes } from './router';
import jwt from 'jsonwebtoken';
import { cookieParser, authorization, green } from './middlewares';
import { CustomResponse } from './helpers/customResponse';

const app = express();

const whitelist = process.env.NODE_ENV === 'prod' ? [''] : ['http://localhost:3000'];

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  cors({
    optionsSuccessStatus: 200,
    credentials: true,
    allowedHeaders: [
      'Authorization',
      'Refresh',
      'Content-Type',
      'Cookie',
      'Origin',
      'X-Requested-With',
      'Accept',
    ],
    methods: ['GET', 'HEAD', 'POST', 'OPTIONS'],
    origin: (origin: string | undefined, callback: any) => {
      if (whitelist.includes(`${origin}`) || typeof origin === 'undefined' || origin === 'null') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  })
);

if (ENV.NODE_ENV !== 'prod') {
  const morgan = require('morgan');
  app.use(morgan('dev'));
}
// [APP ROUTES]
// TODO: remove green routes from here to the auth service
app.use(green, cookieParser, authorization, appRoutes);

app.listen(ENV.PORT, () => {
  console.warn(
    '\x1b[32m%s\x1b[0m',
    '[+] 🚀 Docker Server is listening on:',
    `http://localhost:${ENV.PORT}`
  );
});
