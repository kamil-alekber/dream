import express from 'express';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { ENV } from './env';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if (ENV.NODE_ENV !== 'prod') {
  const morgan = require('morgan');
  app.use(morgan('dev'));
}

app.get('/', (req, res) =>
  res.status(200).sendFile(path.resolve(process.cwd(), 'src/html/index.html'))
);

app.listen(ENV.PORT, () => {
  console.warn(
    '\x1b[32m%s\x1b[0m',
    '[+] 🚀 Sever is listening on:',
    `http://localhost:${ENV.PORT}`
  );
});
