import { Application } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

export function checkEnv(app: Application) {
  const envPath = require('path').resolve(
    process.cwd(),
    process.env.NODE_ENV !== 'prod' ? '.env.dev' : '.env'
  );

  dotenv.config({
    path: envPath,
    debug: process.env.NODE_ENV !== 'prod',
  });

  if (process.env.NODE_ENV !== 'prod') {
    console.warn('\x1b[32m%s\x1b[0m', '[+] ENV file:', envPath);
    const morgan = require('morgan');
    app.use(morgan('dev'));
  }

  if (!process.env?.JWT_SECRET) {
    throw new Error('JWT_SECRET env is not provided');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('no mongo_uri env provided');
  }

  mongoConnect();
}

async function mongoConnect() {
  try {
    const mongo = await mongoose.connect(process.env.MONGO_URI!, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });

    console.warn('\x1b[32m%s\x1b[0m', '[+] Mongoose connected to DB:', mongo.connection.name);
  } catch (error) {
    console.error({ error });
  }
}
