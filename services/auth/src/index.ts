import express from 'express';
import { ENV } from './env';
import cors from 'cors';
import { appRoutes } from './routes';

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
      'userid',
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
app.use(appRoutes);

app.listen(ENV.PORT, () => {
  console.warn(
    '\x1b[32m%s\x1b[0m',
    '[+] 🔑 Auth Sever is listening on:',
    `http://localhost:${ENV.PORT}`
  );
});
