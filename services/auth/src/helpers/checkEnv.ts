import {Application} from 'express';
import dotenv from 'dotenv';
import mongoose from "mongoose";

export function checkEnv (app: Application) {
    dotenv.config({
        path: require("path").resolve(process.cwd(), process.env.NODE_ENV !== 'prod' ? ".env.dev" : '.env'),
    });

    if (process.env.NODE_ENV !== "prod") {
        const morgan = require('morgan')
        app.use(morgan("dev"));
    }
    
    if (!process.env?.JWT_SECRET) {
        throw new Error("JWT_SECRET env is not provided");
    }
    
    if (!process.env.MONGO_URI) {
        throw new Error("no mongo_uri env provided");
    }

    (async () => {
        try {
          await mongoose.connect(process.env.MONGO_URI!, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
          });
        } catch (error) {
          console.log({ error });
        }
      })()
}

